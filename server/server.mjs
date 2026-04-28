import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = process.env.PUBLIC_DIR ?? path.join(__dirname, '..', 'public-runtime');
const port = Number(process.env.PORT ?? 80);
const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash-lite';
const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
const systemPrompt = [
  'Ты ИИ-движок учебного стенда ВКР.',
  'Отвечай строго JSON-объектом без markdown.',
  'В данных нет готовых вердиктов, статусов подтверждения или заранее написанных выводов.',
  'Используй структуру гипотез H1-H5, критерии, связанные метрики и измерения стенда как материал для самостоятельного анализа.',
  'Сначала сопоставь вопрос пользователя с наиболее близкой гипотезой по смыслу.',
  'Если в контексте есть focusHypotheses, анализируй прежде всего их: это не готовый ответ, а результат предварительного поиска по структуре стенда.',
  'Вердикт, confidence, evidence, limitations и recommendation формируй сам на основе переданных критериев и метрик.',
  'Не копируй готовый ответ из базы: база задает только каркас исследования.',
  'Если вопрос относится к технологии или сценарию, выбери релевантные hypothesis.id, relatedCriteria, relatedMetrics и technologyMetrics.',
  'Пиши кратко, прикладно и по-русски.'
].join(' ');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
    applyCorsHeaders(request, response);

    if (request.method === 'OPTIONS') {
      response.writeHead(204);
      response.end();
      return;
    }

    if (url.pathname === '/health') {
      sendJson(response, 200, {
        ok: true,
        provider: 'gemini',
        geminiConfigured: Boolean(apiKey),
        model
      });
      return;
    }

    if (url.pathname === '/api/check-hypothesis') {
      await handleHypothesisCheck(request, response);
      return;
    }

    serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: error instanceof Error ? error.message : 'Unknown server error' });
  }
}).listen(port, () => {
  console.log(`Frontend Hypothesis Lab server listening on port ${port}`);
  console.log(`Gemini configured: ${apiKey ? 'yes' : 'no'}`);
});

async function handleHypothesisCheck(request, response) {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed' });
    return;
  }

  const body = await readBody(request);
  const payload = JSON.parse(body || '{}');
  const question = String(payload.question ?? '').trim();

  if (!question) {
    sendJson(response, 400, { error: 'Question is required' });
    return;
  }

  if (!apiKey) {
    sendJson(response, 503, { error: 'GEMINI_API_KEY is not configured' });
    return;
  }

  const experimentContext = addQuestionFocus(readExperimentContext(), question);
  const geminiRequest = buildGeminiRequest(question, experimentContext);
  let geminiResponse;
  try {
    geminiResponse = await fetchGeminiWithRetry(geminiRequest);
  } catch (error) {
    sendJson(response, 503, {
      error: buildConnectionErrorMessage(error)
    });
    return;
  }

  const data = await geminiResponse.json();

  if (!geminiResponse.ok) {
    sendJson(response, geminiResponse.status, {
      error: data?.error?.message ?? 'Gemini API request failed'
    });
    return;
  }

  const text = extractOutputText(data);
  const parsed = parseModelJson(text, question);
  sendJson(response, 200, { ...parsed, provider: 'gemini' });
}

function buildGeminiRequest(question, experimentContext) {
  return {
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: JSON.stringify({
              task:
                'Ответь на вопрос о проверке гипотез. Сначала выбери наиболее релевантную гипотезу H1-H5 по смыслу вопроса. База не содержит готового ответа: сделай самостоятельный вывод по структуре гипотез, критериям, связанным метрикам и technologyMetrics. Верни поля title, verdict, confidence, summary, evidence, limitations, relatedCriteria, relatedMetrics, recommendation.',
              question,
              requiredShape: {
                title: 'string',
                verdict: 'string',
                confidence: 'number 0..100',
                summary: 'string',
                evidence: ['string'],
                limitations: ['string'],
                relatedCriteria: ['K1'],
                relatedMetrics: ['string'],
                recommendation: 'string'
              },
              experimentContext
            })
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING' },
          verdict: { type: 'STRING' },
          confidence: { type: 'NUMBER' },
          summary: { type: 'STRING' },
          evidence: { type: 'ARRAY', items: { type: 'STRING' } },
          limitations: { type: 'ARRAY', items: { type: 'STRING' } },
          relatedCriteria: { type: 'ARRAY', items: { type: 'STRING' } },
          relatedMetrics: { type: 'ARRAY', items: { type: 'STRING' } },
          recommendation: { type: 'STRING' }
        },
        required: [
          'title',
          'verdict',
          'confidence',
          'summary',
          'evidence',
          'limitations',
          'relatedCriteria',
          'relatedMetrics',
          'recommendation'
        ]
      }
    }
  };
}

async function fetchGeminiWithRetry(payload) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await delay(1200 * attempt);
      }
    }
  }

  throw lastError;
}

function buildConnectionErrorMessage(error) {
  const code = error?.cause?.code;
  const detail = code ? ` Техническая причина: ${code}.` : '';
  return `Не удалось подключиться к Gemini API после нескольких попыток. Проверьте интернет, VPN/регион, DNS Docker Desktop и доступ к generativelanguage.googleapis.com.${detail}`;
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readExperimentContext() {
  const summaryPath = path.join(publicDir, 'experiment-results', 'summary.json');
  const fallbackSummaryPath = path.join(__dirname, '..', 'docs', 'experiment-results', 'summary.json');
  const readablePath = existsSync(summaryPath) ? summaryPath : fallbackSummaryPath;

  if (!existsSync(readablePath)) {
    return { warning: 'summary.json not found' };
  }

  const summary = JSON.parse(readFileSync(readablePath, 'utf8'));
  const hypotheses = sanitizeHypotheses(summary.hypotheses);

  return {
    generatedAt: summary.generatedAt,
    environment: summary.environment,
    hypotheses,
    technologyMetrics: summary.technologyMetrics,
    notes: summary.notes
  };
}

function sanitizeHypotheses(hypotheses = []) {
  return hypotheses.map((hypothesis) => ({
    id: hypothesis.id,
    title: hypothesis.title,
    statement: hypothesis.statement,
    relatedCriteria: hypothesis.relatedCriteria,
    relatedMetrics: hypothesis.relatedMetrics,
    componentIds: hypothesis.componentIds,
    technologyIds: hypothesis.technologyIds
  }));
}

function addQuestionFocus(experimentContext, question) {
  return {
    ...experimentContext,
    focusHypotheses: rankHypotheses(question, experimentContext.hypotheses).slice(0, 2)
  };
}

function rankHypotheses(question, hypotheses = []) {
  const questionTokens = [...tokenize(question)];

  return hypotheses
    .map((hypothesis) => {
      const hypothesisText = [
        hypothesis.id,
        hypothesis.title,
        hypothesis.statement,
        ...(hypothesis.relatedCriteria ?? []),
        ...(hypothesis.relatedMetrics ?? []),
        ...(hypothesis.componentIds ?? []),
        ...(hypothesis.technologyIds ?? [])
      ].join(' ');
      const hypothesisTokens = tokenize(hypothesisText);
      const hypothesisTextLower = hypothesisText.toLowerCase();
      const score = questionTokens.reduce((sum, token) => {
        if (hypothesisTokens.has(token)) {
          return sum + 3;
        }

        if (token.length >= 4 && hypothesisTextLower.includes(token)) {
          return sum + 2;
        }

        return sum;
      }, 0);

      return { ...hypothesis, relevanceScore: score };
    })
    .filter((hypothesis) => hypothesis.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function tokenize(text) {
  return new Set(
    String(text)
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3)
      .flatMap((token) => (token.length >= 6 ? [token, token.slice(0, 6)] : [token]))
  );
}

function extractOutputText(data) {
  const geminiParts = data.candidates?.[0]?.content?.parts;
  if (Array.isArray(geminiParts)) {
    return geminiParts.map((part) => part.text ?? '').join('\n');
  }

  return '';
}

function parseModelJson(text, question) {
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  const jsonText = extractJsonObject(trimmed);
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return {
      title: 'Проверка гипотезы через Gemini',
      verdict: 'ответ получен, но формат JSON был нарушен',
      confidence: 50,
      summary:
        trimmed ||
        `Gemini не вернул корректный JSON для вопроса: ${question}. Попробуйте повторить запрос или уточнить формулировку.`,
      evidence: [],
      limitations: ['Ответ модели не удалось разобрать как структурированный JSON.'],
      relatedCriteria: [],
      relatedMetrics: [],
      recommendation: 'Повторите запрос. Сервер уже ограничивает ответ JSON-схемой, поэтому следующая попытка обычно проходит корректно.'
    };
  }

  return {
    title: String(parsed.title ?? 'Проверка гипотезы'),
    verdict: String(parsed.verdict ?? 'требуется уточнение'),
    confidence: Number(parsed.confidence ?? 50),
    summary: String(parsed.summary ?? ''),
    evidence: Array.isArray(parsed.evidence) ? parsed.evidence.map(String) : [],
    limitations: Array.isArray(parsed.limitations) ? parsed.limitations.map(String) : [],
    relatedCriteria: Array.isArray(parsed.relatedCriteria) ? parsed.relatedCriteria.map(String) : [],
    relatedMetrics: Array.isArray(parsed.relatedMetrics) ? parsed.relatedMetrics.map(String) : [],
    recommendation: String(parsed.recommendation ?? '')
  };
}

function extractJsonObject(text) {
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return text;
  }

  return text.slice(firstBrace, lastBrace + 1);
}

function serveStatic(pathname, response) {
  const safePath = normalizeRequestPath(pathname);
  let filePath = path.join(publicDir, safePath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) {
    filePath = path.join(publicDir, 'index.html');
  }

  const ext = path.extname(filePath);
  response.writeHead(200, { 'Content-Type': mimeTypes[ext] ?? 'application/octet-stream' });
  response.end(readFileSync(filePath));
}

function normalizeRequestPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  return normalized === '/' ? 'index.html' : normalized.replace(/^[/\\]/, '');
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on('data', (chunk) => chunks.push(chunk));
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function applyCorsHeaders(request, response) {
  const origin = request.headers.origin;
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Origin', origin ?? '*');
  response.setHeader('Vary', 'Origin');
}
