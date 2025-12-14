/**
 * Folders list
 * GET /projects/:project_id/folders
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    project_id: z.string().describe('ID project id'),
    order: z.string().optional().describe('Available fields:  name, created_at'),
    page: z.string().optional().describe('page'),
    per_page: z.string().optional().describe('per_page')
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
  httpPath: '/projects/:project_id/folders',
};

export const tool = {
  name: 'kinescope_:project_id_folders_list__project_id',
  description: 'Folders list: GET /projects/:project_id/folders',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const params = new URLSearchParams();
  if (validatedArgs.order) {
    params.append('order', validatedArgs.order.toString());
  }
  if (validatedArgs.page) {
    params.append('page', validatedArgs.page.toString());
  }
  if (validatedArgs.per_page) {
    params.append('per_page', validatedArgs.per_page.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/projects/${validatedArgs.project_id}/folders?${queryString}` : `/projects/${validatedArgs.project_id}/folders`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
