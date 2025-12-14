/**
 * Create event
 * POST /live/events
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    name: z.string().optional().describe('name'),
    type: z.string().optional().describe('type'),
    auto_start: z.boolean().optional().describe('auto_start'),
    protected: z.boolean().optional().describe('protected'),
    time_shift: z.boolean().optional().describe('time_shift'),
    parent_id: z.string().optional().describe('parent_id'),
    reconnect_window: z.number().optional().describe('reconnect_window'),
    scheduled: z.string().optional().describe('scheduled'),
    record: z.string().optional().describe('record'),
    video: z.string().optional().describe('video'),
    restreams: z.array(z.string()).optional().describe('restreams'),
    latency_mode: z.string().optional().describe('latency_mode'),
    show_members: z.boolean().optional().describe('show_members'),
    chat_active: z.boolean().optional().describe('chat_active'),
    chat_after_stream: z.boolean().optional().describe('chat_after_stream'),
    chat_preview: z.boolean().optional().describe('chat_preview')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'events',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/live/events',
};

export const tool = {
  name: 'kinescope_events_create_event_events',
  description: 'Create event: POST /live/events',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/live/events`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
