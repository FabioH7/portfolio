// ============================================
// Smooth Scrolling Navigation
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }

    // ============================================
    // Active Navigation Highlighting
    // ============================================

    const sections = document.querySelectorAll('.section, #hero');
    const navbar = document.getElementById('navbar');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Handle hero section
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#hero') {
                    link.classList.add('active');
                }
            });
        }

        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(8, 12, 18, 0.85)';
        } else {
            navbar.style.background = 'transparent';
        }
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call

    // ============================================
    // Scroll-triggered Animations
    // ============================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements that should animate on scroll
    const animateElements = document.querySelectorAll(
        '.glass-card, .skill-card, .timeline-item, .project-card, .about-text, .contact-info, .contact-form'
    );

    animateElements.forEach(element => {
        element.classList.add('fade-in-up');
        observer.observe(element);
    });

    // ============================================
    // Contact Form Validation and Submission
    // ============================================

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Reset message
            formMessage.className = 'form-message';
            formMessage.textContent = '';

            // Validation
            if (!name || !email || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Check if Formspree is configured
            const formAction = contactForm.getAttribute('action');
            if (!formAction || formAction.includes('YOUR_FORM_ID')) {
                showFormMessage('Form is not configured. Please set up Formspree or another form service.', 'error');
                return;
            }

            // Disable submit button
            const submitButton = contactForm.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {
                // Submit to Formspree
                const formData = new FormData(contactForm);
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        showFormMessage(data.errors.map(error => error.message).join(', '), 'error');
                    } else {
                        showFormMessage('Something went wrong. Please try again later.', 'error');
                    }
                }
            } catch (error) {
                showFormMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Re-enable submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }

    // ============================================
    // Parallax Effect for Hero Background
    // ============================================

    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }

    // ============================================
    // Smooth Page Load Animation
    // ============================================

    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ============================================
    // Keyboard Navigation Support
    // ============================================

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
            // Close image modal on Escape
            const modal = document.getElementById('imageModal');
            if (modal && modal.classList.contains('active')) {
                closeImageModal();
            }
        }
        
        // Navigate modal with arrow keys
        const modal = document.getElementById('imageModal');
        if (modal && modal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                changeModalSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeModalSlide(1);
            }
        }
    });

    // ============================================
    // Performance Optimization: Throttle Scroll Events
    // ============================================

    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply throttling to scroll events
    const throttledUpdateNav = throttle(updateActiveNav, 100);
    window.addEventListener('scroll', throttledUpdateNav);

    // ============================================
    // Carousel Auto-play
    // ============================================

    function setupCarouselAutoPlay(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        if (slides.length <= 1) return; // Don't auto-play single image carousels
        
        const carouselContainer = carousel.closest('.project-carousel-container');
        let autoPlayInterval;
        let isPaused = false;
        
        // Initialize carousel state
        carouselStates[carouselId] = 0;
        
        function startAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(() => {
                if (!isPaused) {
                    const currentSlide = carouselStates[carouselId] || 0;
                    const nextSlide = (currentSlide + 1) % slides.length;
                    carouselStates[carouselId] = nextSlide;
                    updateCarousel(carouselId, nextSlide);
                }
            }, 5000); // Change slide every 5 seconds
        }

        // Pause on hover
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        }

        // Start auto-play
        startAutoPlay();
    }

    // Setup auto-play for all carousels
    setupCarouselAutoPlay('eventaCarousel');
    setupCarouselAutoPlay('playpalCarousel');
    // Pirro has only one image, so no auto-play needed
});

// ============================================
// Carousel Functions
// ============================================

// Store current slide index for each carousel
const carouselStates = {};

function changeSlide(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    let currentIndex = carouselStates[carouselId] !== undefined 
        ? carouselStates[carouselId] 
        : Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    currentIndex += direction;
    
    if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    } else if (currentIndex >= slides.length) {
        currentIndex = 0;
    }
    
    carouselStates[carouselId] = currentIndex;
    updateCarousel(carouselId, currentIndex);
}

function goToSlide(carouselId, index) {
    carouselStates[carouselId] = index;
    updateCarousel(carouselId, index);
}

function updateCarousel(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.carousel-slide');
    const container = carousel.closest('.project-carousel-container');
    const indicators = container ? container.querySelectorAll('.indicator') : [];
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// ============================================
// Image Modal Functions
// ============================================

const projectImages = {
    eventa: [
        { src: 'images/eventa/eventa-home.png', alt: 'Eventa Home Page' },
        { src: 'images/eventa/eventa-event.png', alt: 'Eventa Event Page' },
        { src: 'images/eventa/eventa-order-summary.png', alt: 'Eventa Order Summary' },
        { src: 'images/eventa/eventa-payment.png', alt: 'Eventa Payment Page' }
    ],
    playpal: [
        { src: 'images/playpal/playpal-mobile.PNG', alt: 'PlayPal Mobile App' },
        { src: 'images/playpal/playpal-friends.PNG', alt: 'PlayPal Friends' },
        { src: 'images/playpal/playpal-league.png', alt: 'PlayPal League' },
        { src: 'images/playpal/playpal-rewards.PNG', alt: 'PlayPal Rewards' },
        { src: 'images/playpal/playpal-admin.png', alt: 'PlayPal Admin Panel' }
    ],
    pirro: [
        { src: 'images/pirro/pirro.png', alt: 'Pirro Jewelry Store' }
    ]
};

const projectCarousels = {
    eventa: 'eventaCarousel',
    playpal: 'playpalCarousel',
    pirro: 'pirroCarousel'
};

let currentModalIndex = 0;
let currentProject = 'eventa';

function openImageModal(imageSrc, imageAlt, index, project) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalIndicators = document.getElementById('modalIndicators');
    
    if (!modal || !modalImage) return;
    
    currentProject = project || 'eventa';
    currentModalIndex = index;
    const images = projectImages[currentProject];
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modalCaption.textContent = imageAlt;
    
    // Update indicators
    modalIndicators.innerHTML = '';
    images.forEach((img, i) => {
        const indicator = document.createElement('span');
        indicator.className = `modal-indicator ${i === index ? 'active' : ''}`;
        indicator.onclick = () => goToModalSlide(i);
        modalIndicators.appendChild(indicator);
    });
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Update carousel state
    const carouselId = projectCarousels[currentProject];
    if (carouselId) {
        carouselStates[carouselId] = index;
        updateCarousel(carouselId, index);
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function changeModalSlide(direction) {
    const images = projectImages[currentProject];
    if (!images || images.length === 0) return;
    
    currentModalIndex += direction;
    
    if (currentModalIndex < 0) {
        currentModalIndex = images.length - 1;
    } else if (currentModalIndex >= images.length) {
        currentModalIndex = 0;
    }
    
    goToModalSlide(currentModalIndex);
}

function goToModalSlide(index) {
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalIndicators = document.getElementById('modalIndicators');
    const images = projectImages[currentProject];
    
    if (!modalImage || !images || images.length === 0) return;
    
    currentModalIndex = index;
    const image = images[index];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalCaption.textContent = image.alt;
    
    // Update indicators
    if (modalIndicators) {
        const indicators = modalIndicators.querySelectorAll('.modal-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    // Update carousel state
    const carouselId = projectCarousels[currentProject];
    if (carouselId) {
        carouselStates[carouselId] = index;
        updateCarousel(carouselId, index);
    }
}

