/**
 * Algo Atelier — script.js
 * ─────────────────────────────────────────────────────────────────
 * Main JS file for interactions, scroll effects, and custom transitions.
 * ─────────────────────────────────────────────────────────────────
 */

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // ── Hero Video Logic ──────────────────────────────────────────
    const heroVideo = document.getElementById('heroVideo');
    const heroBg = document.getElementById('heroBg');

    if (heroVideo) {
        // Fix for iOS: ensure parameters are set and force load/play
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');

        const playVideo = () => {
            heroVideo.play().catch(e => {
                console.log("Autoplay blocked, showing poster.");
                if (heroBg) heroBg.classList.add('video-ended');
            });
        };

        playVideo();

        const handleVideoEnd = () => {
            if (heroBg && !heroBg.classList.contains('video-ended')) {
                heroVideo.pause();
                heroVideo.currentTime = 9;
                heroBg.classList.add('video-ended');
            }
        };

        heroVideo.addEventListener('timeupdate', () => {
            if (heroVideo.currentTime >= 9) handleVideoEnd();
        });
        heroVideo.addEventListener('ended', handleVideoEnd);

        // Safety for iOS low power mode
        document.addEventListener('touchstart', () => {
            if (heroVideo.paused) heroVideo.play();
        }, { once: true });
    }

    // ── Mobile Drawer Logic ───────────────────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('drawer');
    const body = document.body;

    if (menuToggle && drawer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = drawer.classList.toggle('open');
            body.classList.toggle('drawer-open', isOpen);
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active', isOpen));
        });

        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('open');
                body.classList.remove('drawer-open');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });
    }

    // ── Observer Observation ──────────────────────────────────────
    document.querySelectorAll('.fade-up, .img-reveal, .reveal-image, section:not(.hero), .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
});

/* ── Unified Ripple Transition Logic ───────────────────────────────── */
(function () {
    const DURATION = 900;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    function getRipple() {
        let ball = document.getElementById('orcamento-transition-ball') || document.getElementById('ripple');
        let ov = document.getElementById('orcamento-transition-overlay') || document.getElementById('page-transition');

        if (!ball) {
            ov = document.createElement('div');
            ov.id = 'orcamento-transition-overlay';
            ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;pointer-events:none;overflow:hidden;';
            ball = document.createElement('div');
            ball.id = 'orcamento-transition-ball';
            ball.style.cssText = 'position:absolute;width:0;height:0;border-radius:50%;background:#0e0e0e;transform:translate(-50%,-50%);transition:none;';
            ov.appendChild(ball);
            document.body.appendChild(ov);
        } else {
            ov = ball.parentElement;
            ov.style.zIndex = '999999';
        }
        return { ov, ball };
    }

    function expand(cx, cy, href) {
        const { ball } = getRipple();
        const r = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.5;

        // Fallback for iOS transition lag
        if (isIOS) {
            document.body.style.transition = 'opacity 0.4s ease';
            document.body.style.opacity = '0';
            setTimeout(() => { window.location.href = href; }, 400);
            return;
        }

        ball.style.transition = 'none'; ball.style.width = '0px'; ball.style.height = '0px';
        ball.style.left = cx + 'px'; ball.style.top = cy + 'px'; ball.style.opacity = '1';
        ball.getBoundingClientRect();
        ball.style.transition = `width ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), height ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        ball.style.width = (r * 2) + 'px'; ball.style.height = (r * 2) + 'px';

        setTimeout(() => {
            document.body.style.opacity = '0';
            window.location.href = href;
        }, DURATION - 100);
    }

    function collapse(cx, cy) {
        const { ball } = getRipple();
        const r = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.5;

        if (isIOS) {
            ball.style.display = 'none';
            document.body.style.opacity = '1';
            return;
        }

        ball.style.transition = 'none'; ball.style.width = (r * 2) + 'px'; ball.style.height = (r * 2) + 'px';
        ball.style.left = cx + 'px'; ball.style.top = cy + 'px'; ball.style.opacity = '1';
        ball.getBoundingClientRect();

        document.body.style.opacity = '1';
        ball.style.transition = `width ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), height ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ${DURATION - 200}ms`;
        ball.style.width = '0px'; ball.style.height = '0px'; ball.style.opacity = '0';
    }

    window.addEventListener('load', () => {
        const isFromBudget = document.referrer.includes('orcamento') || document.referrer.includes('sucesso') || window.location.hash === '#budget_return';
        if (document.body.classList.contains('orcamento-page')) {
            collapse(window.innerWidth / 2, window.innerHeight / 2);
        }
        else if (isFromBudget) {
            let btn = document.querySelector('a.btn-budget') || document.querySelector('a[href*="orcamento"]');
            if (btn) {
                let rect = btn.getBoundingClientRect();
                collapse(rect.left + rect.width / 2, rect.top + rect.height / 2);
            } else {
                collapse(window.innerWidth / 2, window.innerHeight / 2);
            }
        }
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link || link.target === '_blank') return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;

        const isToBudget = href.includes('orcamento') || link.classList.contains('btn-budget') || href.includes('sucesso');
        const isFromBudget = document.body.classList.contains('orcamento-page');

        if (isToBudget || isFromBudget) {
            e.preventDefault();
            const rect = link.getBoundingClientRect();
            const cx = rect.width ? (rect.left + rect.width / 2) : (window.innerWidth / 2);
            const cy = rect.height ? (rect.top + rect.height / 2) : (window.innerHeight / 2);
            expand(cx, cy, href);
        }
    });
}());

/* ── Proximity Scroll Snap (Desktop Only) ────────────────────────── */
(function initScrollSnap() {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const HEADER_HEIGHT = 80;
    const SNAP_THRESHOLD = 0.30;
    let scrollTimer = null;
    let isSnapping = false;

    function getNearestSection() {
        const sections = document.querySelectorAll('.snap-section');
        const viewportH = window.innerHeight;
        let best = null, bestDist = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top - HEADER_HEIGHT;
            const absDist = Math.abs(sectionTop);
            if (absDist < viewportH * SNAP_THRESHOLD && absDist < bestDist) {
                bestDist = absDist;
                best = section;
            }
        });
        return best;
    }

    window.addEventListener('scroll', () => {
        if (isSnapping) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const target = getNearestSection();
            if (target) {
                isSnapping = true;
                const targetY = window.scrollY + target.getBoundingClientRect().top - HEADER_HEIGHT;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
                setTimeout(() => { isSnapping = false; }, 800);
            }
        }, 150);
    }, { passive: true });
}());
