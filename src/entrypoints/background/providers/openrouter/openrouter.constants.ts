export const OPENROUTER_CHAT_COMPLETIONS_URL =
  'https://openrouter.ai/api/v1/chat/completions';

export const OPENROUTER_REQUEST_TIMEOUT_MS = 30_000;

export const OPENROUTER_RETRY_LIMIT = 3;

export const OPENROUTER_RETRY_METHODS = ['post'] as const;

export const OPENROUTER_RETRY_STATUS_CODES = [
  408, 429, 500, 502, 503, 504,
] as const;
