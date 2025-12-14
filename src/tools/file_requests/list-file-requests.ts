/**
 * List file requests
 * GET /file-requests
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    archived: z.string().optional().describe('archived')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'file-requests',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/file-requests',
};

export const tool = {
  name: 'kinescope_file-requests_list_file_requests',
  description: 'List file requests: GET /file-requests',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const params = new URLSearchParams();
  if (validatedArgs.archived) {
    params.append('archived', validatedArgs.archived.toString());
  }
  const queryString = params.toString();
  const path = queryString ? `/file-requests?${queryString}` : `/file-requests`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
