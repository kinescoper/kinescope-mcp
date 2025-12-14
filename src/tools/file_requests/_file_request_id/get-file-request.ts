/**
 * Get file request
 * GET /file-requests/:file_request_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    file_request_id: z.string().describe('ID file request id')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: ':file_request_id',
  operation: 'read',
  httpMethod: 'get',
  httpPath: '/file-requests/:file_request_id',
};

export const tool = {
  name: 'kinescope_:file_request_id_get_file_request__file_request_id',
  description: 'Get file request: GET /file-requests/:file_request_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/file-requests/${validatedArgs.file_request_id}`;
  const result = await client.get(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
