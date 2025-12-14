/**
 * Create upload token to specific project
 * POST /access-tokens
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    name: z.string().optional().describe('name'),
    scope: z.string().optional().describe('scope')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'access-tokens',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/access-tokens',
};

export const tool = {
  name: 'kinescope_access-tokens_create_upload_token_to_specific_project',
  description: 'Create upload token to specific project: POST /access-tokens',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/access-tokens`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
