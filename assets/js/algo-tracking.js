/**
 * algo-tracking.js
 * ─────────────────────────────────────────────────────────────────
 * Módulo de tracking GDPR-compliant para Algo Atelier
 *
 * Fluxo:
 *   1. Página carrega → SEM tracking
 *   2. Banner aparece → utilizador aceita/recusa
 *   3. Só após aceitar → GA e Ads são inicializados
 *
 * IDs injetados pelo Eleventy via data-attributes no <body>.
 * Sem hardcode. Sem tracking antes de consentimento.
 * ─────────────────────────────────────────────────────────────────
 */

(function AlgoTracking() {
    'use strict';

    /* ── Constantes ──────────────────────────────────────────────── */
    const CONSENT_KEY = 'algo_cookie_consent'; // localStorage key
    const CONSENT_YES = 'accepted';
    const CONSENT_NO = 'rejected';
    const CONSENT_TTL = 365;                   // dias até expirar

    /* ── Helpers ─────────────────────────────────────────────────── */

    /** Lê o consentimento guardado */
    function getConsent() {
        try { return localStorage.getItem(CONSENT_KEY); }
        catch (e) { return null; }
    }

    /** Guarda a decisão do utilizador */
    function setConsent(value) {
        try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { }
    }

    /** Lê os IDs do body (injetados pelo Eleventy via data-attributes) */
    function getTrackingIds() {
        const body = document.body;
        return {
            gaId: (body.dataset.gaId || '').trim(),
            adsId: (body.dataset.adsId || '').trim()
        };
    }

    /* ── Loaders de tracking ─────────────────────────────────────── */

    let gaLoaded = false;
    let adsLoaded = false;

    /** Inicializa Google Analytics */
    function loadGA(id) {
        if (gaLoaded || !id) return;
        gaLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', id, { anonymize_ip: true });

        console.info('[Algo Tracking] Google Analytics iniciado:', id);
    }

    /** Inicializa Google Ads */
    function loadAds(id) {
        if (adsLoaded || !id) return;
        adsLoaded = true;

        // Ads partilha o mesmo gtag.js — se GA já carregou, não duplicar
        if (!gaLoaded) {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            window.gtag = gtag;
            gtag('js', new Date());
        }

        window.gtag('config', id);
        console.info('[Algo Tracking] Google Ads iniciado:', id);
    }

    /** Ativa todo o tracking se houver consentimento */
    function activateTracking() {
        const { gaId, adsId } = getTrackingIds();
        if (gaId) loadGA(gaId);
        if (adsId) loadAds(adsId);
    }

    /* ── API pública ─────────────────────────────────────────────── */

    /** O utilizador aceitou cookies */
    window.acceptCookies = function () {
        setConsent(CONSENT_YES);
        hideBanner();
        activateTracking();
    };

    /** O utilizador recusou cookies */
    window.rejectCookies = function () {
        setConsent(CONSENT_NO);
        hideBanner();
        // Sem tracking — não carregar nada
    };

    /** Retorna true se houver consentimento ativo */
    window.hasConsent = function () {
        return getConsent() === CONSENT_YES;
    };

    /** Reabre o banner de preferências */
    window.openCookiePreferences = function () {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.setAttribute('aria-hidden', 'false');
            banner.style.display = 'flex';
        }
    };

    /* ── Banner ──────────────────────────────────────────────────── */

    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.setAttribute('aria-hidden', 'true');
            banner.style.display = 'none';
        }
    }

    function showBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.setAttribute('aria-hidden', 'false');
            banner.style.display = 'flex';
        }
    }

    /* ── Init ────────────────────────────────────────────────────── */

    function init() {
        const consent = getConsent();

        if (consent === CONSENT_YES) {
            // Já aceitou — ativar sem mostrar banner
            activateTracking();
            hideBanner();
        } else if (consent === CONSENT_NO) {
            // Já recusou — nada a fazer
            hideBanner();
        } else {
            // Primeira visita — mostrar banner
            showBanner();
        }
    }

    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
