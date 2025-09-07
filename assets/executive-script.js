// Executive Portfolio - Premium Business Leadership JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeExecutivePortfolio();
});

// Main Initialization Function
function initializeExecutivePortfolio() {
    setupMobileNavigation();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupProgressBar();
    setupCounterAnimations();
    setupParallaxEffects();
    setupExecutiveContactForm();
    setupFloatingActionButton();
    setupHeaderScrollEffect();
    setupTimelineAnimations();
    setupImpactDashboard();
    setupParticleBackground();
    setupExecutiveMetrics();
}

// Mobile Navigation Setup
function setupMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = mobileMenuToggle.querySelectorAll('span');
            if (mobileMenuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close mobile menu when clicking on links
        navMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                
                // Reset hamburger animation
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Smooth Scrolling for Navigation
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(this.getAttribute('href'));
            }
        });
    });
}

// Active Navigation Update
function updateActiveNavigation(currentSection) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('section, .summary-card, .impact-card, .timeline-content, .insight-card').forEach(element => {
        element.classList.add('hidden');
        observer.observe(element);
    });
}

// Progress Bar
function setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Executive Counter Animations
function setupCounterAnimations() {
    const counters = document.querySelectorAll('.metric-number[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = current.toFixed(1);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Trigger counter animation when metrics come into view
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                metricsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => metricsObserver.observe(counter));
}

// Parallax Effects
function setupParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.particles');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Executive Contact Form
function setupExecutiveContactForm() {
    const contactForm = document.getElementById('executiveContactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const company = formData.get('company');
            const title = formData.get('title');
            const email = formData.get('email');
            const inquiry = formData.get('inquiry');
            const message = formData.get('message');
            
            // Executive-level validation
            if (!name || !company || !title || !email || !inquiry || !message) {
                showExecutiveNotification('Please complete all required fields for a professional inquiry.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showExecutiveNotification('Please enter a valid professional email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Strategic Inquiry...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showExecutiveNotification('Thank you for your strategic inquiry. I will respond within 24 hours to discuss partnership opportunities.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Executive Notification System
function showExecutiveNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `executive-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <div class="notification-text">
                <span class="notification-title">${type === 'success' ? 'Strategic Inquiry Received' : type === 'error' ? 'Validation Required' : 'Information'}</span>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add executive styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 450px;
        animation: slideInRight 0.4s ease;
        border-left: 4px solid ${type === 'success' ? '#2f855a' : type === 'error' ? '#c53030' : '#2c5aa0'};
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        notification.remove();
    }, 6000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
}

// Executive Floating Action Button
function setupFloatingActionButton() {
    const fab = document.getElementById('executiveFab');
    
    if (fab) {
        fab.addEventListener('click', () => {
            // Scroll to connect section
            const connectSection = document.querySelector('#connect');
            if (connectSection) {
                connectSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Hide/show based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                fab.style.opacity = '1';
                fab.style.visibility = 'visible';
            } else {
                fab.style.opacity = '0';
                fab.style.visibility = 'hidden';
            }
        });
    }
}

// Header Scroll Effect
function setupHeaderScrollEffect() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Timeline Animations
function setupTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.3}s`;
        item.classList.add('animate-timeline');
    });
}

// Impact Dashboard Controls
function setupImpactDashboard() {
    const controlBtns = document.querySelectorAll('.control-btn');
    
    controlBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            controlBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Simulate data change based on period
            const period = btn.getAttribute('data-period');
            updateDashboardData(period);
        });
    });
}

// Update Dashboard Data
function updateDashboardData(period) {
    const impactCards = document.querySelectorAll('.impact-card');
    
    impactCards.forEach(card => {
        // Add loading state
        card.classList.add('loading');
        
        // Simulate data update
        setTimeout(() => {
            card.classList.remove('loading');
            
            // Update metrics based on period
            const metricValue = card.querySelector('.metric-value');
            const metricChange = card.querySelector('.metric-change');
            
            if (period === 'quarterly') {
                metricValue.style.color = '#dd6b20';
                metricChange.textContent = 'Q4 2024';
            } else if (period === 'monthly') {
                metricValue.style.color = '#805ad5';
                metricChange.textContent = 'Dec 2024';
            } else {
                metricValue.style.color = '';
                metricChange.textContent = metricChange.textContent.replace(/Q4 2024|Dec 2024/, 'Annual');
            }
        }, 500);
    });
}

// Particle Background
function setupParticleBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create executive particles
    for (let i = 0; i < 25; i++) {
        createExecutiveParticle(hero);
    }
}

function createExecutiveParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'executive-particle';
    particle.style.cssText = `
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        pointer-events: none;
        animation: float-executive 8s ease-in-out infinite;
        animation-delay: ${Math.random() * 8}s;
    `;
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    container.appendChild(particle);
}

// Executive Metrics Setup
function setupExecutiveMetrics() {
    // Add hover effects to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add CSS animations
const executiveStyle = document.createElement('style');
executiveStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes float-executive {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.4;
        }
        50% {
            transform: translateY(-25px) translateX(15px);
            opacity: 0.8;
        }
    }
    
    .animate-timeline {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    .notification-content {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .notification-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .notification-title {
        font-weight: 700;
        font-size: 1rem;
    }
    
    .notification-message {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-top: 1px solid rgba(0,0,0,0.1);
    }
    
    .loading {
        opacity: 0.6;
        pointer-events: none;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid var(--accent-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .impact-card {
        position: relative;
    }
    
    .impact-card.loading {
        pointer-events: none;
    }
    
    .impact-card.loading .metric-value,
    .impact-card.loading .metric-change {
        opacity: 0.5;
    }
`;

document.head.appendChild(executiveStyle);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations and effects
}, 16)); // ~60fps

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Executive portfolio ready
console.log('🚀 Executive Portfolio - Premium Business Leadership Portfolio Loaded Successfully!');
