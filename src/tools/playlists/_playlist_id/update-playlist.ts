/**
 * Update playlist
 * PATCH /playlists/:playlist_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    playlist_id: z.string().describe('ID playlist id'),
    name: z.string().optional().describe('name'),
    description: z.string().optional().describe('description'),
    parent_id: z.string().optional().describe('parent_id'),
    privacy_type: z.string().optional().describe('privacy_type'),
    privacy_domains: z.array(z.string()).optional().describe('privacy_domains'),
    settings: z.string().optional().describe('settings')
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
  httpMethod: 'patch',
  httpPath: '/playlists/:playlist_id',
};

export const tool = {
  name: 'kinescope_:playlist_id_update_playlist__playlist_id',
  description: 'Update playlist: PATCH /playlists/:playlist_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/playlists/${validatedArgs.playlist_id}`;
  const { playlist_id, ...bodyData } = validatedArgs;
  const result = await client.patch(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
