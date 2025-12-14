/**
 * Update chapters
 * PUT /videos/:video_id/chapters
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    items: z.array(z.string()).optional().describe('items'),
    enabled: z.boolean().optional().describe('enabled')
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
  httpPath: '/videos/:video_id/chapters',
};

export const tool = {
  name: 'kinescope_:video_id_update_chapters__video_id',
  description: 'Update chapters: PUT /videos/:video_id/chapters',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/chapters`;
  const { video_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
