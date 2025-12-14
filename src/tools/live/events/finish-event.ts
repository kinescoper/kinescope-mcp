/**
 * Finish event
 * PUT /live/events/:event_id/complete
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    event_id: z.string().describe('ID event id')
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
  httpMethod: 'put',
  httpPath: '/live/events/:event_id/complete',
};

export const tool = {
  name: 'kinescope_events_finish_event_events',
  description: 'Finish event: PUT /live/events/:event_id/complete',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/live/events/${validatedArgs.event_id}/complete`;
  const result = await client.put(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
