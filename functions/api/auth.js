// Decap CMS — GitHub OAuth (step 1: initiate).
// Cloudflare Pages Function. Same-origin with the site.
//
// Flow:
//   1. Decap admin opens popup at /api/auth?provider=github
//   2. We mint random state, store as HttpOnly cookie, 302 to GitHub authorize URL
//   3. GitHub redirects user to /api/callback (handled by callback.js)

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider') || 'github';

  if (provider !== 'github') {
    return new Response('Unsupported provider', { status: 400 });
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('OAuth not configured (missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET)', { status: 500 });
  }

  const state = crypto.randomUUID();
  const redirectUri = `${url.origin}/api/callback`;

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', 'repo user');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `csrf_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
