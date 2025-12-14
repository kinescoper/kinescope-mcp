/**
 * Reorder
 * PATCH /videos/:video_id/subtitles/reorder
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id')
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
  httpPath: '/videos/:video_id/subtitles/reorder',
};

export const tool = {
  name: 'kinescope_:video_id_reorder__video_id',
  description: 'Reorder: PATCH /videos/:video_id/subtitles/reorder',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/subtitles/reorder`;
  const { video_id, ...bodyData } = validatedArgs;
  const result = await client.patch(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
