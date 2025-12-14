/**
 * Create restream
 * POST /live/events/:event_id/restreams
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    event_id: z.string().describe('ID event id'),
    name: z.string().optional().describe('name'),
    url: z.string().optional().describe('url'),
    key: z.string().optional().describe('key'),
    description: z.string().optional().describe('description'),
    enabled: z.boolean().optional().describe('enabled')
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
  httpPath: '/live/events/:event_id/restreams',
};

export const tool = {
  name: 'kinescope_events_create_restream_events',
  description: 'Create restream: POST /live/events/:event_id/restreams',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/live/events/${validatedArgs.event_id}/restreams`;
  const { event_id, ...bodyData } = validatedArgs;
  const result = await client.post(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
