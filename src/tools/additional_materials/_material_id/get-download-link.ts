/**
 * Get download link
 * GET /additional-materials/:material_id/link
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    material_id: z.string().describe('ID material id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':material_id',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/additional-materials/:material_id/link',
};

export const tool = {
  name: 'kinescope_:material_id_get_download_link__material_id',
  description: 'Get download link: GET /additional-materials/:material_id/link',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/additional-materials/${validatedArgs.material_id}/link`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
