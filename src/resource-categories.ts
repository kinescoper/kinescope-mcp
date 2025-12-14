/**
 * Категоризация ресурсов Kinescope API
 */

import { Endpoint } from './tools/index.js';

export type ResourceCategory = 'video' | 'data' | 'live_streams' | 'real_time' | 'system';

/**
 * Определяет категорию ресурса на основе HTTP пути
 */
export function getResourceCategory(endpoint: Endpoint): ResourceCategory {
  const path = endpoint.metadata.httpPath.toLowerCase();

  // Live Streams API - проверяем первым, так как может содержать /video в пути
  if (path.startsWith('/live') || path.includes('/live/')) {
    return 'live_streams';
  }

  // Real-time/Speak API
  if (path.startsWith('/speak') || path.includes('/rooms') || path.includes('/participants')) {
    return 'real_time';
  }

  // Data/Analytics API
  if (path.includes('/analytics') || path.includes('/billing/usage')) {
    return 'data';
  }

  // Video API - все пути связанные с видео (но не live)
  if (path.startsWith('/videos') || (path.includes('/video') && !path.includes('/live'))) {
    return 'video';
  }

  // System - все остальное (проекты, теги, вебхуки, плееры, модераторы, плейлисты и т.д.)
  return 'system';
}

/**
 * Получает полный путь категории ресурса (например, 'video.*')
 */
export function getResourcePath(endpoint: Endpoint): string {
  const category = getResourceCategory(endpoint);
  const resource = endpoint.metadata.resource;
  
  // Если resource начинается с категории, возвращаем как есть
  if (resource.startsWith(category)) {
    return resource;
  }
  
  // Иначе возвращаем категорию.*
  return `${category}.*`;
}

/**
 * Проверяет, соответствует ли endpoint паттерну ресурса
 * Поддерживает wildcard паттерны типа 'video.*', 'video.videos.*', 'data.*'
 */
export function matchesResourcePattern(endpoint: Endpoint, pattern: string): boolean {
  const category = getResourceCategory(endpoint);
  const resource = endpoint.metadata.resource;
  
  // Точное совпадение
  if (pattern === resource) {
    return true;
  }
  
  // Паттерн вида 'category.*'
  if (pattern.endsWith('.*')) {
    const patternCategory = pattern.slice(0, -2);
    return category === patternCategory;
  }
  
  // Паттерн вида 'category.resource.*'
  if (pattern.includes('.*')) {
    const parts = pattern.split('.*');
    const patternPrefix = parts[0];
    
    // Проверяем, начинается ли resource с паттерна
    if (resource.startsWith(patternPrefix + '.')) {
      return true;
    }
    
    // Проверяем категорию
    const patternCategory = patternPrefix.split('.')[0];
    if (category === patternCategory) {
      return true;
    }
  }
  
  return false;
}

/**
 * Маппинг категорий на описания
 */
export const categoryDescriptions: Record<ResourceCategory, string> = {
  video: 'Kinescope Video APIs - управление видео, постеры, субтитры, аннотации',
  data: 'Kinescope Data APIs - аналитика и метрики использования',
  live_streams: 'Kinescope Live APIs - управление live стримами и событиями',
  real_time: 'Kinescope Real-time APIs - Speak API для видеозвонков и комнат',
  system: 'Kinescope System APIs - проекты, теги, вебхуки, плееры, модераторы, плейлисты и другие системные API',
};

/**
 * Список всех доступных категорий
 */
export const allCategories: ResourceCategory[] = ['video', 'data', 'live_streams', 'real_time', 'system'];

