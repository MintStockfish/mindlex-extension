export const GEMINI_API_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta';

export const GEMINI_REQUEST_TIMEOUT_MS = 30_000;

export const GEMINI_RETRY_LIMIT = 3;

export const GEMINI_RETRY_METHODS = ['post'] as const;

export const GEMINI_RETRY_STATUS_CODES = [
  408, 429, 500, 502, 503, 504,
] as const;
