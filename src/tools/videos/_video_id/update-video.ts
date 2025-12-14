/**
 * Update video
 * PATCH /videos/:video_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    title: z.string().optional().describe('title'),
    description: z.string().optional().describe('description'),
    privacy_type: z.string().optional().describe('privacy_type'),
    privacy_domains: z.array(z.string()).optional().describe('privacy_domains'),
    additional_materials_enabled: z.boolean().optional().describe('additional_materials_enabled'),
    tags: z.array(z.string()).optional().describe('tags')
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
  httpMethod: 'patch',
  httpPath: '/videos/:video_id',
};

export const tool = {
  name: 'kinescope_:video_id_update_video__video_id',
  description: 'Update video: PATCH /videos/:video_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}`;
  const { video_id, ...bodyData } = validatedArgs;
  const result = await client.patch(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
