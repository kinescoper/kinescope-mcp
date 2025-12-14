/**
 * Get token
 * GET /access-tokens/:token_id
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
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/access-tokens/:token_id',
};

export const tool = {
  name: 'kinescope_:token_id_get_token__token_id',
  description: 'Get token: GET /access-tokens/:token_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/access-tokens/${validatedArgs.token_id}`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
