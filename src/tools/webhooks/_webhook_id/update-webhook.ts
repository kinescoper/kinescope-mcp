/**
 * Update webhook
 * PUT /webhooks/:webhook_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    webhook_id: z.string().describe('ID webhook id'),
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
  resource: ':webhook_id',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/webhooks/:webhook_id',
};

export const tool = {
  name: 'kinescope_:webhook_id_update_webhook__webhook_id',
  description: 'Update webhook: PUT /webhooks/:webhook_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/webhooks/${validatedArgs.webhook_id}`;
  const { webhook_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
