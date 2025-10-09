document.addEventListener('DOMContentLoaded', function() {

    // ========== NAVIGATION ==========

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-menu a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========== SMOOTH SCROLL ==========

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ========== MENU TABS ==========

    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCards = document.querySelectorAll('.menu-card');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Get selected category
            const category = this.getAttribute('data-category');

            // Filter menu cards
            menuCards.forEach(card => {
                if (category === 'all') {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    if (card.getAttribute('data-category') === category) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 300);
                    }
                }
            });
        });
    });

    // ========== BACK TO TOP BUTTON ==========

    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        // Show/hide back to top button
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== SCROLL ANIMATIONS ==========

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections
    const sections = document.querySelectorAll('.about-section, .menu-section, .order-section, .locations-section, .footer');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe menu cards
    menuCards.forEach(card => {
        observer.observe(card);
    });

    // ========== LAZY LOADING IMAGES ==========

    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // ========== PERFORMANCE OPTIMIZATION ==========

    // Debounce function for scroll events
    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Apply debounce to scroll-intensive operations
    window.addEventListener('scroll', debounce(function() {
        // Any additional scroll-based operations can go here
    }, 10));

    // ========== ACCESSIBILITY ==========

    // Keyboard navigation for menu tabs
    menuTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextTab = menuTabs[index + 1] || menuTabs[0];
                nextTab.focus();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevTab = menuTabs[index - 1] || menuTabs[menuTabs.length - 1];
                prevTab.focus();
            }
        });
    });

    // ========== STATS COUNTER ANIMATION ==========

    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    function animateValue(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasSlash = text.includes('/');

        if (hasSlash) {
            // Handle rating format like "4.8/5"
            return;
        }

        const value = parseInt(text.replace(/[^0-9]/g, ''));
        const duration = 2000;
        const stepTime = 50;
        const steps = duration / stepTime;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                element.textContent = value.toLocaleString() + (hasPlus ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + (hasPlus ? '+' : '');
            }
        }, stepTime);
    }

    // ========== CONSOLE MESSAGE ==========

    console.log('%c Change Up Qatar ', 'background: #00dfdd; color: white; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Served with a Smile! ', 'background: white; color: #00dfdd; font-size: 16px; font-weight: bold; padding: 8px;');

});