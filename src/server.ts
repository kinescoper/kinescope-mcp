/**
 * MCP Server для Kinescope API
 * 
 * Основан на архитектуре @mux/mcp
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ListToolsRequestSchema, CallToolRequestSchema, Implementation } from '@modelcontextprotocol/sdk/types.js';
import { KinescopeClient } from './client.js';
import { endpoints, Endpoint } from './tools/index.js';
import {
  applyCompatibilityTransformations,
  ClientCapabilities,
  defaultClientCapabilities,
  knownClients,
  parseEmbeddedJSON,
} from './compat.js';
import { dynamicTools } from './dynamic-tools.js';
import { query, Filter } from './filtering.js';
import { McpOptions, resourcesToFilters } from './options.js';

export interface InitKinescopeServerOptions {
  server: McpServer;
  apiKey: string;
  baseURL?: string;
  mcpOptions?: McpOptions;
}

/**
 * Создает новый MCP сервер для Kinescope
 */
export function newKinescopeMcpServer(): McpServer {
  return new McpServer(
    {
      name: 'kinescope',
      version: '0.1.0',
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
    }
  );
}

/**
 * Инициализирует MCP сервер с инструментами Kinescope
 */
export function initKinescopeServer(options: InitKinescopeServerOptions): void {
  const { server: mcpServer, apiKey, baseURL, mcpOptions = {} } = options;
  const client = new KinescopeClient({ apiKey, baseURL });

  // Получаем базовый Server из McpServer
  const server = mcpServer instanceof McpServer ? mcpServer.server : mcpServer;

  let providedEndpoints: Endpoint[] | null = null;
  let endpointMap: Record<string, Endpoint> | null = null;

  const initTools = async (implementation?: Implementation) => {
    // Автоопределение клиента, если не указан явно или указан 'infer'
    if (implementation && (!mcpOptions.client || mcpOptions.client === 'infer')) {
      const implName = implementation.name.toLowerCase();
      if (implName.includes('claude-code')) {
        mcpOptions.client = 'claude-code';
      } else if (implName.includes('claude')) {
        mcpOptions.client = 'claude';
      } else if (implName.includes('cursor')) {
        mcpOptions.client = 'cursor';
      } else if (implName.includes('openai') || implName.includes('gpt')) {
        mcpOptions.client = 'openai-agents';
      }
    }
    
    // Применяем capabilities для указанного клиента
    if (mcpOptions.client && mcpOptions.client !== 'infer') {
      const clientCapabilities = knownClients[mcpOptions.client as keyof typeof knownClients];
      if (clientCapabilities) {
        // Объединяем capabilities клиента с пользовательскими (пользовательские имеют приоритет)
        mcpOptions.capabilities = {
          ...clientCapabilities,
          ...mcpOptions.capabilities,
        };
      }
    }

    providedEndpoints ??= await selectTools(endpoints as Endpoint[], mcpOptions);
    endpointMap ??= Object.fromEntries(providedEndpoints.map((endpoint) => [endpoint.tool.name, endpoint]));
  };

  // Обработчик запроса списка инструментов
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    if (providedEndpoints === null) {
      await initTools(server.getClientVersion());
    }
    return {
      tools: providedEndpoints!.map((endpoint) => endpoint.tool),
    };
  });

  // Обработчик вызова инструмента
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (endpointMap === null) {
      await initTools(server.getClientVersion());
    }
    const { name, arguments: args } = request.params;
    const endpoint = endpointMap![name];

    if (!endpoint) {
      throw new Error(`Unknown tool: ${name}`);
    }

    return executeHandler(endpoint.tool, endpoint.handler, client, args, mcpOptions.capabilities);
  });
}

/**
 * Выбирает инструменты для включения в MCP сервер на основе опций
 */
export async function selectTools(endpoints: Endpoint[], options?: McpOptions): Promise<Endpoint[]> {
  // Объединяем filters и resources в один массив фильтров
  const allFilters: Filter[] = [
    ...(options?.filters ?? []),
    ...resourcesToFilters(options?.resources),
  ];
  
  const filteredEndpoints = query(allFilters, endpoints as Endpoint[]);

  // Определяем, какие инструменты включать
  const includeDynamicTools = options?.includeDynamicTools !== false; // По умолчанию true
  const includeAllTools = options?.includeAllTools === true; // По умолчанию false

  let includedTools: Endpoint[];

  if (includeAllTools) {
    // Если явно запрошены все статические инструменты
    includedTools = filteredEndpoints.length > 0 ? filteredEndpoints : endpoints;
    if (includeDynamicTools) {
      // Добавляем динамические инструменты к статическим
      includedTools = [...includedTools, ...dynamicTools(includedTools)];
    }
  } else if (includeDynamicTools) {
    // По умолчанию используем только динамические инструменты
    const endpointsToUse = filteredEndpoints.length > 0 ? filteredEndpoints : endpoints;
    includedTools = dynamicTools(endpointsToUse);
  } else {
    // Если динамические инструменты отключены и все инструменты тоже отключены
    // Используем отфильтрованные endpoints или все endpoints
    includedTools = filteredEndpoints.length > 0 ? filteredEndpoints : endpoints;
  }

  const capabilities = { ...defaultClientCapabilities, ...options?.capabilities };
  return applyCompatibilityTransformations(includedTools, capabilities);
}

/**
 * Выполняет обработчик с указанным клиентом и аргументами
 */
export async function executeHandler(
  tool: any,
  handler: (client: KinescopeClient, args: any) => Promise<any>,
  client: KinescopeClient,
  args: Record<string, unknown> | undefined,
  compatibilityOptions?: Partial<ClientCapabilities>,
) {
  const options = { ...defaultClientCapabilities, ...compatibilityOptions };
  
  // Парсим встроенный JSON для клиентов, которые не поддерживают валидный JSON
  if (!options.validJson && args) {
    args = parseEmbeddedJSON(args, tool.inputSchema);
  }

  try {
    const result = await handler(client, args || {});
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message || String(error)}`,
        },
      ],
      isError: true,
    };
  }
}

export { McpOptions } from './options.js';
export { ClientType } from './compat.js';
export { Filter } from './filtering.js';
export { endpoints } from './tools/index.js';

