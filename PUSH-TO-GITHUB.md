# Инструкция по публикации в GitHub

## Шаги для публикации проекта

### 1. Создание репозитория на GitHub

Если репозиторий еще не создан:
1. Перейдите на https://github.com/kinescoper
2. Нажмите "New repository"
3. Название: `kinescope-mcp` (или другое по желанию)
4. Выберите Public или Private
5. Не добавляйте README, .gitignore или лицензию (они уже есть в проекте)
6. Нажмите "Create repository"

### 2. Инициализация Git (если еще не инициализирован)

```bash
cd kinescope-mcp-starter
git init
```

### 3. Добавление всех файлов

```bash
git add .
```

### 4. Создание первого коммита

```bash
git commit -m "Initial commit: Kinescope MCP Server

- 126+ API endpoints для работы с Kinescope API
- Поддержка динамических инструментов (3 инструмента по умолчанию)
- Совместимость с Cursor, Claude, Claude Code, OpenAI Agents
- Фильтрация по ресурсам (video.*, data.*, live_streams.*, и т.д.)
- HTTP транспорт для удаленного доступа
- Полная документация на русском и английском языках"
```

### 5. Добавление remote репозитория

```bash
git remote add origin https://github.com/kinescoper/kinescope-mcp.git
```

Или если используете SSH:
```bash
git remote add origin git@github.com:kinescoper/kinescope-mcp.git
```

### 6. Переименование ветки в main (если нужно)

```bash
git branch -M main
```

### 7. Публикация в GitHub

```bash
git push -u origin main
```

## Если репозиторий уже существует

Если репозиторий уже создан и содержит файлы:

```bash
# Получить изменения из удаленного репозитория
git pull origin main --allow-unrelated-histories

# Разрешить конфликты, если они есть
# Затем запушить
git push -u origin main
```

## Обновление репозитория после изменений

После внесения изменений:

```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Создать коммит
git commit -m "Описание изменений"

# Отправить в GitHub
git push
```

## Полезные команды

```bash
# Просмотр истории коммитов
git log --oneline

# Просмотр изменений
git diff

# Просмотр удаленных репозиториев
git remote -v

# Изменение URL удаленного репозитория
git remote set-url origin https://github.com/kinescoper/kinescope-mcp.git
```

