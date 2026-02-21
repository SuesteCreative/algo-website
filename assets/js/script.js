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
});

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
