import { implementations } from '../data/metrics';

export function collectDemoMetrics() {
  return implementations.map((record) => ({
    technologyId: record.technologyId,
    componentId: record.componentId,
    files: record.metrics.files,
    lines: record.metrics.lines,
    dependencies: record.metrics.dependencies,
    buildKb: record.metrics.buildKb
  }));
}
