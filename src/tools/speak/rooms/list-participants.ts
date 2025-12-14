/**
 * List Participants
 * GET /speak/rooms/:room_id/participants
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    room_id: z.string().describe('ID room id'),
    page: z.string().optional().describe('page'),
    per_page: z.string().optional().describe('per_page'),
    order: z.string().optional().describe('Available fields - name, role, created_at, updated_at'),
    q: z.string().optional().describe('Search by room name'),
    role: z.array(z.string()).optional().describe('admin, manager')
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
  httpPath: '/speak/rooms/:room_id/participants',
};

export const tool = {
  name: 'kinescope_rooms_list_participants_rooms',
  description: 'List Participants: GET /speak/rooms/:room_id/participants',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const params = new URLSearchParams();
  if (validatedArgs.page) {
    params.append('page', validatedArgs.page.toString());
  }
  if (validatedArgs.per_page) {
    params.append('per_page', validatedArgs.per_page.toString());
  }
  if (validatedArgs.order) {
    params.append('order', validatedArgs.order.toString());
  }
  if (validatedArgs.q) {
    params.append('q', validatedArgs.q.toString());
  }
  if (validatedArgs.role) {
    validatedArgs.role.forEach((v: string) => params.append('role[]', v));
  }
  const queryString = params.toString();
  const path = queryString ? `/speak/rooms/${validatedArgs.room_id}/participants?${queryString}` : `/speak/rooms/${validatedArgs.room_id}/participants`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
