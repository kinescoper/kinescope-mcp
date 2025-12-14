# Фильтрация ресурсов Kinescope MCP

Система фильтрации ресурсов позволяет выбирать конкретные категории API для включения в MCP сервер.

## Категории ресурсов

### `video.*` - Kinescope Video APIs
Все API связанные с управлением видео:
- `/videos` - список и управление видео
- `/videos/{video_id}` - операции с конкретным видео
- Постеры, субтитры, аннотации
- Копирование, обрезка, конкатенация видео

### `data.*` - Kinescope Data APIs
Аналитика и метрики:
- `/analytics` - аналитика
- `/billing/usage` - использование и биллинг

### `live_streams.*` - Kinescope Live APIs
Управление live стримами:
- `/live/events` - события и стримы
- Создание, обновление, завершение стримов
- Restreams и QoS метрики

### `real_time.*` - Kinescope Real-time APIs
Speak API для видеозвонков:
- `/speak/rooms` - комнаты для видеозвонков
- `/speak/participants` - участники комнат

### `system.*` - Kinescope System APIs
Системные API:
- `/projects` - проекты и папки
- `/tags` - теги
- `/webhooks` - вебхуки
- `/players` - плееры
- `/moderators` - модераторы
- `/playlists` - плейлисты
- `/access-tokens` - токены доступа
- `/file-requests` - запросы файлов
- `/cdn/zones` - CDN зоны
- `/privacy-domains` - домены приватности
- И другие системные API

## Использование

### Через CLI

```bash
# Только Video API
npm start -- --api-key YOUR_KEY --resource video.*

# Video и Data API
npm start -- --api-key YOUR_KEY --resource video.* --resource data.*

# Только Live Streams
npm start -- --api-key YOUR_KEY --resource live_streams.*

# Несколько категорий через запятую
npm start -- --api-key YOUR_KEY --resource video.*,data.*,live_streams.*
```

### Через HTTP запросы

```bash
# Query параметр resources
curl -X POST "http://localhost:3000/?resources=video.*,data.*" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Программно

```typescript
import { launchStdioServer } from './stdio.js';

await launchStdioServer({
  apiKey: 'YOUR_KEY',
  mcpOptions: {
    resources: ['video.*', 'data.*'],
  },
});
```

## Примеры фильтров

```typescript
import { filters } from './filtering.js';

// Только Video API
const videoFilter = filters.video();

// Только операции чтения из Video API
const readOnlyVideo = filters.combine(
  filters.video(),
  filters.readOnly()
);

// Несколько категорий
const multipleCategories = filters.combine(
  filters.video(),
  filters.data(),
  filters.liveStreams()
);
```

## Логика фильтрации

Фильтры работают по принципу **включения (OR логика)**:
- Если указано несколько фильтров, endpoint включается если соответствует **хотя бы одному** фильтру
- Можно комбинировать фильтры по ресурсам с фильтрами по операциям, методам и т.д.
- Если фильтры не указаны, включаются все инструменты

## Wildcard паттерны

Поддерживаются следующие паттерны:
- `video.*` - все Video API
- `data.*` - все Data API
- `live_streams.*` - все Live API
- `real_time.*` - все Real-time API
- `system.*` - все System API

Можно также использовать более специфичные паттерны (если они будут реализованы в будущем):
- `video.videos.*` - только операции с видео
- `video.posters.*` - только постеры

