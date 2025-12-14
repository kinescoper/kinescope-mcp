/**
 * Delete token
 * DELETE /access-tokens/:token_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    token_id: z.string().describe('ID token id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':token_id',
  operation: 'write',
  httpMethod: 'delete',
  httpPath: '/access-tokens/:token_id',
};

export const tool = {
  name: 'kinescope_:token_id_delete_token__token_id',
  description: 'Delete token: DELETE /access-tokens/:token_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/access-tokens/${validatedArgs.token_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
