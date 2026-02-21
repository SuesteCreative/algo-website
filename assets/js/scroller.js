/**
 * Scroller Narrative Animation Logic
 * Clean, high-performance scroll mapping for Algo Atelier
 */

document.addEventListener('DOMContentLoaded', () => {
    const scrollerSection = document.getElementById('scroller-narrative');
    if (!scrollerSection) return;

    const spacer = scrollerSection.querySelector('.scroller-spacer');
    const imgContainer = scrollerSection.querySelector('.scroller-img-container');
    const imgOverlay = scrollerSection.querySelector('.img-overlay');
    const content = scrollerSection.querySelector('.scroller-content');

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function updateAnimation() {
        const rect = spacer.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 991;

        // Calculate progress within the spacer
        const totalDist = rect.height - viewHeight;
        const currentDist = -rect.top;
        let progress = Math.max(0, Math.min(1, currentDist / totalDist));

        // ADJUSTMENT 1: Mobile Offset (Delay start)
        if (isMobile) {
            // Start at 15% scroll depth, then map 0.15-1.0 to 0.0-1.0
            const mobileOffset = 0.15;
            progress = Math.max(0, (progress - mobileOffset) / (1 - mobileOffset));
        }

        // ADJUSTMENT 2: Final Plateau (Hold state)
        // Animation ends at 85% of progress, remaining 15% is "hold"
        const animEnd = 0.85;
        const pMapped = Math.max(0, Math.min(1, progress / animEnd));

        // PHASE 1: Entrance & Blur (0% - 40% of mapped scroll)
        const p1 = Math.max(0, Math.min(1, pMapped / 0.4));

        const translateX = -100 + (p1 * 100);
        const blurVal = 20 - (p1 * 20);

        imgContainer.style.transform = `translateX(${translateX}%)`;
        imgContainer.style.filter = `blur(${blurVal}px)`;

        // PHASE 2: Highlights Reveal & Content Fade (40% - 100% of mapped scroll)
        const p2 = Math.max(0, Math.min(1, (pMapped - 0.4) / 0.6));

        imgOverlay.style.opacity = p2;
        imgOverlay.style.clipPath = `inset(0 ${100 - (p2 * 100)}% 0 0)`;

        content.style.opacity = p2;
        content.style.transform = `translateY(${30 - (p2 * 30)}px)`;

        requestAnimationFrame(updateAnimation);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(updateAnimation);
            }
        });
    }, { threshold: 0 });

    observer.observe(scrollerSection);
});
