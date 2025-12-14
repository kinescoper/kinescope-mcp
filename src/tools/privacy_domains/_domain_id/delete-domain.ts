/**
 * Delete domain
 * DELETE /privacy-domains/:domain_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    domain_id: z.string().describe('ID domain id'),
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
  resource: ':domain_id',
  operation: 'write',
  httpMethod: 'delete',
  httpPath: '/privacy-domains/:domain_id',
};

export const tool = {
  name: 'kinescope_:domain_id_delete_domain__domain_id',
  description: 'Delete domain: DELETE /privacy-domains/:domain_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/privacy-domains/${validatedArgs.domain_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
