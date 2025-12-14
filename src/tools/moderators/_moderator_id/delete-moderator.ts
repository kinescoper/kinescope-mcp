/**
 * Delete moderator
 * DELETE /moderators/:moderator_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    moderator_id: z.string().describe('ID moderator id')
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
  httpMethod: 'delete',
  httpPath: '/moderators/:moderator_id',
};

export const tool = {
  name: 'kinescope_:moderator_id_delete_moderator__moderator_id',
  description: 'Delete moderator: DELETE /moderators/:moderator_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/moderators/${validatedArgs.moderator_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
