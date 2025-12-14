/**
 * Тестовый скрипт для проверки работы с Kinescope API
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

async function testAPI() {
  console.log('🚀 Начинаем тестирование Kinescope API...\n');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  try {
    // Тест 1: Получение списка видео
    console.log('📹 Тест 1: Получение списка видео...');
    try {
      const videos = await client.get('/videos');
      console.log('✅ Успешно! Получен список видео:');
      console.log(JSON.stringify(videos, null, 2));
      console.log('');
    } catch (error: any) {
      console.log('❌ Ошибка:', error.message);
      console.log('');
    }

    // Тест 2: Получение информации о проекте (если есть endpoint)
    console.log('📁 Тест 2: Получение списка проектов...');
    try {
      const projects = await client.get('/projects');
      console.log('✅ Успешно! Получен список проектов:');
      console.log(JSON.stringify(projects, null, 2));
      console.log('');
    } catch (error: any) {
      console.log('⚠️  Endpoint /projects не найден или недоступен:', error.message);
      console.log('');
    }

    // Тест 3: Live API v2 - список Live стримов
    console.log('🔴 Тест 3: Получение списка Live стримов (v2)...');
    const liveClient = new KinescopeClient({
      apiKey: API_KEY,
      apiVersion: 'v2',
    });
    try {
      const liveStreams = await liveClient.get('/live');
      console.log('✅ Успешно! Получен список Live стримов:');
      console.log(JSON.stringify(liveStreams, null, 2));
      console.log('');
    } catch (error: any) {
      console.log('❌ Ошибка:', error.message);
      console.log('');
    }

    // Тест 4: Проверка базового URL
    console.log('🌐 Тест 4: Проверка базовых URL...');
    console.log('Video API v1 URL:', client.getBaseURL());
    console.log('Live API v2 URL:', liveClient.getBaseURL());
    console.log('');

  } catch (error: any) {
    console.error('💥 Критическая ошибка:', error);
  }
}

// Запуск тестов
testAPI().catch(console.error);

