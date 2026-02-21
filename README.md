# Algo Atelier — Website

Site institucional do Algo Atelier. Construído em HTML/CSS/JS puro, sem framework de build.

---

## 🚀 Deploy no Netlify

### Opção A — Interface Netlify (drag & drop ou GitHub)

1. Faz login em [app.netlify.com](https://app.netlify.com)
2. Clica em **"Add new site" → "Import an existing project"**
3. Liga ao repositório GitHub `SuesteCreative/algo-website`
4. Nas definições de build, preenche:
   | Campo | Valor |
   |---|---|
   | **Build command** | *(deixar em branco)* |
   | **Publish directory** | `.` |
5. Clica **Deploy site**

O ficheiro `netlify.toml` já está configurado — o Netlify vai detetar automaticamente.

---

### Opção B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --dir . --prod
```

---

## 📁 Estrutura do Projeto

```
/                        → Landing page PT (raiz)
/sobre/                  → Sobre (PT)
/servicos/               → Serviços (PT)
/projetos/               → Lista de projetos (PT)
  /projetos/casa-do-penedo/
  /projetos/pavilhao-de-vidro/
  /projetos/luz-do-sul/
  /projetos/pavilhao-entre-aguas/
  /projetos/sede-tecnologica-x/
  /projetos/torre-de-luz/
  /projetos/centro-civico/
/contacto/               → Contacto (PT)
/orcamento/              → Orçamento (PT)
/legal/                  → Privacidade & Cookies
/en/                     → Landing page EN
/en/about/
/en/services/
/en/projects/
  /en/projects/penedo-house/
  /en/projects/glass-pavilion/
  /en/projects/southern-light/
  /en/projects/between-waters-pavilion/
  /en/projects/x-tech-hq/
  /en/projects/tower-of-light/
  /en/projects/civic-center/
/en/contact/
/assets/css/             → Folha de estilos global
/assets/js/              → Script JS global
/assets/img/             → Imagens e vídeo hero
```

---

## ⚠️ Notas sobre Paths

- **Todos os caminhos são relativos** (`../assets/`, `../../assets/`, etc.) — funcionam em qualquer domínio, raiz ou subpath.
- A página 404 usa caminhos **absolutos** (`/assets/css/styles.css`) porque o Netlify a serve a partir da raiz independentemente de onde o erro ocorra.
- PT está na raiz `/`, EN está em `/en/`. A troca de língua usa caminhos relativos para o equivalente da página.

---

## 🛠️ Desenvolvimento Local

```bash
npm install
npm run dev
# Abre em http://localhost:3000
```

---

## 📋 netlify.toml resumo

```toml
[build]
  command = ""   # sem build step
  publish = "."  # raiz do repo
```

Inclui headers de segurança e cache de assets (CSS/JS/imagens: 1 ano imutável).
