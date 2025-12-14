/**
 * Move media
 * PUT /playlists/:playlist_id/entities/:media_id/move
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    playlist_id: z.string().describe('ID playlist id'),
    media_id: z.string().describe('ID media id'),
    position: z.number().optional().describe('position')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':playlist_id',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/playlists/:playlist_id/entities/:media_id/move',
};

export const tool = {
  name: 'kinescope_:playlist_id_move_media__playlist_id',
  description: 'Move media: PUT /playlists/:playlist_id/entities/:media_id/move',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/playlists/${validatedArgs.playlist_id}/entities/${validatedArgs.media_id}/move`;
  const { playlist_id, media_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
