/**
 * AI Pal talks to an optional FastAPI backend.
 * Never put Deepseek / Zhipu API keys in the frontend.
 * Static GitHub Pages builds leave this disabled.
 */
export function isAiPalEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_AI_PAL === "true"
}

export function getAiApiUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_API_URL
  return url && url.length > 0 ? url.replace(/\/$/, "") : undefined
}
