/**
 * Create playlist
 * POST /playlists
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    name: z.string().optional().describe('name'),
    parent_id: z.string().optional().describe('parent_id'),
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
  resource: 'playlists',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/playlists',
};

export const tool = {
  name: 'kinescope_playlists_create_playlist',
  description: 'Create playlist: POST /playlists',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/playlists`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
