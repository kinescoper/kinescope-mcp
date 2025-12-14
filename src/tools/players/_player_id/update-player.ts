/**
 * Update player
 * PUT /players/:player_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    player_id: z.string().describe('ID player id'),
    name: z.string().optional().describe('name'),
    settings: z.string().optional().describe('settings'),
    ads: z.array(z.string()).optional().describe('ads')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':player_id',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/players/:player_id',
};

export const tool = {
  name: 'kinescope_:player_id_update_player__player_id',
  description: 'Update player: PUT /players/:player_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/players/${validatedArgs.player_id}`;
  const { player_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
