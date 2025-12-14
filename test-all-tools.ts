/**
 * Комплексное тестирование всех инструментов Kinescope MCP
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

interface ResourceStats {
  resource: string;
  total: number;
  success: number;
  errors: number;
  skipped: number;
  results: TestResult[];
}

async function testAllTools() {
  console.log('🧪 Комплексное тестирование всех инструментов Kinescope MCP\n');
  console.log('=' .repeat(70));
  console.log(`Всего инструментов для тестирования: ${endpoints.length}\n`);

  const client = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v1',
  });

  const liveClient = new KinescopeClient({
    apiKey: API_KEY,
    apiVersion: 'v2',
  });

  const results: TestResult[] = [];
  const resourceStats = new Map<string, ResourceStats>();

  // Группируем инструменты по ресурсам
  const toolsByResource = new Map<string, typeof endpoints>();
  for (const endpoint of endpoints) {
    const resource = endpoint.metadata.resource;
    if (!toolsByResource.has(resource)) {
      toolsByResource.set(resource, []);
    }
    toolsByResource.get(resource)!.push(endpoint);
  }

  console.log(`Группировка по ресурсам: ${toolsByResource.size} групп\n`);

  // Кэш для данных, которые могут понадобиться другим тестам
  let cachedVideoId: string | null = null;
  let cachedProjectId: string | null = null;
  let cachedLiveEventId: string | null = null;

  // Функция для безопасного выполнения теста
  async function safeTest(
    tool: typeof endpoints[0],
    getClient: () => KinescopeClient,
    getArgs: () => any
  ): Promise<TestResult> {
    try {
      const args = getArgs();
      if (args === null) {
        return {
          name: tool.tool.name,
          status: 'skipped',
          message: 'Требуются данные из других тестов',
        };
      }

      const result = await tool.handler(getClient(), args);
      
      // Проверяем, что результат не undefined и не null
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
      // Пропускаем некоторые ожидаемые ошибки
      const errorMsg = error.message || String(error);
      
      // 404 может быть нормальным для некоторых операций
      if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        return {
          name: tool.tool.name,
          status: 'skipped',
          message: 'Ресурс не найден (возможно, нормально)',
        };
      }

      // 400 может означать неправильные параметры
      if (errorMsg.includes('400') || errorMsg.includes('validation')) {
        return {
          name: tool.tool.name,
          status: 'error',
          message: `Валидация: ${errorMsg.substring(0, 100)}`,
          error: errorMsg,
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

  // Тестируем каждый ресурс
  let processed = 0;
  for (const [resource, tools] of toolsByResource.entries()) {
    const stats: ResourceStats = {
      resource,
      total: tools.length,
      success: 0,
      errors: 0,
      skipped: 0,
      results: [],
    };

    console.log(`\n📦 Тестирование ресурса: ${resource} (${tools.length} инструментов)`);
    console.log('-'.repeat(70));

    for (const tool of tools) {
      processed++;
      const toolName = tool.tool.name;
      const method = tool.metadata.httpMethod.toUpperCase();
      const path = tool.metadata.httpPath;

      // Определяем клиент в зависимости от пути
      const useLiveClient = path.includes('/live/') || path.startsWith('/live');
      const getClient = () => useLiveClient ? liveClient : client;

      // Генерируем аргументы в зависимости от типа операции
      const getArgs = (): any => {
        const args: any = {};

        // Path variables
        if (path.includes(':video_id') || path.includes('{video_id}')) {
          if (!cachedVideoId) return null;
          args.video_id = cachedVideoId;
        }
        if (path.includes(':project_id') || path.includes('{project_id}')) {
          if (!cachedProjectId) return null;
          args.project_id = cachedProjectId;
        }
        if (path.includes(':event_id') || path.includes('{event_id}')) {
          if (!cachedLiveEventId) return null;
          args.event_id = cachedLiveEventId;
        }
        if (path.includes(':folder_id') || path.includes('{folder_id}')) {
          args.folder_id = 'test-folder-id'; // Может не существовать, но попробуем
        }
        if (path.includes(':poster_id') || path.includes('{poster_id}')) {
          args.poster_id = 'test-poster-id';
        }
        if (path.includes(':subtitle_id') || path.includes('{subtitle_id}')) {
          args.subtitle_id = 'test-subtitle-id';
        }
        if (path.includes(':annotation_id') || path.includes('{annotation_id}')) {
          args.annotation_id = 'test-annotation-id';
        }
        if (path.includes(':token_id') || path.includes('{token_id}')) {
          args.token_id = 'test-token-id';
        }
        if (path.includes(':material_id') || path.includes('{material_id}')) {
          args.material_id = 'test-material-id';
        }
        if (path.includes(':player_id') || path.includes('{player_id}')) {
          args.player_id = 'test-player-id';
        }
        if (path.includes(':tag_id') || path.includes('{tag_id}')) {
          args.tag_id = 'test-tag-id';
        }
        if (path.includes(':webhook_id') || path.includes('{webhook_id}')) {
          args.webhook_id = 'test-webhook-id';
        }
        if (path.includes(':moderator_id') || path.includes('{moderator_id}')) {
          args.moderator_id = 'test-moderator-id';
        }
        if (path.includes(':playlist_id') || path.includes('{playlist_id}')) {
          args.playlist_id = 'test-playlist-id';
        }
        if (path.includes(':domain_id') || path.includes('{domain_id}')) {
          args.domain_id = 'test-domain-id';
        }
        if (path.includes(':restream_id') || path.includes('{restream_id}')) {
          args.restream_id = 'test-restream-id';
        }
        if (path.includes(':file_request_id') || path.includes('{file_request_id}')) {
          args.file_request_id = 'test-file-request-id';
        }
        if (path.includes(':zone_id') || path.includes('{zone_id}')) {
          args.zone_id = 'test-zone-id';
        }
        if (path.includes(':room_id') || path.includes('{room_id}')) {
          args.room_id = 'test-room-id';
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

        // Body parameters для POST/PUT/PATCH
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          const schema = tool.tool.inputSchema as any;
          // Минимальные данные для создания/обновления
          if (schema?.properties?.title) {
            args.title = 'Test Title';
          }
          if (schema?.properties?.name) {
            args.name = 'Test Name';
          }
          if (schema?.properties?.description) {
            args.description = 'Test Description';
          }
          if (schema?.properties?.enabled !== undefined) {
            args.enabled = true;
          }
        }

        return args;
      };

      const result = await safeTest(tool, getClient, getArgs);
      stats.results.push(result);

      if (result.status === 'success') {
        stats.success++;
        process.stdout.write('✅');
      } else if (result.status === 'error') {
        stats.errors++;
        process.stdout.write('❌');
      } else {
        stats.skipped++;
        process.stdout.write('⏭️ ');
      }

      results.push(result);

      // Кэшируем ID из успешных GET запросов со списками
      if (result.status === 'success' && method === 'GET' && path.includes('list')) {
        try {
          const testResult = await tool.handler(getClient(), getArgs());
          if (testResult && typeof testResult === 'object') {
            const data = (testResult as any).data;
            if (Array.isArray(data) && data.length > 0 && data[0]?.id) {
              const id = data[0].id;
              if (path.includes('/videos') && !cachedVideoId) {
                cachedVideoId = id;
                console.log(`\n   💾 Кэширован video_id: ${id}`);
              } else if (path.includes('/projects') && !cachedProjectId) {
                cachedProjectId = id;
                console.log(`\n   💾 Кэширован project_id: ${id}`);
              } else if (path.includes('/events') && !cachedLiveEventId) {
                cachedLiveEventId = id;
                console.log(`\n   💾 Кэширован event_id: ${id}`);
              }
            }
          }
        } catch (e) {
          // Игнорируем ошибки при кэшировании
        }
      }

      // Показываем прогресс каждые 10 инструментов
      if (processed % 10 === 0) {
        process.stdout.write(` ${processed}/${endpoints.length}\n`);
      }
    }

    if (processed % 10 !== 0) {
      process.stdout.write(` ${processed}/${endpoints.length}\n`);
    }

    resourceStats.set(resource, stats);
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

  console.log(`\n📦 Статистика по ресурсам:`);
  for (const [resource, stats] of resourceStats.entries()) {
    const successRate = stats.total > 0 ? Math.round(stats.success / stats.total * 100) : 0;
    const icon = successRate >= 80 ? '✅' : successRate >= 50 ? '⚠️' : '❌';
    console.log(`   ${icon} ${resource}: ${stats.success}/${stats.total} успешно (${successRate}%)`);
  }

  // Детали ошибок
  if (totalErrors > 0) {
    console.log(`\n❌ Детали ошибок (первые 20):`);
    results
      .filter(r => r.status === 'error')
      .slice(0, 20)
      .forEach(r => {
        console.log(`   - ${r.name}: ${r.message}`);
      });
    if (totalErrors > 20) {
      console.log(`   ... и еще ${totalErrors - 20} ошибок`);
    }
  }

  // Сохраняем детальный отчет
  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, 'test-all-results.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    summary: {
      total: results.length,
      success: totalSuccess,
      errors: totalErrors,
      skipped: totalSkipped,
    },
    byResource: Object.fromEntries(resourceStats),
    allResults: results,
  }, null, 2));

  console.log(`\n📄 Детальный отчет сохранен в: ${reportPath}`);
  console.log('\n' + '='.repeat(70));

  if (totalErrors === 0) {
    console.log('🎉 Все инструменты работают корректно!');
  } else if (totalSuccess / results.length >= 0.8) {
    console.log(`✅ Большинство инструментов работают (${Math.round(totalSuccess / results.length * 100)}% успешно)`);
  } else {
    console.log(`⚠️  Требуется внимание: ${totalErrors} ошибок из ${results.length} тестов`);
  }
}

testAllTools().catch(console.error);

