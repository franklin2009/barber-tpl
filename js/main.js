// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carousel functionality
class Carousel {
    constructor(element) {
        this.element = element;
        this.slides = Array.from(element.querySelectorAll('.carousel-slide'));
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        this.isTransitioning = false;
        
        if (this.totalSlides > 0) {
            this.init();
        }
    }

    init() {
        this.showSlide(0);
        this.startAutoplay();
        this.setupControls();
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.add('hidden');
            slide.style.opacity = '0';
        });

        // Show target slide
        const targetSlide = this.slides[index];
        targetSlide.classList.remove('hidden');

        // Trigger reflow
        void targetSlide.offsetWidth;

        // Animate opacity
        targetSlide.style.opacity = '1';

        this.currentSlide = index;
        
        // Update indicators
        const indicators = this.element.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('bg-warm-brown', i === index);
            indicator.classList.toggle('bg-gray-300', i !== index);
        });

        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    nextSlide() {
        if (this.isTransitioning) return;
        const next = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(next);
    }

    previousSlide() {
        if (this.isTransitioning) return;
        const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prev);
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setupControls() {
        const prevButton = this.element.querySelector('.carousel-prev');
        const nextButton = this.element.querySelector('.carousel-next');
        
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
                this.startAutoplay();
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
                this.startAutoplay();
            });
        }

        // Setup indicators
        const indicators = this.element.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (this.isTransitioning) return;
                this.showSlide(index);
                this.startAutoplay();
            });
        });

        // Pause autoplay on hover
        this.element.addEventListener('mouseenter', () => this.stopAutoplay());
        this.element.addEventListener('mouseleave', () => this.startAutoplay());

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.element.matches(':hover')) {
                if (e.key === 'ArrowLeft') {
                    this.previousSlide();
                    this.startAutoplay();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                    this.startAutoplay();
                }
            }
        });
    }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => new Carousel(carousel));
}); 