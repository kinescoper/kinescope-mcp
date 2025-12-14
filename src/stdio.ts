/**
 * STDIO транспорт для MCP сервера
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { newKinescopeMcpServer, initKinescopeServer } from './server.js';
import { McpOptions } from './options.js';

export interface StdioServerOptions {
  apiKey: string;
  baseURL?: string;
  mcpOptions?: McpOptions;
}

export async function launchStdioServer(options: StdioServerOptions): Promise<void> {
  const server = newKinescopeMcpServer();
  
  initKinescopeServer({
    server,
    apiKey: options.apiKey,
    baseURL: options.baseURL,
    mcpOptions: options.mcpOptions,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('Kinescope MCP Server running on stdio');
}

