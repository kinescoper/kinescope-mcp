/**
 * Тест инструментов MCP сервера
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

async function testTools() {
  console.log('🧪 Тестирование MCP инструментов...\n');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  try {
    // Тест 1: list_kinescope_videos
    console.log('📋 Тест 1: list_kinescope_videos');
    try {
      const { handler } = await import('./dist/tools/video/list-videos.js');
      const result = await handler(client, { limit: 5 });
      console.log('✅ Успешно! Получено видео:', Array.isArray(result?.data) ? result.data.length : 'N/A');
      if (result?.data?.[0]) {
        console.log('   Первое видео:', result.data[0].title);
        console.log('   ID:', result.data[0].id);
      }
      console.log('');
    } catch (error: any) {
      console.log('❌ Ошибка:', error.message);
      console.log('');
    }

    // Тест 2: get_kinescope_video (используем ID из первого теста)
    console.log('🔍 Тест 2: get_kinescope_video');
    try {
      const { handler: listHandler } = await import('./dist/tools/video/list-videos.js');
      const listResult: any = await listHandler(client, { limit: 1 });
      const videoId = listResult?.data?.[0]?.id;
      
      if (videoId) {
        const { handler: getHandler } = await import('./dist/tools/video/get-video.js');
        const result = await getHandler(client, { video_id: videoId });
        console.log('✅ Успешно! Получено видео:');
        console.log('   Название:', result?.title || 'N/A');
        console.log('   Статус:', result?.status || 'N/A');
        console.log('   Длительность:', result?.duration ? `${Math.round(result.duration)} сек` : 'N/A');
      } else {
        console.log('⚠️  Не удалось получить ID видео для теста');
      }
      console.log('');
    } catch (error: any) {
      console.log('❌ Ошибка:', error.message);
      console.log('');
    }

    // Тест 3: Проверка структуры ответа
    console.log('📊 Тест 3: Проверка структуры данных');
    try {
      const { handler } = await import('./dist/tools/video/list-videos.js');
      const result: any = await handler(client, { limit: 1 });
      
      if (result?.meta) {
        console.log('✅ Структура ответа корректна:');
        console.log('   Пагинация:', result.meta.pagination ? '✅' : '❌');
        console.log('   Данные:', Array.isArray(result.data) ? '✅' : '❌');
        console.log('   Всего видео:', result.meta?.pagination?.total || 'N/A');
      } else {
        console.log('⚠️  Неожиданная структура ответа');
      }
      console.log('');
    } catch (error: any) {
      console.log('❌ Ошибка:', error.message);
      console.log('');
    }

  } catch (error: any) {
    console.error('💥 Критическая ошибка:', error);
  }
}

testTools().catch(console.error);

