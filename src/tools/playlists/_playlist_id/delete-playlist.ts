/**
 * Delete playlist
 * DELETE /playlists/:playlist_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    playlist_id: z.string().describe('ID playlist id')
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
  httpMethod: 'delete',
  httpPath: '/playlists/:playlist_id',
};

export const tool = {
  name: 'kinescope_:playlist_id_delete_playlist__playlist_id',
  description: 'Delete playlist: DELETE /playlists/:playlist_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/playlists/${validatedArgs.playlist_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
