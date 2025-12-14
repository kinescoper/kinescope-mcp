/**
 * Add moderator
 * POST /moderators
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../client.js';

const schema = z.object({
    username: z.string().optional().describe('username'),
    email: z.string().optional().describe('email'),
    password: z.string().optional().describe('password')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'moderators',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/moderators',
};

export const tool = {
  name: 'kinescope_moderators_add_moderator',
  description: 'Add moderator: POST /moderators',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/moderators`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
