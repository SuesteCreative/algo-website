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

    document.querySelectorAll('.fade-up, .img-reveal').forEach(el => {
        observer.observe(el);
    });
});
