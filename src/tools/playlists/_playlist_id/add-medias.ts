/**
 * Add medias
 * POST /playlists/:playlist_id/entities
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    playlist_id: z.string().describe('ID playlist id'),
    entity_ids: z.array(z.string()).optional().describe('entity_ids')
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
  httpMethod: 'post',
  httpPath: '/playlists/:playlist_id/entities',
};

export const tool = {
  name: 'kinescope_:playlist_id_add_medias__playlist_id',
  description: 'Add medias: POST /playlists/:playlist_id/entities',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/playlists/${validatedArgs.playlist_id}/entities`;
  const { playlist_id, ...bodyData } = validatedArgs;
  const result = await client.post(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
