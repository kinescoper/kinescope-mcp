/**
 * Прямой тест API для проверки структуры ответов
 */

import { KinescopeClient } from './dist/client.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

async function testDirectAPI() {
  console.log('🔍 Прямой тест API для проверки структуры ответов\n');

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  try {
    // Тест 1: Videos list
    console.log('1. GET /videos?per_page=2');
    const videosResult: any = await client.get('/videos?per_page=2');
    console.log('   Тип:', typeof videosResult);
    console.log('   Это массив?', Array.isArray(videosResult));
    console.log('   Ключи:', videosResult ? Object.keys(videosResult).slice(0, 10).join(', ') : 'null');
    if (videosResult?.data) {
      console.log('   Есть поле data:', Array.isArray(videosResult.data));
      console.log('   data.length:', videosResult.data?.length);
    }
    if (videosResult?.meta) {
      console.log('   Есть поле meta:', Object.keys(videosResult.meta).join(', '));
    }
    console.log('');

    // Тест 2: Get video
    if (videosResult?.data?.[0]?.id || (Array.isArray(videosResult) && videosResult[0]?.id)) {
      const videoId = videosResult?.data?.[0]?.id || videosResult[0]?.id;
      console.log(`2. GET /videos/${videoId}`);
      const videoResult: any = await client.get(`/videos/${videoId}`);
      console.log('   Тип:', typeof videoResult);
      console.log('   Ключи:', videoResult ? Object.keys(videoResult).slice(0, 10).join(', ') : 'null');
      if (videoResult?.data) {
        console.log('   Есть поле data');
        console.log('   data.id:', videoResult.data?.id);
      }
      console.log('');
    }

    // Тест 3: Projects list
    console.log('3. GET /projects?per_page=2');
    const projectsResult: any = await client.get('/projects?per_page=2');
    console.log('   Тип:', typeof projectsResult);
    console.log('   Это массив?', Array.isArray(projectsResult));
    console.log('   Ключи:', projectsResult ? Object.keys(projectsResult).slice(0, 10).join(', ') : 'null');
    if (projectsResult?.data) {
      console.log('   Есть поле data:', Array.isArray(projectsResult.data));
    }
    console.log('');

  } catch (error: any) {
    console.error('Ошибка:', error.message);
  }
}

testDirectAPI().catch(console.error);

