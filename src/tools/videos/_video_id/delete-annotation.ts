/**
 * Delete annotation
 * DELETE /videos/:video_id/annotations/:annotation_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    annotation_id: z.string().describe('ID annotation id')
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
  httpMethod: 'delete',
  httpPath: '/videos/:video_id/annotations/:annotation_id',
};

export const tool = {
  name: 'kinescope_:video_id_delete_annotation__video_id',
  description: 'Delete annotation: DELETE /videos/:video_id/annotations/:annotation_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/annotations/${validatedArgs.annotation_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
