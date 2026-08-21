/**
 * Sanitizes backend, AI, and network errors into clean, student-friendly messages.
 * Prevents raw stack traces, API keys, and internal provider errors from leaking to the UI.
 */
export const getFriendlyErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  // Extract message from Axios response or Error object
  const raw = (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    (typeof error === 'string' ? error : '')
  ).trim();

  const lower = raw.toLowerCase();
  const status = error?.response?.status;

  // 1. Network / Connection errors
  if (lower.includes('network error') || lower.includes('failed to fetch') || lower.includes('econnrefused') || lower.includes('enotfound')) {
    return 'Unable to connect to the server. Please check your internet connection or try again in a moment.';
  }

  // 2. Rate limiting (429)
  if (status === 429 || lower.includes('rate limit') || lower.includes('too many requests')) {
    return 'AI request limit reached. Please wait a few minutes before generating more study content.';
  }

  // 3. AI Provider High Demand / 503 / Timeouts
  if (
    status === 503 ||
    status === 504 ||
    lower.includes('high demand') ||
    lower.includes('503') ||
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('all ai providers failed') ||
    lower.includes('googlegenerativeai') ||
    lower.includes('groq') ||
    lower.includes('overloaded') ||
    lower.includes('busy')
  ) {
    return 'The AI study engine is currently busy. Please wait a few seconds and try again.';
  }

  // 4. Auth & Permissions
  if (status === 401 || lower.includes('unauthorized') || lower.includes('invalid token') || lower.includes('no token')) {
    return 'Your session has expired. Please log in again to continue.';
  }
  if (status === 403 || lower.includes('forbidden')) {
    return 'You do not have permission to perform this action.';
  }

  // 5. Content parsing / Extraction issues
  if (lower.includes('invalid flashcard') || lower.includes('invalid quiz') || lower.includes('malformed') || lower.includes('failed to parse')) {
    return 'Could not extract enough study concepts from this text. Please try adding more detailed lecture notes or clear headings.';
  }

  // 6. Large or empty input
  if (lower.includes('too large') || lower.includes('payload too large') || status === 413) {
    return 'This document is too large to process at once. Please try uploading a shorter chapter or excerpt.';
  }
  if (lower.includes('no source text') || lower.includes('prompt is required') || lower.includes('message is required')) {
    return 'Please provide some lecture text or notes to generate study materials.';
  }

  // 7. If the raw message is reasonably short, clean, and not a code trace, use it
  if (raw && raw.length < 90 && !raw.includes('[') && !raw.includes('{') && !raw.includes('Error:')) {
    return raw;
  }

  return fallback;
};
