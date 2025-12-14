/**
 * Overview
 * GET /analytics/overview
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    from: z.string().optional().describe('from'),
    to: z.string().optional().describe('to'),
    group_time: z.string().optional().describe('hour, week, month, day (default)'),
    video_id: z.string().optional().describe('not required')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'overview',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/analytics/overview',
};

export const tool = {
  name: 'kinescope_overview_overview_overview',
  description: 'Overview: GET /analytics/overview',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const params = new URLSearchParams();
  if (validatedArgs.from) {
    params.append('from', validatedArgs.from.toString());
  }
  if (validatedArgs.to) {
    params.append('to', validatedArgs.to.toString());
  }
  if (validatedArgs.group_time) {
    params.append('group_time', validatedArgs.group_time.toString());
  }
  if (validatedArgs.video_id) {
    params.append('video_id', validatedArgs.video_id.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/analytics/overview?${queryString}` : `/analytics/overview`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
