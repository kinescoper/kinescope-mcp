/**
 * Генератор всех инструментов MCP на основе Postman коллекции
 */

const fs = require('fs');
const path = require('path');

const toolsStructureFile = path.join(__dirname, '../tools-structure.json');
const structure = JSON.parse(fs.readFileSync(toolsStructureFile, 'utf-8'));

const toolsDir = path.join(__dirname, '../src/tools');
const templateDir = path.join(__dirname, '../src/tools');

// Функция для создания имени файла
function getFileName(endpoint) {
  const name = endpoint.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return name || 'tool';
}

// Функция для создания безопасного имени директории
function getSafeDirName(pathPart) {
  return pathPart.replace(/:/g, '_').replace(/[^a-z0-9_]/gi, '_');
}

// Функция для создания имени инструмента
function getToolName(endpoint, resource, pathParts = []) {
  const action = endpoint.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  
  // Добавляем части пути для уникальности
  const pathSuffix = pathParts.length > 0 ? '_' + pathParts.join('_') : '';
  return `kinescope_${resource}_${action}${pathSuffix}`;
}

// Функция для создания Zod схемы из параметров
function createZodSchema(endpoint) {
  const fields = [];
  const seenFields = new Set();
  
  // Path variables
  for (const pathVar of endpoint.pathVars || []) {
    if (!seenFields.has(pathVar)) {
      fields.push(`${pathVar}: z.string().describe('ID ${pathVar.replace(/_/g, ' ')}')`);
      seenFields.add(pathVar);
    }
  }
  
  // Query parameters
  for (const qp of endpoint.queryParams || []) {
    const safeDesc = (qp.description || qp.key).replace(/'/g, "\\'").replace(/\n/g, ' ').trim();
    const baseKey = qp.key.replace('[]', '');
    if (seenFields.has(baseKey)) continue; // Skip duplicates
    seenFields.add(baseKey);
    
    if (qp.key.endsWith('[]')) {
      fields.push(`${baseKey}: z.array(z.string()).optional().describe('${safeDesc}')`);
    } else {
      const zodType = qp.description?.includes('number') ? 'z.number()' : 'z.string()';
      fields.push(`${qp.key}: ${zodType}.optional().describe('${safeDesc}')`);
    }
  }
  
  // Body parameters (исключаем path variables)
  if (endpoint.bodyParams && typeof endpoint.bodyParams === 'object' && !Array.isArray(endpoint.bodyParams)) {
    for (const [key, value] of Object.entries(endpoint.bodyParams)) {
      if (key === 'file') continue; // Skip file uploads for now
      if (seenFields.has(key)) continue; // Skip duplicates and path variables
      seenFields.add(key);
      const zodType = typeof value === 'number' ? 'z.number()' : 
                     typeof value === 'boolean' ? 'z.boolean()' : 
                     Array.isArray(value) ? 'z.array(z.string())' : 'z.string()';
      fields.push(`${key}: ${zodType}.optional().describe('${key}')`);
    }
  }
  
  return fields.length > 0 ? `z.object({\n    ${fields.join(',\n    ')}\n  })` : 'z.object({})';
}

// Функция для вычисления относительного пути к client.js
function getClientImportPath(depth) {
  return '../'.repeat(depth) + 'client.js';
}

// Функция для создания пути API
function createApiPath(endpoint) {
  let path = endpoint.path.replace(/^v\d+\//, '/');
  for (const pathVar of endpoint.pathVars || []) {
    path = path.replace(`:${pathVar}`, `\${${pathVar}}`);
  }
  return '`' + path + '`';
}

// Функция для создания handler
function createHandler(endpoint, resource) {
  const method = endpoint.method.toLowerCase();
  const pathVars = endpoint.pathVars || [];
  const queryParams = endpoint.queryParams || [];
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.bodyParams;
  
  let handlerCode = `export const handler = async (client: KinescopeClient, args: any) => {\n`;
  handlerCode += `  const validatedArgs = schema.parse(args);\n`;
  
  // Build path
  let pathCode = endpoint.path.replace(/^v\d+\//, '/');
  for (const pathVar of pathVars) {
    pathCode = pathCode.replace(`:${pathVar}`, `\${validatedArgs.${pathVar}}`);
  }
  
  // Build query string
  if (queryParams.length > 0) {
    handlerCode += `  const params = new URLSearchParams();\n`;
    for (const qp of queryParams) {
      const key = qp.key.replace('[]', '');
      handlerCode += `  if (validatedArgs.${key}) {\n`;
      if (qp.key.endsWith('[]')) {
        handlerCode += `    validatedArgs.${key}.forEach((v: string) => params.append('${qp.key}', v));\n`;
      } else {
        handlerCode += `    params.append('${qp.key}', validatedArgs.${key}.toString());\n`;
      }
      handlerCode += `  }\n`;
    }
    handlerCode += `  const queryString = params.toString();\n`;
    handlerCode += `  const path = queryString ? \`${pathCode}?\${queryString}\` : \`${pathCode}\`;\n`;
  } else {
    handlerCode += `  const path = \`${pathCode}\`;\n`;
  }
  
  // Build body
  if (hasBody) {
    const bodyFields = [];
    for (const pathVar of pathVars) {
      bodyFields.push(pathVar);
    }
    handlerCode += `  const { ${bodyFields.join(', ')}${bodyFields.length > 0 ? ', ' : ''}...bodyData } = validatedArgs;\n`;
    handlerCode += `  const result = await client.${method}(path${bodyFields.length > 0 ? ', bodyData' : ''});\n`;
  } else {
    handlerCode += `  const result = await client.${method}(path);\n`;
  }
  
  // Handle response data field
  if (['GET', 'POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    handlerCode += `  return (result as any)?.data || result;\n`;
  } else {
    handlerCode += `  return result;\n`;
  }
  
  handlerCode += `};`;
  
  return handlerCode;
}

// Функция для создания TypeScript файла инструмента
function createToolFile(endpoint, resource, subResource, depth = 2, pathParts = []) {
  const fileName = getFileName(endpoint);
  const toolName = getToolName(endpoint, subResource || resource, pathParts);
  const schema = createZodSchema(endpoint);
  const apiPath = endpoint.path.replace(/^v\d+\//, '/');
  const httpMethod = endpoint.method.toLowerCase();
  
  // Экранируем специальные символы в описании
  const safeDescription = endpoint.name.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const safeApiPath = apiPath.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  const clientImport = getClientImportPath(depth);
  
  const content = `/**
 * ${safeDescription}
 * ${endpoint.method} ${safeApiPath}
 */

import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { KinescopeClient } from '${clientImport}';

const schema = ${schema};

// Функция-обертка для обхода проблем с типами
function createInputSchema(schema: z.ZodType<any>) {
  return {
    type: 'object' as const,
    ...(zodToJsonSchema(schema as any) as Record<string, any>),
  };
}

export const metadata = {
  resource: '${subResource || resource}',
  operation: '${httpMethod === 'get' ? 'read' : 'write'}',
  httpMethod: '${httpMethod}',
  httpPath: '${apiPath}',
};

export const tool = {
  name: '${toolName}',
  description: '${safeDescription}: ${endpoint.method} ${safeApiPath}',
  inputSchema: createInputSchema(schema),
};

${createHandler(endpoint, subResource || resource)}

export const toolExport = {
  metadata,
  tool,
  handler,
};
`;

  return { fileName, content, toolName };
}

// Создаем директории для ресурсов
const createdFiles = [];
let totalEndpoints = 0;

for (const [key, group] of Object.entries(structure)) {
  const [version, resource, ...subParts] = key.split('/');
  const subResource = subParts.length > 0 ? subParts.join('_') : null;
  
  const safeResource = getSafeDirName(resource);
  const resourceDir = path.join(toolsDir, safeResource);
  if (!fs.existsSync(resourceDir)) {
    fs.mkdirSync(resourceDir, { recursive: true });
  }
  
  const safeSubResource = subResource ? getSafeDirName(subResource) : null;
  const subResourceDir = safeSubResource ? path.join(resourceDir, safeSubResource) : resourceDir;
  if (safeSubResource && !fs.existsSync(subResourceDir)) {
    fs.mkdirSync(subResourceDir, { recursive: true });
  }
  
  // Вычисляем глубину вложенности для правильного импорта
  const depth = safeSubResource ? 3 : 2;
  const pathParts = subParts.map(p => getSafeDirName(p));
  
  // Отслеживаем имена инструментов для избежания дубликатов
  const toolNames = new Set();
  
  for (const endpoint of group.endpoints) {
    let { fileName, content, toolName } = createToolFile(endpoint, resource, subResource || resource, depth, pathParts);
    
    // Уникализируем имя инструмента если нужно
    let uniqueToolName = toolName;
    let counter = 1;
    while (toolNames.has(uniqueToolName)) {
      uniqueToolName = `${toolName}_${counter}`;
      counter++;
    }
    toolNames.add(uniqueToolName);
    
    // Обновляем имя в контенте если изменилось
    if (uniqueToolName !== toolName) {
      content = content.replace(new RegExp(`name: '${toolName}'`, 'g'), `name: '${uniqueToolName}'`);
      toolName = uniqueToolName;
    }
    const filePath = path.join(subResourceDir, `${fileName}.ts`);
    
    // Не перезаписываем существующие файлы
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf-8');
      createdFiles.push({ filePath, toolName });
      totalEndpoints++;
    }
  }
}

console.log(`\n✅ Создано ${createdFiles.length} новых файлов инструментов`);
console.log(`Всего endpoints обработано: ${totalEndpoints}\n`);

// Сохраняем список созданных файлов
const createdListPath = path.join(__dirname, '../created-tools.json');
fs.writeFileSync(createdListPath, JSON.stringify(createdFiles, null, 2));
console.log(`Список созданных файлов сохранен в ${createdListPath}`);

