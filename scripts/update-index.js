/**
 * Обновляет index.ts со всеми инструментами
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toolsDir = path.join(__dirname, '../src/tools');
const indexFile = path.join(toolsDir, 'index.ts');

// Рекурсивно находим все файлы инструментов
function findToolFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findToolFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      const relativePath = path.relative(baseDir, fullPath).replace(/\.ts$/, '');
      files.push(relativePath);
    }
  }
  
  return files;
}

const toolFiles = findToolFiles(toolsDir);
toolFiles.sort();

console.log(`Найдено ${toolFiles.length} файлов инструментов\n`);

// Создаем импорты и экспорты
let imports = [];
let exports = [];

const varNames = new Set();
let counter = 1;

for (const file of toolFiles) {
  const importPath = `./${file.replace(/\\/g, '/')}`;
  let varName = file.split(/[/\\]/).pop().replace(/[-_]/g, '_');
  
  // Уникализируем имя переменной
  let uniqueVarName = varName;
  while (varNames.has(uniqueVarName)) {
    uniqueVarName = `${varName}_${counter}`;
    counter++;
  }
  varNames.add(uniqueVarName);
  
  imports.push(`import { toolExport as ${uniqueVarName} } from '${importPath}.js';`);
  exports.push(`  ${uniqueVarName},`);
}

const content = `/**
 * Все инструменты Kinescope MCP
 * Автоматически сгенерировано на основе Postman коллекции
 */

${imports.join('\n')}

// Экспорт всех endpoints
export const endpoints = [
${exports.join('\n')}
];
`;

fs.writeFileSync(indexFile, content, 'utf-8');
console.log(`✅ Обновлен ${indexFile}`);
console.log(`   Импортировано: ${imports.length} инструментов`);

