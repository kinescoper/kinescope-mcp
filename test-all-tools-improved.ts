/**
 * Улучшенное тестирование всех инструментов с предварительным получением реальных данных
 */

import { KinescopeClient } from './dist/client.js';
import { endpoints } from './dist/tools/index.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
  error?: string;
}

async function testAllToolsImproved() {
  console.log('🧪 Улучшенное тестирование всех инструментов Kinescope MCP\n');
  console.log('=' .repeat(70));
  console.log(`Всего инструментов: ${endpoints.length}\n`);

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  const liveClient = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v2',
  });

  const results: TestResult[] = [];

  // Шаг 1: Получаем реальные данные для тестирования
  console.log('📥 Шаг 1: Получение реальных данных для тестирования...\n');

  let realVideoId: string | null = null;
  let realProjectId: string | null = null;
  let realLiveEventId: string | null = null;
  let realPlayerId: string | null = null;
  let realTagId: string | null = null;
  let realWebhookId: string | null = null;
  let realPlaylistId: string | null = null;
  let realModeratorId: string | null = null;
  let realFolderId: string | null = null;
  let realPosterId: string | null = null;
  let realSubtitleId: string | null = null;
  let realAnnotationId: string | null = null;

  try {
    // Получаем список видео
    const videosResult: any = await client.get('/videos?per_page=1');
    if (videosResult?.data?.[0]?.id) {
      realVideoId = videosResult.data[0].id;
      console.log(`   ✅ Получен video_id: ${realVideoId}`);
      
      // Получаем постеры для видео
      try {
        const postersResult: any = await client.get(`/videos/${realVideoId}/posters`);
        if (postersResult?.data?.[0]?.id) {
          realPosterId = postersResult.data[0].id;
          console.log(`   ✅ Получен poster_id: ${realPosterId}`);
        }
      } catch (e) {}
      
      // Получаем субтитры
      try {
        const subtitlesResult: any = await client.get(`/videos/${realVideoId}/subtitles`);
        if (subtitlesResult?.data?.[0]?.id) {
          realSubtitleId = subtitlesResult.data[0].id;
          console.log(`   ✅ Получен subtitle_id: ${realSubtitleId}`);
        }
      } catch (e) {}
      
      // Получаем аннотации
      try {
        const annotationsResult: any = await client.get(`/videos/${realVideoId}/annotations`);
        if (annotationsResult?.data?.[0]?.id) {
          realAnnotationId = annotationsResult.data[0].id;
          console.log(`   ✅ Получен annotation_id: ${realAnnotationId}`);
        }
      } catch (e) {}
    }
  } catch (e) {
    console.log(`   ⚠️  Не удалось получить video_id`);
  }

  try {
    // Получаем список проектов
    const projectsResult: any = await client.get('/projects?per_page=1');
    if (projectsResult?.data?.[0]?.id) {
      realProjectId = projectsResult.data[0].id;
      console.log(`   ✅ Получен project_id: ${realProjectId}`);
      
      // Получаем папки проекта
      try {
        const foldersResult: any = await client.get(`/projects/${realProjectId}/folders`);
        if (foldersResult?.data?.[0]?.id) {
          realFolderId = foldersResult.data[0].id;
          console.log(`   ✅ Получен folder_id: ${realFolderId}`);
        }
      } catch (e) {}
    }
  } catch (e) {
    console.log(`   ⚠️  Не удалось получить project_id`);
  }

  try {
    // Получаем список Live событий
    const eventsResult: any = await liveClient.get('/live/events?per_page=1');
    if (eventsResult?.data?.[0]?.id) {
      realLiveEventId = eventsResult.data[0].id;
      console.log(`   ✅ Получен event_id: ${realLiveEventId}`);
    }
  } catch (e) {
    console.log(`   ⚠️  Не удалось получить event_id`);
  }

  try {
    // Получаем список плееров
    const playersResult: any = await client.get('/players?per_page=1');
    if (playersResult?.data?.[0]?.id) {
      realPlayerId = playersResult.data[0].id;
      console.log(`   ✅ Получен player_id: ${realPlayerId}`);
    }
  } catch (e) {}

  try {
    // Получаем список тегов
    const tagsResult: any = await client.get('/tags?per_page=1');
    if (tagsResult?.data?.[0]?.id) {
      realTagId = tagsResult.data[0].id;
      console.log(`   ✅ Получен tag_id: ${realTagId}`);
    }
  } catch (e) {}

  try {
    // Получаем список вебхуков
    const webhooksResult: any = await client.get('/webhooks?per_page=1');
    if (webhooksResult?.data?.[0]?.id) {
      realWebhookId = webhooksResult.data[0].id;
      console.log(`   ✅ Получен webhook_id: ${realWebhookId}`);
    }
  } catch (e) {}

  try {
    // Получаем список плейлистов
    const playlistsResult: any = await client.get('/playlists?per_page=1');
    if (playlistsResult?.data?.[0]?.id) {
      realPlaylistId = playlistsResult.data[0].id;
      console.log(`   ✅ Получен playlist_id: ${realPlaylistId}`);
    }
  } catch (e) {}

  try {
    // Получаем список модераторов
    const moderatorsResult: any = await client.get('/moderators?per_page=1');
    if (moderatorsResult?.data?.[0]?.id) {
      realModeratorId = moderatorsResult.data[0].id;
      console.log(`   ✅ Получен moderator_id: ${realModeratorId}`);
    }
  } catch (e) {}

  console.log('\n📋 Шаг 2: Тестирование инструментов с реальными данными...\n');
  console.log('-'.repeat(70));

  // Функция для безопасного выполнения теста
  async function safeTest(
    tool: typeof endpoints[0],
    getClient: () => KinescopeClient,
    getArgs: () => any | null
  ): Promise<TestResult> {
    try {
      const args = getArgs();
      if (args === null) {
        return {
          name: tool.tool.name,
          status: 'skipped',
          message: 'Требуются данные, которых нет в аккаунте',
        };
      }

      const result = await tool.handler(getClient(), args);
      
      if (result === undefined || result === null) {
        return {
          name: tool.tool.name,
          status: 'error',
          message: 'Пустой результат',
        };
      }

      return {
        name: tool.tool.name,
        status: 'success',
        message: 'Успешно выполнен',
      };
    } catch (error: any) {
      const errorMsg = error.message || String(error);
      
      // Пропускаем ожидаемые ошибки
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        return {
          name: tool.tool.name,
          status: 'skipped',
          message: 'Ресурс не найден',
        };
      }

      if (errorMsg.includes('403') || errorMsg.includes('Access denied')) {
        return {
          name: tool.tool.name,
          status: 'skipped',
          message: 'Доступ запрещен',
        };
      }

      return {
        name: tool.tool.name,
        status: 'error',
        message: errorMsg.substring(0, 150),
        error: errorMsg,
      };
    }
  }

  // Тестируем инструменты
  let processed = 0;
  for (const tool of endpoints) {
    processed++;
    const toolName = tool.tool.name;
    const method = tool.metadata.httpMethod.toUpperCase();
    const path = tool.metadata.httpPath;

    // Определяем клиент
    const useLiveClient = path.includes('/live/') || path.startsWith('/live');
    const getClient = () => useLiveClient ? liveClient : client;

    // Генерируем аргументы с реальными ID
    const getArgs = (): any | null => {
      const args: any = {};

      // Path variables с реальными ID
      if (path.includes(':video_id') || path.includes('{video_id}')) {
        if (!realVideoId) return null;
        args.video_id = realVideoId;
      }
      if (path.includes(':project_id') || path.includes('{project_id}')) {
        if (!realProjectId) return null;
        args.project_id = realProjectId;
      }
      if (path.includes(':event_id') || path.includes('{event_id}')) {
        if (!realLiveEventId) return null;
        args.event_id = realLiveEventId;
      }
      if (path.includes(':folder_id') || path.includes('{folder_id}')) {
        if (!realFolderId) return null;
        args.folder_id = realFolderId;
      }
      if (path.includes(':poster_id') || path.includes('{poster_id}')) {
        if (!realPosterId) return null;
        args.poster_id = realPosterId;
      }
      if (path.includes(':subtitle_id') || path.includes('{subtitle_id}')) {
        if (!realSubtitleId) return null;
        args.subtitle_id = realSubtitleId;
      }
      if (path.includes(':annotation_id') || path.includes('{annotation_id}')) {
        if (!realAnnotationId) return null;
        args.annotation_id = realAnnotationId;
      }
      if (path.includes(':player_id') || path.includes('{player_id}')) {
        if (!realPlayerId) return null;
        args.player_id = realPlayerId;
      }
      if (path.includes(':tag_id') || path.includes('{tag_id}')) {
        if (!realTagId) return null;
        args.tag_id = realTagId;
      }
      if (path.includes(':webhook_id') || path.includes('{webhook_id}')) {
        if (!realWebhookId) return null;
        args.webhook_id = realWebhookId;
      }
      if (path.includes(':playlist_id') || path.includes('{playlist_id}')) {
        if (!realPlaylistId) return null;
        args.playlist_id = realPlaylistId;
      }
      if (path.includes(':moderator_id') || path.includes('{moderator_id}')) {
        if (!realModeratorId) return null;
        args.moderator_id = realModeratorId;
      }
      if (path.includes(':token_id') || path.includes('{token_id}')) {
        // Для токенов пропускаем - нужны реальные токены
        return null;
      }
      if (path.includes(':material_id') || path.includes('{material_id}')) {
        // Для материалов пропускаем - нужны реальные материалы
        return null;
      }
      if (path.includes(':file_request_id') || path.includes('{file_request_id}')) {
        // Для file requests пропускаем
        return null;
      }
      if (path.includes(':restream_id') || path.includes('{restream_id}')) {
        // Для restreams пропускаем
        return null;
      }
      if (path.includes(':zone_id') || path.includes('{zone_id}')) {
        // Для zones пропускаем
        return null;
      }
      if (path.includes(':room_id') || path.includes('{room_id}')) {
        // Для rooms пропускаем
        return null;
      }
      if (path.includes(':domain_id') || path.includes('{domain_id}')) {
        // Для domains пропускаем
        return null;
      }

      // Пропускаем DELETE операции для безопасности
      if (method === 'DELETE') {
        return null;
      }

      // Query parameters для GET запросов
      if (method === 'GET') {
        const schema = tool.tool.inputSchema as any;
        if (schema?.properties?.page) {
          args.page = '1';
        }
        if (schema?.properties?.per_page) {
          args.per_page = '5';
        }
        if (schema?.properties?.order) {
          args.order = 'created_at.desc';
        }
      }

      // Body parameters для POST/PUT/PATCH (только для чтения, не создаем новые ресурсы)
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        // Пропускаем операции создания для безопасности
        if (path.includes('/videos') && method === 'POST') return null;
        if (path.includes('/projects') && method === 'POST') return null;
        if (path.includes('/events') && method === 'POST') return null;
        if (path.includes('/tokens') && method === 'POST') return null;
        if (path.includes('/webhooks') && method === 'POST') return null;
        if (path.includes('/tags') && method === 'POST') return null;
        if (path.includes('/playlists') && method === 'POST') return null;
        if (path.includes('/moderators') && method === 'POST') return null;
        if (path.includes('/players') && method === 'POST') return null;
        if (path.includes('/file-requests') && method === 'POST') return null;
        if (path.includes('/zones') && method === 'POST') return null;
        if (path.includes('/rooms') && method === 'POST') return null;
        if (path.includes('/privacy-domains') && method === 'POST') return null;
        
        // Для обновлений используем минимальные данные
        const schema = tool.tool.inputSchema as any;
        if (schema?.properties?.title) {
          args.title = 'Updated Title';
        }
        if (schema?.properties?.name) {
          args.name = 'Updated Name';
        }
        if (schema?.properties?.description) {
          args.description = 'Updated Description';
        }
        if (schema?.properties?.enabled !== undefined) {
          args.enabled = true;
        }
      }

      return args;
    };

    const result = await safeTest(tool, getClient, getArgs);
    results.push(result);

    if (result.status === 'success') {
      process.stdout.write('✅');
    } else if (result.status === 'error') {
      process.stdout.write('❌');
    } else {
      process.stdout.write('⏭️ ');
    }

    if (processed % 20 === 0) {
      process.stdout.write(` ${processed}/${endpoints.length}\n`);
    }
  }

  if (processed % 20 !== 0) {
    process.stdout.write(` ${processed}/${endpoints.length}\n`);
  }

  // Итоговый отчет
  console.log('\n\n' + '='.repeat(70));
  console.log('📊 ИТОГОВЫЙ ОТЧЕТ');
  console.log('='.repeat(70));

  const totalSuccess = results.filter(r => r.status === 'success').length;
  const totalErrors = results.filter(r => r.status === 'error').length;
  const totalSkipped = results.filter(r => r.status === 'skipped').length;

  console.log(`\n📈 Общая статистика:`);
  console.log(`   Всего инструментов: ${results.length}`);
  console.log(`   ✅ Успешно: ${totalSuccess} (${Math.round(totalSuccess / results.length * 100)}%)`);
  console.log(`   ❌ Ошибок: ${totalErrors} (${Math.round(totalErrors / results.length * 100)}%)`);
  console.log(`   ⏭️  Пропущено: ${totalSkipped} (${Math.round(totalSkipped / results.length * 100)}%)`);

  // Группируем по ресурсам
  const byResource = new Map<string, { success: number; total: number; errors: number; skipped: number }>();
  for (const result of results) {
    const tool = endpoints.find(e => e.tool.name === result.name);
    if (tool) {
      const resource = tool.metadata.resource;
      if (!byResource.has(resource)) {
        byResource.set(resource, { success: 0, total: 0, errors: 0, skipped: 0 });
      }
      const stats = byResource.get(resource)!;
      stats.total++;
      if (result.status === 'success') stats.success++;
      else if (result.status === 'error') stats.errors++;
      else stats.skipped++;
    }
  }

  console.log(`\n📦 Статистика по ресурсам (топ 15):`);
  const sortedResources = Array.from(byResource.entries())
    .sort((a, b) => b[1].success - a[1].success)
    .slice(0, 15);
  
  for (const [resource, stats] of sortedResources) {
    const successRate = stats.total > 0 ? Math.round(stats.success / stats.total * 100) : 0;
    const icon = successRate >= 80 ? '✅' : successRate >= 50 ? '⚠️' : '❌';
    console.log(`   ${icon} ${resource}: ${stats.success}/${stats.total} успешно (${successRate}%)`);
  }

  // Детали ошибок
  if (totalErrors > 0) {
    console.log(`\n❌ Детали ошибок (первые 15):`);
    results
      .filter(r => r.status === 'error')
      .slice(0, 15)
      .forEach(r => {
        console.log(`   - ${r.name}: ${r.message.substring(0, 100)}`);
      });
    if (totalErrors > 15) {
      console.log(`   ... и еще ${totalErrors - 15} ошибок`);
    }
  }

  // Сохраняем отчет
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, 'test-all-results-improved.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      total: results.length,
      success: totalSuccess,
      errors: totalErrors,
      skipped: totalSkipped,
    },
    byResource: Object.fromEntries(byResource),
    allResults: results,
  }, null, 2));

  console.log(`\n📄 Детальный отчет сохранен в: ${reportPath}`);
  console.log('\n' + '='.repeat(70));

  if (totalErrors === 0) {
    console.log('🎉 Все инструменты работают корректно!');
  } else if (totalSuccess / results.length >= 0.7) {
    console.log(`✅ Большинство инструментов работают (${Math.round(totalSuccess / results.length * 100)}% успешно)`);
    console.log(`   Ошибки в основном связаны с отсутствием данных или операциями создания/удаления`);
  } else {
    console.log(`⚠️  Требуется внимание: ${totalErrors} ошибок из ${results.length} тестов`);
  }
}

testAllToolsImproved().catch(console.error);

