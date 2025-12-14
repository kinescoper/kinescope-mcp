# Анализ Kinescope API из Postman коллекции

## Статистика
- **Всего endpoints:** 132
- **v1 endpoints:** 110
- **v2 endpoints:** 20

## Структура API

### Video API v1 (26 endpoints)

#### Основные операции с видео:
1. ✅ `GET /v1/videos` - список видео (уже реализовано)
2. ✅ `GET /v1/videos/:video_id` - получение видео (уже реализовано)
3. ✅ `PATCH /v1/videos/:video_id` - обновление видео (уже реализовано)
4. ✅ `DELETE /v1/videos/:video_id` - удаление видео (уже реализовано)
5. `PUT /v1/videos/:video_id/move` - перемещение видео в другой проект/папку
6. `PUT /v1/videos/:video_id/chapters` - обновление глав
7. `POST /v1/videos/:video_id/concat` - конкатенация видео
8. `POST /v1/videos/:video_id/copy` - копирование видео
9. `POST /v1/videos/:video_id/cut` - обрезка видео

#### Постеры (5 endpoints):
10. `GET /v1/videos/:video_id/posters` - список постеров
11. `POST /v1/videos/:video_id/posters` - создание постера по времени
12. `GET /v1/videos/:video_id/posters/:poster_id` - получение постера
13. `POST /v1/videos/:video_id/posters/:poster_id/active` - установка активного постера
14. `DELETE /v1/videos/:video_id/posters/:poster_id` - удаление постера

#### Субтитры (7 endpoints):
15. `GET /v1/videos/:video_id/subtitles` - список субтитров
16. `POST /v1/videos/:video_id/subtitles` - добавление субтитров
17. `PATCH /v1/videos/:video_id/subtitles/reorder` - изменение порядка
18. `GET /v1/videos/:video_id/subtitles/:subtitle_id` - получение субтитров
19. `PATCH /v1/videos/:video_id/subtitles/:subtitle_id` - обновление субтитров
20. `POST /v1/videos/:video_id/subtitles/:subtitle_id/copy` - копирование субтитров
21. `DELETE /v1/videos/:video_id/subtitles/:subtitle_id` - удаление субтитров

#### Аннотации (5 endpoints):
22. `GET /v1/videos/:video_id/annotations` - список аннотаций
23. `GET /v1/videos/:video_id/annotations/:annotation_id` - получение аннотации
24. `POST /v1/videos/:video_id/annotations` - добавление аннотации
25. `PUT /v1/videos/:video_id/annotations/:annotation_id` - обновление аннотации
26. `DELETE /v1/videos/:video_id/annotations/:annotation_id` - удаление аннотации

### Projects API v1 (10 endpoints)
1. `POST /v1/projects` - создание проекта
2. `GET /v1/projects` - список проектов
3. `GET /v1/projects/:project_id` - получение проекта
4. `PUT /v1/projects/:project_id` - обновление проекта
5. `DELETE /v1/projects/:project_id` - удаление проекта
6. ... и еще 5 endpoints

### Folders API v1 (6 endpoints)
1. `POST /v1/folders` - создание папки
2. `GET /v1/folders` - список папок
3. `GET /v1/folders/:folder_id` - получение папки
4. `PUT /v1/folders/:folder_id` - обновление папки
5. `DELETE /v1/folders/:folder_id` - удаление папки
6. ... и еще 1 endpoint

### Live API v2 (20 endpoints)
1. `POST /v2/live/events` - создание события
2. `GET /v2/live/events` - список событий
3. `GET /v2/live/events/:event_id` - получение события
4. `PUT /v2/live/events/:event_id` - обновление события
5. `DELETE /v2/live/events/:event_id` - удаление события
6. `PUT /v2/live/events/:event_id/enable` - включение события
7. `PUT /v2/live/events/:event_id/complete` - завершение события
8. `POST /v2/live/events/:event_id/stream` - создание стрима
9. `PUT /v2/live/events/:event_id/stream` - обновление стрима
10. `GET /v2/live/events/:event_id/videos` - список видео события
11. `PUT /v2/live/events/:event_id/move` - перемещение события
12. `GET /v2/live/events/:event_id/qos` - качество стрима
13. ... и еще 8 endpoints для restreams и chat

### Другие ресурсы v1:
- **Analytics** (2 endpoints)
- **Additional Materials** (4 endpoints)
- **Access Tokens** (5 endpoints)
- **Players** (6 endpoints)
- **File Requests** (5 endpoints)
- **DRM** (6 endpoints)
- **Privacy Domains** (4 endpoints)
- **Tags** (4 endpoints)
- **Playlists** (9 endpoints)
- **Moderators** (5 endpoints)
- **Billing** (1 endpoint)
- **Dictionaries** (1 endpoint)

## План обновления

### Приоритет 1: Video API v1 (основные операции)
- ✅ Уже реализовано: list, get, update, delete
- ⏳ Требует обновления: параметры запросов (query params)
- ⏳ Нужно добавить: move, chapters, concat, copy, cut

### Приоритет 2: Video API v1 (расширенные функции)
- ⏳ Постеры (5 endpoints)
- ⏳ Субтитры (7 endpoints)
- ⏳ Аннотации (5 endpoints)

### Приоритет 3: Projects & Folders
- ⏳ Projects CRUD (5 endpoints)
- ⏳ Folders CRUD (5 endpoints)

### Приоритет 4: Live API v2
- ⏳ Events CRUD (основные операции)
- ⏳ Stream management
- ⏳ Restreams

### Приоритет 5: Другие ресурсы
- ⏳ Analytics
- ⏳ Additional Materials
- ⏳ Access Tokens
- ⏳ Players
- и т.д.

## Следующие шаги

1. Обновить существующие инструменты с правильными query параметрами
2. Добавить недостающие инструменты для Video API v1
3. Реализовать инструменты для Projects и Folders
4. Исправить Live API v2 endpoints
5. Добавить остальные ресурсы по необходимости

