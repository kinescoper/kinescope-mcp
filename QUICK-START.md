# Быстрый старт

## Публикация в npm

```bash
# 1. Войдите в npm
npm login

# 2. Опубликуйте пакет
npm publish --access public
```

## Использование после публикации

### Конфигурация для Cursor

Скопируйте содержимое файла `cursor-mcp-config.json` в конфигурацию Cursor:

**macOS:** `~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

**Windows:** `%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json`

**Linux:** `~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`

Или добавьте в существующий файл конфигурации MCP:

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

### Тестирование локально

Перед публикацией можно протестировать локально:

```bash
# Упакуйте пакет
npm pack

# Распакуйте и протестируйте
tar -xzf kinescope-mcp-0.1.0.tgz
cd package
npm install
node dist/index.js --help
```

### Использование через npx (после публикации)

```bash
# Последняя версия
npx -y @kinescope/mcp@latest --api-key YOUR_KEY --client=cursor

# С фильтрацией по ресурсам
npx -y @kinescope/mcp@latest --api-key YOUR_KEY --client=cursor --resource video.*,data.*

# С динамическими инструментами
npx -y @kinescope/mcp@latest --api-key YOUR_KEY --client=cursor --include-dynamic-tools
```

## Структура пакета

После публикации в npm пакет будет содержать:
- `dist/` - скомпилированный JavaScript код
- `README.md` - документация
- `package.json` - метаданные пакета

Все исходные файлы (`src/`), тесты и документация разработчика исключены через `.npmignore`.

