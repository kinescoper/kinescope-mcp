/**
 * Опции для настройки MCP сервера
 */

import { z } from 'zod';
import { ClientCapabilities, ClientType } from './compat.js';
import { Filter } from './filtering.js';

export interface McpOptions {
  client?: ClientType;
  capabilities?: Partial<ClientCapabilities>;
  filters?: Filter[];
  resources?: string | string[]; // Поддержка resource паттернов типа 'video.*' или ['video.*', 'data.*']
  includeDynamicTools?: boolean; // По умолчанию true
  includeAllTools?: boolean; // По умолчанию false
}

/**
 * Парсит опции из query параметров HTTP запроса
 */
export function parseQueryOptions(
  defaultOptions: McpOptions,
  query: Record<string, any>,
): McpOptions {
  const options: McpOptions = { ...defaultOptions };

  if (query.client) {
    const clientValue = query.client as string;
    // Валидация клиента
    if (['claude', 'claude-code', 'cursor', 'openai-agents', 'infer'].includes(clientValue)) {
      options.client = clientValue as ClientType;
    }
  }

  if (query.resources) {
    // Поддержка как строки, так и массива
    if (typeof query.resources === 'string') {
      options.resources = query.resources.split(',').map((r: string) => r.trim());
    } else if (Array.isArray(query.resources)) {
      options.resources = query.resources;
    }
  }

  if (query.filters) {
    try {
      options.filters = JSON.parse(query.filters);
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
  }

  if (query.includeDynamicTools !== undefined) {
    options.includeDynamicTools = query.includeDynamicTools === 'true';
  }

  if (query.includeAllTools !== undefined) {
    options.includeAllTools = query.includeAllTools === 'true';
  }

  return options;
}

/**
 * Преобразует resources опцию в фильтры
 */
export function resourcesToFilters(resources?: string | string[]): Filter[] {
  if (!resources) {
    return [];
  }
  
  const resourceList = Array.isArray(resources) ? resources : [resources];
  return resourceList.map(resource => ({ resource }));
}

