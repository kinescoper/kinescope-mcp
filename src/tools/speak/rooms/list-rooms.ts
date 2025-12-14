/**
 * List Rooms
 * GET /speak/rooms
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    page: z.string().optional().describe('page'),
    per_page: z.string().optional().describe('per_page'),
    order: z.string().optional().describe('Available fields - name, code, type, status, created_at, updated_at'),
    status: z.array(z.string()).optional().describe('pending, scheduled, active, cancelled, finished'),
    type: z.array(z.string()).optional().describe('instant_meeting, permanent_meeting'),
    code: z.array(z.string()).optional().describe('code[]'),
    q: z.string().optional().describe('Search by room name')
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
  httpPath: '/speak/rooms',
};

export const tool = {
  name: 'kinescope_rooms_list_rooms_rooms',
  description: 'List Rooms: GET /speak/rooms',
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
  if (validatedArgs.status) {
    validatedArgs.status.forEach((v: string) => params.append('status[]', v));
  }
  if (validatedArgs.type) {
    validatedArgs.type.forEach((v: string) => params.append('type[]', v));
  }
  if (validatedArgs.code) {
    validatedArgs.code.forEach((v: string) => params.append('code[]', v));
  }
  if (validatedArgs.q) {
    params.append('q', validatedArgs.q.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/speak/rooms?${queryString}` : `/speak/rooms`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
