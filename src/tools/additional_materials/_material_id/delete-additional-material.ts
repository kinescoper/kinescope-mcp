/**
 * Delete additional material
 * DELETE /additional-materials/:material_id
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
  operation: 'write',
  httpMethod: 'delete',
  httpPath: '/additional-materials/:material_id',
};

export const tool = {
  name: 'kinescope_:material_id_delete_additional_material__material_id',
  description: 'Delete additional material: DELETE /additional-materials/:material_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/additional-materials/${validatedArgs.material_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
