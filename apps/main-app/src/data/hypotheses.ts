import type { ComponentId, ResearchHypothesis, TechnologyId } from './types';

export const hypotheses: ResearchHypothesis[] = [
  {
    id: 'H1',
    title: 'Гипотеза об инкапсуляции',
    statement:
      'Web Components обеспечивают более выраженную инкапсуляцию DOM и изоляцию стилей по сравнению с фреймворками, где изоляция чаще зависит от tooling и соглашений.',
    relatedCriteria: ['K2', 'K3', 'K5'],
    relatedMetrics: ['инкапсуляция DOM', 'изоляция стилей', 'повторное использование'],
    componentIds: ['product-card', 'tabs', 'form'],
    technologyIds: ['web-components', 'react', 'vue', 'angular']
  },
  {
    id: 'H2',
    title: 'Гипотеза о переносимости',
    statement:
      'Web Components лучше подходят для встраиваемых компонентов и дизайн-систем, так как меньше зависят от конкретного frontend-фреймворка.',
    relatedCriteria: ['K5', 'K6', 'K10'],
    relatedMetrics: ['количество зависимостей', 'удобство повторного использования', 'применимость'],
    componentIds: ['counter', 'product-card', 'tabs'],
    technologyIds: ['web-components', 'react', 'vue', 'angular', 'vanilla']
  },
  {
    id: 'H3',
    title: 'Гипотеза о скорости разработки интерактивного UI',
    statement:
      'React и Vue позволяют быстрее и понятнее реализовывать компоненты с активным состоянием, событиями и условным отображением.',
    relatedCriteria: ['K4', 'K7', 'K10'],
    relatedMetrics: ['читаемость кода', 'сложность реализации', 'удобство поддержки'],
    componentIds: ['counter', 'todo', 'tabs', 'form'],
    technologyIds: ['react', 'vue', 'web-components', 'angular', 'vanilla']
  },
  {
    id: 'H4',
    title: 'Гипотеза о корпоративной масштабируемости',
    statement:
      'Angular лучше подходит для крупных корпоративных SPA благодаря строгой архитектуре, TypeScript-first подходу, CLI и встроенным практикам.',
    relatedCriteria: ['K7', 'K8', 'K4', 'K10'],
    relatedMetrics: ['масштабируемость', 'tooling', 'удобство поддержки', 'применимость'],
    componentIds: ['todo', 'form', 'tabs'],
    technologyIds: ['angular', 'react', 'vue', 'web-components']
  },
  {
    id: 'H5',
    title: 'Гипотеза о цене минимализма',
    statement:
      'Vanilla JavaScript имеет минимальные зависимости и небольшой размер, но хуже масштабируется при росте сложности состояния, повторного использования и сопровождения.',
    relatedCriteria: ['K1', 'K4', 'K6', 'K8', 'K9'],
    relatedMetrics: ['количество зависимостей', 'размер сборки', 'сложность реализации', 'удобство поддержки'],
    componentIds: ['counter', 'todo', 'form'],
    technologyIds: ['vanilla', 'web-components', 'react', 'vue', 'angular']
  }
];

export function getHypothesesByComponent(componentId: ComponentId) {
  return hypotheses.filter((hypothesis) => hypothesis.componentIds.includes(componentId));
}

export function getHypothesesByTechnology(technologyId: TechnologyId) {
  return hypotheses.filter((hypothesis) => hypothesis.technologyIds.includes(technologyId));
}
