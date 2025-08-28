// ===== ANIMATIONS & INTERACTIONS =====

// Parallax scrolling effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed');
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Typing animation for hero title
function initTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title .name');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing after a delay
    setTimeout(typeWriter, 1000);
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isCurrency = target.includes('INR') || target.includes('Cr');
        
        let finalValue;
        if (isPercentage) {
            finalValue = parseInt(target.replace('%', ''));
        } else if (isCurrency) {
            finalValue = parseInt(target.replace(/[^\d]/g, ''));
        } else {
            finalValue = parseInt(target.replace(/[^\d]/g, ''));
        }
        
        let currentValue = 0;
        const increment = finalValue / 50;
        
        const updateCounter = () => {
            if (currentValue < finalValue) {
                currentValue += increment;
                if (isPercentage) {
                    counter.textContent = Math.floor(currentValue) + '%';
                } else if (isCurrency) {
                    counter.textContent = 'INR ' + Math.floor(currentValue) + ' Cr+';
                } else {
                    counter.textContent = Math.floor(currentValue) + '+';
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Floating elements animation
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-card');
    
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
        element.style.animationDuration = `${3 + index * 0.5}s`;
    });
}

// Smooth reveal animations
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Hover effects for interactive elements
function initHoverEffects() {
    const interactiveElements = document.querySelectorAll('.btn, .timeline-item, .project-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Gradient background animation
function initGradientAnimation() {
    const gradientBg = document.querySelector('.gradient-bg');
    if (!gradientBg) return;
    
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        gradientBg.style.background = `linear-gradient(135deg, 
            hsl(${hue}, 70%, 60%), 
            hsl(${(hue + 60) % 360}, 70%, 50%), 
            hsl(${(hue + 120) % 360}, 70%, 40%))`;
    }, 50);
}

// Particle background effect
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initTypingAnimation();
    animateCounters();
    initFloatingElements();
    initRevealAnimations();
    initHoverEffects();
    initGradientAnimation();
    initParticleBackground();
});

// Export functions for external use
window.WebumeAnimations = {
    initParallax,
    initTypingAnimation,
    animateCounters,
    initFloatingElements,
    initRevealAnimations,
    initHoverEffects,
    initGradientAnimation,
    initParticleBackground
};
