/**
 * Milind Wadhwa - Portfolio Interactivity Script
 */

function init() {
  initBackgroundCanvas();
  initScrollEffects();
  initIntersectionObserverReveal();
  initContactForm();
  initMobileMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/**
 * Interactive Particle Canvas Background
 */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let particles = [];
  
  // Reduce density for mobile/perf or if users prefer reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 30 : 80;
  const connectionDistance = 120;
  
  const mouse = {
    x: null,
    y: null,
    radius: 150
  };

  // Handle Mouse interaction
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 1;
      this.alpha = Math.random() * 0.5 + 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce on edges
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          // Push particles slightly away from cursor
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 0.8;
          this.y += Math.sin(angle) * force * 0.8;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.fill();
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Re-initialize particles
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Debounced resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200);
  });

  // Initial sizing
  resizeCanvas();

  // Draw node connections
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(127, 0, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    drawConnections();
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  animate();
}

/**
 * Scroll and Nav Styling
 */
function initScrollEffects() {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('.main-nav a');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    // Header class toggling
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active Navigation Highlight
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Intersection Observer scroll reveals for browsers without native view timelines
 */
function initIntersectionObserverReveal() {
  // Check for native CSS scroll timeline support
  const supportsCSSScrollTimeline = CSS.supports('animation-timeline', 'view()') && CSS.supports('animation-range', '0% 100%');
  
  if (supportsCSSScrollTimeline) {
    return; // Let CSS handle it natively for maximum performance
  }

  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        entry.target.classList.remove('reveal-hidden');
        // Stop observing once visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-hidden');
    revealObserver.observe(el);
  });
}

/**
 * Handle Contact Form submission via mailto link assembly
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name-input').value.trim();
    const subject = document.getElementById('subject-input').value.trim();
    const message = document.getElementById('message-input').value.trim();

    const recipient = 'milindw.97@gmail.com';
    const emailSubject = `${name} - ${subject}`;
    
    // Construct body text with clean formatting (only message content)
    const emailBody = message;

    // Create a programmatically clean mailto URL
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Trigger the client mail program
    window.location.href = mailtoUrl;
  });
}

/**
 * Mobile Navigation Drawer Toggle & Dismissal logic
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  const backdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.main-nav a');

  if (!toggleBtn || !nav || !backdrop) return;

  function toggleMenu() {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.classList.toggle('open');
    backdrop.classList.toggle('open');
    
    // Accessibility: toggle aria expanded state
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    
    // Prevent background layout scroll when menu is active
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    nav.classList.remove('open');
    toggleBtn.classList.remove('open');
    backdrop.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  // Bind trigger click
  toggleBtn.addEventListener('click', toggleMenu);

  // Bind backdrop overlay click (light dismiss)
  backdrop.addEventListener('click', closeMenu);

  // Auto close menu when a navigation item is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}
