# Публикация npm пакета с 2FA

## Проблема
```
npm error 403 Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

## Решение 1: Использование OTP кода (простой способ)

### Шаг 1: Убедитесь, что 2FA включена
1. Перейдите на https://www.npmjs.com/settings/[your-username]/security
2. Проверьте, что "Require two-factor authentication" включена

### Шаг 2: Публикуйте с OTP
При выполнении `npm publish` npm запросит OTP код:

```bash
npm publish --access public
# npm попросит ввести OTP код из вашего приложения-аутентификатора
```

## Решение 2: Использование Access Token (для автоматизации)

### Шаг 1: Создайте Access Token
1. Перейдите на https://www.npmjs.com/settings/[your-username]/tokens
2. Нажмите "Generate New Token"
3. Выберите тип:
   - **Automation** - для CI/CD (рекомендуется)
   - **Publish** - только для публикации
4. Включите опцию "Bypass 2FA for publishing" (если доступна)
5. Скопируйте токен (он показывается только один раз!)

### Шаг 2: Используйте токен для авторизации

**Вариант A: Через .npmrc файл (рекомендуется)**

Создайте или отредактируйте файл `~/.npmrc`:

```bash
# Добавьте строку:
//registry.npmjs.org/:_authToken=YOUR_ACCESS_TOKEN_HERE
```

**Вариант B: Через переменную окружения**

```bash
export NPM_TOKEN=your_access_token_here
npm publish --access public
```

**Вариант C: Через npm login с токеном**

```bash
npm login --auth-type=legacy
# Username: ваш_username
# Password: ваш_пароль
# Email: ваш_email
# OTP: код из приложения (если требуется)
```

### Шаг 3: Публикуйте

```bash
npm publish --access public
```

## Решение 3: Временное отключение 2FA (не рекомендуется)

Если вы хотите временно отключить требование 2FA для публикации:

1. Перейдите на https://www.npmjs.com/settings/[your-username]/security
2. Отключите "Require two-factor authentication when publishing"
3. Опубликуйте пакет
4. **Важно:** Включите обратно для безопасности!

## Проверка авторизации

```bash
# Проверьте, кто вы вошли
npm whoami

# Проверьте права доступа
npm access ls-packages
```

## Безопасность

⚠️ **Важно:**
- Никогда не коммитьте `.npmrc` с токенами в git
- Используйте `.gitignore` для `.npmrc` если он содержит токены
- Для CI/CD используйте секреты/переменные окружения
- Access tokens имеют срок действия - обновляйте их регулярно

## Пример для CI/CD (GitHub Actions)

```yaml
- name: Publish to npm
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  run: npm publish --access public
```

