/**
 * Create zone
 * POST /cdn/zones
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '../../../client.js';

const schema = z.object({
    name: z.string().optional().describe('name'),
    host: z.string().optional().describe('host'),
    origins: z.array(z.string()).optional().describe('origins'),
    access_control: z.string().optional().describe('access_control'),
    settings: z.string().optional().describe('settings')
  });

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: 'zones',
  operation: 'write',
  httpMethod: 'post',
  httpPath: '/cdn/zones',
};

export const tool = {
  name: 'kinescope_zones_create_zone_zones',
  description: 'Create zone: POST /cdn/zones',
  inputSchema: createInputSchema(schema),
};

export const handler = async (client: KinescopeClient, args: any) => {
  const validatedArgs = schema.parse(args);
  const path = `/cdn/zones`;
  const { ...bodyData } = validatedArgs;
  const result = await client.post(path);
  return (result as any)?.data || result;
};

export const toolExport = {
  metadata,
  tool,
  handler,
};
