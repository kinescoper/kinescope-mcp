/**
 * Delete file request
 * DELETE /file-requests/:file_request_id
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    file_request_id: z.string().describe('ID file request id'),
    name: z.string().optional().describe('name'),
    folder_id: z.string().optional().describe('folder_id'),
    expired_at: z.string().optional().describe('expired_at'),
    archived: z.boolean().optional().describe('archived')
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
  operation: 'write',
  httpMethod: 'delete',
  httpPath: '/file-requests/:file_request_id',
};

export const tool = {
  name: 'kinescope_:file_request_id_delete_file_request__file_request_id',
  description: 'Delete file request: DELETE /file-requests/:file_request_id',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/file-requests/${validatedArgs.file_request_id}`;
  const result = await client.delete(path);
  return result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
