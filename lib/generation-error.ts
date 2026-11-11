export function generationError(error: unknown): { status: number; message: string } {
  const status = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
  if (status === 429) return { status: 429, message: 'The AI generation limit has been reached. Please try again later.' };
  if (status === 400) return { status: 422, message: 'AI could not generate text for this request. Try rephrasing your prompt.' };
  if (status === 401 || status === 403 || status === 404) return { status: 503, message: 'AI text generation is temporarily unavailable. Please try again later.' };
  return { status: 502, message: 'AI text generation failed. Please try again.' };
}
