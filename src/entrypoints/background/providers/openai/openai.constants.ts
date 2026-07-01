export const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

export const OPENAI_REQUEST_TIMEOUT_MS = 30_000;

export const OPENAI_RETRY_LIMIT = 3;

export const OPENAI_RETRY_METHODS = ['post'] as const;

export const OPENAI_RETRY_STATUS_CODES = [
  408, 429, 500, 502, 503, 504,
] as const;
