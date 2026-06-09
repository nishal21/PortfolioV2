import { submitIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

/**
 * POST /api/indexnow — ping Bing & IndexNow after deploy.
 * Optional: Authorization: Bearer {INDEXNOW_SECRET}
 */
export async function POST(request: Request) {
  const secret = process.env.INDEXNOW_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = await request.json().catch(() => ({}));
    const urls = Array.isArray(body?.urls) ? (body.urls as string[]) : undefined;
    const { payload, results } = await submitIndexNow(urls);

    return Response.json({
      ok: results.some((result) => result.ok),
      submitted: payload.urlList.length,
      keyLocation: payload.keyLocation,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'IndexNow submission failed';
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    message: 'POST to this endpoint to submit URLs to IndexNow (Bing, Yandex, etc.)',
    docs: 'https://www.indexnow.org/documentation',
  });
}
