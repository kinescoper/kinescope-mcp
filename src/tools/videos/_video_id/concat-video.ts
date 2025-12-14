/**
 * Concat video
 * POST /videos/:video_id/concat
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    prepend: z.array(z.string()).optional().describe('prepend'),
    append: z.array(z.string()).optional().describe('append'),
    replace: z.boolean().optional().describe('replace')
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
  httpMethod: 'post',
  httpPath: '/videos/:video_id/concat',
};

export const tool = {
  name: 'kinescope_:video_id_concat_video__video_id',
  description: 'Concat video: POST /videos/:video_id/concat',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/concat`;
  const { video_id, ...bodyData } = validatedArgs;
  const result = await client.post(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
