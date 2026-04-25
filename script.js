(() => {
    'use strict';

    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('preloaderCounter');
    let count = 0;
    const countUp = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count >= 100) { count = 100; clearInterval(countUp); }
        if (counter) counter.textContent = count;
        if (count === 100) {
            setTimeout(() => {
                if (preloader) preloader.classList.add('done');
                document.querySelectorAll('.reveal-text').forEach(el => {
                    const d = parseFloat(el.dataset.delay) || 0;
                    setTimeout(() => el.classList.add('visible'), d * 1000);
                });
                animateCounters();
            }, 400);
        }
    }, 40);

    // --- Interactive Cursor ---
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const isMobile = window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

    if (!isMobile && cursor) {
        let mx = 0, my = 0, cx = 0, cy = 0;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        (function loop() {
            cx += (mx - cx) * 0.15;
            cy += (my - cy) * 0.15;
            if (dot) dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
            if (ring) ring.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('[data-cursor]').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.className = `cursor-${el.dataset.cursor}`);
            el.addEventListener('mouseleave', () => document.body.className = '');
        });
    }

    // --- Header scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // --- Mobile nav ---
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Scroll Reveal (IntersectionObserver) ---
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stagger = entry.target.dataset.stagger;
                if (stagger !== undefined) {
                    setTimeout(() => entry.target.classList.add('visible'), parseInt(stagger) * 150);
                } else {
                    entry.target.classList.add('visible');
                }
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => revealObs.observe(el));

    // --- Parallax on scroll ---
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!isMobile && parallaxEls.length) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const sy = window.scrollY;
                    parallaxEls.forEach(el => {
                        const speed = parseFloat(el.dataset.speed) || 0.03;
                        el.style.transform = `translate3d(0, ${sy * speed * -1}px, 0)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Counter animation ---
    function animateCounters() {
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const isDecimal = String(target).includes('.');
            const duration = 2000;
            const start = performance.now();

            function tick(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = eased * target;

                if (target >= 1000) {
                    el.textContent = (current / 1000).toFixed(1) + 'k+';
                } else if (isDecimal) {
                    el.textContent = current.toFixed(1) + suffix;
                } else {
                    el.textContent = Math.round(current) + suffix;
                }

                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    // --- Testimonial cards use CSS grid now, no JS slider needed ---

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

})();
