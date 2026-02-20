document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Animating Elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Watch for fades and image wrappers
    document.querySelectorAll('.fade-in, .img-wrapper, .reveal-container').forEach(el => {
        observer.observe(el);
    });

    // Custom Mouse Interaction (Subtle Parallax on Hero)
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPos = (clientX / window.innerWidth - 0.5) * 20;
            const yPos = (clientY / window.innerHeight - 0.5) * 20;
            const title = hero.querySelector('.hero-title');
            if (title) {
                title.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            }
        });
    }

    // Refresh observer on dynamic content (if any)
});
