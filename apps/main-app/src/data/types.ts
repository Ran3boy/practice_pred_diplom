import type { ReactNode } from 'react';

export type TechnologyId = 'web-components' | 'react' | 'vue' | 'angular' | 'vanilla';
export type ComponentId = 'counter' | 'todo' | 'product-card' | 'tabs' | 'form';

export interface Technology {
  id: TechnologyId;
  name: string;
  shortName: string;
  summary: string;
  strengths: string[];
  limitations: string[];
  dependencyLevel: 'низкая' | 'средняя' | 'высокая';
}

export interface UiComponentMeta {
  id: ComponentId;
  name: string;
  scenario: string;
  researchValue: string;
}

export interface ImplementationMetric {
  files: number;
  lines: number;
  dependencies: number;
  buildKb: number;
  buildMs: number;
  renderMs: number;
  responseMs: number;
  readability: number;
  complexity: number;
  maintainability: number;
  reuse: number;
  realWorldFit: number;
}

export interface ImplementationRecord {
  technologyId: TechnologyId;
  componentId: ComponentId;
  description: string;
  code: string;
  metrics: ImplementationMetric;
}

export interface CriterionScore {
  id: string;
  title: string;
  description: string;
  scores: Record<TechnologyId, number>;
}

export interface ProfileScore {
  id: 'P-A' | 'P-B' | 'P-C' | 'P-D';
  title: string;
  description: string;
  scores: Record<TechnologyId, number>;
  bestFit: TechnologyId;
}

export interface ResearchHypothesis {
  id: 'H1' | 'H2' | 'H3' | 'H4' | 'H5';
  title: string;
  statement: string;
  relatedCriteria: string[];
  relatedMetrics: string[];
  componentIds: ComponentId[];
  technologyIds: TechnologyId[];
}

export interface PreviewProps {
  componentId: ComponentId;
  technologyId: TechnologyId;
}

export type PreviewRenderer = (props: PreviewProps) => ReactNode;
