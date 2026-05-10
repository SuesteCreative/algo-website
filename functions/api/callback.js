// Decap CMS — GitHub OAuth (step 2: callback).
// Cloudflare Pages Function. Same-origin with the site.
//
// Verifies state cookie, exchanges code for access token, posts the token
// back to the opener (the Decap admin popup) using Decap's wire format:
//   "authorization:github:success:{...}" / "authorization:github:error:{...}"

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const cookies = parseCookies(request.headers.get('Cookie') || '');
  const expectedState = cookies['csrf_state'];

  const clearStateCookie = 'csrf_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

  if (!code || !state || !expectedState || state !== expectedState) {
    return htmlResponse(errorPage('Invalid OAuth state. Try logging in again.'), clearStateCookie);
  }

  let tokenData;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'algoatelier-cms-auth',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    tokenData = await res.json();
  } catch (e) {
    return htmlResponse(errorPage('Token exchange request failed.'), clearStateCookie);
  }

  if (tokenData.error || !tokenData.access_token) {
    const msg = tokenData.error_description || tokenData.error || 'Token exchange failed.';
    return htmlResponse(errorPage(msg), clearStateCookie);
  }

  const payload = { token: tokenData.access_token, provider: 'github' };
  return htmlResponse(successPage(payload), clearStateCookie);
}

function parseCookies(header) {
  const out = {};
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k) out[k] = v.join('=');
  }
  return out;
}

function htmlResponse(body, setCookie) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': setCookie,
    },
  });
}

function successPage(payload) {
  const successMessage = `authorization:github:success:${JSON.stringify(payload)}`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Authenticating…</title></head>
<body>
<p>Authentication successful. You may close this window.</p>
<script>
(function () {
  var successMsg = ${JSON.stringify(successMessage)};
  function receiveMessage(e) {
    if (!window.opener) return;
    window.opener.postMessage(successMsg, e.origin || '*');
  }
  window.addEventListener('message', receiveMessage, false);
  // Initial handshake — Decap parent replies, then we send token.
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
}

function errorPage(message) {
  const wire = `authorization:github:error:${JSON.stringify({ message })}`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Auth error</title></head>
<body>
<p>Authentication error: ${escapeHtml(message)}</p>
<script>
(function () {
  if (window.opener) window.opener.postMessage(${JSON.stringify(wire)}, '*');
})();
</script>
</body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}
