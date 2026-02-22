# Project Status — 2026-02-22 (Version v6)

## Overview
The website for Algo Atelier is now fully dynamic, SEO-optimized, and prepared for the final domain `algoatelier.pt`. A new visual identity (sub-logo) has been implemented across the entire site.

## Key Changes in v6
1.  **Domain Migration Setup**:
    *   Updated `_data/site.js` to `https://algoatelier.pt`.
    *   Replaced all hardcoded `netlify.app` URLs with dynamic `site.siteUrl` versions in all templates (`.njk` and `robots.txt`).
    *   Sitemap and legal pages now use dynamic absolute URLs for better SEO and indexability.
2.  **Visual Identity Update**:
    *   Replaced classic logo with the new sub-logo version (`algo-logosub-black.webp` and `algo-logosub-white.webp`).
    *   Navbar logo increased to `115px` for optical balance.
    *   Footer logo increased to `120px` for desktop.
    *   Admin panel logo updated to match the new brand.
3.  **Back-Office (Decap CMS) Improvements**:
    *   Added `google_merchant` field to `general.yml` and `admin/config.yml`.
    *   Fixed admin favicon paths.
    *   Improved mobile responsiveness of the CMS via custom CSS injection.
4.  **UI/UX Refinements**:
    *   Homogenized "About" page titles to use `font-sans` (Outfit) with correct sizing to match the "Services" page.

## Technical Details
- **Stack**: Eleventy (11ty), Nunjucks, Vanilla CSS/JS.
- **Hosting**: Netlify.
- **Domain**: `algoatelier.pt`.
- **Versioning**: Snapshot saved as `versions/v6`.

## Next Steps
- Client verification of the Google Merchant ID once provided.
- Final domain pointing (DNS) on Netlify by the client.
