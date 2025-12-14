/**
 * Простой тест инструментов
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

async function testSimple() {
  console.log('🧪 Простое тестирование инструментов...\n');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  try {
    // Импортируем handlers
    const { handler: listHandler } = await import('./dist/tools/video/list-videos.js');
    const { handler: getHandler } = await import('./dist/tools/video/get-video.js');

    // Тест 1: list_kinescope_videos
    console.log('📋 Тест 1: list_kinescope_videos');
    const listResult: any = await listHandler(client, { limit: 3 });
    console.log('✅ Успешно!');
    console.log('   Всего видео:', listResult?.meta?.pagination?.total || 'N/A');
    console.log('   Получено:', listResult?.data?.length || 0);
    if (listResult?.data?.[0]) {
      console.log('   Первое видео:', listResult.data[0].title);
      console.log('   ID:', listResult.data[0].id);
    }
    console.log('');

    // Тест 2: get_kinescope_video
    if (listResult?.data?.[0]?.id) {
      console.log('🔍 Тест 2: get_kinescope_video');
      const videoId = listResult.data[0].id;
      const getResult: any = await getHandler(client, { video_id: videoId });
      console.log('✅ Успешно!');
      console.log('   ID:', getResult?.id || 'N/A');
      console.log('   Название:', getResult?.title || 'N/A');
      console.log('   Статус:', getResult?.status || 'N/A');
      console.log('   Длительность:', getResult?.duration ? `${Math.round(getResult.duration)} сек` : 'N/A');
      console.log('   Проект ID:', getResult?.project_id || 'N/A');
      console.log('');
    }

    // Тест 3: Проверка всех доступных инструментов
    console.log('📦 Тест 3: Проверка всех инструментов');
    const { endpoints } = await import('./dist/tools/index.js');
    console.log(`✅ Всего инструментов: ${endpoints.length}`);
    console.log('\n   Список инструментов:');
    endpoints.forEach((endpoint: any, i: number) => {
      console.log(`   ${i + 1}. ${endpoint.tool.name}`);
      console.log(`      Ресурс: ${endpoint.metadata.resource}`);
      console.log(`      Операция: ${endpoint.metadata.operation}`);
    });
    console.log('');

    console.log('✅ Все тесты завершены успешно!');
    
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

testSimple().catch(console.error);

