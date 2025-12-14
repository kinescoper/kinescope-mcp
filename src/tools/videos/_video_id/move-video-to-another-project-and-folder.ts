/**
 * Move video to another project and folder
 * PUT /videos/:video_id/move
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    video_id: z.string().describe('ID video id'),
    project_id: z.string().optional().describe('project_id'),
    folder_id: z.string().optional().describe('folder_id')
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
  httpPath: '/videos/:video_id/move',
};

export const tool = {
  name: 'kinescope_:video_id_move_video_to_another_project_and_folder__video_id',
  description: 'Move video to another project and folder: PUT /videos/:video_id/move',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/videos/${validatedArgs.video_id}/move`;
  const { video_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
