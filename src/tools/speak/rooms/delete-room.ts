/**
 * Delete Room
 * DELETE /speak/rooms/:room_id
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
  operation: 'write',
  httpMethod: 'delete',
  httpPath: '/speak/rooms/:room_id',
};

export const tool = {
  name: 'kinescope_rooms_delete_room_rooms',
  description: 'Delete Room: DELETE /speak/rooms/:room_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/speak/rooms/${validatedArgs.room_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
