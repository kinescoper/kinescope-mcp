/**
 * Тест фильтрации ресурсов
 */

import { endpoints } from './dist/tools/index.js';
import { getResourceCategory, matchesResourcePattern, categoryDescriptions } from './dist/resource-categories.js';
import { query, filters } from './dist/filtering.js';

console.log('🧪 Тестирование фильтрации ресурсов\n');
console.log('='.repeat(70));

// Статистика по категориям
const categoryStats = new Map<string, number>();
for (const endpoint of endpoints) {
  const category = getResourceCategory(endpoint as any);
  categoryStats.set(category, (categoryStats.get(category) || 0) + 1);
}

console.log('\n📊 Статистика по категориям:');
for (const [category, count] of categoryStats.entries()) {
  console.log(`   ${category.padEnd(15)}: ${count} инструментов - ${categoryDescriptions[category as keyof typeof categoryDescriptions]}`);
}

// Тест фильтрации video.*
console.log('\n\n🎬 Тест фильтра video.*:');
const videoEndpoints = query([filters.video()], endpoints as any);
console.log(`   Найдено: ${videoEndpoints.length} инструментов`);
if (videoEndpoints.length > 0) {
  console.log(`   Примеры:`);
  videoEndpoints.slice(0, 5).forEach(e => {
    console.log(`     - ${e.tool.name} (${e.metadata.httpPath})`);
  });
}

// Тест фильтрации data.*
console.log('\n\n📈 Тест фильтра data.*:');
const dataEndpoints = query([filters.data()], endpoints as any);
console.log(`   Найдено: ${dataEndpoints.length} инструментов`);
if (dataEndpoints.length > 0) {
  console.log(`   Примеры:`);
  dataEndpoints.slice(0, 5).forEach(e => {
    console.log(`     - ${e.tool.name} (${e.metadata.httpPath})`);
  });
}

// Тест фильтрации live_streams.*
console.log('\n\n📡 Тест фильтра live_streams.*:');
const liveEndpoints = query([filters.liveStreams()], endpoints as any);
console.log(`   Найдено: ${liveEndpoints.length} инструментов`);
if (liveEndpoints.length > 0) {
  console.log(`   Примеры:`);
  liveEndpoints.slice(0, 5).forEach(e => {
    console.log(`     - ${e.tool.name} (${e.metadata.httpPath})`);
  });
}

// Тест фильтрации real_time.*
console.log('\n\n💬 Тест фильтра real_time.*:');
const realTimeEndpoints = query([filters.realTime()], endpoints as any);
console.log(`   Найдено: ${realTimeEndpoints.length} инструментов`);
if (realTimeEndpoints.length > 0) {
  console.log(`   Примеры:`);
  realTimeEndpoints.slice(0, 5).forEach(e => {
    console.log(`     - ${e.tool.name} (${e.metadata.httpPath})`);
  });
}

// Тест фильтрации system.*
console.log('\n\n⚙️  Тест фильтра system.*:');
const systemEndpoints = query([filters.system()], endpoints as any);
console.log(`   Найдено: ${systemEndpoints.length} инструментов`);
if (systemEndpoints.length > 0) {
  console.log(`   Примеры:`);
  systemEndpoints.slice(0, 5).forEach(e => {
    console.log(`     - ${e.tool.name} (${e.metadata.httpPath})`);
  });
}

// Тест комбинированной фильтрации
console.log('\n\n🔀 Тест комбинированной фильтрации (video.* + data.*):');
const combinedEndpoints = query([
  filters.video(),
  filters.data(),
], endpoints as any);
console.log(`   Найдено: ${combinedEndpoints.length} инструментов`);

// Проверка, что все endpoints распределены по категориям
const totalCategorized = Array.from(categoryStats.values()).reduce((a, b) => a + b, 0);
console.log(`\n\n✅ Проверка:`);
console.log(`   Всего endpoints: ${endpoints.length}`);
console.log(`   Распределено по категориям: ${totalCategorized}`);
console.log(`   ${totalCategorized === endpoints.length ? '✅ Все endpoints распределены' : '⚠️  Некоторые endpoints не распределены'}`);

console.log('\n' + '='.repeat(70));

