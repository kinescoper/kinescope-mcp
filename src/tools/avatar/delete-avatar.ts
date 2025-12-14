/**
 * Delete avatar
 * DELETE /avatar
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({});

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'avatar',
  operation: 'write',
  httpMethod: 'delete',
  httpPath: '/avatar',
};

export const tool = {
  name: 'kinescope_avatar_delete_avatar',
  description: 'Delete avatar: DELETE /avatar',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/avatar`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
