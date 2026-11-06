export const dynamic = 'force-dynamic';

/** GET /api/voice/status — whether live voice is configured. Exposes no values. */
export function GET() {
  const configured = Boolean(process.env.CARTESIA_API_KEY && process.env.CARTESIA_AGENT_ID);
  return Response.json({ voice: configured }, { headers: { 'Cache-Control': 'no-store' } });
}
