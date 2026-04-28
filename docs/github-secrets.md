# Настройка Gemini API key в GitHub

API-ключ нельзя вставлять в код, README, `.env.example` или frontend. Для GitHub он добавляется как секрет репозитория.

## 1. Добавить ключ в GitHub Secrets

1. Открыть репозиторий на GitHub.
2. Перейти в `Settings`.
3. Открыть `Secrets and variables`.
4. Выбрать `Actions`.
5. Нажать `New repository secret`.
6. В поле `Name` указать:

```text
GEMINI_API_KEY
```

7. В поле `Secret` вставить Gemini API key из Google AI Studio.
8. Нажать `Add secret`.

## 2. Что делает GitHub Actions

Workflow `.github/workflows/ci.yml`:

- устанавливает зависимости;
- собирает приложение;
- запускает тесты;
- собирает Angular demo;
- собирает данные эксперимента;
- собирает Docker-образ;
- проверяет `/health`;
- если secret `GEMINI_API_KEY` задан, проверяет, что контейнер видит ключ;
- публикует Docker-образ в GitHub Container Registry.

## 3. Важное ограничение GitHub Pages

GitHub Pages является статическим хостингом. Он не может безопасно хранить `GEMINI_API_KEY` и выполнять серверный endpoint `/api/check-hypothesis`.

Для версии с настоящим ИИ нужно запускать Docker-образ на сервере или платформе, где можно задать переменные окружения: VPS, Render, Railway, Fly.io, Yandex Cloud или другой Docker-хостинг.

## 4. Локальная проверка

В Windows:

```powershell
.\scripts\setup-gemini-key.ps1
docker compose up --build
```

Проверка:

```text
http://localhost:8080/health
```

Ожидаемый результат:

```json
{"ok":true,"provider":"gemini","geminiConfigured":true,"model":"gemini-2.5-flash-lite"}
```
