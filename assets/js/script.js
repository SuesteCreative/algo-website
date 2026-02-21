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

    document.querySelectorAll('.fade-up, .img-reveal, .reveal-image, section:not(.hero)').forEach(el => {
        observer.observe(el);
    });
});
