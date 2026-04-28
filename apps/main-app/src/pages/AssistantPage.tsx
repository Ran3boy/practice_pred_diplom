import { PageHeader } from '../components/common/PageHeader';
import { HypothesisAssistant } from '../components/ai/HypothesisAssistant';

export function AssistantPage() {
  return (
    <main className="single-page-shell page-stack">
      <PageHeader
        eyebrow="Преддипломная практика"
        title="Преддипломная практика. Иванов Н.Ю"
        description="Интерактивный стенд для проверки гипотез и анализа frontend-технологий на основе экспериментальных данных."
      />
      <HypothesisAssistant />
    </main>
  );
}
