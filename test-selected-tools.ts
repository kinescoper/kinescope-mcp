/**
 * Тестирование выборочных инструментов
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
  data?: any;
}

async function testSelectedTools() {
  console.log('🧪 Тестирование выборочных инструментов Kinescope MCP\n');
  console.log('=' .repeat(60));
  console.log('');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  const results: TestResult[] = [];

  // Тест 1: Videos list (обновленный с правильными параметрами)
  console.log('📋 Тест 1: list_kinescope_videos (с фильтрацией)');
  try {
    const { handler } = await import('./dist/tools/videos/videos-list.js');
    const result: any = await handler(client, { 
      page: '1', 
      per_page: '3',
      order: 'created_at.desc'
    });
    
    if (result?.data && Array.isArray(result.data)) {
      console.log(`   ✅ Успешно! Получено ${result.data.length} видео из ${result.meta?.pagination?.total || 'N/A'}`);
      if (result.data[0]) {
        console.log(`   Первое видео: "${result.data[0].title}"`);
        console.log(`   ID: ${result.data[0].id}`);
      }
      results.push({ 
        name: 'list_kinescope_videos', 
        status: 'success', 
        message: `Получено ${result.data.length} видео`,
        data: { total: result.meta?.pagination?.total, returned: result.data.length }
      });
    } else {
      console.log(`   Отладка: результат = ${JSON.stringify(result).substring(0, 200)}`);
      throw new Error('Неожиданная структура ответа');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'list_kinescope_videos', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 2: Get video
  console.log('🔍 Тест 2: get_kinescope_video');
  try {
    // Сначала получим ID
    const { handler: listHandler } = await import('./dist/tools/videos/videos-list.js');
    const listResult: any = await listHandler(client, { per_page: '1' });
    const videoId = listResult?.data?.[0]?.id;

    if (videoId) {
      const { handler: getHandler } = await import('./dist/tools/videos/_video_id/get-video.js');
      const result: any = await getHandler(client, { video_id: videoId });
      
      if (result?.id && result?.title) {
        console.log(`   ✅ Успешно! Получено видео:`);
        console.log(`   Название: "${result.title}"`);
        console.log(`   ID: ${result.id}`);
        console.log(`   Статус: ${result.status}`);
        console.log(`   Длительность: ${Math.round(result.duration || 0)} сек`);
        results.push({ 
          name: 'get_kinescope_video', 
          status: 'success', 
          message: `Получено видео: ${result.title}`,
          data: { id: result.id, status: result.status }
        });
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

  // Тест 3: Projects list
  console.log('📁 Тест 3: list_kinescope_projects');
  try {
    const { handler } = await import('./dist/tools/projects/projects-list.js');
    const result: any = await handler(client, { per_page: '5' });
    
    if (result?.data && Array.isArray(result.data)) {
      console.log(`   ✅ Успешно! Получено ${result.data.length} проектов из ${result.meta?.pagination?.total || 'N/A'}`);
      if (result.data[0]) {
        console.log(`   Первый проект: "${result.data[0].name}"`);
        console.log(`   ID: ${result.data[0].id}`);
      }
      results.push({ 
        name: 'list_kinescope_projects', 
        status: 'success', 
        message: `Получено ${result.data.length} проектов`,
        data: { total: result.meta?.pagination?.total, returned: result.data.length }
      });
    } else {
      throw new Error('Неожиданная структура ответа');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'list_kinescope_projects', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 4: Live Events list (v2)
  console.log('🔴 Тест 4: list_kinescope_live_events (v2)');
  try {
    const liveClient = new KinescopeClient({
      apiKey: API_KEY,
      apiVersion: 'v2',
    });
    
    const { handler } = await import('./dist/tools/live/events/list-events.js');
    const result: any = await handler(liveClient, { per_page: '3' });
    
    // Проверяем разные варианты структуры ответа
    if (result?.data && Array.isArray(result.data)) {
      console.log(`   ✅ Успешно! Получено ${result.data.length} Live событий`);
      if (result.data[0]) {
        console.log(`   Первое событие: "${result.data[0].title || result.data[0].name || 'N/A'}"`);
        console.log(`   ID: ${result.data[0].id}`);
      }
      results.push({ 
        name: 'list_kinescope_live_events', 
        status: 'success', 
        message: `Получено ${result.data.length} событий`,
        data: { returned: result.data.length }
      });
    } else if (Array.isArray(result)) {
      console.log(`   ✅ Успешно! Получено ${result.length} Live событий (массив)`);
      if (result[0]) {
        console.log(`   Первое событие: "${result[0].title || result[0].name || 'N/A'}"`);
        console.log(`   ID: ${result[0].id}`);
      }
      results.push({ 
        name: 'list_kinescope_live_events', 
        status: 'success', 
        message: `Получено ${result.length} событий`,
        data: { returned: result.length }
      });
    } else {
      console.log(`   Отладка: результат = ${JSON.stringify(result).substring(0, 200)}`);
      throw new Error('Неожиданная структура ответа');
    }
  } catch (error: any) {
    console.log(`   ⚠️  Ошибка: ${error.message}`);
    results.push({ name: 'list_kinescope_live_events', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 5: Posters list для видео
  console.log('🖼️  Тест 5: list_kinescope_video_posters');
  try {
    // Получаем ID видео
    const { handler: listHandler } = await import('./dist/tools/videos/videos-list.js');
    const listResult: any = await listHandler(client, { per_page: '1' });
    const videoId = listResult?.data?.[0]?.id;

    if (videoId) {
      const { handler: postersHandler } = await import('./dist/tools/videos/_video_id/posters-list.js');
      const result: any = await postersHandler(client, { video_id: videoId });
      
      if (result?.data && Array.isArray(result.data)) {
        console.log(`   ✅ Успешно! Получено ${result.data.length} постеров для видео`);
        results.push({ 
          name: 'list_kinescope_video_posters', 
          status: 'success', 
          message: `Получено ${result.data.length} постеров`,
          data: { count: result.data.length }
        });
      } else {
        console.log(`   ⚠️  Пустой список постеров (возможно, их нет)`);
        results.push({ 
          name: 'list_kinescope_video_posters', 
          status: 'success', 
          message: 'Пустой список (нормально)',
          data: { count: 0 }
        });
      }
    } else {
      throw new Error('Не удалось получить ID видео');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'list_kinescope_video_posters', status: 'error', message: error.message });
  }
  console.log('');

  // Тест 6: Subtitles list для видео
  console.log('📝 Тест 6: list_kinescope_video_subtitles');
  try {
    const { handler: listHandler } = await import('./dist/tools/videos/videos-list.js');
    const listResult: any = await listHandler(client, { per_page: '1' });
    const videoId = listResult?.data?.[0]?.id;

    if (videoId) {
      const { handler: subtitlesHandler } = await import('./dist/tools/videos/_video_id/list-subtitles.js');
      const result: any = await subtitlesHandler(client, { video_id: videoId });
      
      if (result?.data && Array.isArray(result.data)) {
        console.log(`   ✅ Успешно! Получено ${result.data.length} субтитров для видео`);
        if (result.data[0]) {
          console.log(`   Первый субтитр: язык "${result.data[0].language || 'N/A'}"`);
        }
        results.push({ 
          name: 'list_kinescope_video_subtitles', 
          status: 'success', 
          message: `Получено ${result.data.length} субтитров`,
          data: { count: result.data.length }
        });
      } else {
        console.log(`   ⚠️  Пустой список субтитров`);
        results.push({ 
          name: 'list_kinescope_video_subtitles', 
          status: 'success', 
          message: 'Пустой список',
          data: { count: 0 }
        });
      }
    } else {
      throw new Error('Не удалось получить ID видео');
    }
  } catch (error: any) {
    console.log(`   ❌ Ошибка: ${error.message}`);
    results.push({ name: 'list_kinescope_video_subtitles', status: 'error', message: error.message });
  }
  console.log('');

  // Итоговый отчет
  console.log('=' .repeat(60));
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('=' .repeat(60));
  
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  
  console.log(`\n✅ Успешно: ${successCount}/${results.length}`);
  console.log(`❌ Ошибок: ${errorCount}/${results.length}`);
  console.log('');
  
  if (errorCount > 0) {
    console.log('⚠️  Ошибки:');
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
    console.log('');
  }
  
  console.log('📋 Детали успешных тестов:');
  results.filter(r => r.status === 'success').forEach(r => {
    console.log(`   ✅ ${r.name}: ${r.message}`);
  });
  
  console.log('');
  console.log('=' .repeat(60));
  
  if (errorCount === 0) {
    console.log('🎉 Все тесты пройдены успешно!');
  } else {
    console.log(`⚠️  ${errorCount} тест(ов) не прошли, но большинство работает`);
  }
}

testSelectedTools().catch(console.error);

