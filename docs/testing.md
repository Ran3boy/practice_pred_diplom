# Тестирование

## Автоматические проверки

```bash
npm install
npm run install:apps
npm run lint
npm run test
npm run build
npm run build:angular
npm run experiment
```

## Ручные тест-кейсы

1. Открыть `http://localhost:8080`.
2. Проверить, что открывается экран ИИ-проверки.
3. Открыть `http://localhost:8080/health`.
4. Проверить, что `geminiConfigured` равно `true`.
5. Ввести вопрос: `Проверь H1`.
6. Проверить, что ответ пришел от Gemini API, а не от локального fallback.
7. Создать `.env` по примеру `.env.example` или через `.\scripts\setup-gemini-key.ps1`.
8. Собрать Docker-образ командой `docker build -t frontend-comparison-lab .`.
9. Запустить `docker run --env-file .env -p 8080:80 frontend-comparison-lab`.
10. Открыть `http://localhost:8080/health` и проверить, что `geminiConfigured` равно `true`.
11. Открыть `http://localhost:8080/experiment-results/summary.json` и проверить, что контейнер отдает данные эксперимента.
