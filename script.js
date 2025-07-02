// TypeScript-style class definitions
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})`
            });
        }
        this.animate();
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((particle, index) => {
            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                particle.vx += dx * 0.0001;
                particle.vy += dy * 0.0001;
            }
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            // Boundary checking
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            // Connect nearby particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const dist = Math.sqrt((particle.x - other.x) ** 2 + (particle.y - other.y) ** 2);
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${0.2 - dist / 600})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        requestAnimationFrame(() => this.animate());
    }
    updateMouse(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
    }
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
class RuneSystem {
    constructor() {
        this.runes = ['⚔', '🗿', '🜃', '⭐', '🌙', '☉', '⚡', '🔮'];
        this.container = document.getElementById('floatingRunes');
        this.activeRunes = [];
        this.init();
    }
    init() {
        setInterval(() => this.createRune(), 3000);
    }
    createRune() {
        if (this.activeRunes.length >= 8) return;
        const rune = document.createElement('div');
        rune.className = 'floating-rune';
        rune.textContent = this.runes[Math.floor(Math.random() * this.runes.length)];
        rune.style.left = Math.random() * 100 + '%';
        rune.style.animationDuration = (Math.random() * 10 + 10) + 's';
        rune.style.animationDelay = Math.random() * 2 + 's';
        this.container.appendChild(rune);
        this.activeRunes.push(rune);
        setTimeout(() => {
            if (rune.parentNode) {
                rune.parentNode.removeChild(rune);
                const index = this.activeRunes.indexOf(rune);
                if (index > -1) this.activeRunes.splice(index, 1);
            }
        }, 15000);
    }
}
class AnimationController {
    constructor() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }
    setupEventListeners() {
        // Parallax header effect
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.getElementById('header');
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
        // Dynamic typing effect for title
        this.typeWriter();
    }
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'sectionAppear 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    typeWriter() {
        const subtitle = document.querySelector('.subtitle');
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            if (i < originalText.length) {
                subtitle.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 100);
    }
}
// Global variables
let particleSystem;
let runeSystem;
let animationController;
// Navigation functionality
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    // Add entrance animation
    const activeSection = document.getElementById(sectionId);
    activeSection.style.animation = 'none';
    setTimeout(() => {
        activeSection.style.animation = 'sectionAppear 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }, 10);
}
// Enhanced card animations
function animateCard(card) {
    card.style.transform = 'translateY(-15px) rotateY(360deg) scale(1.05)';
    card.style.boxShadow = '0 30px 80px rgba(212, 175, 55, 0.5)';
    setTimeout(() => {
        card.style.transform = '';
        card.style.boxShadow = '';
    }, 800);
    // Particle burst effect
    createParticleBurst(card);
}
function animateBook(book) {
    book.style.transform = 'rotateX(15deg) rotateY(5deg) scale(1.1)';
    book.style.filter = 'brightness(1.2)';
    setTimeout(() => {
        book.style.transform = '';
        book.style.filter = '';
    }, 600);
}
function createParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#d4af37';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        const angle = (360 / 15) * i;
        const velocity = 150;
        const vx = Math.cos(angle * Math.PI / 180) * velocity;
        const vy = Math.sin(angle * Math.PI / 180) * velocity;
        document.body.appendChild(particle);
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
}
// Enhanced rune interactions
function setupRuneInteractions() {
    document.querySelectorAll('.rune-symbol').forEach(rune => {
        rune.addEventListener('click', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(2) rotate(1080deg)';
            this.style.textShadow = '0 0 50px #d4af37';
            // Create expanding ring effect
            const ring = document.createElement('div');
            ring.style.position = 'absolute';
            ring.style.width = '20px';
            ring.style.height = '20px';
            ring.style.border = '2px solid #d4af37';
            ring.style.borderRadius = '50%';
            ring.style.left = '50%';
            ring.style.top = '50%';
            ring.style.transform = 'translate(-50%, -50%)';
            ring.style.pointerEvents = 'none';
            this.style.position = 'relative';
            this.appendChild(ring);
            ring.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: 'translate(-50%, -50%) scale(10)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => ring.remove();
            setTimeout(() => {
                this.style.animation = '';
                this.style.transform = '';
                this.style.textShadow = '';
            }, 1500);
        });
    });
}
// Audio context for sound effects
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.setupAudio();
    }
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    playHoverSound() {
        this.playTone(800, 0.1, 'sine');
    }
    playClickSound() {
        this.playTone(400, 0.2, 'square');
    }
}
// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingOverlay').style.display = 'none';
        }, 1000);
    }, 2000);
    // Initialize systems
    const canvas = document.getElementById('particlesCanvas');
    particleSystem = new ParticleSystem(canvas);
    runeSystem = new RuneSystem();
    animationController = new AnimationController();
    const soundEffects = new SoundEffects();
    // Mouse tracking for particles
    document.addEventListener('mousemove', (e) => {
        particleSystem.updateMouse(e.clientX, e.clientY);
    });
    // Window resize handling
    window.addEventListener('resize', () => {
        particleSystem.resize();
    });
    // Enhanced button interactions
    document.querySelectorAll('.nav-btn, .game-card, .book-item').forEach(element => {
        element.addEventListener('mouseenter', () => {
            soundEffects.playHoverSound();
        });
        element.addEventListener('click', () => {
            soundEffects.playClickSound();
        });
    });
    setupRuneInteractions();
    // Scroll-triggered animations
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        document.querySelector('.header').style.transform = `translateY(${rate}px)`;
        // Parallax effect for sections
        document.querySelectorAll('.section').forEach((section, index) => {
            const rate = scrolled * -0.2 * (index + 1);
            section.style.transform = `translateY(${rate}px)`;
        });
    });
    // Random background color shifts
    setInterval(() => {
        const hue = Math.random() * 60 + 200; // Blue to purple range
        document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 100%, 5%) 0%, hsl(${hue + 20}, 80%, 15%) 50%, hsl(${hue + 40}, 60%, 25%) 100%)`;
    }, 10000);
    // Skill bar animations
    setTimeout(() => {
        document.querySelectorAll('.skill-progress').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 1000);
});
// Custom cursor trail effect
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.setupTrail();
    }
    setupTrail() {
        document.addEventListener('mousemove', (e) => {
            this.trail.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now()
            });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }
            this.updateTrail();
        });
    }
    updateTrail() {
        // Remove old trail elements
        document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
        this.trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'cursor-trail';
            trailElement.style.position = 'fixed';
            trailElement.style.left = point.x + 'px';
            trailElement.style.top = point.y + 'px';
            trailElement.style.width = '6px';
            trailElement.style.height = '6px';
            trailElement.style.background = '#d4af37';
            trailElement.style.borderRadius = '50%';
            trailElement.style.pointerEvents = 'none';
            trailElement.style.zIndex = '9998';
            trailElement.style.opacity = index / this.maxTrail;
            trailElement.style.transform = `scale(${index / this.maxTrail})`;
            document.body.appendChild(trailElement);
            setTimeout(() => {
                if (trailElement.parentNode) {
                    trailElement.remove();
                }
            }, 500);
        });
    }
}
// Initialize cursor trail
setTimeout(() => {
    new CursorTrail();
}, 1000); 