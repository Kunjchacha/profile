// ===== MAIN JAVASCRIPT FILE =====

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupThemeToggle();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupMobileMenu();
    setupContactLinks();
    setupPerformanceOptimizations();
}

// ===== NAVIGATION =====

function setupNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== THEME TOGGLE =====

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(icon, savedTheme);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
        
        // Add transition effect
        body.classList.add('theme-transitioning');
        setTimeout(() => {
            body.classList.remove('theme-transitioning');
        }, 300);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// ===== SMOOTH SCROLLING =====

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
    
    // Timeline animations
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        observer.observe(item);
        item.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Project card animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        observer.observe(card);
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Skill tag animations
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        observer.observe(tag);
        tag.style.animationDelay = `${index * 0.05}s`;
    });
}

// ===== MOBILE MENU =====

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===== CONTACT LINKS =====

function setupContactLinks() {
    // Email link
    const emailLink = document.querySelector('.contact-item[href*="mailto"]');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'kunjnikhilchacha@gmail.com';
            const subject = 'Inquiry from Webume Portfolio';
            const body = 'Hello Kunj,\n\nI came across your portfolio and would like to connect...';
            
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
    
    // Phone link
    const phoneLink = document.querySelector('.contact-item[href*="tel"]');
    if (phoneLink) {
        phoneLink.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = '+917304042382';
            window.location.href = `tel:${phone}`;
        });
    }
    
    // LinkedIn link
    const linkedinLink = document.querySelector('.contact-item[href*="linkedin"]');
    if (linkedinLink) {
        linkedinLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://www.linkedin.com/in/kunjchacha', '_blank');
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

function setupPerformanceOptimizations() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            // Perform scroll-based operations
        }, 16); // ~60fps
    });
    
    // Preload critical resources
    preloadCriticalResources();
}

function preloadCriticalResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600&display=swap'
    ];
    
    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

// ===== UTILITY FUNCTIONS =====

// Debounce function
function debounce(func, wait) {
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

// Throttle function
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
    };
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Animate counter
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(start));
        }
    }, 16);
}

// ===== ANALYTICS & TRACKING =====

function trackEvent(eventName, properties = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Custom analytics
    console.log('Event tracked:', eventName, properties);
}

// Track page views
function trackPageView() {
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

// Track interactions
function setupEventTracking() {
    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('button_click', {
                button_text: btn.textContent.trim(),
                button_location: btn.closest('section')?.id || 'unknown'
            });
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('navigation_click', {
                link_text: link.textContent.trim(),
                link_href: link.getAttribute('href')
            });
        });
    });
    
    // Track theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        trackEvent('theme_toggle', {
            theme: currentTheme === 'dark' ? 'light' : 'dark'
        });
    });
}

// ===== ERROR HANDLING =====

function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        trackEvent('error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno
        });
    });
    
    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        trackEvent('promise_rejection', {
            reason: e.reason
        });
    });
}

// ===== INITIALIZATION =====

// Initialize tracking
setupEventTracking();
setupErrorHandling();

// Track initial page view
trackPageView();

// Export functions for external use
window.WebumeApp = {
    trackEvent,
    animateCounter,
    formatNumber,
    debounce,
    throttle
};
