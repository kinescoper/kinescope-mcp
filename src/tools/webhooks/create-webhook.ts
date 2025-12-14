/**
 * Create webhook
 * POST /webhooks
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    name: z.string().optional().describe('name'),
    endpoint: z.string().optional().describe('endpoint'),
    login: z.string().optional().describe('login'),
    password: z.string().optional().describe('password'),
    events: z.array(z.string()).optional().describe('events')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'webhooks',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/webhooks',
};

export const tool = {
  name: 'kinescope_webhooks_create_webhook',
  description: 'Create webhook: POST /webhooks',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/webhooks`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
