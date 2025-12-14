/**
 * Get Room
 * GET /speak/rooms/:room_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    room_id: z.string().describe('ID room id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'rooms',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/speak/rooms/:room_id',
};

export const tool = {
  name: 'kinescope_rooms_get_room_rooms',
  description: 'Get Room: GET /speak/rooms/:room_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/speak/rooms/${validatedArgs.room_id}`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
