/**
 * Update tag
 * PUT /tags/:tag_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    tag_id: z.string().describe('ID tag id'),
    tag: z.string().optional().describe('tag'),
    archived: z.boolean().optional().describe('archived')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':tag_id',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/tags/:tag_id',
};

export const tool = {
  name: 'kinescope_:tag_id_update_tag__tag_id',
  description: 'Update tag: PUT /tags/:tag_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/tags/${validatedArgs.tag_id}`;
  const { tag_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
