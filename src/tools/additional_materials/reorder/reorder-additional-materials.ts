/**
 * Reorder additional materials
 * PATCH /additional-materials/reorder
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({});

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'reorder',
  operation: 'write',
  httpMethod: 'patch',
  httpPath: '/additional-materials/reorder',
};

export const tool = {
  name: 'kinescope_reorder_reorder_additional_materials_reorder',
  description: 'Reorder additional materials: PATCH /additional-materials/reorder',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/additional-materials/reorder`;
  const { ...bodyData } = validatedArgs;
  const result = await client.patch(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
