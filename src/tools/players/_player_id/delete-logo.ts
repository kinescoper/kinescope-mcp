/**
 * Delete logo
 * DELETE /players/:player_id/logo
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    player_id: z.string().describe('ID player id')
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
  httpMethod: 'delete',
  httpPath: '/players/:player_id/logo',
};

export const tool = {
  name: 'kinescope_:player_id_delete_logo__player_id',
  description: 'Delete logo: DELETE /players/:player_id/logo',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/players/${validatedArgs.player_id}/logo`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
