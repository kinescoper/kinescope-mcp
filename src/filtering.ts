/**
 * Фильтрация инструментов по различным критериям
 */

import { Endpoint } from './tools/index.js';
import { matchesResourcePattern } from './resource-categories.js';

export interface Filter {
  resource?: string | string[]; // Поддержка wildcard паттернов типа 'video.*' или массива паттернов
  operation?: 'read' | 'write';
  httpMethod?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  httpPath?: string | RegExp;
  name?: string | RegExp;
}

/**
 * Применяет фильтры к списку endpoints
 * Фильтры работают как включение (OR логика) - endpoint включается если соответствует хотя бы одному фильтру
 */
export function query(filters: Filter[], endpoints: Endpoint[]): Endpoint[] {
  if (filters.length === 0) {
    return endpoints;
  }

  return endpoints.filter((endpoint) => {
    return filters.some((filter) => {
      // Фильтр по resource (поддержка wildcard паттернов)
      if (filter.resource !== undefined) {
        const resourcePatterns = Array.isArray(filter.resource) ? filter.resource : [filter.resource];
        const matches = resourcePatterns.some(pattern => matchesResourcePattern(endpoint, pattern));
        if (!matches) {
          return false;
        }
      }

      // Фильтр по operation
      if (filter.operation !== undefined) {
        if (endpoint.metadata.operation !== filter.operation) {
          return false;
        }
      }

      // Фильтр по httpMethod
      if (filter.httpMethod !== undefined) {
        if (endpoint.metadata.httpMethod !== filter.httpMethod) {
          return false;
        }
      }

      // Фильтр по httpPath
      if (filter.httpPath !== undefined) {
        const path = endpoint.metadata.httpPath;
        if (filter.httpPath instanceof RegExp) {
          if (!filter.httpPath.test(path)) {
            return false;
          }
        } else {
          if (path !== filter.httpPath) {
            return false;
          }
        }
      }

      // Фильтр по имени инструмента
      if (filter.name !== undefined) {
        const toolName = endpoint.tool.name;
        if (filter.name instanceof RegExp) {
          if (!filter.name.test(toolName)) {
            return false;
          }
        } else {
          if (toolName !== filter.name) {
            return false;
          }
        }
      }

      return true;
    });
  });
}

/**
 * Вспомогательные функции для создания фильтров
 */
export const filters = {
  /**
   * Фильтр для операций чтения
   */
  readOnly: (): Filter => ({ operation: 'read' }),

  /**
   * Фильтр для операций записи
   */
  writeOnly: (): Filter => ({ operation: 'write' }),

  /**
   * Фильтр по ресурсу (поддержка wildcard паттернов типа 'video.*')
   */
  resource: (resource: string | string[]): Filter => ({ resource }),
  
  /**
   * Фильтр для всех Video API
   */
  video: (): Filter => ({ resource: 'video.*' }),
  
  /**
   * Фильтр для всех Data/Analytics API
   */
  data: (): Filter => ({ resource: 'data.*' }),
  
  /**
   * Фильтр для всех Live Streams API
   */
  liveStreams: (): Filter => ({ resource: 'live_streams.*' }),
  
  /**
   * Фильтр для всех Real-time/Speak API
   */
  realTime: (): Filter => ({ resource: 'real_time.*' }),
  
  /**
   * Фильтр для всех System API
   */
  system: (): Filter => ({ resource: 'system.*' }),

  /**
   * Фильтр по HTTP методу
   */
  method: (httpMethod: 'get' | 'post' | 'put' | 'patch' | 'delete'): Filter => ({ httpMethod }),

  /**
   * Фильтр по пути
   */
  path: (httpPath: string | RegExp): Filter => ({ httpPath }),

  /**
   * Фильтр по имени инструмента
   */
  name: (name: string | RegExp): Filter => ({ name }),

  /**
   * Комбинированный фильтр
   */
  combine: (...filters: Filter[]): Filter[] => filters,
};

