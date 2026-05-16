/* ═══════════════════════════════════════
   THEME TOGGLE
═══════════════════════════════════════ */
function toggleTheme() {
  const html = document.documentElement;
  const knob = document.getElementById('knob');
  if (html.dataset.theme === 'dark') {
    html.dataset.theme = 'light';
    knob.textContent = '☀️';
  } else {
    html.dataset.theme = 'dark';
    knob.textContent = '🌙';
  }
}

/* ═══════════════════════════════════════
   CARD TOGGLE
   - Click arrow → open/close
   - Click anywhere outside → close all
   - Scroll out of view → close
═══════════════════════════════════════ */
const openCards = new Set();

function toggleCard(id) {
  const card = document.getElementById(id);
  const isOpen = card.classList.contains('is-open');

  // Close all currently open cards
  openCards.forEach(openId => {
    const c = document.getElementById(openId);
    if (c) {
      c.classList.remove('is-open');
      if (c._obs) { c._obs.disconnect(); delete c._obs; }
    }
  });
  openCards.clear();

  // If the clicked card was closed → open it
  if (!isOpen) {
    card.classList.add('is-open');
    openCards.add(id);

    // Auto-close when scrolled out of viewport
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) {
          card.classList.remove('is-open');
          openCards.delete(id);
          obs.disconnect();
          delete card._obs;
        }
      });
    }, { threshold: 0.05 });
    obs.observe(card);
    card._obs = obs;
  }
}

// Click outside any card → close all
document.addEventListener('click', (e) => {
  if (!e.target.closest('.card')) {
    openCards.forEach(id => {
      const c = document.getElementById(id);
      if (c) {
        c.classList.remove('is-open');
        if (c._obs) { c._obs.disconnect(); delete c._obs; }
      }
    });
    openCards.clear();
  }
});

/* ═══════════════════════════════════════
   CONTACT FORM (Formspree)
═══════════════════════════════════════ */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const ok = document.getElementById('form-ok');
  try {
    const res = await fetch('https://formspree.io/f/mlgzvnav', {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      ok.style.display = 'block';
      form.reset();
      setTimeout(() => ok.style.display = 'none', 4000);
    }
  } catch (err) {
    console.error(err);
  }
}

/* ═══════════════════════════════════════
   SKILL CAROUSELS
   Fix: true seamless infinite loop via JS clone
   - 3 copies so gap never shows on fast screens
   - pause/resume on group hover (not pill hover)
   - tooltip still works on hover
═══════════════════════════════════════ */
const skillData = {
  core: [
    {
      name: 'Go / Golang',
      tip: 'Statically typed, compiled language. Primary language across all personal and open-source projects.',
      svg: `<svg viewBox="0 0 24 24"><path d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.082.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.304-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 0 1 .292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 0 1-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2zm3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 0 1-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106z"/></svg>`
    },
    { name: 'PostgreSQL', tip: 'Advanced relational database. Schema design, SQL queries, and data modelling in backend services.', svg: '' },
    { name: 'Redis', tip: 'In-memory data store for caching, session management, and pub/sub messaging patterns.', svg: '' },
    { name: 'REST API', tip: 'Designed and implemented RESTful endpoints following idiomatic Go patterns with proper HTTP status codes.', svg: '' },
    { name: 'gRPC', tip: 'High-performance RPC framework using Protocol Buffers. Applied in SSO-protos project with shared proto contracts.', svg: '' },
    { name: 'WebSocket', tip: 'Full-duplex communication protocol. Built a concurrent WebSocket server in the Nexus project.', svg: '' },
  ],
  infra: [
    {
      name: 'Docker',
      tip: 'Containerisation platform. Building images, isolating services, and creating reproducible environments.',
      svg: `<svg viewBox="0 0 24 24"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.185v1.888c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>`
    },
    { name: 'Docker Compose', tip: 'Multi-container orchestration. Define and run multi-service local dev environments with a single command.', svg: '' },
    { name: 'Linux', tip: 'Primary development OS. Terminal, file system, process management, and shell scripting.', svg: '' },
    {
      name: 'Git',
      tip: 'Version control system. Branching, merging, pull requests, and collaborative workflows on GitHub.',
      svg: `<svg viewBox="0 0 24 24"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.606-.403-.545-.545-.676-1.342-.396-2.009L7.636 3.69.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>`
    },
    { name: 'CI/CD', tip: 'Continuous integration and delivery. Automated testing and deployment pipeline workflows.', svg: '' },
  ],
  arch: [
    { name: 'Microservices', tip: 'Architectural pattern: independent, loosely coupled services. Applied in multi-service Go projects.', svg: '' },
    { name: 'SQL Optimisation', tip: 'Writing efficient queries, understanding execution plans, and designing indexes for performant DB access.', svg: '' },
    { name: 'pgAdmin4', tip: 'GUI tool for PostgreSQL administration and query execution during development.', svg: '' },
    { name: 'DBeaver', tip: 'Universal database tool for querying and managing relational databases across projects.', svg: '' },
    { name: 'AWS SQS', tip: 'Message queuing service. Practical knowledge gained by contributing to the kumo open-source library.', svg: '' },
    { name: 'HTML/CSS/JS', tip: 'Frontend basics acquired before pivoting to backend. Useful for full-stack context.', svg: '' },
  ]
};

function buildPill(skill) {
  const p = document.createElement('div');
  p.className = 'skill-pill';
  p.innerHTML = (skill.svg || '') + skill.name + `<span class="tip">${skill.tip}</span>`;
  return p;
}

function initCarousel(trackId, items, speed) {
  const track = document.getElementById(trackId);
  if (!track) return;

  // Build 3 copies for seamless loop on any screen width
  const allItems = [...items, ...items, ...items];
  allItems.forEach(s => track.appendChild(buildPill(s)));

  if (speed === 'fast') track.classList.add('speed-fast');

  // Pause/resume on the parent glass group hover
  const group = track.closest('.skill-group-glass');
  if (group) {
    group.addEventListener('mouseenter', () => track.classList.add('paused'));
    group.addEventListener('mouseleave', () => track.classList.remove('paused'));
  }

  // Seamless reset: when animation completes one cycle, jump back silently
  // (CSS handles this via translateX(-50%) on 2-copy; with 3 copies we reset at 1/3)
  // Override: dynamically compute the exact pixel width of ONE set and reset there
  const oneSetWidth = items.length * (track.children[0]
    ? (track.children[0].offsetWidth + 10) : 160);

  track.addEventListener('animationiteration', () => {
    // Nothing needed — CSS handles it perfectly with 3 copies at -50%
  });
}

// Wait for DOM + fonts to load so offsetWidth is accurate
window.addEventListener('load', () => {
  initCarousel('track-core',  skillData.core,  'normal');
  initCarousel('track-infra', skillData.infra, 'fast');
  initCarousel('track-arch',  skillData.arch,  'normal');
});
