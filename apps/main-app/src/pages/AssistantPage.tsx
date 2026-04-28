import { PageHeader } from '../components/common/PageHeader';
import { HypothesisAssistant } from '../components/ai/HypothesisAssistant';

export function AssistantPage() {
  return (
    <main className="single-page-shell page-stack">
      <PageHeader
        eyebrow="ИИ-проверка"
        title="Экспериментальная проверка гипотез"
        description="Задайте вопрос. Сервер передаст его ИИ-движку вместе со структурой стенда и метриками, а ответ будет сформирован без готовых выводов на главной."
      />
      <HypothesisAssistant />
    </main>
  );
}
