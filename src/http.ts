/**
 * HTTP транспорт для удаленного доступа к MCP серверу
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import cors from 'cors';
import express from 'express';
import { fromError } from 'zod-validation-error';
import { McpOptions, parseQueryOptions } from './options.js';
import { initKinescopeServer, newKinescopeMcpServer } from './server.js';

const oauthResourceIdentifier = (req: express.Request): string => {
  const protocol = req.headers['x-forwarded-proto'] ?? req.protocol;
  return `${protocol}://${req.get('host')}/`;
};

const newServer = ({
  apiKey,
  baseURL,
  mcpOptions: defaultMcpOptions,
  req,
  res,
}: {
  apiKey: string;
  baseURL?: string;
  mcpOptions: McpOptions;
  req: express.Request;
  res: express.Response;
}): McpServer | null => {
  const server = newKinescopeMcpServer();

  let mcpOptions: McpOptions;
  try {
    mcpOptions = parseQueryOptions(defaultMcpOptions, req.query);
  } catch (error) {
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: `Invalid request: ${fromError(error)}`,
      },
    });
    return null;
  }

  try {
    // Инициализируем сервер с опциями
    initKinescopeServer({
      server,
      apiKey,
      baseURL,
      mcpOptions,
    });
  } catch (error: any) {
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: `Server initialization error: ${error.message}`,
      },
    });
    return null;
  }

  return server;
};

const post =
  (options: { apiKey: string; baseURL?: string; mcpOptions: McpOptions }) =>
  async (req: express.Request, res: express.Response) => {
    const server = newServer({ ...options, req, res });
    if (server === null) return;

    const transport = new StreamableHTTPServerTransport({
      // Stateless server
      sessionIdGenerator: undefined,
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  };

const get = async (req: express.Request, res: express.Response) => {
  if (req.headers['sec-fetch-dest'] === 'document') {
    res.redirect('https://kinescope.io');
    return;
  }

  res.status(405).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not supported',
    },
  });
};

const del = async (req: express.Request, res: express.Response) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not supported',
    },
  });
};

export const streamableHTTPApp = ({
  apiKey,
  baseURL,
  mcpOptions = {},
}: {
  apiKey: string;
  baseURL?: string;
  mcpOptions?: McpOptions;
}): express.Express => {
  const app = express();
  app.set('query parser', 'extended');
  app.use(express.json());

  app.get('/', get);
  app.post('/', cors(), post({ apiKey, baseURL, mcpOptions }));
  app.delete('/', del);

  return app;
};

export const launchStreamableHTTPServer = async (
  options: { apiKey: string; baseURL?: string; mcpOptions?: McpOptions },
  port: number | string | undefined = process.env.PORT || 3000,
) => {
  const app = streamableHTTPApp(options);
  const server = app.listen(port);
  const address = server.address();

  if (typeof address === 'string') {
    console.error(`Kinescope MCP Server running on streamable HTTP at ${address}`);
  } else if (address !== null) {
    console.error(`Kinescope MCP Server running on streamable HTTP on port ${address.port}`);
  } else {
    console.error(`Kinescope MCP Server running on streamable HTTP on port ${port}`);
  }

  return server;
};

