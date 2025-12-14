/**
 * Custom
 * GET /analytics
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    from: z.string().optional().describe('must be YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ'),
    to: z.string().optional().describe('must be YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ'),
    group: z.string().optional().describe('hour, week, month, day'),
    group_entities: z.string().optional().describe('video_id, device, watch_time, city, country_code, folder_name, folder_id, project_name, project_id'),
    fields: z.string().optional().describe('view, seek, play, pause, replay, player_init, player_load, buffering_time, buffering_count, video_id, workspace_id, device, watch_time, city, country_code, folder_name, folder_id, project_name, project_id, unique_view, external_id'),
    order: z.string().optional().describe('not required')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'analytics',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/analytics',
};

export const tool = {
  name: 'kinescope_analytics_custom',
  description: 'Custom: GET /analytics',
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
  if (validatedArgs.group) {
    params.append('group', validatedArgs.group.toString());
  }
  if (validatedArgs.group_entities) {
    params.append('group_entities', validatedArgs.group_entities.toString());
  }
  if (validatedArgs.fields) {
    params.append('fields', validatedArgs.fields.toString());
  }
  if (validatedArgs.order) {
    params.append('order', validatedArgs.order.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/analytics?${queryString}` : `/analytics`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
