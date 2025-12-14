/**
 * List events
 * GET /live/events
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    page: z.string().optional().describe('page'),
    per_page: z.string().optional().describe('per_page'),
    order: z.string().optional().describe('created_at, name'),
    folder_id: z.string().optional().describe('Show only events from this folder'),
    project_id: z.string().optional().describe('Show only events from this project'),
    without_folder: z.string().optional().describe('Show only events without folder')
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
  httpPath: '/live/events',
};

export const tool = {
  name: 'kinescope_events_list_events_events',
  description: 'List events: GET /live/events',
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
  if (validatedArgs.folder_id) {
    params.append('folder_id', validatedArgs.folder_id.toString());
  }
  if (validatedArgs.project_id) {
    params.append('project_id', validatedArgs.project_id.toString());
  }
  if (validatedArgs.without_folder) {
    params.append('without_folder', validatedArgs.without_folder.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/live/events?${queryString}` : `/live/events`;
  const result = await client.get(path);
  // API возвращает объект с полями meta и data, возвращаем весь объект
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
