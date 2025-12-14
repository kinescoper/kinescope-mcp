/**
 * Финальный тест всех инструментов
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
}

async function runFinalTests() {
  console.log('🎯 Финальное тестирование всех инструментов Kinescope MCP\n');
  console.log('=' .repeat(60));
  console.log('');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  const results: TestResult[] = [];

  // Тест 1: list_kinescope_videos
  console.log('📋 Тест: list_kinescope_videos');
  try {
    const { handler } = await import('./dist/tools/video/list-videos.js');
    const result: any = await handler(client, { limit: 5 });
    if (result?.data && Array.isArray(result.data)) {
      console.log(`   ✅ Успешно! Получено ${result.data.length} видео из ${result.meta?.pagination?.total || 'N/A'}`);
      results.push({ name: 'list_kinescope_videos', status: 'success', message: `Получено ${result.data.length} видео` });
    } else {
      throw new Error('Неожиданная структура ответа');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'list_kinescope_videos', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 2: get_kinescope_video
  console.log('🔍 Тест: get_kinescope_video');
  try {
    // Сначала получим ID
    const { handler: listHandler } = await import('./dist/tools/video/list-videos.js');
    const listResult: any = await listHandler(client, { limit: 1 });
    const videoId = listResult?.data?.[0]?.id;

    if (videoId) {
      const { handler: getHandler } = await import('./dist/tools/video/get-video.js');
      const result: any = await getHandler(client, { video_id: videoId });
      if (result?.id && result?.title) {
        console.log(`   ✅ Успешно! Получено видео: "${result.title}"`);
        console.log(`      ID: ${result.id}, Статус: ${result.status}, Длительность: ${Math.round(result.duration || 0)} сек`);
        results.push({ name: 'get_kinescope_video', status: 'success', message: `Получено видео: ${result.title}` });
      } else {
        throw new Error('Неполные данные');
      }
    } else {
      throw new Error('Не удалось получить ID видео');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'get_kinescope_video', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 3: Проверка всех инструментов
  console.log('📦 Тест: Проверка регистрации всех инструментов');
  try {
    const { endpoints } = await import('./dist/tools/index.js');
    console.log(`   ✅ Всего зарегистрировано инструментов: ${endpoints.length}`);
    
    const videoTools = endpoints.filter((e: any) => e.metadata.resource === 'video').length;
    const liveTools = endpoints.filter((e: any) => e.metadata.resource === 'live').length;
    const uploadTools = endpoints.filter((e: any) => e.metadata.resource === 'upload').length;
    
    console.log(`      - Video API v1: ${videoTools} инструментов`);
    console.log(`      - Live API v2: ${liveTools} инструментов`);
    console.log(`      - Upload: ${uploadTools} инструментов`);
    
    results.push({ name: 'tool_registration', status: 'success', message: `${endpoints.length} инструментов зарегистрировано` });
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'tool_registration', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 4: Проверка структуры инструментов
  console.log('🔧 Тест: Проверка структуры инструментов');
  try {
    const { endpoints } = await import('./dist/tools/index.js');
    let allValid = true;
    
    for (const endpoint of endpoints) {
      if (!endpoint.tool?.name || !endpoint.tool?.description || !endpoint.handler) {
        allValid = false;
        break;
      }
    }
    
    if (allValid) {
      console.log(`   ✅ Все инструменты имеют корректную структуру`);
      results.push({ name: 'tool_structure', status: 'success', message: 'Все инструменты валидны' });
    } else {
      throw new Error('Некоторые инструменты имеют неполную структуру');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'tool_structure', status: 'error', message: error.message });
  }
  console.log('');

  // Итоговый отчет
  console.log('=' .repeat(60));
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('=' .repeat(60));
  
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`\n✅ Успешно: ${successCount}`);
  console.log(`❌ Ошибок: ${errorCount}`);
  console.log(`📊 Всего тестов: ${results.length}`);
  console.log('');
  
  if (errorCount === 0) {
    console.log('🎉 Все тесты пройдены успешно!');
  } else {
    console.log('⚠️  Некоторые тесты не прошли:');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  }
  
  console.log('');
  console.log('=' .repeat(60));
}

runFinalTests().catch(console.error);

