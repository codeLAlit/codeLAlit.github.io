document.addEventListener('DOMContentLoaded', () => {

  /* ===== RENDER FUNCTIONS ===== */

  function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;
    container.innerHTML = '';
    portfolioData.timeline.forEach((entry, i) => {
      const el = document.createElement('div');
      el.className = `timeline-entry reveal ${i % 2 === 0 ? 'left' : 'right'}`;
      el.style.transitionDelay = `${i * 0.08}s`;
      const dotColor = entry.type === 'education' ? 'var(--accent)' : 'var(--accent-orange)';
      el.innerHTML = `
        <div class="timeline-dot" style="background: ${dotColor}"></div>
        <div class="timeline-card">
          <span class="timeline-card__date">${entry.date}</span>
          <span class="timeline-card__type ${entry.type}">${entry.type}</span>
          <h3>${entry.title}</h3>
          <h4>${entry.subtitle}</h4>
          <p>${entry.description}</p>
        </div>
      `;
      container.appendChild(el);
    });
    const begin = document.createElement('div');
    begin.className = 'timeline-entry begin';
    container.appendChild(begin);
  }

  function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    portfolioData.projects.forEach((proj, i) => {
      const card = document.createElement('div');
      card.className = 'project-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="project-card__image" style="background-image: url(${proj.image})">
          <div class="project-card__overlay">
            <div class="project-card__content">
              <span class="project-card__tech">${proj.tech}</span>
              <h3><a href="${proj.link}" target="_blank">${proj.title}</a></h3>
              <p>${proj.description}</p>
              <a href="${proj.link}" target="_blank" class="project-card__link">
                <i class="icon-github"></i> View Repository
              </a>
            </div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderBlogs() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    grid.innerHTML = '';
    portfolioData.blogs.forEach((blog, i) => {
      const card = document.createElement('div');
      card.className = 'blog-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="blog-card__image">
          <img src="${blog.image}" alt="${blog.title}">
        </div>
        <div class="blog-card__body">
          <div class="blog-card__meta">
            ${blog.date ? `<span>${blog.date}</span>` : ''}
            <span class="blog-card__category">${blog.category}</span>
          </div>
          <h3><a href="${blog.link}" target="_blank">${blog.title}</a></h3>
          <p>${blog.summary}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ===== TYPEWRITER ===== */

  function initTypewriter() {
    const el = document.getElementById('tagline');
    if (!el) return;
    const phrases = [
      'Electrical Engineer by study, coder by heart.',
      'Building things with ML & Deep Learning.',
      'IIT Bombay · Automating the future.'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }
      el.textContent = currentText;
      if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => { isDeleting = true; type(); }, 2000);
        return;
      }
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, isDeleting ? 40 : 80);
    }
    type();
  }

  /* ===== NAVIGATION ===== */

  function initNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('navbar');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('nav--open');
      });
      document.querySelectorAll('.nav__links a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('nav--open');
        });
      });
    }
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav__links a:not([target="_blank"])');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
    sections.forEach(s => observer.observe(s));
  }

  /* ===== SMOOTH SCROLL ===== */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ===== SCROLL ANIMATIONS ===== */

  function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ===== FOOTER YEAR ===== */

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== INIT ===== */

  renderTimeline();
  renderProjects();
  renderBlogs();

  initTypewriter();
  initNav();
  initSmoothScroll();

  requestAnimationFrame(() => {
    initScrollAnimations();
  });

});

/* ===== CONSTELLATION BACKGROUND ===== */

(function initConstellation() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const NUM_STARS = 150;
  const CONNECTION_DIST = 130;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < NUM_STARS; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.6 + 0.2,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.x += s.dx;
      s.y += s.dy;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${s.o})`;
      ctx.fill();

      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dx = s.x - s2.x;
        const dy = s.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - dist / CONNECTION_DIST) * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  resize();
  initStars();
  animate();
  window.addEventListener('resize', () => { resize(); initStars(); });
})();
