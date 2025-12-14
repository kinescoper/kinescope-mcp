# Решение проблемы превышения лимита инструментов

## Проблема

Cursor показывает предупреждение:
- **126 инструментов** включено
- Рекомендуемый максимум: **80 инструментов**
- Слишком много инструментов может ухудшить производительность

## Решения

### Решение 1: Фильтрация по категориям ресурсов (Рекомендуется)

Используйте фильтрацию, чтобы включить только нужные категории API.

#### Вариант A: Только Video API (~26 инструментов)
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```

#### Вариант B: Video + Analytics (~29 инструментов)
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*", "--resource", "data.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```

#### Вариант C: Video + Analytics + Live (~47 инструментов)
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*", "--resource", "data.*", "--resource", "live_streams.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```

### Решение 2: Динамические инструменты (3 инструмента)

Используйте только динамические инструменты для доступа ко всем API:

```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--include-dynamic-tools"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```

Это даст вам всего **3 инструмента**:
- `kinescope_list_api_endpoints` - поиск endpoints
- `kinescope_get_api_endpoint_schema` - получение схемы
- `kinescope_invoke_api_endpoint` - вызов любого endpoint

### Решение 3: Комбинированный подход

Используйте динамические инструменты + только нужные категории:

```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*", "--include-dynamic-tools"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```

## Распределение инструментов по категориям

- **video**: ~26 инструментов
- **data**: ~3 инструмента
- **live_streams**: ~18 инструментов
- **real_time**: ~10 инструментов
- **system**: ~69 инструментов

## Рекомендации

### Для работы с видео (рекомендуется)
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```
**Результат:** ~26 инструментов ✅

### Для аналитики + видео
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*", "--resource", "data.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```
**Результат:** ~29 инструментов ✅

### Максимальная функциональность (в пределах лимита)
```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor", "--resource", "video.*", "--resource", "data.*", "--resource", "live_streams.*"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key"
      }
    }
  }
}
```
**Результат:** ~47 инструментов ✅

## Готовые конфигурации

Я создал 3 готовых конфигурационных файла:
- `cursor-mcp-config-video-only.json` - только Video API (~26 инструментов)
- `cursor-mcp-config-essential.json` - Video + Analytics (~29 инструментов)
- `cursor-mcp-config-dynamic.json` - только динамические инструменты (3 инструмента)

Скопируйте содержимое нужного файла в конфигурацию Cursor.

