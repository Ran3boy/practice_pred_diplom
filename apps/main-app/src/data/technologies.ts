import type { Technology } from './types';

export const technologies: Technology[] = [
  {
    id: 'web-components',
    name: 'Web Components',
    shortName: 'WC',
    summary:
      'Нативная браузерная модель компонентов на Custom Elements, Shadow DOM и HTML Templates. Хорошо подходит для переносимых виджетов и дизайн-систем.',
    strengths: ['инкапсуляция DOM', 'изолированные стили', 'низкая зависимость от фреймворков'],
    limitations: ['больше ручного кода', 'менее богатый DX без дополнительных библиотек'],
    dependencyLevel: 'низкая'
  },
  {
    id: 'react',
    name: 'React',
    shortName: 'React',
    summary:
      'Компонентная библиотека с развитой экосистемой, декларативным UI и сильной поддержкой корпоративной разработки.',
    strengths: ['богатая экосистема', 'удобное управление состоянием', 'высокая популярность'],
    limitations: ['зависимость от runtime и tooling', 'нет встроенной изоляции стилей'],
    dependencyLevel: 'средняя'
  },
  {
    id: 'vue',
    name: 'Vue',
    shortName: 'Vue',
    summary:
      'Прогрессивный фреймворк с однофайловыми компонентами, низким порогом входа и удобной реактивностью.',
    strengths: ['читаемость SFC', 'мягкая кривая обучения', 'хорошая интеграция'],
    limitations: ['меньше корпоративных стандартов, чем у Angular', 'изоляция стилей зависит от SFC-сборки'],
    dependencyLevel: 'средняя'
  },
  {
    id: 'angular',
    name: 'Angular',
    shortName: 'Angular',
    summary:
      'Полноценный фреймворк для крупных SPA с DI, строгой архитектурой, CLI и TypeScript-first подходом.',
    strengths: ['масштабируемая структура', 'официальный CLI', 'единые архитектурные практики'],
    limitations: ['высокий порог входа', 'значительный framework runtime'],
    dependencyLevel: 'высокая'
  },
  {
    id: 'vanilla',
    name: 'Vanilla JavaScript',
    shortName: 'Vanilla',
    summary:
      'Базовая реализация без фреймворка. Используется как контрольная точка для оценки цены abstractions и зависимостей.',
    strengths: ['минимальные зависимости', 'прямой контроль DOM', 'простота для малых сценариев'],
    limitations: ['сложно масштабировать', 'много ручной синхронизации состояния и DOM'],
    dependencyLevel: 'низкая'
  }
];
