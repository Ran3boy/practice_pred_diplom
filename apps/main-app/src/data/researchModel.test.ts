import { describe, expect, it } from 'vitest';
import { criteria, profiles } from './comparison';
import { hypotheses } from './hypotheses';
import { implementations } from './metrics';
import { technologies } from './technologies';
import { uiComponents } from './uiComponents';

describe('research model', () => {
  it('contains K1-K10 criteria', () => {
    expect(criteria).toHaveLength(10);
    expect(criteria[0].id).toBe('K1');
    expect(criteria[9].id).toBe('K10');
  });

  it('contains implementation records for every technology and component', () => {
    expect(implementations).toHaveLength(technologies.length * uiComponents.length);
  });

  it('contains project profiles P-A through P-D', () => {
    expect(profiles.map((profile) => profile.id)).toEqual(['P-A', 'P-B', 'P-C', 'P-D']);
  });

  it('contains research hypotheses H1 through H5 linked to criteria and components', () => {
    expect(hypotheses.map((hypothesis) => hypothesis.id)).toEqual(['H1', 'H2', 'H3', 'H4', 'H5']);
    expect(hypotheses.every((hypothesis) => hypothesis.relatedCriteria.length > 0)).toBe(true);
    expect(hypotheses.every((hypothesis) => hypothesis.componentIds.length > 0)).toBe(true);
  });
});
