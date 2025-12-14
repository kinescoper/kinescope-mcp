/**
 * Парсер Postman коллекции для извлечения всех endpoints
 */

const fs = require('fs');
const path = require('path');

const collectionPath = '/Users/insty/Downloads/Kinescope API.postman_collection.json';
const collection = JSON.parse(fs.readFileSync(collectionPath, 'utf-8'));

function extractEndpoints(items, basePath = '', endpoints = []) {
  for (const item of items) {
    if (item.item) {
      // Это папка
      const newPath = basePath ? `${basePath}/${item.name}` : item.name;
      extractEndpoints(item.item, newPath, endpoints);
    } else if (item.request) {
      // Это endpoint
      const req = item.request;
      const method = req.method || '';
      const url = req.url;
      
      let pathStr = '';
      if (typeof url === 'string') {
        pathStr = url;
      } else if (url.path) {
        pathStr = Array.isArray(url.path) ? url.path.join('/') : url.path;
      }
      
      // Извлекаем query параметры
      const queryParams = [];
      if (url.query && Array.isArray(url.query)) {
        for (const q of url.query) {
          if (!q.disabled && q.key) {
            queryParams.push({
              key: q.key,
              value: q.value || '',
              description: q.description || '',
            });
          }
        }
      }
      
      // Извлекаем body параметры
      let bodyParams = null;
      if (req.body) {
        if (req.body.mode === 'raw' && req.body.raw) {
          try {
            bodyParams = JSON.parse(req.body.raw);
          } catch (e) {
            bodyParams = req.body.raw;
          }
        } else if (req.body.formdata) {
          bodyParams = {};
          for (const field of req.body.formdata) {
            if (!field.disabled) {
              bodyParams[field.key] = field.value || '';
            }
          }
        }
      }
      
      // Извлекаем path переменные
      const pathVars = [];
      if (url.variable && Array.isArray(url.variable)) {
        for (const v of url.variable) {
          pathVars.push(v.key);
        }
      }
      
      endpoints.push({
        name: item.name,
        method: method,
        path: pathStr,
        fullPath: basePath ? `${basePath}/${item.name}` : item.name,
        queryParams,
        bodyParams,
        pathVars,
        description: item.description || '',
      });
    }
  }
  return endpoints;
}

const allEndpoints = extractEndpoints(collection.item);

// Группируем по версии API
const v1Endpoints = allEndpoints.filter(e => e.path.startsWith('v1/'));
const v2Endpoints = allEndpoints.filter(e => e.path.startsWith('v2/'));

console.log(`Всего endpoints: ${allEndpoints.length}`);
console.log(`v1 endpoints: ${v1Endpoints.length}`);
console.log(`v2 endpoints: ${v2Endpoints.length}`);

// Группируем по ресурсам
function groupByResource(endpoints) {
  const groups = {};
  for (const ep of endpoints) {
    const parts = ep.path.split('/');
    if (parts.length >= 2) {
      const resource = parts[1]; // v1/videos -> videos
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(ep);
    }
  }
  return groups;
}

const v1Groups = groupByResource(v1Endpoints);
const v2Groups = groupByResource(v2Endpoints);

console.log('\n=== V1 Resources ===');
for (const [resource, eps] of Object.entries(v1Groups)) {
  console.log(`\n${resource}: ${eps.length} endpoints`);
  for (const ep of eps.slice(0, 5)) {
    console.log(`  ${ep.method.padEnd(6)} ${ep.path}`);
  }
  if (eps.length > 5) {
    console.log(`  ... и еще ${eps.length - 5}`);
  }
}

console.log('\n=== V2 Resources ===');
for (const [resource, eps] of Object.entries(v2Groups)) {
  console.log(`\n${resource}: ${eps.length} endpoints`);
  for (const ep of eps.slice(0, 5)) {
    console.log(`  ${ep.method.padEnd(6)} ${ep.path}`);
  }
  if (eps.length > 5) {
    console.log(`  ... и еще ${eps.length - 5}`);
  }
}

// Сохраняем в JSON для дальнейшего использования
const outputPath = path.join(__dirname, '../postman-endpoints.json');
fs.writeFileSync(outputPath, JSON.stringify({
  v1: v1Groups,
  v2: v2Groups,
  all: allEndpoints,
}, null, 2));

console.log(`\n✅ Endpoints сохранены в ${outputPath}`);

