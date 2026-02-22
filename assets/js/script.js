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

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // ── Hero Video & Global Autoplay (iOS focus) ──────────────────
    const heroVideo = document.getElementById('heroVideo');
    const heroBg = document.getElementById('heroBg');

    const tryPlayVideo = (video) => {
        if (!video) return;
        video.muted = true; // Essential for iOS
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success! Ensure video-ended class is removed if it was added
                if (video.id === 'heroVideo' && heroBg) {
                    heroBg.classList.remove('video-ended');
                }
            }).catch(error => {
                console.log("Autoplay blocked/failed:", error);
                // On failure, we show the poster/img fallback
                if (video.id === 'heroVideo' && heroBg) {
                    heroBg.classList.add('video-ended');
                }
            });
        }
    };

    if (heroVideo) {
        // Ensure iOS attributes are present
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');
        heroVideo.muted = true;

        // Initial attempt
        tryPlayVideo(heroVideo);

        // 9-second stop logic
        const stopAtNine = () => {
            if (heroVideo.currentTime >= 9) {
                heroVideo.pause();
                if (heroBg) heroBg.classList.add('video-ended');
                heroVideo.removeEventListener('timeupdate', stopAtNine);
            }
        };
        heroVideo.addEventListener('timeupdate', stopAtNine);

        // Handle video ended (if video is shorter than 9s)
        heroVideo.addEventListener('ended', () => {
            if (heroBg) heroBg.classList.add('video-ended');
        });

        // Interaction enforcers
        const fullEnforcer = () => {
            if (!heroVideo.classList.contains('video-ended')) {
                tryPlayVideo(heroVideo);
            }
            // Also enforce any other autoplay videos
            document.querySelectorAll('video[autoplay]').forEach(v => {
                if (v.id !== 'heroVideo') tryPlayVideo(v);
            });
        };

        window.addEventListener('touchstart', fullEnforcer, { once: true });
        window.addEventListener('click', fullEnforcer, { once: true });
        window.addEventListener('scroll', fullEnforcer, { once: true });
    } else {
        // Fallback for pages without heroVideo
        const globalEnforce = () => {
            document.querySelectorAll('video[autoplay]').forEach(v => tryPlayVideo(v));
        };
        window.addEventListener('touchstart', globalEnforce, { once: true });
        window.addEventListener('click', globalEnforce, { once: true });
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

    // ── AJAX Form Submission ──────────────────────────────────────
    const handleFormSubmit = (e) => {
        const form = e.target;
        if (!form.hasAttribute('data-netlify')) return;

        e.preventDefault();
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        const originalBtnText = submitBtn.innerText;

        // Find or create message container
        let msgContainer = form.querySelector('.form-message');
        if (!msgContainer) {
            msgContainer = document.createElement('div');
            msgContainer.className = 'form-message';
            msgContainer.style.marginTop = '1.5rem';
            msgContainer.style.fontSize = '0.9rem';
            msgContainer.style.padding = '1rem';
            msgContainer.style.borderRadius = '2px';
            form.appendChild(msgContainer);
        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'A enviar...';
        msgContainer.style.display = 'none';

        const fetchUrl = form.getAttribute('action') || "/";

        fetch(fetchUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
            .then(() => {
                msgContainer.innerText = 'Mensagem enviada com sucesso!';
                msgContainer.style.background = 'rgba(0, 100, 0, 0.05)';
                msgContainer.style.color = 'darkgreen';
                msgContainer.style.display = 'block';
                form.reset();
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            })
            .catch(() => {
                msgContainer.innerText = 'Ocorreu um erro ao enviar. Por favor, tente novamente.';
                msgContainer.style.background = 'rgba(100, 0, 0, 0.05)';
                msgContainer.style.color = 'darkred';
                msgContainer.style.display = 'block';
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
    };

    document.querySelectorAll('form[data-netlify]').forEach(form => {
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
    });

    // ── Observer Observation ──────────────────────────────────────
    document.querySelectorAll('.fade-up, .img-reveal, .reveal-image, section:not(.hero), .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });
});

/* ── Unified Ripple Transition Logic ───────────────────────────────── */
(function () {
    const DURATION = 900; // Original Duration
    const isMobile = window.innerWidth <= 768;

    function getRipple() {
        let ball = document.getElementById('orcamento-transition-ball') || document.getElementById('ripple');
        let ov = document.getElementById('orcamento-transition-overlay') || document.getElementById('page-transition');

        if (!ball) {
            ov = document.createElement('div');
            ov.id = 'orcamento-transition-overlay';
            ov.style.cssText = 'position:fixed;top:0;left:0;width:100\%;height:100\%;z-index:999999;pointer-events:none;overflow:hidden;background:transparent;';
            ball = document.createElement('div');
            ball.id = 'orcamento-transition-ball';
            ball.style.cssText = 'position:absolute;width:0;height:0;border-radius:50%;background:#0e0e0e;transform:translate(-50%,-50%);transition:none;opacity:0;';
            ov.appendChild(ball);
            document.body.appendChild(ov);
        } else {
            ov = ball.parentElement;
            ov.style.zIndex = '999999';
        }
        return { ov, ball };
    }

    function expand(cx, cy, href) {
        const { ball, ov } = getRipple();
        const r = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.5;
        const isMob = window.innerWidth <= 768;

        if (isMob) {
            // Faster, more solid transition for mobile to avoid flash
            document.body.style.transition = 'opacity 0.2s ease';
            document.body.style.opacity = '0';
            setTimeout(() => { window.location.href = href; }, 200);
            return;
        }

        ov.style.display = 'block';
        ov.style.pointerEvents = 'auto';
        ov.style.background = 'transparent';

        ball.style.transition = 'none';
        ball.style.width = '0px';
        ball.style.height = '0px';
        ball.style.left = cx + 'px';
        ball.style.top = cy + 'px';
        ball.style.opacity = '1';

        ball.getBoundingClientRect(); // trigger reflow

        ball.style.transition = `width ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), height ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        ball.style.width = (r * 2) + 'px';
        ball.style.height = (r * 2) + 'px';

        // Ensure redirect ONLY after ball has fully grown
        setTimeout(() => {
            ov.style.background = '#0e0e0e'; // Solid fallback
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = href;
            }, 150); // Small extra safety buffer
        }, DURATION);
    }

    function collapse(cx, cy) {
        const { ball, ov } = getRipple();
        const r = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2)) * 1.5;

        // Check mobile state dynamically
        const isMob = window.innerWidth <= 768;

        if (isMob) {
            if (ball) ball.style.display = 'none';
            if (ov) {
                ov.style.transition = 'opacity 0.3s ease';
                ov.style.opacity = '0';
                setTimeout(() => { ov.style.display = 'none'; }, 300);
            }
            document.body.style.opacity = '1';
            return;
        }

        ov.style.display = 'block';
        ov.style.background = '#0e0e0e';

        ball.style.transition = 'none';
        ball.style.width = (r * 2) + 'px';
        ball.style.height = (r * 2) + 'px';
        ball.style.left = cx + 'px';
        ball.style.top = cy + 'px';
        ball.style.opacity = '1';

        ball.getBoundingClientRect(); // trigger reflow

        ov.style.transition = 'background 0.3s ease';
        ov.style.background = 'transparent';

        document.body.style.opacity = '1';
        ball.style.transition = `width ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), height ${DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ${DURATION}ms`;
        ball.style.width = '0px';
        ball.style.height = '0px';
        ball.style.opacity = '0';

        setTimeout(() => {
            ov.style.display = 'none';
        }, DURATION + 400);
    }

    function getBudgetBtnCoords() {
        // Specifically hunt for the header button first
        const headerBtn = document.querySelector('header .btn-budget');
        if (headerBtn) {
            const rect = headerBtn.getBoundingClientRect();
            if (rect.width > 0) {
                return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
            }
        }

        // Fallback to any budget button
        const anyBtn = document.querySelector('.btn-budget');
        if (anyBtn) {
            const rect = anyBtn.getBoundingClientRect();
            return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
        }

        return { cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
    }

    // Run collapse logic on DOMContentLoaded for speed, 
    // but also on Load in case layout shifts.
    const handleInitialCollapse = () => {
        const isBudgetPage = document.body.classList.contains('orcamento-page');
        const fromBudgetPage = document.referrer.includes('orcamento');

        if (isBudgetPage || fromBudgetPage) {
            const coords = getBudgetBtnCoords();
            collapse(coords.cx, coords.cy);
        } else {
            document.body.style.opacity = '1';
            const ripple = document.getElementById('orcamento-transition-overlay');
            if (ripple) ripple.style.display = 'none';
        }
    };

    if (document.readyState === 'complete') {
        handleInitialCollapse();
    } else {
        window.addEventListener('load', handleInitialCollapse);
    }

    // Safety fallback: Ensure page is visible after 2 seconds no matter what
    setTimeout(() => {
        document.body.style.opacity = '1';
        const ripple = document.getElementById('orcamento-transition-overlay');
        if (ripple && ripple.style.display !== 'none') {
            ripple.style.transition = 'opacity 0.5s ease';
            ripple.style.opacity = '0';
            setTimeout(() => { ripple.style.display = 'none'; }, 500);
        }
    }, 2000);

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link || link.target === '_blank') return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;

        const isToBudget = href.includes('orcamento');
        const isFromBudget = document.body.classList.contains('orcamento-page');

        if (isToBudget || isFromBudget) {
            e.preventDefault();
            const rect = link.getBoundingClientRect();
            // If the link has a rect, use its center, otherwise look for the button
            let cx = rect.left + rect.width / 2;
            let cy = rect.top + rect.height / 2;

            // Special treatment for the header button to ensure exact pinpoint
            if (link.closest('header')) {
                const coords = getBudgetBtnCoords();
                cx = coords.cx;
                cy = coords.cy;
            }

            expand(cx, cy, href);
        }
    });
}());
