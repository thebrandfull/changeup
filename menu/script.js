// Category Filtering
document.addEventListener('DOMContentLoaded', function() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    // Function to filter cards by category
    function filterByCategory(category) {
        menuCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                // Trigger animation
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.3s ease';
                }, 10);
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Initialize: Show only beef burgers on page load
    filterByCategory('beef');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter menu cards
            filterByCategory(category);

            // Scroll to top of menu content smoothly
            const menuContent = document.querySelector('.menu-content');
            const categoryNav = document.querySelector('.category-nav');
            const headerHeight = document.querySelector('.menu-header').offsetHeight;
            const navHeight = categoryNav.offsetHeight;
            const scrollPosition = menuContent.offsetTop - navHeight;

            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        });
    });

    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.card-image img').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Touch feedback for cards
    menuCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });

        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });

    // Prevent pull-to-refresh on category scroll
    const categoryContainer = document.querySelector('.category-container');
    let startY = 0;

    categoryContainer.addEventListener('touchstart', function(e) {
        startY = e.touches[0].pageY;
    });

    categoryContainer.addEventListener('touchmove', function(e) {
        const currentY = e.touches[0].pageY;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop === 0 && currentY > startY) {
            e.preventDefault();
        }
    }, { passive: false });
});
