const yearNodes = document.querySelectorAll('.year');
yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const header = document.querySelector('.site-header');
if (header) {
  const updateHeaderShadow = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  updateHeaderShadow();
  window.addEventListener('scroll', updateHeaderShadow, { passive: true });
}

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-links a').forEach((link) => {
  const linkPath = link.getAttribute('href');
  if (!linkPath) return;
  const normalized = linkPath.replace(/\/$/, '') || '/';
  if (normalized === currentPath || (normalized === '/index.html' && (currentPath === '/' || currentPath === '/index.html'))) {
    link.classList.add('active');
  }
});

const authAction = document.getElementById('authAction');
if (authAction) {
  const token = localStorage.getItem('kingbotToken');
  if (token) {
    authAction.textContent = 'Dashboard';
    authAction.setAttribute('href', '/dashboard.html');
  } else {
    const guestLabel = authAction.dataset.guestLabel || authAction.textContent;
    const guestHref = authAction.dataset.guestHref || authAction.getAttribute('href');
    authAction.textContent = guestLabel;
    authAction.setAttribute('href', guestHref);
  }
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach((target) => observer.observe(target));
  }
} else {
  document.querySelectorAll('.reveal, .reveal-stagger').forEach((target) => target.classList.add('in-view'));
}

const form = document.getElementById('strategy-form');
if (form) {
  const strategyTemplate = document.getElementById('strategyTemplate');
  const timeframe = document.getElementById('timeframe');
  const market = document.getElementById('market');
  const riskMode = document.getElementById('riskMode');
  const riskPercent = document.getElementById('riskPercent');
  const riskValue = document.getElementById('riskValue');
  const previewStrategy = document.getElementById('previewStrategy');
  const previewTimeframe = document.getElementById('previewTimeframe');
  const previewMode = document.getElementById('previewMode');
  const previewRisk = document.getElementById('previewRisk');

  const applyParamToSelect = (select, value) => {
    if (!select || !value) return;
    const match = Array.from(select.options).find((option) => option.value.toLowerCase() === value.toLowerCase());
    if (match) select.value = match.value;
  };

  const params = new URLSearchParams(window.location.search);
  applyParamToSelect(strategyTemplate, params.get('template'));
  applyParamToSelect(timeframe, params.get('timeframe'));
  applyParamToSelect(market, params.get('market'));

  const syncPreview = () => {
    if (!previewStrategy || !previewTimeframe || !previewMode || !previewRisk) return;
    previewStrategy.textContent = strategyTemplate?.value || 'Trend Breakout';
    previewTimeframe.textContent = timeframe?.value || '15m';
    previewMode.textContent = riskMode?.value || 'Normal';
    previewRisk.textContent = `${riskPercent?.value || 3}%`;
    if (riskValue) {
      riskValue.textContent = `${riskPercent?.value || 3}%`;
    }
  };

  ['change', 'input'].forEach((eventName) => {
    strategyTemplate?.addEventListener(eventName, syncPreview);
    timeframe?.addEventListener(eventName, syncPreview);
    market?.addEventListener(eventName, syncPreview);
    riskMode?.addEventListener(eventName, syncPreview);
    riskPercent?.addEventListener(eventName, syncPreview);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    syncPreview();
    const submitButton = form.querySelector('button');
    if (submitButton) {
      submitButton.textContent = 'Settings saved';
      submitButton.disabled = true;
      setTimeout(() => {
        submitButton.textContent = 'Save settings';
        submitButton.disabled = false;
      }, 1400);
    }
  });

  if (params.get('template')) {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  syncPreview();
}
