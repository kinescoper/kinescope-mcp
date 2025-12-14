/**
 * Update Participant
 * PATCH /speak/rooms/:room_id/participants/:participant_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    room_id: z.string().describe('ID room id'),
    participant_id: z.string().describe('ID participant id')
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
  httpMethod: 'patch',
  httpPath: '/speak/rooms/:room_id/participants/:participant_id',
};

export const tool = {
  name: 'kinescope_rooms_update_participant_rooms',
  description: 'Update Participant: PATCH /speak/rooms/:room_id/participants/:participant_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/speak/rooms/${validatedArgs.room_id}/participants/${validatedArgs.participant_id}`;
  const result = await client.patch(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
