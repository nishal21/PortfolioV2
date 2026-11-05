import { NextRequest, NextResponse } from 'next/server';
import { personal } from '@/data/personal';
import { FEATURED_PROJECT_TITLES } from '@/data/featured';
import { projects } from '@/data/projects';

/**
 * Text fallback for the voice dock when mic/WebAudio is unavailable
 * or Cartesia is in mock mode. Grounded only on repo data.
 */
export async function POST(req: NextRequest) {
  let body: { message?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const q = (body.message || '').trim().toLowerCase();
  if (!q) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 });
  }

  const featured = projects.filter((p) =>
    (FEATURED_PROJECT_TITLES as readonly string[]).includes(p.title),
  );

  let reply: string;

  if (/project|build|work|app|repo/.test(q)) {
    const list = featured.map((p) => `• ${p.title}: ${p.description}`).join('\n');
    reply = `Here are featured projects from nishal.dev:\n${list}\n\nMore on https://nishal.dev/projects`;
  } else if (/contact|email|hire|collab/.test(q)) {
    reply = `Email Nishal at nishal@nishal.dev. Portfolio: https://nishal.dev — open to collabs and freelance.`;
  } else if (/who|about|nishal|kerala|amv|music/.test(q)) {
    reply = `${personal.bio[0]} ${personal.pullQuote}`;
  } else if (/firstpr|first pr/.test(q)) {
    const fp = projects.find((p) => p.title === 'FirstPR');
    reply = fp
      ? `${fp.title}: ${fp.description} ${fp.liveUrl || ''}`
      : 'FirstPR helps you find and review your first open-source PR. https://firstpr.nishal.dev';
  } else {
    reply = `I'm the text stand-in for Nishal's site voice agent (Cartesia). Ask about projects, AMV/music work, or how to contact him. Live voice needs CARTESIA_API_KEY + CARTESIA_AGENT_ID on the server.`;
  }

  return NextResponse.json({
    mock: !process.env.CARTESIA_API_KEY,
    reply,
  });
}
