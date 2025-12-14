/**
 * Тест MCP сервера напрямую
 */

import { newKinescopeMcpServer, initKinescopeServer } from './dist/server.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const API_KEY = '695b1a99-e779-47cf-b5f8-9079eddbaf49';

async function testMCPServer() {
  console.log('🔧 Тестирование MCP сервера...\n');

  const server = newKinescopeMcpServer();
  
  initKinescopeServer({
    server,
    apiKey: API_KEY,
  });

  try {
    // Тест 1: Получение списка инструментов
    console.log('📋 Тест 1: Получение списка инструментов');
    const listToolsRequest = {
      jsonrpc: '2.0' as const,
      id: 1,
      method: 'tools/list',
      params: {},
    };
    
    const listToolsResponse = await server.server.request(listToolsRequest, ListToolsRequestSchema);
    console.log('✅ Успешно! Доступно инструментов:', listToolsResponse.tools?.length || 0);
    
    if (listToolsResponse.tools && listToolsResponse.tools.length > 0) {
      console.log('\n   Доступные инструменты:');
      listToolsResponse.tools.slice(0, 5).forEach((tool, i) => {
        console.log(`   ${i + 1}. ${tool.name} - ${tool.description?.substring(0, 50)}...`);
      });
      if (listToolsResponse.tools.length > 5) {
        console.log(`   ... и еще ${listToolsResponse.tools.length - 5}`);
      }
    }
    console.log('');

    // Тест 2: Вызов инструмента list_kinescope_videos
    console.log('📹 Тест 2: Вызов list_kinescope_videos');
    const callToolRequest = {
      jsonrpc: '2.0' as const,
      id: 2,
      method: 'tools/call',
      params: {
        name: 'list_kinescope_videos',
        arguments: {
          limit: 3,
        },
      },
    };
    
    const callToolResponse = await server.server.request(callToolRequest, CallToolRequestSchema);
    
    if (callToolResponse.content && callToolResponse.content.length > 0) {
      const resultText = callToolResponse.content[0].text;
      const result = JSON.parse(resultText);
      console.log('✅ Успешно! Результат:');
      console.log('   Всего видео:', result?.meta?.pagination?.total || 'N/A');
      console.log('   Получено:', result?.data?.length || 0);
      if (result?.data?.[0]) {
        console.log('   Первое видео:', result.data[0].title);
      }
    } else {
      console.log('⚠️  Пустой ответ');
    }
    console.log('');

    // Тест 3: Вызов инструмента get_kinescope_video
    console.log('🔍 Тест 3: Вызов get_kinescope_video');
    
    // Сначала получим ID видео
    const listRequest = {
      jsonrpc: '2.0' as const,
      id: 3,
      method: 'tools/call',
      params: {
        name: 'list_kinescope_videos',
        arguments: { limit: 1 },
      },
    };
    
    const listResponse = await server.server.request(listRequest, CallToolRequestSchema);
    let videoId: string | null = null;
    
    if (listResponse.content && listResponse.content.length > 0) {
      const listResult = JSON.parse(listResponse.content[0].text);
      videoId = listResult?.data?.[0]?.id;
    }
    
    if (videoId) {
      const getToolRequest = {
        jsonrpc: '2.0' as const,
        id: 4,
        method: 'tools/call',
        params: {
          name: 'get_kinescope_video',
          arguments: { video_id: videoId },
        },
      };
      
      const getToolResponse = await server.server.request(getToolRequest, CallToolRequestSchema);
      
      if (getToolResponse.content && getToolResponse.content.length > 0) {
        const result = JSON.parse(getToolResponse.content[0].text);
        console.log('✅ Успешно! Получено видео:');
        console.log('   ID:', result?.id || 'N/A');
        console.log('   Название:', result?.title || 'N/A');
        console.log('   Статус:', result?.status || 'N/A');
        console.log('   Длительность:', result?.duration ? `${Math.round(result.duration)} сек` : 'N/A');
      } else {
        console.log('⚠️  Пустой ответ');
      }
    } else {
      console.log('⚠️  Не удалось получить ID видео');
    }
    console.log('');

    console.log('✅ Все тесты завершены!');
    
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
}

testMCPServer().catch(console.error);

