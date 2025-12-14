/**
 * Create folder
 * POST /projects/:project_id/folders
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    project_id: z.string().describe('ID project id'),
    name: z.string().optional().describe('name'),
    parent_id: z.string().optional().describe('parent_id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':project_id',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/projects/:project_id/folders',
};

export const tool = {
  name: 'kinescope_:project_id_create_folder__project_id',
  description: 'Create folder: POST /projects/:project_id/folders',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/projects/${validatedArgs.project_id}/folders`;
  const { project_id, ...bodyData } = validatedArgs;
  const result = await client.post(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
