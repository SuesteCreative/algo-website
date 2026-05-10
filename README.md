# Algo Atelier — Website

Site institucional do Algo Atelier. Eleventy v2 (gerador estático), Decap CMS para edição de conteúdos, alojado em Cloudflare Pages.

---

## 🚀 Deploy

Auto-deploy via GitHub → Cloudflare Pages. Cada push para `main` faz build e deploy.

**Configuração CF Pages:**

| Campo | Valor |
|---|---|
| Build command | `npx @11ty/eleventy` |
| Build output | `_site` |
| Root directory | `/` |

### Variáveis de ambiente (Production)

| Variável | Descrição |
|---|---|
| `GITHUB_CLIENT_ID` | OAuth App para login do CMS |
| `GITHUB_CLIENT_SECRET` | OAuth App secret |
| `RESEND_API_KEY` | API key Resend |
| `RESEND_FROM` | Sender (ex: `Algo Atelier <noreply@algoatelier.pt>`) |
| `CONTACT_RECIPIENT` | Email destinatário |
| `CONTACT_CC` | (opcional) email em cópia |

---

## 🛠️ Desenvolvimento Local

```bash
npm install
npm run dev
# Abre em http://localhost:8080
```

---

## ✍️ CMS

- URL: `https://algoatelier.pt/admin/`
- Backend: GitHub OAuth (Decap CMS)
- Conteúdos: `content/projetos/*.md` + `content/settings/*.yml`
- Login requer membro do repositório com push em `main`

---

## 📁 Estrutura

```
/                        → Landing PT
/sobre/, /servicos/, /projetos/, /contacto/, /orcamento/
/legal/                  → Privacidade & Cookies
/en/                     → Versão inglesa (mesma estrutura)
/admin/                  → Decap CMS UI
/content/                → Conteúdos editáveis (markdown + yaml)
/functions/api/          → Cloudflare Pages Functions
   ├── auth.js           → OAuth iniciador
   ├── callback.js       → OAuth callback
   └── contact.js        → Handler do formulário (Resend)
/_headers                → Cabeçalhos CF Pages
/assets/                 → CSS, JS, imagens, vídeos
```

---

## 🔌 Integrações

- **Cloudflare Pages** — alojamento + serverless functions
- **GitHub** — controlo de versões + auth do CMS
- **Decap CMS** — UI editorial (`/admin/`)
- **Resend** — envio de emails do formulário de contacto
