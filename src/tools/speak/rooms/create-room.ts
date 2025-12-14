/**
 * Create Room
 * POST /speak/rooms
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({});

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'rooms',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/speak/rooms',
};

export const tool = {
  name: 'kinescope_rooms_create_room_rooms',
  description: 'Create Room: POST /speak/rooms',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/speak/rooms`;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
