window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Hero Video Logic
    const heroVideo = document.getElementById('heroVideo');
    const heroBg = document.getElementById('heroBg');

    if (heroVideo) {
        // Attempt to autoplay
        heroVideo.play().catch(error => {
            console.log("Autoplay blocked or video missing:", error);
            if (heroBg) heroBg.classList.add('video-ended');
        });

        // Specific requirement: stop at 9 seconds and show image
        const handleVideoEnd = () => {
            if (heroBg && !heroBg.classList.contains('video-ended')) {
                heroVideo.pause();
                heroVideo.currentTime = 9; // Snap to 9s to be sure
                heroBg.classList.add('video-ended');
            }
        };

        heroVideo.addEventListener('timeupdate', () => {
            // If it goes beyond 9s, stop it immediately
            if (heroVideo.currentTime >= 9) {
                handleVideoEnd();
            }
        });

        heroVideo.addEventListener('ended', handleVideoEnd);
    }

    // Mobile Drawer Logic
    const menuToggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('drawer');
    const body = document.body;

    if (menuToggle && drawer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = drawer.classList.toggle('open');
            body.classList.toggle('drawer-open', isOpen);

            // Animate hamburger to X
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active', isOpen));
        });

        // Close drawer when clicking a link
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('open');
                body.classList.remove('drawer-open');
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });
    }

    document.querySelectorAll('.fade-up, .img-reveal, .reveal-image, section:not(.hero), .reveal-left, .reveal-right').forEach(el => {
        observer.observe(el);
    });

    /* ── Transição circular ao clicar em "Pedir Orçamento" ────────
       Cria um ripple overlay preto que expande e depois navega.
       Só ativo fora da página /orcamento/ (que tem a sua própria lógica).
    */
    if (!document.body.classList.contains('orcamento-page')) {
        const _ov = document.createElement('div');
        _ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;overflow:hidden;';
        const _ball = document.createElement('div');
        _ball.style.cssText = 'position:absolute;width:0;height:0;border-radius:50%;background:#0e0e0e;transform:translate(-50%,-50%);';
        _ov.appendChild(_ball);
        document.body.appendChild(_ov);

        function _orcExpand(cx, cy, href) {
            var r = Math.sqrt(Math.pow(window.innerWidth,2)+Math.pow(window.innerHeight,2));
            _ball.style.transition = 'none';
            _ball.style.width = '0px'; _ball.style.height = '0px';
            _ball.style.left = cx+'px'; _ball.style.top = cy+'px';
            _ball.getBoundingClientRect();
            _ball.style.transition = 'width 620ms cubic-bezier(0.4,0,0.2,1),height 620ms cubic-bezier(0.4,0,0.2,1)';
            _ball.style.width = (r*2)+'px'; _ball.style.height = (r*2)+'px';
            setTimeout(function(){ window.location.href = href; }, 620);
        }

        document.querySelectorAll('a.btn-budget, a[href="/orcamento/"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (!href || !href.includes('orcamento')) return;
                e.preventDefault();
                var rect = this.getBoundingClientRect();
                _orcExpand(rect.left+rect.width/2, rect.top+rect.height/2, href);
            });
        });
    }
});

/* ── Transição circular Pedir Orcamento ── */
(function() {
    const DURATION = 620;
    function getRipple() {
        let ov = document.getElementById('orcamento-transition-overlay');
        if (!ov) {
            ov = document.createElement('div');
            ov.id = 'orcamento-transition-overlay';
            ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;pointer-events:none;overflow:hidden;';
            const ball = document.createElement('div');
            ball.id = 'orcamento-transition-ball';
            ball.style.cssText = 'position:absolute;width:0;height:0;border-radius:50%;background:#0e0e0e;transform:translate(-50%,-50%);transition:none;';
            ov.appendChild(ball);
            document.body.appendChild(ov);
        }
        return { ov, ball: ov.firstChild };
    }

    function expand(cx, cy, href) {
        const { ball } = getRipple();
        const r = Math.sqrt(Math.pow(window.innerWidth,2)+Math.pow(window.innerHeight,2));
        ball.style.transition = 'none'; ball.style.width = '0px'; ball.style.height = '0px';
        ball.style.left = cx+'px'; ball.style.top = cy+'px'; ball.style.opacity = '1';
        ball.getBoundingClientRect();
        ball.style.transition = `width ${DURATION}ms cubic-bezier(0.4,0,0.2,1), height ${DURATION}ms cubic-bezier(0.4,0,0.2,1)`;
        ball.style.width = (r*2)+'px'; ball.style.height = (r*2)+'px';
        setTimeout(() => { if(href) window.location.href = href; }, DURATION);
    }

    function collapse(cx, cy) {
        const { ball } = getRipple();
        const r = Math.sqrt(Math.pow(window.innerWidth,2)+Math.pow(window.innerHeight,2));
        ball.style.transition = 'none'; ball.style.width = (r*2)+'px'; ball.style.height = (r*2)+'px';
        ball.style.left = cx+'px'; ball.style.top = cy+'px'; ball.style.opacity = '1';
        ball.getBoundingClientRect();
        ball.style.transition = `width ${DURATION}ms cubic-bezier(0.4,0,0.2,1), height ${DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity 0.1s ${DURATION-80}ms`;
        ball.style.width = '0px'; ball.style.height = '0px'; ball.style.opacity = '0';
    }

    // Se viermos da página de orçamento, colapsamos a bola
    if (document.referrer.includes('orcamento') && !document.body.classList.contains('orcamento-page')) {
        window.addEventListener('load', () => {
            collapse(window.innerWidth/2, window.innerHeight/2);
        });
    }

    // Ao clicar em links de orçamento
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link || link.target === '_blank') return;
        const href = link.getAttribute('href');
        if (href && href.includes('orcamento') && !document.body.classList.contains('orcamento-page')) {
            e.preventDefault();
            const rect = link.getBoundingClientRect();
            expand(rect.left + rect.width/2, rect.top + rect.height/2, href);
        }
    });
}());

/* ── Proximity Scroll Snap (Desktop Only) ──
   Fires after user stops scrolling (~150ms debounce).
   Finds the nearest snap-section and gently scrolls to it,
   but only if the section is within 30% of the viewport.
   Skips: mobile, reduced-motion, and sections already visible. */
(function initScrollSnap() {
    if (window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const HEADER_HEIGHT = 80;    // px — compensates fixed header
    const SNAP_THRESHOLD = 0.30; // 30% of viewport — max distance to trigger snap
    let scrollTimer = null;
    let isSnapping = false;

    function getNearestSection() {
        const sections = document.querySelectorAll('.snap-section');
        const viewportH = window.innerHeight;
        const scrollY = window.scrollY;
        let best = null;
        let bestDist = Infinity;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Distance of section top from ideal position (just below header)
            const sectionTop = rect.top - HEADER_HEIGHT;
            const absDist = Math.abs(sectionTop);

            // Only consider sections within threshold
            if (absDist < viewportH * SNAP_THRESHOLD && absDist < bestDist) {
                bestDist = absDist;
                best = section;
            }
        });

        return best;
    }

    function snapToSection(section) {
        if (!section || isSnapping) return;
        isSnapping = true;

        const targetY = window.scrollY + section.getBoundingClientRect().top - HEADER_HEIGHT;
        window.scrollTo({ top: targetY, behavior: 'smooth' });

        // Release snapping lock after animation
        setTimeout(() => { isSnapping = false; }, 600);
    }

    window.addEventListener('scroll', () => {
        if (isSnapping) return;
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const target = getNearestSection();
            snapToSection(target);
        }, 150); // wait for scroll to settle
    }, { passive: true });

    // Re-init on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth < 1024) {
            clearTimeout(scrollTimer);
        }
    });
}());
