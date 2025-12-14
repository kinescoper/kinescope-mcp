#!/usr/bin/env node
/**
 * CLI точка входа для Kinescope MCP Server
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { launchStdioServer } from './stdio.js';
import { launchStreamableHTTPServer } from './http.js';
import { ClientType } from './compat.js';
import { McpOptions } from './options.js';

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('api-key', {
      type: 'string',
      description: 'Kinescope API ключ',
      demandOption: false,
    })
    .option('base-url', {
      type: 'string',
      description: 'Базовый URL API (опционально)',
    })
    .option('transport', {
      type: 'string',
      choices: ['stdio', 'http'],
      description: 'Тип транспорта',
      default: 'stdio',
    })
    .option('port', {
      type: 'number',
      description: 'Порт для HTTP транспорта',
      default: 3000,
    })
    .option('client', {
      type: 'string',
      choices: ['cursor', 'claude', 'claude-code', 'openai-agents', 'infer'],
      description: 'Тип MCP клиента',
      default: 'infer',
    })
    .option('include-dynamic-tools', {
      type: 'boolean',
      description: 'Включить динамические инструменты (по умолчанию включены)',
      default: true,
    })
    .option('include-all-tools', {
      type: 'boolean',
      description: 'Включить все статические инструменты (по умолчанию выключены)',
      default: false,
    })
    .option('resource', {
      type: 'array',
      string: true,
      description: 'Фильтр по категориям ресурсов (можно указать несколько). Примеры: video.*, data.*, live_streams.*, real_time.*, system.*',
      default: [],
    })
    .help()
    .parse();

  const apiKey = argv['api-key'] || process.env.KINESCOPE_API_KEY;
  
  if (!apiKey) {
    console.error('Error: Kinescope API key is required');
    console.error('Provide it via --api-key flag or KINESCOPE_API_KEY environment variable');
    process.exit(1);
  }

  const mcpOptions: McpOptions = {
    client: argv.client as ClientType,
    includeDynamicTools: argv['include-dynamic-tools'],
    includeAllTools: argv['include-all-tools'],
    resources: (argv.resource as string[]) || undefined,
  };

  if (argv.transport === 'http') {
    await launchStreamableHTTPServer({
      apiKey,
      baseURL: argv['base-url'],
      mcpOptions,
    }, argv.port);
  } else {
    await launchStdioServer({
      apiKey,
      baseURL: argv['base-url'],
      mcpOptions,
    });
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

