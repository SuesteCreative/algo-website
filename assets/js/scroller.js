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

        // Calculate progress within the spacer
        // progress = 0 when top is at top of viewport
        // progress = 1 when bottom is at bottom of viewport
        const totalDist = rect.height - viewHeight;
        const currentDist = -rect.top;
        const progress = Math.max(0, Math.min(1, currentDist / totalDist));

        // PHASE 1: Entrance & Blur (0% - 40% of scroll)
        // Maps 0-0.4 to 0-1 factor
        const p1 = Math.max(0, Math.min(1, progress / 0.4));

        // Translation: -100% to 0%
        const translateX = -100 + (p1 * 100);
        // Blur: 20px to 0px
        const blurVal = 20 - (p1 * 20);

        imgContainer.style.transform = `translateX(${translateX}%)`;
        imgContainer.style.filter = `blur(${blurVal}px)`;

        // PHASE 2: Highlights Reveal & Content Fade (40% - 100% of scroll)
        // Maps 0.4-1.0 to 0-1 factor
        const p2 = Math.max(0, Math.min(1, (progress - 0.4) / 0.6));

        // Reveal image overlay (highlights)
        imgOverlay.style.opacity = p2;
        imgOverlay.style.clipPath = `inset(0 ${100 - (p2 * 100)}% 0 0)`;

        // Fade in content
        content.style.opacity = p2;
        content.style.transform = `translateY(${30 - (p2 * 30)}px)`;

        requestAnimationFrame(updateAnimation);
    }

    // Optimization: Only run when section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(updateAnimation);
            }
        });
    }, { threshold: 0 });

    observer.observe(scrollerSection);
});
