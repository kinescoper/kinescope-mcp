/**
 * Динамические инструменты для работы с Kinescope API
 * Предоставляют универсальные инструменты для поиска и вызова любых endpoints
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Endpoint } from './tools/index.js';
import { KinescopeClient } from './client.js';

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

/**
 * Создает динамические инструменты на основе списка endpoints
 */
export function dynamicTools(endpoints: Endpoint[]): Endpoint[] {
  const dynamicEndpoints: Endpoint[] = [];

  // Инструмент для поиска endpoints
  const listEndpointsSchema = z.object({
    resource: z.string().optional().describe('Фильтр по ресурсу (например, "videos", "projects")'),
    operation: z.enum(['read', 'write']).optional().describe('Фильтр по типу операции'),
    httpMethod: z.enum(['get', 'post', 'put', 'patch', 'delete']).optional().describe('Фильтр по HTTP методу'),
    path: z.string().optional().describe('Поиск по пути (подстрока)'),
  });

  const listEndpointsTool: Tool = {
    name: 'kinescope_list_api_endpoints',
    description: 'Список доступных API endpoints Kinescope с возможностью фильтрации',
    inputSchema: createInputSchema(listEndpointsSchema),
  };

  const listEndpointsHandler = async (client: KinescopeClient, args: any) => {
    const filtered = endpoints.filter((endpoint) => {
      if (args.resource && endpoint.metadata.resource !== args.resource) {
        return false;
      }
      if (args.operation && endpoint.metadata.operation !== args.operation) {
        return false;
      }
      if (args.httpMethod && endpoint.metadata.httpMethod !== args.httpMethod) {
        return false;
      }
      if (args.path && !endpoint.metadata.httpPath.includes(args.path)) {
        return false;
      }
      return true;
    });

    return {
      endpoints: filtered.map((endpoint) => ({
        name: endpoint.tool.name,
        description: endpoint.tool.description,
        resource: endpoint.metadata.resource,
        operation: endpoint.metadata.operation,
        httpMethod: endpoint.metadata.httpMethod.toUpperCase(),
        httpPath: endpoint.metadata.httpPath,
      })),
      total: filtered.length,
    };
  };

  dynamicEndpoints.push({
    metadata: {
      resource: 'dynamic',
      operation: 'read',
      httpMethod: 'get',
      httpPath: '/dynamic/endpoints',
    },
    tool: listEndpointsTool,
    handler: listEndpointsHandler,
  });

  // Инструмент для получения схемы endpoint
  const getEndpointSchemaSchema = z.object({
    endpoint_name: z.string().describe('Имя инструмента (endpoint)'),
  });

  const getEndpointSchemaTool: Tool = {
    name: 'kinescope_get_api_endpoint_schema',
    description: 'Получить схему входных параметров для указанного endpoint',
    inputSchema: createInputSchema(getEndpointSchemaSchema),
  };

  const getEndpointSchemaHandler = async (client: KinescopeClient, args: any) => {
    const endpoint = endpoints.find((e) => e.tool.name === args.endpoint_name);

    if (!endpoint) {
      throw new Error(`Endpoint "${args.endpoint_name}" not found`);
    }

    return {
      name: endpoint.tool.name,
      description: endpoint.tool.description,
      inputSchema: endpoint.tool.inputSchema,
      metadata: endpoint.metadata,
    };
  };

  dynamicEndpoints.push({
    metadata: {
      resource: 'dynamic',
      operation: 'read',
      httpMethod: 'get',
      httpPath: '/dynamic/schema',
    },
    tool: getEndpointSchemaTool,
    handler: getEndpointSchemaHandler,
  });

  // Инструмент для вызова любого endpoint
  const invokeEndpointSchema = z.object({
    endpoint_name: z.string().describe('Имя инструмента для вызова'),
    arguments: z.record(z.any()).describe('Аргументы для передачи в endpoint'),
  });

  const invokeEndpointTool: Tool = {
    name: 'kinescope_invoke_api_endpoint',
    description: 'Вызвать любой доступный endpoint Kinescope API по имени',
    inputSchema: createInputSchema(invokeEndpointSchema),
  };

  const invokeEndpointHandler = async (client: KinescopeClient, args: any) => {
    const endpoint = endpoints.find((e) => e.tool.name === args.endpoint_name);

    if (!endpoint) {
      throw new Error(`Endpoint "${args.endpoint_name}" not found`);
    }

    try {
      const result = await endpoint.handler(client, args.arguments || {});
      return {
        success: true,
        endpoint: args.endpoint_name,
        result,
      };
    } catch (error: any) {
      return {
        success: false,
        endpoint: args.endpoint_name,
        error: error.message || String(error),
      };
    }
  };

  dynamicEndpoints.push({
    metadata: {
      resource: 'dynamic',
      operation: 'write',
      httpMethod: 'post',
      httpPath: '/dynamic/invoke',
    },
    tool: invokeEndpointTool,
    handler: invokeEndpointHandler,
  });

  return dynamicEndpoints;
}

