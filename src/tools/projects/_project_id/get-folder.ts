/**
 * Get folder
 * GET /projects/:project_id/folders/:folder_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    project_id: z.string().describe('ID project id'),
    folder_id: z.string().describe('ID folder id')
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
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/projects/:project_id/folders/:folder_id',
};

export const tool = {
  name: 'kinescope_:project_id_get_folder__project_id',
  description: 'Get folder: GET /projects/:project_id/folders/:folder_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/projects/${validatedArgs.project_id}/folders/${validatedArgs.folder_id}`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
