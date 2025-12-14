/**
 * Генератор инструментов MCP на основе Postman коллекции
 */

const fs = require('fs');
const path = require('path');

const endpointsFile = path.join(__dirname, '../postman-endpoints.json');
const endpointsData = JSON.parse(fs.readFileSync(endpointsFile, 'utf-8'));

// Функция для создания имени инструмента из endpoint
function createToolName(endpoint) {
  const parts = endpoint.path.split('/').filter(p => p && !p.startsWith(':'));
  const resource = parts[1] || 'unknown';
  const action = endpoint.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  
  return `kinescope_${resource}_${action}`;
}

// Функция для создания описания
function createDescription(endpoint) {
  const method = endpoint.method;
  const path = endpoint.path.replace(/v\d+\//, '');
  return `${method} ${path}`;
}

// Группируем endpoints по ресурсам и версиям
const toolsByResource = {};

function processEndpoints(version, endpoints) {
  for (const endpoint of endpoints) {
    const parts = endpoint.path.split('/').filter(p => p);
    if (parts.length < 2) continue;
    
    const resource = parts[1];
    const subResource = parts.length > 2 ? parts[2] : null;
    
    const key = `${version}/${resource}${subResource ? `/${subResource}` : ''}`;
    
    if (!toolsByResource[key]) {
      toolsByResource[key] = {
        version,
        resource,
        subResource,
        endpoints: []
      };
    }
    
    toolsByResource[key].endpoints.push(endpoint);
  }
}

// Обрабатываем v1 и v2 endpoints
for (const [resource, resourceEndpoints] of Object.entries(endpointsData.v1)) {
  processEndpoints('v1', resourceEndpoints);
}

for (const [resource, resourceEndpoints] of Object.entries(endpointsData.v2)) {
  processEndpoints('v2', resourceEndpoints);
}

// Выводим статистику
console.log('=== Статистика endpoints ===\n');
console.log(`Всего групп ресурсов: ${Object.keys(toolsByResource).length}\n`);

for (const [key, group] of Object.entries(toolsByResource)) {
  console.log(`${key}: ${group.endpoints.length} endpoints`);
}

// Сохраняем структурированные данные
const outputPath = path.join(__dirname, '../tools-structure.json');
fs.writeFileSync(outputPath, JSON.stringify(toolsByResource, null, 2));

console.log(`\n✅ Структура сохранена в ${outputPath}`);

