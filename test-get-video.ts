/**
 * Тест получения конкретного видео
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

async function testGetVideo() {
  console.log('🔍 Тестирование получения видео...\n');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  try {
    // Сначала получим список, чтобы взять ID
    console.log('1. Получение списка видео...');
    const listResult: any = await client.get('/videos?limit=1');
    const videoId = listResult?.data?.[0]?.id;
    
    if (!videoId) {
      console.log('❌ Не удалось получить ID видео');
      return;
    }
    
    console.log(`✅ Получен ID: ${videoId}`);
    console.log(`   Название: ${listResult.data[0].title}`);
    console.log('');

    // Тест 1: Прямой запрос к API
    console.log('2. Прямой запрос к API /videos/{id}...');
    try {
      const directResult: any = await client.get(`/videos/${videoId}`);
      console.log('✅ Успешно! Структура ответа:');
      console.log('   Ключи:', Object.keys(directResult).join(', '));
      console.log('   ID:', directResult?.id || 'N/A');
      console.log('   Название:', directResult?.title || 'N/A');
      console.log('   Статус:', directResult?.status || 'N/A');
      console.log('');
    } catch (error: any) {
      console.log('❌ Ошибка:', error.message);
      console.log('');
    }

    // Тест 2: Через handler инструмента
    console.log('3. Через handler инструмента get_kinescope_video...');
    try {
      const { handler } = await import('./dist/tools/video/get-video.js');
      const handlerResult: any = await handler(client, { video_id: videoId });
      console.log('✅ Успешно! Структура ответа:');
      console.log('   Тип:', typeof handlerResult);
      console.log('   Ключи:', handlerResult ? Object.keys(handlerResult).join(', ') : 'null');
      if (handlerResult) {
        console.log('   ID:', handlerResult?.id || 'N/A');
        console.log('   Название:', handlerResult?.title || 'N/A');
        console.log('   Статус:', handlerResult?.status || 'N/A');
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

testGetVideo().catch(console.error);

