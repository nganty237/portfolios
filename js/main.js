/**
 * Gabriel Nganty - Portfolio Main Engine
 * Full-Stack JavaScript Developer & UI/UX Web Designer
 * Powered by GSAP & ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {
  normalizeMojibakeText();
  initPreloader();
  initTheme();
  initNavigation();
  initScrollToTop();
  initProjectFilters();
  initProjectModal();
  initContactForm();
  initGSAPAnimations();
});

function normalizeMojibakeText() {
  const replacements = {
    'Â·': '·',
    'â€”': '—',
    'â€“': '–',
    'âœ“': '✓',
    'â†’': '→',
    'â†—': '↗',
    'â–': '',
    'Ã©': 'é',
    'Ã¨': 'è',
    'Ã ': 'à',
    'Ã´': 'ô',
    'Ã¢': 'â',
    'Ã§': 'ç'
  };

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(node => {
    let value = node.nodeValue;
    Object.entries(replacements).forEach(([bad, good]) => {
      value = value.split(bad).join(good);
    });
    node.nodeValue = value;
  });
}

/* --- 1. Minimalist Preloader --- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    if (preloader.classList.contains('loaded')) return;
    preloader.classList.add('loaded');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  };

  // Allow the letter revelation & progress animation to complete smoothly (~2.1s)
  setTimeout(hidePreloader, 2100);
}

/* --- Shared footer actions --- */
function initScrollToTop() {
  document.querySelectorAll('[data-scroll-top]').forEach((button) => {
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* --- 2. Theme Switcher (Dark / Light Mode) --- */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle, .scroll-nav-theme-btn');
  const storedTheme = localStorage.getItem('nganty_portfolio_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Determine initial theme state
  const isDark = storedTheme === 'dark' || (storedTheme !== 'light' && prefersDark);
  applyTheme(isDark);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDark = document.body.classList.contains('dark-theme');
      const nextDark = !currentDark;
      applyTheme(nextDark);
      localStorage.setItem('nganty_portfolio_theme', nextDark ? 'dark' : 'light');
    });
  });

  // Listen to system OS preference changes if no manual theme stored
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('nganty_portfolio_theme')) {
        applyTheme(e.matches);
      }
    });
  }
}

function applyTheme(isDark) {
  if (isDark) {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
    document.documentElement.classList.add('dark-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.setAttribute('data-theme', 'light');
  }
  updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    if (isDark) {
      icon.innerHTML = `<i class="fa-solid fa-sun"></i>`;
      icon.setAttribute('title', 'Switch to Light Theme');
    } else {
      icon.innerHTML = `<i class="fa-solid fa-moon"></i>`;
      icon.setAttribute('title', 'Switch to Dark Theme');
    }
  });

  // Update the label in the scroll-nav dropdown
  const themeLabels = document.querySelectorAll('.scroll-nav-theme-label');
  themeLabels.forEach(label => {
    label.textContent = isDark ? 'Light mode' : 'Dark mode';
  });
}

/* --- 3. Navigation & Mobile Drawer --- */
function initNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.innerHTML = isOpen 
        ? `<i class="fa-solid fa-xmark"></i>` 
        : `<i class="fa-solid fa-bars"></i>`;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        document.body.style.overflow = '';
      });
    });

    // Reset mobile drawer on screen resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        mobileToggle.innerHTML = `<i class="fa-solid fa-bars"></i>`;
        document.body.style.overflow = '';
      }
    });
  }

  // Active page indicator
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
  
  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Sticky header scroll behavior: fade out links on scroll, keep only logo + trigger btn
  const navContainer = document.querySelector('.nav-container');
  const scrollNavTrigger = document.querySelector('.scroll-nav-trigger');
  const scrollNavDropdown = document.querySelector('.scroll-nav-dropdown');

  if (navContainer) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        navContainer.classList.add('scrolled');
      } else {
        navContainer.classList.remove('scrolled');
        // Close dropdown when back at top
        if (scrollNavDropdown) {
          scrollNavDropdown.classList.remove('open');
          scrollNavDropdown.setAttribute('aria-hidden', 'true');
        }
        if (scrollNavTrigger) {
          scrollNavTrigger.setAttribute('aria-expanded', 'false');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Toggle the compact scroll-nav dropdown
  if (scrollNavTrigger && scrollNavDropdown) {
    scrollNavTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = scrollNavDropdown.classList.toggle('open');
      scrollNavDropdown.setAttribute('aria-hidden', String(!isOpen));
      scrollNavTrigger.setAttribute('aria-expanded', String(isOpen));
      // Toggle icon between bars and xmark
      const icon = scrollNavTrigger.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!scrollNavDropdown.contains(e.target) && !scrollNavTrigger.contains(e.target)) {
        scrollNavDropdown.classList.remove('open');
        scrollNavDropdown.setAttribute('aria-hidden', 'true');
        scrollNavTrigger.setAttribute('aria-expanded', 'false');
        const icon = scrollNavTrigger.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });

    // Close dropdown when a link inside is clicked
    scrollNavDropdown.querySelectorAll('.scroll-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        scrollNavDropdown.classList.remove('open');
        scrollNavDropdown.setAttribute('aria-hidden', 'true');
        scrollNavTrigger.setAttribute('aria-expanded', 'false');
        const icon = scrollNavTrigger.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

/* --- 4. Work Filtering (For Work Page & Sections) --- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterBtns.length === 0 || projectCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          if (window.gsap) {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
          } else {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }
        } else {
          if (window.gsap) {
            gsap.to(card, {
              opacity: 0,
              y: 20,
              duration: 0.3,
              ease: 'power2.in',
              onComplete: () => { card.style.display = 'none'; }
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => { card.style.display = 'none'; }, 300);
          }
        }
      });
    });
  });
}

/* --- 5. Interactive Project Modal --- */
function initProjectModal() {
  const modalBackdrop = document.getElementById('projectModal');
  if (!modalBackdrop) return;

  const modalBody = modalBackdrop.querySelector('.modal-body');
  const closeBtn = modalBackdrop.querySelector('.modal-close');

  document.querySelectorAll('[data-project-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = trigger.getAttribute('data-project-trigger');
      const project = projectsData[projectId];

      if (project) {
        modalBody.innerHTML = `
          <div style="margin-bottom: 1.5rem; border-radius: 12px; overflow: hidden; max-height: 280px; border: 1px solid var(--border-subtle);">
            <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.8rem; align-items: center; flex-wrap: wrap;">
            <span class="project-tag" style="background: var(--accent-primary-soft); color: var(--accent-primary); font-weight: 600;">${project.category}</span>
            <span class="project-tag">${project.badge}</span>
            ${project.figmaUrl ? `<span class="project-tag" style="background: var(--accent-figma-soft); color: var(--accent-figma);"><i class="fa-brands fa-figma"></i> Figma File Available</span>` : ''}
          </div>
          <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">${project.title}</h2>
          <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">${project.description}</p>
          
          <h4 style="font-size: 1rem; margin-bottom: 0.6rem;">Key Engineering & Design Highlights</h4>
          <ul style="list-style: disc; margin-left: 1.2rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
            ${project.highlights.map(h => `<li style="margin-bottom: 0.4rem;">${h}</li>`).join('')}
          </ul>

          <h4 style="font-size: 1rem; margin-bottom: 0.6rem;">Tech Stack & Tooling</h4>
          <div class="project-tags" style="margin-bottom: 2rem;">
            ${project.stack.map(s => `<span class="project-tag">${s}</span>`).join('')}
          </div>

          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            ${project.figmaUrl ? `
              <a href="${project.figmaUrl}" class="btn btn-figma btn-sm" target="_blank">
                <i class="fa-brands fa-figma"></i> Open Figma Prototype
              </a>
            ` : ''}
            <a href="${project.liveUrl}" class="btn btn-primary btn-sm" target="_blank">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Live Preview
            </a>
            <a href="${project.codeUrl}" class="btn btn-secondary btn-sm" target="_blank">
              <i class="fa-brands fa-github"></i> Source Code
            </a>
          </div>
        `;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* --- 6. Contact Form Validation --- */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const feedback = form.querySelector('.form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name') ? form.querySelector('#name').value.trim() : '';
    const email = form.querySelector('#email') ? form.querySelector('#email').value.trim() : '';
    const message = form.querySelector('#message') ? form.querySelector('#message').value.trim() : '';

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
      if (feedback) {
        feedback.innerHTML = `Thank you, <strong>${name}</strong>! Your message has been sent to <strong>surflinkayos@gmail.com</strong>. Gabriel will get back to you shortly.`;
        feedback.className = 'form-feedback success';
      }
      form.reset();
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

/* --- 7. GSAP Smooth Animations --- */
function initHorizontalProjects() {
  const section = document.getElementById('Selectedworks');
  const viewport = section?.querySelector('.editorial-works-viewport');
  const rail = section?.querySelector('.editorial-works-rail');
  const panels = rail ? gsap.utils.toArray('.editorial-work-panel', rail) : [];

  if (!section || !viewport || !rail || !panels.length || typeof ScrollTrigger === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const media = gsap.matchMedia();

  media.add('(min-width: 993px)', () => {
    section.classList.add('is-horizontal-projects');

    const getScrollDistance = () => Math.max(0, rail.scrollWidth - viewport.clientWidth);
    const setActivePanel = (progress) => {
      const activeIndex = Math.round(progress * (panels.length - 1));
      panels.forEach((panel, index) => panel.classList.toggle('is-active', index === activeIndex));
    };

    setActivePanel(0);

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => setActivePanel(self.progress)
      }
    });

    timeline.to(rail, {
      x: () => -getScrollDistance(),
      duration: 1,
      ease: 'none'
    }, 0);

    panels.forEach((panel, index) => {
      const position = index / (panels.length - 1 || 1);
      const mediaContainer = panel.querySelector('.editorial-media-container');
      const content = panel.querySelector('.editorial-content-container');

      timeline.fromTo(mediaContainer,
        { autoAlpha: 0.6, scale: 0.92, y: 28 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' },
        position
      );
      timeline.fromTo(content,
        { autoAlpha: 0, x: 28 },
        { autoAlpha: 1, x: 0, duration: 0.2, ease: 'power2.out' },
        position + 0.04
      );

      if (index < panels.length - 1) {
        timeline.to([mediaContainer, content], {
          autoAlpha: 0.55,
          scale: 0.96,
          duration: 0.14,
          ease: 'power1.in'
        }, position + 0.32);
      }
    });

    return () => {
      section.classList.remove('is-horizontal-projects');
      panels.forEach((panel) => panel.classList.remove('is-active'));
      gsap.set([rail, ...panels], { clearProps: 'transform,opacity,filter,visibility' });
      gsap.set(panels.flatMap((panel) => [
        panel.querySelector('.editorial-media-container'),
        panel.querySelector('.editorial-content-container')
      ]), { clearProps: 'transform,opacity,visibility' });
    };
  });
}

function initAcademicTimeline() {
  if (typeof ScrollTrigger === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.utils.toArray('.timeline').forEach((timeline) => {
    const progress = timeline.querySelector('.timeline-progress');
    const items = gsap.utils.toArray('.timeline-item', timeline);

    if (!progress || !items.length) return;

    gsap.fromTo(progress,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 72%',
          end: 'bottom 55%',
          scrub: true
        }
      }
    );

    items.forEach((item) => {
      gsap.fromTo(item,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 84%',
            toggleActions: 'play none none none',
            onEnter: () => item.classList.add('is-active'),
            onEnterBack: () => item.classList.add('is-active')
          }
        }
      );
    });
  });
}

function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Section Stagger
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } });
  
  if (document.querySelector('.hero-title')) {
    heroTimeline
      .from('.hero-title', { opacity: 0, y: 30 })
      .from('.hero-description', { opacity: 0, y: 20 }, '-=0.5')
      .from('.hero-links a', { opacity: 0, y: 12, stagger: 0.08 }, '-=0.4');
  }

  initHorizontalProjects();
  initAcademicTimeline();

  // ScrollReveal for Editorial Work Cards & Project Cards
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.utils.toArray('.editorial-work-card:not(.editorial-work-panel), .project-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 45,
        duration: 0.85,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });

    gsap.utils.toArray('.skill-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 0.7,
        delay: index * 0.12,
        ease: 'power2.out'
      });
    });

  }
}
