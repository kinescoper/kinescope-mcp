/**
 * Get subtitle
 * GET /videos/:video_id/subtitles/:subtitle_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    subtitle_id: z.string().describe('ID subtitle id'),
    language: z.string().optional().describe('language'),
    description: z.string().optional().describe('description')
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
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/videos/:video_id/subtitles/:subtitle_id',
};

export const tool = {
  name: 'kinescope_:video_id_get_subtitle__video_id',
  description: 'Get subtitle: GET /videos/:video_id/subtitles/:subtitle_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/subtitles/${validatedArgs.subtitle_id}`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
