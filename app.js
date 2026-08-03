/**
 * Milind Wadhwa - Personal Portfolio Script
 * Creative Floating Island Capsule Dock, fast typewriter, steady timeline, and mail composer.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothAnchorScroll();
  initNavbarScroll();
  initMobileNav();
  initTypewriter();
  initContactForm();
  initActiveNavSpy();
  initTimelineScrollObserver();
  initInteractiveConfetti();
  initLiveClock();
  initBackToTopRocket();
  initBlogFilterAndSearch();
  initSeamlessViewSwitcher();
});

/**
 * Global smooth anchor scroll — intercepts ALL in-page # link clicks on the page
 * and uses scrollIntoView so mobile browsers don't snap-jump then rebound.
 * Works for hero CTAs, footer links, anywhere — not just the navbar.
 */
function initSmoothAnchorScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    // Let the mobile nav handler deal with links inside the dock (it does extra menu-close logic)
    if (link.closest('#floating-dock')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/**
 * Handle Floating Dock background and elevation on scroll
 */
function initNavbarScroll() {
  const dock = document.getElementById('floating-dock');
  if (!dock) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      dock.classList.add('scrolled');
    } else {
      dock.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Menu Toggle & Backdrop Dismissal
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-links');
  const backdrop = document.getElementById('nav-backdrop');
  const links = document.querySelectorAll('.dock-link');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  // Cover all in-page anchor links inside the dock: nav links + Say Hi CTA
  const allAnchorLinks = document.querySelectorAll('.dock-link, .dock-cta-btn');

  function handleAnchorClick(e, link) {
    const href = link.getAttribute('href');
    const isAnchor = href && href.startsWith('#');

    if (isAnchor) {
      e.preventDefault();

      // 1. Unlock scroll first — before scrollIntoView
      document.body.style.overflow = '';

      // 2. Close menu UI
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');

      // 3. Scroll on next frame after overflow is fully released
      const target = document.querySelector(href);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } else {
      closeMenu();
    }
  }

  allAnchorLinks.forEach(link => {
    link.addEventListener('click', (e) => handleAnchorClick(e, link));
  });
}

/**
 * Fast Rotating Typewriter Animation with full stops & 1s delay
 */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'GenAI Engineer.',
    'Voice AI Architect.',
    'Backend Craftsman.',
    'Systems Developer.',
    'Agentic AI Builder.'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 55;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      const nextText = currentWord.substring(0, charIndex - 1);
      el.textContent = nextText.length > 0 ? nextText : '\u00A0';
      charIndex--;
      speed = 28; // Rapid backspacing
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      speed = 55; // Fast typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1000; // Exactly 1 second delay before backspacing
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 250; // Brief pause before typing next word
    }

    setTimeout(type, speed);
  }

  type();
}

/**
 * Active navigation spy to highlight current section & sync Mode Switcher
 */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('header#top, section');
  const navLinks = document.querySelectorAll('.dock-link');

  if (!sections.length || !navLinks.length) return;

  const spyScroll = () => {
    let currentId = '';
    const scrollPos = window.scrollY + 220;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id') || '';
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', spyScroll, { passive: true });
  spyScroll();
}

/**
 * Smooth fade-in observer for timeline milestones (steady in place, zero jerk)
 */
function initTimelineScrollObserver() {
  const milestones = document.querySelectorAll('.timeline-milestone');
  if (!milestones.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  milestones.forEach((m, idx) => {
    m.style.opacity = '0';
    m.style.transition = `opacity 0.5s ease ${idx * 0.08}s`;
    observer.observe(m);
  });
}

/**
 * Creative celebratory micro-confetti burst when clicking contact button, avatar, or Say Hi CTA
 */
function initInteractiveConfetti() {
  const targetButtons = [
    document.getElementById('hero-contact-btn'),
    document.querySelector('.dock-cta-btn'),
    document.querySelector('.profile-pic-container')
  ];

  targetButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      createSparkleBurst(e.clientX, e.clientY);
    });
  });
}

function createSparkleBurst(x, y) {
  const colors = ['#FFE15D', '#11999E', '#66BFBF', '#3B82F6', '#10B981', '#EC4899'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count;
    const velocity = 40 + Math.random() * 60;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 6;

    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.transition = 'all 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    particle.style.opacity = '1';

    document.body.appendChild(particle);

    requestAnimationFrame(() => {
      const destX = x + Math.cos(angle) * velocity;
      const destY = y + Math.sin(angle) * velocity + 20;
      particle.style.transform = `translate(${destX - x}px, ${destY - y}px) scale(0)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => {
      particle.remove();
    }, 750);
  }
}

/**
 * Contact Form mailto link builder
 * Subject format: "[Name] - [Subject]"
 * Body: Raw message content
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name-input')?.value.trim() || '';
    const subject = document.getElementById('subject-input')?.value.trim() || '';
    const message = document.getElementById('message-input')?.value.trim() || '';

    const recipient = 'milindw.97@gmail.com';
    const emailSubject = `${name} - ${subject}`;
    const emailBody = message;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
  });
}

/**
 * Real-time Indian Standard Time (IST) clock for footer status widget
 */
function initLiveClock() {
  const clockEl = document.getElementById('live-local-time');
  if (!clockEl) return;

  const updateClock = () => {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = now.toLocaleTimeString('en-US', options);
      clockEl.textContent = `${timeStr} IST`;
    } catch (err) {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}:${s} IST`;
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Smooth Rocket Back-to-Top with mini sparkle
 */
function initBackToTopRocket() {
  const btn = document.getElementById('footer-back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const rect = btn.getBoundingClientRect();
    if (typeof triggerMiniSparkle === 'function') {
      triggerMiniSparkle(rect.left + rect.width / 2, rect.top);
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Blog Filter & Keyword Search
 */
function initBlogFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.tag-filter-btn');
  const searchInput = document.getElementById('blog-search-input');
  const articlesGrid = document.getElementById('blog-articles-grid');
  const noResultsMsg = document.getElementById('no-articles-found');

  if (!articlesGrid) return;

  const cards = Array.from(articlesGrid.querySelectorAll('.blog-card'));
  let activeTag = 'all';
  let searchTerm = '';

  const applyFilters = () => {
    let visibleCount = 0;

    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const excerpt = (card.querySelector('.blog-card-excerpt')?.textContent || '').toLowerCase();

      const matchesTag = activeTag === 'all' || tags.includes(activeTag.toLowerCase());
      const matchesSearch = !searchTerm || title.includes(searchTerm) || excerpt.includes(searchTerm) || tags.includes(searchTerm);

      if (matchesTag && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTag = btn.getAttribute('data-tag') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

function resetBlogFilters() {
  const filterBtns = document.querySelectorAll('.tag-filter-btn');
  const searchInput = document.getElementById('blog-search-input');
  
  filterBtns.forEach(b => b.classList.remove('active'));
  const allBtn = document.querySelector('.tag-filter-btn[data-tag="all"]');
  if (allBtn) allBtn.classList.add('active');

  if (searchInput) searchInput.value = '';

  const articlesGrid = document.getElementById('blog-articles-grid');
  if (articlesGrid) {
    const cards = articlesGrid.querySelectorAll('.blog-card');
    cards.forEach(card => card.style.display = 'flex');
  }

  const noResultsMsg = document.getElementById('no-articles-found');
  if (noResultsMsg) noResultsMsg.style.display = 'none';
}

/**
 * Interactive Seamless Single-Page View Transition & Dynamic Dock Morphing
 */
function initSeamlessViewSwitcher() {
  const switcher = document.getElementById('dock-mode-switcher');
  const dock = document.getElementById('floating-dock');
  const portfolioView = document.getElementById('portfolio-view');
  const blogView = document.getElementById('blog-view');
  
  if (!switcher) return;

  let glider = switcher.querySelector('.mode-glider');
  if (!glider) {
    glider = document.createElement('span');
    glider.className = 'mode-glider';
    glider.setAttribute('aria-hidden', 'true');
    switcher.prepend(glider);
  }

  const pills = switcher.querySelectorAll('.mode-pill');
  const blogPill = document.getElementById('mode-btn-blog') || switcher.querySelector('a[href*="blog"]');
  const portfolioPill = document.getElementById('mode-btn-portfolio') || switcher.querySelector('a[href*="top"], a[href*="index"]');

  function updateGliderPosition(activeEl, immediate = false) {
    if (!activeEl) return;
    const switcherRect = switcher.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();

    const left = activeRect.left - switcherRect.left;
    const width = activeRect.width;

    if (width === 0) return; // Prevent 0-width collapse before layout

    if (immediate) {
      switcher.classList.remove('glider-ready');
      glider.style.transition = 'none';
    }

    glider.style.width = `${width}px`;
    glider.style.transform = `translateX(${left}px)`;

    if (immediate) {
      void glider.offsetWidth; // Force reflow
      // Enable sliding transitions after initial paint
      requestAnimationFrame(() => {
        switcher.classList.add('glider-ready');
        glider.style.transition = '';
      });
    }
  }

  function setView(mode, updateUrl = true, immediate = false) {
    if (!portfolioView || !blogView) {
      // Standalone post or secondary pages
      if (mode === 'blog' && blogPill) {
        window.location.href = blogPill.getAttribute('href') || 'blog.html';
      } else if (mode === 'portfolio' && portfolioPill) {
        window.location.href = portfolioPill.getAttribute('href') || 'index.html';
      }
      return;
    }

    if (mode === 'blog') {
      if (portfolioPill) portfolioPill.classList.remove('active');
      if (blogPill) blogPill.classList.add('active');
      updateGliderPosition(blogPill, immediate);
      if (!immediate) {
        setTimeout(() => updateGliderPosition(blogPill, false), 50);
        setTimeout(() => updateGliderPosition(blogPill, false), 180);
      }

      // Strip the no-transition paint class so the dock-menu CSS transition plays
      document.documentElement.classList.remove('initial-blog-mode');
      if (dock) dock.classList.add('blog-mode');

      if (immediate) {
        portfolioView.style.display = 'none';
        blogView.style.display = 'block';
        blogView.classList.remove('view-fade-out');
        blogView.classList.add('view-fade-in');
      } else {
        portfolioView.classList.add('view-fade-out');
        setTimeout(() => {
          portfolioView.style.display = 'none';
          portfolioView.classList.remove('view-fade-out');
          blogView.style.display = 'block';
          blogView.classList.add('view-fade-out');
          void blogView.offsetWidth; // force reflow
          blogView.classList.remove('view-fade-out');
          blogView.classList.add('view-fade-in');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 190);
      }

      if (updateUrl) {
        history.pushState({ mode: 'blog' }, '', '#blog');
      }
    } else {
      if (blogPill) blogPill.classList.remove('active');
      if (portfolioPill) portfolioPill.classList.add('active');
      updateGliderPosition(portfolioPill, immediate);
      if (!immediate) {
        setTimeout(() => updateGliderPosition(portfolioPill, false), 50);
        setTimeout(() => updateGliderPosition(portfolioPill, false), 180);
      }

      document.documentElement.classList.remove('initial-blog-mode');
      if (dock) dock.classList.remove('blog-mode');

      if (immediate) {
        blogView.style.display = 'none';
        portfolioView.style.display = 'block';
        portfolioView.classList.remove('view-fade-out');
        portfolioView.classList.add('view-fade-in');
      } else {
        blogView.classList.add('view-fade-out');
        setTimeout(() => {
          blogView.style.display = 'none';
          blogView.classList.remove('view-fade-out');
          portfolioView.style.display = 'block';
          portfolioView.classList.add('view-fade-out');
          void portfolioView.offsetWidth; // force reflow
          portfolioView.classList.remove('view-fade-out');
          portfolioView.classList.add('view-fade-in');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 190);
      }

      if (updateUrl) {
        history.pushState({ mode: 'portfolio' }, '', window.location.pathname);
      }
    }
  }

  // Bind click on switcher buttons
  if (blogPill) {
    blogPill.addEventListener('click', (e) => {
      if (portfolioView && blogView) {
        e.preventDefault();
        setView('blog', true);
      }
    });
  }

  if (portfolioPill) {
    portfolioPill.addEventListener('click', (e) => {
      if (portfolioView && blogView) {
        if (blogView.style.display !== 'none' || document.documentElement.classList.contains('initial-blog-mode')) {
          e.preventDefault();
          setView('portfolio', true);
        }
      }
    });
  }

  // Handle URL hash or query params on load
  const isBlogInitial = window.location.hash === '#blog' || window.location.search.includes('tab=blog');
  const targetInitialPill = isBlogInitial ? blogPill : (switcher.querySelector('.mode-pill.active') || portfolioPill);

  if (isBlogInitial) {
    setView('blog', false, true);
  }

  if (targetInitialPill) {
    updateGliderPosition(targetInitialPill, true);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const cur = isBlogInitial ? blogPill : (switcher.querySelector('.mode-pill.active') || portfolioPill);
        if (cur) updateGliderPosition(cur, true);
      });
    }
  }

  // Handle browser Back / Forward history buttons
  window.addEventListener('popstate', (e) => {
    if (window.location.hash === '#blog' || (e.state && e.state.mode === 'blog')) {
      setView('blog', false);
    } else {
      setView('portfolio', false);
    }
  });

  window.addEventListener('resize', () => {
    const curActive = switcher.querySelector('.mode-pill.active');
    if (curActive) updateGliderPosition(curActive, true);
  }, { passive: true });
}
