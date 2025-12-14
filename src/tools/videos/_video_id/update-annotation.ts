/**
 * Update annotation
 * PUT /videos/:video_id/annotations/:annotation_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    annotation_id: z.string().describe('ID annotation id'),
    annotation_poster_id: z.string().optional().describe('annotation_poster_id'),
    title: z.string().optional().describe('title'),
    link: z.string().optional().describe('link'),
    start_time: z.number().optional().describe('start_time'),
    end_time: z.number().optional().describe('end_time')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':video_id',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/videos/:video_id/annotations/:annotation_id',
};

export const tool = {
  name: 'kinescope_:video_id_update_annotation__video_id',
  description: 'Update annotation: PUT /videos/:video_id/annotations/:annotation_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/annotations/${validatedArgs.annotation_id}`;
  const { video_id, annotation_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
