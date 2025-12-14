# Инструкция по публикации в GitHub

## Шаг 1: Создание репозитория на GitHub

1. Перейдите на https://github.com/kinescoper
2. Нажмите кнопку **"New"** или **"New repository"** (зеленая кнопка)
3. Заполните форму:
   - **Repository name:** `kinescope-mcp`
   - **Description:** `MCP Server for Kinescope API - Model Context Protocol server providing access to Kinescope video platform APIs`
   - **Visibility:** Выберите Public или Private
   - **НЕ добавляйте** README, .gitignore или лицензию (они уже есть в проекте)
4. Нажмите **"Create repository"**

## Шаг 2: Публикация кода

После создания репозитория выполните команды:

```bash
cd "/Users/insty/Coursor project/Tetris/kinescope-mcp-starter"

# Проверьте, что remote настроен правильно
git remote -v

# Если remote не настроен, добавьте его:
git remote add origin https://github.com/kinescoper/kinescope-mcp.git

# Запушите код
git push -u origin main
```

## Альтернативный способ через GitHub CLI

Если у вас установлен GitHub CLI (`gh`):

```bash
# Создать репозиторий и запушить код одной командой
gh repo create kinescope-mcp --public --source=. --remote=origin --push
```

## Проверка

После успешной публикации:

1. Откройте https://github.com/kinescoper/kinescope-mcp
2. Убедитесь, что все файлы загружены
3. Проверьте, что README.md отображается корректно

## Обновление репозитория

После внесения изменений:

```bash
git add .
git commit -m "Описание изменений"
git push
```

## Настройка репозитория (опционально)

После публикации рекомендуется:

1. **Добавить темы (topics):** `mcp`, `kinescope`, `video-api`, `model-context-protocol`
2. **Добавить описание:** "MCP Server for Kinescope API"
3. **Настроить GitHub Pages** (если нужна документация)
4. **Добавить badges** в README (npm version, license, etc.)

## Полезные ссылки

- [GitHub репозиторий](https://github.com/kinescoper/kinescope-mcp)
- [npm пакет](https://www.npmjs.com/package/@kinescope/mcp)
- [Документация Kinescope API](https://documenter.getpostman.com/view/10589901/TVCcXpNM)

