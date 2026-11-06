/**
 * Cartesia Managed Agents — documented endpoints only.
 * Guide:  https://docs.cartesia.ai/line/integrations/websocket-api
 * Events: https://docs.cartesia.ai/api-reference/agents/agent-websocket
 * Tokens: https://docs.cartesia.ai/api-reference/auth/access-token
 */
export const CARTESIA_API_BASE = 'https://api.cartesia.ai';
export const CARTESIA_WS_ORIGIN = 'wss://api.cartesia.ai';
export const CARTESIA_VERSION = '2026-08-14';

/** Token only needs to live long enough to open the socket. */
export const VOICE_TOKEN_TTL_SECONDS = 60;

/** Client-side hard cap on one call. Also set a max call duration on the agent itself. */
export const VOICE_MAX_SESSION_MS = 5 * 60 * 1000;

/** pcm_16000: 16-bit little-endian mono, ~40 ms chunks (docs: 20–100 ms). */
export const VOICE_SAMPLE_RATE = 16000;
export const VOICE_INPUT_FORMAT = 'pcm_16000';

export function agentSocketUrl(agentId: string, accessToken: string) {
  const url = new URL(`${CARTESIA_WS_ORIGIN}/v1/agents/websocket/${encodeURIComponent(agentId)}`);
  url.searchParams.set('cartesia_version', CARTESIA_VERSION);
  url.searchParams.set('access_token', accessToken);
  return url.toString();
}
