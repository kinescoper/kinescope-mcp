/**
 * Update auth
 * PUT /drm/auth/:project_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    project_id: z.string().describe('ID project id'),
    url: z.string().optional().describe('url'),
    username: z.string().optional().describe('username'),
    password: z.string().optional().describe('password'),
    strict: z.boolean().optional().describe('strict')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'auth',
  operation: 'write',
  httpMethod: 'put',
  httpPath: '/drm/auth/:project_id',
};

export const tool = {
  name: 'kinescope_auth_update_auth_auth',
  description: 'Update auth: PUT /drm/auth/:project_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/drm/auth/${validatedArgs.project_id}`;
  const { project_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
