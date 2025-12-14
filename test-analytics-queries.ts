/**
 * Тестирование аналитических запросов через Kinescope MCP
 */

import { KinescopeClient } from './dist/client.js';
import { endpoints } from './dist/tools/index.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

// Находим нужные инструменты
const analyticsCustom = endpoints.find(e => e.tool.name === 'kinescope_analytics_custom');
const analyticsOverview = endpoints.find(e => e.tool.name === 'kinescope_overview_overview_overview');
const videosList = endpoints.find(e => e.tool.name === 'kinescope_videos_videos_list');

if (!analyticsCustom || !analyticsOverview || !videosList) {
  console.error('❌ Не найдены необходимые инструменты');
  console.error(`analyticsCustom: ${!!analyticsCustom}`);
  console.error(`analyticsOverview: ${!!analyticsOverview}`);
  console.error(`videosList: ${!!videosList}`);
  process.exit(1);
}

// TypeScript guard - теперь TypeScript знает, что они не undefined
const analyticsCustomTool = analyticsCustom!;
const analyticsOverviewTool = analyticsOverview!;
const videosListTool = videosList!;

const client = new KinescopeClient({
  apiKey: API_KEY,
  apiVersion: 'v1',
});

// Вспомогательная функция для получения дат
function getDateRange(daysAgo: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysAgo);
  
  return {
    from: from.toISOString().split('T')[0], // YYYY-MM-DD
    to: to.toISOString().split('T')[0],
  };
}

async function testQuery(name: string, handler: () => Promise<any>) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 Тест: ${name}`);
  console.log('-'.repeat(70));
  
  try {
    const result = await handler();
    console.log('✅ Успешно выполнено');
    console.log('\nРезультат:');
    console.log(JSON.stringify(result, null, 2).substring(0, 500));
    if (JSON.stringify(result).length > 500) {
      console.log('... (результат обрезан)');
    }
    return result;
  } catch (error: any) {
    console.log('❌ Ошибка:', error.message);
    return null;
  }
}

async function main() {
  console.log('🧪 Тестирование аналитических запросов Kinescope MCP\n');
  
  // 1. Best performing country for video streaming over the last month
  await testQuery(
    'Best performing country for video streaming over the last month',
    async () => {
      const { from, to } = getDateRange(30);
      return await analyticsCustomTool.handler(client, {
        from,
        to,
        group: 'month',
        group_entities: 'country_code',
        fields: 'country_code,view,unique_view,watch_time',
        order: 'view.desc',
      });
    }
  );
  
  // 2. Video performance metrics for the last week
  await testQuery(
    'Video performance metrics for the last week',
    async () => {
      const { from, to } = getDateRange(7);
      return await analyticsOverviewTool.handler(client, {
        from,
        to,
        group_time: 'day',
      });
    }
  );
  
  // 3. Top performing videos by view count
  await testQuery(
    'Top performing videos by view count',
    async () => {
      const { from, to } = getDateRange(30);
      return await analyticsCustomTool.handler(client, {
        from,
        to,
        group: 'month',
        group_entities: 'video_id',
        fields: 'video_id,view,unique_view,watch_time',
        order: 'view.desc',
      });
    }
  );
  
  // 4. Countries with highest video engagement
  await testQuery(
    'Countries with highest video engagement',
    async () => {
      const { from, to } = getDateRange(30);
      return await analyticsCustomTool.handler(client, {
        from,
        to,
        group: 'month',
        group_entities: 'country_code',
        fields: 'country_code,view,unique_view,watch_time,play,pause,replay',
        order: 'view.desc', // Используем view для сортировки, watch_time в полях
      });
    }
  );
  
  // 5. List all available video assets with filters
  await testQuery(
    'List all available video assets (with filters)',
    async () => {
      return await videosListTool.handler(client, {
        page: '1',
        per_page: '10',
        order: 'created_at.desc',
      });
    }
  );
  
  // Дополнительно: проверяем доступные фильтры для videos
  console.log(`\n${'='.repeat(70)}`);
  console.log('📋 Доступные фильтры для списка видео:');
  console.log('-'.repeat(70));
  const videoTool = videosListTool.tool;
  if (videoTool.inputSchema && typeof videoTool.inputSchema === 'object' && 'properties' in videoTool.inputSchema) {
    const props = videoTool.inputSchema.properties as Record<string, any>;
    for (const [key, value] of Object.entries(props)) {
      const description = value.description || 'No description';
      console.log(`   - ${key}: ${description}`);
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ Тестирование завершено');
  console.log('='.repeat(70));
}

main().catch(console.error);

