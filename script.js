/**
 * Pol Reig Plazas — Portfolio Scripts
 * Handles mobile navigation, custom cursor, magnetic buttons,
 * scroll-triggered reveals, and section highlighting.
 */

(function() {
    'use strict';

    // Detect touch device
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    // ——— Custom Cursor ———
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');

    if (!isTouchDevice && cursor && cursorFollower) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        let isMouseActive = false;
        let mouseTimeout;
        let rafId = null;

        function animateCursor() {
            if (!isMouseActive) {
                rafId = null;
                return;
            }

            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;

            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;

            rafId = requestAnimationFrame(animateCursor);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isMouseActive) {
                isMouseActive = true;
                if (!rafId) {
                    rafId = requestAnimationFrame(animateCursor);
                }
            }

            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                isMouseActive = false;
            }, 100);
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .btn, .tag, .about-card, .contribution-card, .contact-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('is-hovering');
                cursorFollower.classList.add('is-hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('is-hovering');
                cursorFollower.classList.remove('is-hovering');
            });
        });
    }

    // ——— Magnetic Buttons ———
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    if (!isTouchDevice) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ——— Mobile Menu Toggle ———
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    const menuBackdrop = document.getElementById('menuBackdrop');

    if (menuToggle && headerNav) {
        function openMenu() {
            menuToggle.classList.add('is-active');
            menuToggle.setAttribute('aria-expanded', 'true');
            headerNav.classList.add('is-open');
            headerNav.setAttribute('aria-hidden', 'false');
            if (menuBackdrop) menuBackdrop.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('is-active');
            menuToggle.setAttribute('aria-expanded', 'false');
            headerNav.classList.remove('is-open');
            headerNav.setAttribute('aria-hidden', 'true');
            if (menuBackdrop) menuBackdrop.classList.remove('is-visible');
            document.body.style.overflow = '';
        }

        menuToggle.addEventListener('click', () => {
            if (headerNav.classList.contains('is-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (menuBackdrop) {
            menuBackdrop.addEventListener('click', closeMenu);
        }

        // Close menu when clicking a link
        headerNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && headerNav.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // ——— Scroll-Triggered Reveals ———
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
    const sectionNumbers = document.querySelectorAll('.section-number');
    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionLines = document.querySelectorAll('.section-line');
    const skillBlocks = document.querySelectorAll('.skill-block');
    const staggerContainers = document.querySelectorAll('.stagger-children');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.05
        });

        revealElements.forEach(el => revealObserver.observe(el));
        staggerContainers.forEach(el => revealObserver.observe(el));

        // Section header animations
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    headerObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -30px 0px',
            threshold: 0.1
        });

        sectionNumbers.forEach(el => headerObserver.observe(el));
        sectionTitles.forEach(el => headerObserver.observe(el));
        sectionLines.forEach(el => headerObserver.observe(el));
        skillBlocks.forEach(el => headerObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('is-visible'));
        staggerContainers.forEach(el => el.classList.add('is-visible'));
        sectionNumbers.forEach(el => el.classList.add('is-visible'));
        sectionTitles.forEach(el => el.classList.add('is-visible'));
        sectionLines.forEach(el => el.classList.add('is-visible'));
        skillBlocks.forEach(el => el.classList.add('is-visible'));
    }

    // ——— Hero Entrance Animation ———
    const hero = document.querySelector('.hero');
    if (hero) {
        // Trigger after a brief delay to ensure CSS is ready
        setTimeout(() => {
            hero.classList.add('is-loaded');
        }, 100);
    }

    // ——— Header background on scroll ———
    let ticking = false;
    const siteHeader = document.getElementById('siteHeader');

    function updateHeader() {
        if (siteHeader) {
            if (window.scrollY > 50) {
                siteHeader.classList.add('is-scrolled');
            } else {
                siteHeader.classList.remove('is-scrolled');
            }
        }
        ticking = false;
    }

    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ——— Active Section Highlighting in Sidebar ———
    const sections = document.querySelectorAll('.section, .hero');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (sidebarLinks.length && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    sidebarLinks.forEach(link => {
                        const href = link.getAttribute('href').replace('#', '');
                        if (href === id) {
                            link.classList.add('is-active');
                        } else {
                            link.classList.remove('is-active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: 0
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ——— Smooth Scroll Polyfill Enhancement ———
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = window.innerWidth < 1024 ? 70 : 0;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ——— Parallax effect for hero illustration ———
    if (!isTouchDevice && window.innerWidth >= 1024) {
        const heroIllustration = document.querySelector('.hero-illustration');
        if (heroIllustration) {
            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    const heroRect = heroSection.getBoundingClientRect();
                    if (heroRect.bottom > 0) {
                        heroIllustration.style.transform = `translateY(calc(-50% + ${scrollY * 0.1}px))`;
                    }
                }
            }, { passive: true });
        }
    }

    // ——— Subtle 3D Tilt on Cards (desktop only) ———
    if (!isTouchDevice) {
        const tiltCards = document.querySelectorAll('.about-card, .contact-card, .contribution-card');
        
        tiltCards.forEach(card => {
            const isContact = card.classList.contains('contact-card');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -2;
                const rotateY = (x - centerX) / centerX * 2;
                const translateX = isContact ? 6 : 0;
                const translateY = isContact ? -6 : -4;
                
                card.style.transition = 'transform 0.1s ease-out';
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = '';
            });
        });
    }
})();
