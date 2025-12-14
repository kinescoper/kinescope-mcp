/**
 * Event videos
 * GET /live/events/:event_id/videos
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    event_id: z.string().describe('ID event id'),
    page: z.string().optional().describe('page'),
    per_page: z.string().optional().describe('per_page'),
    order: z.string().optional().describe('order')
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
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/live/events/:event_id/videos',
};

export const tool = {
  name: 'kinescope_events_event_videos_events',
  description: 'Event videos: GET /live/events/:event_id/videos',
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
  const queryString = params.toString();
  const path = queryString ? `/live/events/${validatedArgs.event_id}/videos?${queryString}` : `/live/events/${validatedArgs.event_id}/videos`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
