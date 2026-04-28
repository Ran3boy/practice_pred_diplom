export interface AiAnswer {
  title: string;
  verdict: string;
  confidence: number;
  summary: string;
  evidence: string[];
  limitations: string[];
  relatedCriteria: string[];
  relatedMetrics: string[];
  recommendation: string;
  provider?: 'gemini';
}

export interface AiErrorPayload {
  error: string;
  code?: string;
  retryable?: boolean;
}
