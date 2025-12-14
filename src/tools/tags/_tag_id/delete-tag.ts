/**
 * Delete tag
 * DELETE /tags/:tag_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    tag_id: z.string().describe('ID tag id'),
    domain: z.string().optional().describe('domain'),
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
  httpMethod: 'delete',
  httpPath: '/tags/:tag_id',
};

export const tool = {
  name: 'kinescope_:tag_id_delete_tag__tag_id',
  description: 'Delete tag: DELETE /tags/:tag_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/tags/${validatedArgs.tag_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
