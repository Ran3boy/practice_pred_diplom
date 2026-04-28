# Воспроизводимый экспериментальный стенд

Проект реализует интерактивный веб-ресурс с ИИ-движком для проверки гипотез о применимости Web Components и frontend-фреймворков.

## Что входит в стенд

- Vite/React-приложение с экраном ИИ-проверки гипотез;
- отдельное Angular demo-приложение для сравнения;
- Node-сервер, который хранит API-ключ на серверной стороне и обращается к Gemini API;
- Docker-образ, который публикует собранное приложение и серверный API;
- скрипт сбора данных `npm run experiment`;
- CSV/JSON-артефакты эксперимента в `docs/experiment-results`.

## Запуск через Docker

```bash
docker build -t frontend-comparison-lab .
docker run --env-file .env -p 8080:80 frontend-comparison-lab
```

После запуска открыть:

```text
http://localhost:8080
```

Проверить, видит ли сервер ключ Gemini:

```text
http://localhost:8080/health
```

## Сбор данных

Команда:

```bash
npm run experiment
```

создает:

- `docs/experiment-results/summary.json` — полный машинно-читаемый отчет;
- `docs/experiment-results/technology-metrics.csv` — таблицу по технологиям;
- `docs/experiment-results/hypotheses.csv` — таблицу по гипотезам H1-H5.
