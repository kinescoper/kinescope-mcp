/**
 * Delete auth
 * DELETE /drm/auth/:project_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    project_id: z.string().describe('ID project id')
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
  httpMethod: 'delete',
  httpPath: '/drm/auth/:project_id',
};

export const tool = {
  name: 'kinescope_auth_delete_auth_auth',
  description: 'Delete auth: DELETE /drm/auth/:project_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/drm/auth/${validatedArgs.project_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
