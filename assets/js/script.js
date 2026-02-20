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

        // Use the event to switch to image exactly when video ends
        heroVideo.addEventListener('ended', () => {
            if (heroBg) {
                heroBg.classList.add('video-ended');
            }
        });
    }

    // Mobile Drawer Logic
    const menuToggle = document.getElementById('menuToggle');
    const drawer = document.getElementById('drawer');

    if (menuToggle && drawer) {
        menuToggle.addEventListener('click', () => {
            drawer.classList.toggle('open');
            // Animate hamburger to X (optional but nice)
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });

        // Close drawer when clicking a link
        drawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                drawer.classList.remove('open');
            });
        });
    }

    document.querySelectorAll('.fade-up, .img-reveal').forEach(el => {
        observer.observe(el);
    });
});
