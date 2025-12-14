/**
 * Show avatar
 * GET /user/avatar/:avatar_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    avatar_id: z.string().describe('ID avatar id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'avatar',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/user/avatar/:avatar_id',
};

export const tool = {
  name: 'kinescope_avatar_show_avatar_avatar',
  description: 'Show avatar: GET /user/avatar/:avatar_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/user/avatar/${validatedArgs.avatar_id}`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
