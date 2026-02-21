# Algo Atelier — Versão v4
**Data:** 2026-02-21  
**Commit:** ff2e80a

## O que está nesta versão

### Ficheiros incluídos
| Ficheiro | Descrição |
|---|---|
| `assets/css/styles.css` | CSS principal — todos os estilos |
| `assets/js/script.js` | JS — scroll snap, hero video, drawer mobile |
| `_includes/footer-pt.njk` | Footer PT com link Sueste + wave |
| `_includes/footer-en.njk` | Footer EN com link Sueste + wave |
| `_includes/testimonials.njk` | Secção de testemunhos (bilíngue) |
| `_includes/process.njk` | Secção de processo/vídeo (bilíngue) |
| `_includes/contact-cta.njk` | Secção contacto CTA (bilíngue) |
| `admin/config.yml` | CMS reorganizado por página |
| `admin/index.html` | Back-office com branding Algo |
| `content/settings/general.yml` | Configurações globais (YAML limpo, sem conflitos) |
| `projetos/index.njk` | Página projetos PT |
| `en/projects/index.njk` | Página projetos EN |
| `contacto/index.njk` | Página contacto PT (mapa inline) |
| `en/contact/index.njk` | Página contacto EN (mapa inline) |
| `index.njk` | Landing page PT |
| `en/index.njk` | Landing page EN |

## Principais features desta versão

- **Footer** — logo 100px, link clicável Sueste - Creative Agency, wave ultra-fina (stroke 0.8)
- **Mapa na página contacto** — posicionado abaixo do form, mesma largura da coluna
- **Scroll snap** — JS leve com debounce 150ms, threshold 30% viewport, desktop only
- **Página projetos** — header overlap corrigido (padding-top: 185px), cards 230px vs 280px
- **CMS reorganizado** — secções por página: 🏠 Landing · 📐 Projetos · 👤 Sobre · 📍 Contacto · ⚙️ Configurações
- **Back-office** — logo Algo branco + label "Back-Office" + sidebar escura
- **general.yml** — conflito git eliminado, site data restaurado

## Para restaurar esta versão
```bash
# Copiar os ficheiros desta pasta para o root do projeto
cp -r versions/v4/* ./
```
Ou via git:
```bash
git checkout ff2e80a
```
