export default async (req: Request) => {
  const reqUrl = new URL(req.url);
  const fileUrl = reqUrl.searchParams.get('url');
  const title = reqUrl.searchParams.get('title') || 'DJ_EMMA_PRO_Mix';

  if (!fileUrl) {
    return new Response('Missing file URL', { status: 400 });
  }

  // Only allow downloads from your trusted R2 and Supabase storage domains
  const isAllowed =
    fileUrl.startsWith('https://pub-c81eb1d416094a9093c09a6c4872aa95.r2.dev/') ||
    fileUrl.startsWith('https://supabase.co');

  if (!isAllowed) {
    return new Response('Unauthorized download domain', { status: 403 });
  }

  const upstream = await fetch(fileUrl);
  if (!upstream.ok || !upstream.body) {
    return new Response('File not found', { status: upstream.status || 404 });
  }

  const safeName = title.replace(/[^a-zA-Z0-9._-]/g, '_') + '.mp3';
  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('Content-Type') || 'audio/mpeg');
  headers.set('Content-Disposition', `attachment; filename="${safeName}"`);

  const contentLength = upstream.headers.get('Content-Length');
  if (contentLength) {
    headers.set('Content-Length', contentLength);
  }

  return new Response(upstream.body, {
    status: 200,
    headers,
  });
};
