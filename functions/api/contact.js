// Contact form handler — sends email via Resend.
// Cloudflare Pages Function.
//
// Accepts urlencoded or multipart form POSTs from any of the site's forms
// (contacto, orcamento, contacto-landing). Recipient + sender are read from
// CF env vars — never from form input — to avoid spam-relay abuse.

export async function onRequestPost({ request, env }) {
  let fields;
  try {
    fields = await readFields(request);
  } catch (e) {
    return json({ ok: false, error: 'Invalid form payload' }, 400);
  }

  // Honeypot. Field name "website" — bots auto-fill it; humans never see it.
  if (fields.website) {
    // Silent accept so bots don't iterate.
    return json({ ok: true });
  }

  // Tolerate PT or EN field naming.
  const name = (fields.name || fields.nome || '').trim();
  const email = (fields.email || '').trim();
  const message = (fields.message || fields.mensagem || '').trim();
  const privacy = fields.privacy;
  const source = (fields.form_source || 'contacto').trim();

  if (!name || !email || !message) {
    return json({ ok: false, error: 'Missing required fields' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Invalid email' }, 400);
  }
  if (privacy !== 'on' && privacy !== 'true' && privacy !== '1') {
    return json({ ok: false, error: 'Privacy consent required' }, 400);
  }
  if (message.length > 5000 || name.length > 200) {
    return json({ ok: false, error: 'Field too long' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_RECIPIENT || !env.RESEND_FROM) {
    return json({ ok: false, error: 'Email service not configured' }, 500);
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const country = request.cf?.country || 'unknown';

  // Extra fields (orcamento has phone, project type, etc.) — append all.
  const extras = {};
  for (const [k, v] of Object.entries(fields)) {
    if (['name', 'nome', 'email', 'message', 'mensagem', 'privacy', 'website', 'form_source', 'form-name', 'bot-field', 'recipient_email', 'cc_email'].includes(k)) continue;
    if (v) extras[k] = v;
  }

  const subject = `[${source}] Novo contacto: ${name}`;
  const html = renderHtml({ source, name, email, message, extras, ip, country });
  const text = renderText({ source, name, email, message, extras, ip, country });

  const body = {
    from: env.RESEND_FROM,
    to: [env.CONTACT_RECIPIENT],
    reply_to: email,
    subject,
    html,
    text,
  };
  if (env.CONTACT_CC) body.cc = [env.CONTACT_CC];

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('Resend send failed', res.status, errText);
    return json({ ok: false, error: 'Email send failed' }, 502);
  }

  return json({ ok: true });
}

async function readFields(request) {
  const ct = request.headers.get('Content-Type') || '';
  if (ct.includes('application/json')) {
    return await request.json();
  }
  const form = await request.formData();
  return Object.fromEntries(form);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderHtml({ source, name, email, message, extras, ip, country }) {
  const extrasRows = Object.entries(extras).map(([k, v]) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#888;">${escapeHtml(k)}</td><td>${escapeHtml(String(v))}</td></tr>`
  ).join('');
  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,sans-serif;color:#222;max-width:640px;margin:0 auto;padding:24px;">
<h2 style="margin:0 0 16px;">Novo contacto via algoatelier.pt</h2>
<p style="margin:0 0 8px;color:#888;font-size:13px;">Origem: ${escapeHtml(source)}</p>
<table style="border-collapse:collapse;margin-bottom:16px;font-size:14px;">
<tr><td style="padding:4px 12px 4px 0;color:#888;">Nome</td><td>${escapeHtml(name)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#888;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
${extrasRows}
</table>
<h3 style="margin:24px 0 8px;font-size:14px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Mensagem</h3>
<div style="white-space:pre-wrap;background:#f6f6f4;padding:16px;border-radius:4px;font-size:15px;line-height:1.6;">${escapeHtml(message)}</div>
<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
<p style="font-size:12px;color:#aaa;">IP: ${escapeHtml(ip)} · País: ${escapeHtml(country)}</p>
</body></html>`;
}

function renderText({ source, name, email, message, extras, ip, country }) {
  const extraLines = Object.entries(extras).map(([k, v]) => `${k}: ${v}`).join('\n');
  return [
    `Novo contacto via algoatelier.pt`,
    `Origem: ${source}`,
    ``,
    `Nome: ${name}`,
    `Email: ${email}`,
    extraLines,
    ``,
    `Mensagem:`,
    message,
    ``,
    `---`,
    `IP: ${ip} · País: ${country}`,
  ].filter(Boolean).join('\n');
}
