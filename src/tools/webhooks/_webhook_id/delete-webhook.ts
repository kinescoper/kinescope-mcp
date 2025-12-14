/**
 * Delete webhook
 * DELETE /webhooks/:webhook_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    webhook_id: z.string().describe('ID webhook id')
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
  httpMethod: 'delete',
  httpPath: '/webhooks/:webhook_id',
};

export const tool = {
  name: 'kinescope_:webhook_id_delete_webhook__webhook_id',
  description: 'Delete webhook: DELETE /webhooks/:webhook_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/webhooks/${validatedArgs.webhook_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
