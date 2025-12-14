# Установка Kinescope MCP сервера локально

Это руководство поможет вам установить и настроить MCP (Model Context Protocol) сервер для Kinescope API локально на вашем компьютере.

## Предварительные требования

Перед началом установки убедитесь, что у вас установлены:

- **Node.js** версии 18.0.0 или выше
- **npm** (обычно устанавливается вместе с Node.js)
- Действующий **API ключ Kinescope**

Проверить версию Node.js можно командой:
```bash
node --version
```

## Способы установки

### Способ 1: Установка через npm (рекомендуется)

Установите пакет `@kinescope/mcp` глобально:

```bash
npm install -g @kinescope/mcp
```

После установки вы сможете использовать команду `kinescope-mcp` из любой директории.

### Способ 2: Использование через npx (без установки)

Вы можете использовать пакет напрямую через `npx` без предварительной установки:

```bash
npx -y @kinescope/mcp@latest --api-key YOUR_API_KEY
```

Этот способ автоматически загрузит последнюю версию пакета при каждом запуске.

## Настройка переменных окружения

Для работы MCP сервера требуется API ключ Kinescope. Вы можете указать его несколькими способами:

### Вариант 1: Переменная окружения (рекомендуется)

**macOS/Linux:**
```bash
export KINESCOPE_API_KEY="your_api_key_here"
```

**Windows (PowerShell):**
```powershell
$env:KINESCOPE_API_KEY="your_api_key_here"
```

**Windows (CMD):**
```cmd
set KINESCOPE_API_KEY=your_api_key_here
```

### Вариант 2: Файл .env

Создайте файл `.env` в корневой директории вашего проекта:

```bash
KINESCOPE_API_KEY=your_api_key_here
```

Затем используйте пакет `dotenv` для загрузки переменных (если требуется).

### Вариант 3: Параметр командной строки

Передайте API ключ напрямую при запуске:

```bash
npx -y @kinescope/mcp@latest --api-key your_api_key_here
```

## Настройка для различных MCP клиентов

### Cursor

Добавьте конфигурацию в файл настроек Cursor:

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
```

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json
```

**Linux:**
```
~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
```

**Конфигурация (рекомендуемая - динамические инструменты):**
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor"],
      "env": {
        "KINESCOPE_API_KEY": "your_kinescope_api_key_here"
      }
    }
  }
}
```

**Конфигурация с фильтрацией по ресурсам:**
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": [
        "-y",
        "@kinescope/mcp@latest",
        "--client=cursor",
        "--include-all-tools",
        "--resource",
        "video.*",
        "--resource",
        "data.*"
      ],
      "env": {
        "KINESCOPE_API_KEY": "your_kinescope_api_key_here"
      }
    }
  }
}
```

### Claude Desktop

Добавьте конфигурацию в файл настроек Claude Desktop:

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

**Конфигурация:**
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=claude"],
      "env": {
        "KINESCOPE_API_KEY": "your_kinescope_api_key_here"
      }
    }
  }
}
```

### Claude Code

Для Claude Code используйте аналогичную конфигурацию с `--client=claude-code`:

```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=claude-code"],
      "env": {
        "KINESCOPE_API_KEY": "your_kinescope_api_key_here"
      }
    }
  }
}
```

## Запуск MCP сервера

### STDIO транспорт (по умолчанию)

STDIO транспорт используется для локального взаимодействия с MCP клиентами:

```bash
kinescope-mcp --api-key YOUR_API_KEY
```

Или с переменной окружения:

```bash
KINESCOPE_API_KEY=your_key kinescope-mcp
```

### HTTP транспорт

Для удаленного доступа запустите сервер в режиме HTTP:

```bash
kinescope-mcp --transport=http --port=3000 --api-key YOUR_API_KEY
```

Сервер будет доступен по адресу `http://localhost:3000`.

## Параметры командной строки

Полный список доступных параметров:

```bash
kinescope-mcp [options]

Options:
  --version                Показать номер версии
  --api-key <key>          Kinescope API ключ (или используйте KINESCOPE_API_KEY env var)
  --base-url <url>         Базовый URL API (опционально)
  --transport <stdio|http> Тип транспорта (по умолчанию: stdio)
  --port <number>          Порт для HTTP транспорта (по умолчанию: 3000)
  --client <type>          Тип MCP клиента: cursor, claude, claude-code, openai-agents, infer (по умолчанию: infer)
  --include-dynamic-tools  Включить динамические инструменты (по умолчанию: true)
  --include-all-tools      Включить все статические инструменты (по умолчанию: false)
  --resource <pattern>     Фильтр по категориям ресурсов (например, video.*, data.*, live_streams.*)
  --help                   Показать справку
```

## Фильтрация инструментов

По умолчанию пакет использует только **динамические инструменты (3 инструмента)**, что оптимально для производительности и не превышает рекомендуемый лимит Cursor в 80 инструментов.

### Доступные категории ресурсов

- `video.*` - Video API (~26 инструментов)
  - Управление видео
  - Постеры, субтитры, аннотации
  - Операции с видео (копирование, обрезка, объединение)
  
- `data.*` - Analytics API (~3 инструмента)
  - Кастомная аналитика с группировкой
  - Обзорные метрики с временной шкалой
  - Производительность по странам, устройствам, видео
  
- `live_streams.*` - Live Streaming API (~18 инструментов)
  - Управление Live событиями
  - Настройка рестримов
  - Метрики QoS
  - Планирование событий
  
- `real_time.*` - Real-time/Speak API (~10 инструментов)
  - Видеозвонки
  - Комнаты для общения
  
- `system.*` - System API (~69 инструментов)
  - Проекты и папки
  - Теги и webhooks
  - Настройка плееров
  - Модераторы и плейлисты
  - Токены доступа и запросы файлов

### Примеры использования фильтров

**Только Video API:**
```bash
kinescope-mcp --include-all-tools --resource video.*
```

**Video + Analytics:**
```bash
kinescope-mcp --include-all-tools --resource video.* --resource data.*
```

**Несколько категорий:**
```bash
kinescope-mcp --include-all-tools --resource video.* --resource data.* --resource live_streams.*
```

## Динамические инструменты

Динамические инструменты предоставляют универсальный доступ ко всем API endpoints через три инструмента:

1. **kinescope_list_api_endpoints** - Поиск доступных endpoints с фильтрацией
2. **kinescope_get_api_endpoint_schema** - Получение схемы входных параметров для endpoint
3. **kinescope_invoke_api_endpoint** - Вызов любого API endpoint

Это позволяет получить доступ ко всем 126+ endpoints без необходимости загружать все статические инструменты.

## Проверка установки

После установки проверьте, что пакет работает корректно:

```bash
# Проверка версии
kinescope-mcp --version

# Просмотр справки
kinescope-mcp --help

# Тестовый запуск (требуется API ключ)
kinescope-mcp --api-key YOUR_API_KEY --help
```

## Устранение неполадок

### Проблема: Команда не найдена

**Решение:** Убедитесь, что пакет установлен глобально:
```bash
npm install -g @kinescope/mcp
```

Или используйте `npx`:
```bash
npx -y @kinescope/mcp@latest --help
```

### Проблема: Ошибка аутентификации

**Решение:** Проверьте, что API ключ указан правильно:
```bash
# Проверка переменной окружения
echo $KINESCOPE_API_KEY  # macOS/Linux
echo %KINESCOPE_API_KEY% # Windows CMD
$env:KINESCOPE_API_KEY   # Windows PowerShell
```

### Проблема: Превышение лимита инструментов в Cursor

**Решение:** Используйте динамические инструменты по умолчанию или фильтруйте по ресурсам:
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor"],
      "env": {
        "KINESCOPE_API_KEY": "your_key"
      }
    }
  }
}
```

### Проблема: Сервер не запускается

**Решение:** 
1. Проверьте версию Node.js (требуется >= 18.0.0)
2. Убедитесь, что порт не занят (для HTTP транспорта)
3. Проверьте логи ошибок в консоли

## Обновление пакета

Для обновления до последней версии:

```bash
npm install -g @kinescope/mcp@latest
```

Или при использовании через `npx` последняя версия загружается автоматически.

## Дополнительные ресурсы

- [Документация Kinescope API](https://documenter.getpostman.com/view/10589901/TVCcXpNM)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [npm пакет @kinescope/mcp](https://www.npmjs.com/package/@kinescope/mcp)
- [README проекта](./README.md)
- [Решение проблемы лимита инструментов](./TOOLS-LIMIT-SOLUTION.md)

## Примеры использования

### Получение списка видео

```bash
# Через динамические инструменты в MCP клиенте
# Используйте инструмент kinescope_invoke_api_endpoint с параметрами:
# endpoint_name: "kinescope_videos_videos_list"
# arguments: {"per_page": "10", "order": "created_at.desc"}
```

### Получение аналитики

```bash
# Используйте инструмент kinescope_invoke_api_endpoint с параметрами:
# endpoint_name: "kinescope_analytics_custom"
# arguments: {
#   "from": "2024-12-01",
#   "to": "2024-12-14",
#   "group": "day",
#   "fields": "view,unique_view,watch_time"
# }
```

## Поддержка

Если у вас возникли проблемы или вопросы:

1. Проверьте [README](./README.md) для общей информации
2. Изучите [TOOLS-LIMIT-SOLUTION.md](./TOOLS-LIMIT-SOLUTION.md) для решения проблем с лимитом инструментов
3. Обратитесь к [документации Kinescope API](https://documenter.getpostman.com/view/10589901/TVCcXpNM)

---

**Версия документа:** 1.0  
**Последнее обновление:** Декабрь 2024

