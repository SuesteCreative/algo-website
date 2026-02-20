document.addEventListener('DOMContentLoaded', () => {
    // Reveal Observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.querySelector('.mask-overlay')) {
                    entry.target.querySelector('.mask-overlay').classList.add('active');
                }
                // observer.unobserve(entry.target); // Keep observing for re-entry animations if desired
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .img-reveal-wrapper').forEach(el => {
        revealObserver.observe(el);
    });

    // Hero Animation (Staggered Lines)
    setTimeout(() => {
        document.querySelectorAll('.hero-title .line').forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.parallax').forEach(el => {
            const speed = el.dataset.speed || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});
