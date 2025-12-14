/**
 * Create file request
 * POST /file-requests
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    title: z.string().optional().describe('title'),
    description: z.string().optional().describe('description'),
    uploading_location_id: z.string().optional().describe('uploading_location_id'),
    expired_at: z.string().optional().describe('expired_at')
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
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/file-requests',
};

export const tool = {
  name: 'kinescope_file-requests_create_file_request',
  description: 'Create file request: POST /file-requests',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/file-requests`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
