/**
 * Create project
 * POST /projects
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    name: z.string().optional().describe('name'),
    privacy_type: z.string().optional().describe('privacy_type'),
    privacy_domains: z.array(z.string()).optional().describe('privacy_domains'),
    player_id: z.string().optional().describe('player_id'),
    encrypted: z.boolean().optional().describe('encrypted'),
    catalog_type: z.string().optional().describe('catalog_type')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'projects',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/projects',
};

export const tool = {
  name: 'kinescope_projects_create_project',
  description: 'Create project: POST /projects',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/projects`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
