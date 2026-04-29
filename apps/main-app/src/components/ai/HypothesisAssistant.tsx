import { Bot, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { AiAnswer, AiErrorPayload } from '../../data/aiEngine';

const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '').replace(/\/$/, '');

export function HypothesisAssistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitQuestion() {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/check-hypothesis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: cleanQuestion })
      });

      const data = (await response.json()) as AiAnswer | AiErrorPayload;

      if (!response.ok) {
        const errorMessage =
          'error' in data && data.error
            ? `${data.error}${data.retryable ? ' Можно повторить запрос немного позже.' : ''}`
            : `API вернул статус ${response.status}`;
        throw new Error(errorMessage);
      }

      setAnswer(data as AiAnswer);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Не удалось получить ответ от ИИ.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="assistant-workspace">
      <section className="panel assistant-chat">
        <div className="section-title">
          <Bot size={22} />
          <div>
            <h2>Рабочий экран проверки</h2>
            <p>Введите вопрос или гипотезу. Ответ формируется по структуре стенда и экспериментальным метрикам.</p>
          </div>
        </div>

        <form
          className="assistant-form"
          onSubmit={(event) => {
            event.preventDefault();
            void submitQuestion();
          }}
        >
          <textarea
            aria-label="Вопрос для ИИ"
            placeholder="Введите вопрос для проверки"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <button disabled={isLoading || !question.trim()}>
            <Send size={18} />
            {isLoading ? 'Проверяю...' : 'Проверить через ИИ'}
          </button>
        </form>

        {error ? <div className="error-box">{error}</div> : null}
      </section>

      <section className="panel answer-panel">
        {answer ? (
          <>
            <div className="answer-head">
              <Sparkles size={22} />
              <div>
                <h2>{answer.title}</h2>
                <span>{answer.verdict}</span>
              </div>
              <strong>{answer.confidence}%</strong>
            </div>

            <p className="answer-summary">{answer.summary}</p>
            <div className={`provider-pill provider-${answer.provider ?? 'gemini'}`}>
              Источник ответа: {answer.provider === 'gemini' ? 'Gemini API' : 'ИИ-движок'}
            </div>

            <div className="answer-columns">
              <article>
                <h3>Доказательства</h3>
                <ul>
                  {answer.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Ограничения</h3>
                <ul>
                  {answer.limitations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>

            <div className="tag-row">
              {answer.relatedCriteria.map((item) => (
                <span key={item}>{item}</span>
              ))}
              {answer.relatedMetrics.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="note-box">{answer.recommendation}</div>
          </>
        ) : (
          <div className="empty-answer">
            <Sparkles size={28} />
            <h2>Ответ появится здесь</h2>
            <p>После отправки запроса здесь появится результат работы ИИ.</p>
          </div>
        )}
      </section>
    </div>
  );
}
