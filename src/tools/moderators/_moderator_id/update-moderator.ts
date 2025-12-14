/**
 * Update moderator
 * PUT /moderators/:moderator_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    moderator_id: z.string().describe('ID moderator id'),
    username: z.string().optional().describe('username'),
    email: z.string().optional().describe('email'),
    password: z.string().optional().describe('password')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':moderator_id',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/moderators/:moderator_id',
};

export const tool = {
  name: 'kinescope_:moderator_id_update_moderator__moderator_id',
  description: 'Update moderator: PUT /moderators/:moderator_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/moderators/${validatedArgs.moderator_id}`;
  const { moderator_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
