# Публикация пакета в npm

## Подготовка к публикации

1. **Убедитесь, что проект собран:**
   ```bash
   npm run build
   ```

2. **Проверьте package.json:**
   - Имя пакета: `@kinescope/mcp`
   - Версия: `0.1.0`
   - Все зависимости указаны

3. **Проверьте .npmignore:**
   - Исходные файлы исключены
   - Только `dist/` и `README.md` включены

## Публикация

### Первая публикация (требуется npm account)

1. **Создайте аккаунт на npm:**
   ```bash
   npm adduser
   ```

2. **Войдите в npm:**
   ```bash
   npm login
   ```

3. **Проверьте, что вы вошли:**
   ```bash
   npm whoami
   ```

4. **Публикуйте пакет:**
   ```bash
   npm publish --access public
   ```
   
   Примечание: `--access public` нужен для scoped пакетов (`@kinescope/mcp`)

### Обновление версии

1. **Обновите версию в package.json:**
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   npm version minor  # 0.1.0 -> 0.2.0
   npm version major  # 0.1.0 -> 1.0.0
   ```

2. **Соберите проект:**
   ```bash
   npm run build
   ```

3. **Опубликуйте:**
   ```bash
   npm publish --access public
   ```

## Использование после публикации

После публикации пакет можно использовать через npx:

```bash
# Последняя версия
npx -y @kinescope/mcp@latest --api-key YOUR_KEY

# Конкретная версия
npx -y @kinescope/mcp@0.1.0 --api-key YOUR_KEY
```

## Конфигурация для Cursor

После публикации добавьте в конфигурацию Cursor (`~/.cursor/mcp.json` или аналогичный файл):

```json
{
  "mcpServers": {
    "kinescope": {
      "command": "npx",
      "args": ["-y", "@kinescope/mcp@latest", "--client=cursor"],
      "env": {
        "KINESCOPE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Проверка перед публикацией

```bash
# Проверка содержимого пакета (что будет опубликовано)
npm pack --dry-run

# Локальная установка для тестирования
npm pack
tar -xzf kinescope-mcp-0.1.0.tgz
cd package
npm install
node dist/index.js --help
```

## Важные замечания

1. **Версионирование:** Используйте semantic versioning (semver)
2. **Тестирование:** Убедитесь, что все тесты проходят перед публикацией
3. **Документация:** README.md должен быть актуальным
4. **Лицензия:** Убедитесь, что LICENSE файл включен (если есть)

