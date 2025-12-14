# Поддержка клиентов и их capabilities

Kinescope MCP Server поддерживает различные MCP клиенты с автоматической адаптацией схем инструментов под возможности каждого клиента.

## Поддерживаемые клиенты

### `claude` (по умолчанию для Claude Desktop)
- **topLevelUnions**: `true` - поддерживает union типы верхнего уровня
- **validJson**: `false` - требует парсинг встроенного JSON из строк
- **refs**: `true` - поддерживает $ref ссылки
- **unions**: `true` - поддерживает anyOf/oneOf
- **formats**: `true` - поддерживает format поля

### `claude-code` (Claude Code)
- **topLevelUnions**: `false` - не поддерживает union типы верхнего уровня
- **validJson**: `true` - поддерживает валидный JSON
- **refs**: `true` - поддерживает $ref ссылки
- **unions**: `true` - поддерживает anyOf/oneOf
- **formats**: `true` - поддерживает format поля

### `cursor` (Cursor IDE)
- **topLevelUnions**: `false` - не поддерживает union типы верхнего уровня
- **validJson**: `true` - поддерживает валидный JSON
- **refs**: `false` - требует инлайнинг всех $ref ссылок
- **unions**: `false` - требует удаление anyOf конструкций
- **formats**: `false` - требует удаление format полей (добавляются в описание)
- **toolNameLength**: `50` - ограничение длины имен инструментов

### `openai-agents` (OpenAI Agents)
- **topLevelUnions**: `false` - не поддерживает union типы верхнего уровня
- **validJson**: `true` - поддерживает валидный JSON
- **refs**: `true` - поддерживает $ref ссылки
- **unions**: `true` - поддерживает anyOf/oneOf
- **formats**: `true` - поддерживает format поля

### `infer` (автоопределение)
Автоматически определяет клиента на основе информации от MCP клиента. Если определение невозможно, используются capabilities по умолчанию (полная поддержка всех возможностей).

## Использование

### Через CLI

```bash
# Явное указание клиента
npm start -- --api-key YOUR_KEY --client cursor

# Для Claude Desktop (по умолчанию)
npm start -- --api-key YOUR_KEY --client claude

# Для Claude Code
npm start -- --api-key YOUR_KEY --client claude-code

# Для OpenAI Agents
npm start -- --api-key YOUR_KEY --client openai-agents

# Автоопределение (по умолчанию)
npm start -- --api-key YOUR_KEY --client infer
```

### Через HTTP запросы

```bash
# Query параметр client
curl -X POST "http://localhost:3000/?client=cursor" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Программно

```typescript
import { launchStdioServer } from './stdio.js';
import { ClientType } from './compat.js';

await launchStdioServer({
  apiKey: 'YOUR_KEY',
  mcpOptions: {
    client: 'cursor' as ClientType,
  },
});
```

## Автоматические трансформации

В зависимости от выбранного клиента, сервер автоматически применяет следующие трансформации:

### Для Cursor:
1. **Обрезка имен инструментов** до 50 символов с обеспечением уникальности
2. **Инлайнинг $ref ссылок** - все ссылки заменяются на полные определения
3. **Удаление anyOf** - используется только первый вариант
4. **Удаление format полей** - информация о формате добавляется в описание

### Для клиентов без topLevelUnions:
1. **Разделение union типов** - каждый вариант union становится отдельным инструментом

### Для Claude (validJson: false):
1. **Парсинг встроенного JSON** - строки, содержащие JSON, автоматически парсятся в объекты

## Соответствие документации

Реализация полностью соответствует [документации Stainless по client capabilities](https://www.stainless.com/docs/guides/generate-mcp-server-from-openapi#client-capabilities).

Все capabilities настроены в соответствии с тестированными значениями для каждого известного клиента, как указано в документации Mux MCP и Stainless.

