/**
 * Delete restream
 * DELETE /live/events/:event_id/restreams/:restream_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    event_id: z.string().describe('ID event id'),
    restream_id: z.string().describe('ID restream id')
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
  httpMethod: 'delete',
  httpPath: '/live/events/:event_id/restreams/:restream_id',
};

export const tool = {
  name: 'kinescope_events_delete_restream_events',
  description: 'Delete restream: DELETE /live/events/:event_id/restreams/:restream_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/live/events/${validatedArgs.event_id}/restreams/${validatedArgs.restream_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
