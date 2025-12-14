/**
 * Videos list
 * GET /videos
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    page: z.string().optional().describe('page'),
    per_page: z.string().optional().describe('per_page'),
    order: z.string().optional().describe('title, description, created_at, updated_at, duration'),
    status: z.array(z.string()).optional().describe('pending, uploading, pre-processing, processing, aborted, done, error'),
    folder_id: z.string().optional().describe('folder_id'),
    project_id: z.string().optional().describe('project_id'),
    video_ids: z.array(z.string()).optional().describe('List of video IDs to fetch'),
    q: z.string().optional().describe('String for searching in title, description'),
    without_folder: z.string().optional().describe('Show only videos without folder')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'videos',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/videos',
};

export const tool = {
  name: 'kinescope_videos_videos_list',
  description: 'Videos list: GET /videos',
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
  if (validatedArgs.folder_id) {
    params.append('folder_id', validatedArgs.folder_id.toString());
  }
  if (validatedArgs.project_id) {
    params.append('project_id', validatedArgs.project_id.toString());
  }
  if (validatedArgs.video_ids) {
    validatedArgs.video_ids.forEach((v: string) => params.append('video_ids[]', v));
  }
  if (validatedArgs.q) {
    params.append('q', validatedArgs.q.toString());
  }
  if (validatedArgs.without_folder) {
    params.append('without_folder', validatedArgs.without_folder.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/videos?${queryString}` : `/videos`;
  const result = await client.get(path);
  // API возвращает объект с полями meta и data, возвращаем весь объект
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
