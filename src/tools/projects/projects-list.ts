/**
 * Projects list
 * GET /projects
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    catalog_type: z.string().optional().describe('Default: vod. Available: live or vod'),
    per_page: z.string().optional().describe('per_page'),
    page: z.string().optional().describe('page')
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
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/projects',
};

export const tool = {
  name: 'kinescope_projects_projects_list',
  description: 'Projects list: GET /projects',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const params = new URLSearchParams();
  if (validatedArgs.catalog_type) {
    params.append('catalog_type', validatedArgs.catalog_type.toString());
  }
  if (validatedArgs.per_page) {
    params.append('per_page', validatedArgs.per_page.toString());
  }
  if (validatedArgs.page) {
    params.append('page', validatedArgs.page.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/projects?${queryString}` : `/projects`;
  const result = await client.get(path);
  // API возвращает объект с полями meta и data, возвращаем весь объект
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
