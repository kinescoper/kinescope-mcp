/**
 * Update project
 * PUT /projects/:project_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    project_id: z.string().describe('ID project id'),
    name: z.string().optional().describe('name'),
    privacy_type: z.string().optional().describe('privacy_type'),
    privacy_domains: z.array(z.string()).optional().describe('privacy_domains'),
    apply_to_videos: z.boolean().optional().describe('apply_to_videos'),
    player_id: z.string().optional().describe('player_id')
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
  httpMethod: 'put',
  httpPath: '/projects/:project_id',
};

export const tool = {
  name: 'kinescope_:project_id_update_project__project_id',
  description: 'Update project: PUT /projects/:project_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/projects/${validatedArgs.project_id}`;
  const { project_id, ...bodyData } = validatedArgs;
  const result = await client.put(path, bodyData);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
