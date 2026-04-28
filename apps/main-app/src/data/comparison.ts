import type { CriterionScore, ProfileScore, TechnologyId } from './types';

export const criteria: CriterionScore[] = [
  {
    id: 'K1',
    title: 'Модульность',
    description: 'Насколько естественно технология поддерживает независимые UI-модули.',
    scores: { 'web-components': 5, react: 5, vue: 5, angular: 5, vanilla: 2 }
  },
  {
    id: 'K2',
    title: 'Инкапсуляция DOM',
    description: 'Степень изоляции внутренней DOM-структуры компонента.',
    scores: { 'web-components': 5, react: 2, vue: 3, angular: 3, vanilla: 1 }
  },
  {
    id: 'K3',
    title: 'Изоляция стилей',
    description: 'Насколько просто предотвратить конфликт CSS между компонентами.',
    scores: { 'web-components': 5, react: 3, vue: 4, angular: 4, vanilla: 1 }
  },
  {
    id: 'K4',
    title: 'Управление состоянием',
    description: 'Удобство локального и расширяемого управления состоянием.',
    scores: { 'web-components': 3, react: 5, vue: 5, angular: 4, vanilla: 2 }
  },
  {
    id: 'K5',
    title: 'Интеграция и переносимость',
    description: 'Возможность встроить компонент в разные окружения.',
    scores: { 'web-components': 5, react: 3, vue: 3, angular: 2, vanilla: 4 }
  },
  {
    id: 'K6',
    title: 'Зависимость от экосистемы',
    description: 'Чем выше оценка, тем ниже обязательная зависимость от фреймворка и tooling.',
    scores: { 'web-components': 5, react: 3, vue: 3, angular: 2, vanilla: 5 }
  },
  {
    id: 'K7',
    title: 'Tooling и DX',
    description: 'Качество CLI, dev server, диагностики, тестовой и сборочной инфраструктуры.',
    scores: { 'web-components': 3, react: 5, vue: 4, angular: 5, vanilla: 2 }
  },
  {
    id: 'K8',
    title: 'Масштабируемость процесса',
    description: 'Поддержка командной разработки, архитектурных правил и роста проекта.',
    scores: { 'web-components': 3, react: 4, vue: 4, angular: 5, vanilla: 2 }
  },
  {
    id: 'K9',
    title: 'Потенциал производительности',
    description: 'Условный потенциал при аккуратной реализации и контроле runtime.',
    scores: { 'web-components': 4, react: 4, vue: 4, angular: 3, vanilla: 5 }
  },
  {
    id: 'K10',
    title: 'Совместимость с UI-экосистемой',
    description: 'Доступность библиотек компонентов, паттернов и интеграций.',
    scores: { 'web-components': 3, react: 5, vue: 4, angular: 4, vanilla: 2 }
  }
];

export const profiles: ProfileScore[] = [
  {
    id: 'P-A',
    title: 'Встраиваемые компоненты и виджеты',
    description: 'Компоненты, которые нужно подключать в разные приложения независимо от их стека.',
    scores: { 'web-components': 5, react: 3, vue: 3, angular: 2, vanilla: 4 },
    bestFit: 'web-components'
  },
  {
    id: 'P-B',
    title: 'Корпоративное SPA',
    description: 'Большое приложение с маршрутизацией, формами, ролями, архитектурными стандартами.',
    scores: { 'web-components': 3, react: 5, vue: 4, angular: 5, vanilla: 2 },
    bestFit: 'angular'
  },
  {
    id: 'P-C',
    title: 'Дизайн-система',
    description: 'Набор переиспользуемых компонентов для нескольких команд и продуктов.',
    scores: { 'web-components': 5, react: 4, vue: 4, angular: 3, vanilla: 2 },
    bestFit: 'web-components'
  },
  {
    id: 'P-D',
    title: 'Высокоинтерактивный UI',
    description: 'Интерфейс с большим количеством состояния, событий и сложной пользовательской логики.',
    scores: { 'web-components': 3, react: 5, vue: 5, angular: 4, vanilla: 2 },
    bestFit: 'react'
  }
];

export function getAverageScore(technologyId: TechnologyId) {
  const total = criteria.reduce((sum, criterion) => sum + criterion.scores[technologyId], 0);
  return Number((total / criteria.length).toFixed(1));
}

export function getProfileAverage(technologyId: TechnologyId) {
  const total = profiles.reduce((sum, profile) => sum + profile.scores[technologyId], 0);
  return Number((total / profiles.length).toFixed(1));
}
