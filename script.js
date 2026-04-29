const root = document.documentElement;
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const themeToggle = document.getElementById('themeToggle');
const themePanelBox = document.getElementById('themePanelBox');
const primaryColor = document.getElementById('primaryColor');
const secondaryColor = document.getElementById('secondaryColor');
const applyThemeBtn = document.getElementById('applyTheme');
const resetThemeBtn = document.getElementById('resetTheme');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

const defaults = { primary: '#0f766e', secondary: '#f59e0b' };

function shadeColor(hex, amount = -24) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  let r = Math.max(0, Math.min(255, (num >> 16) + amount));
  let g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  let b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function applyTheme(primary, secondary) {
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--primary-dark', shadeColor(primary, -24));
  root.style.setProperty('--secondary', secondary);
  localStorage.setItem('hasana-theme-v3', JSON.stringify({ primary, secondary }));
}

function loadTheme() {
  const stored = localStorage.getItem('hasana-theme-v3');
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored);
    if (parsed.primary && parsed.secondary) {
      primaryColor.value = parsed.primary;
      secondaryColor.value = parsed.secondary;
      applyTheme(parsed.primary, parsed.secondary);
    }
  } catch (e) {}
}

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

themeToggle?.addEventListener('click', () => {
  const hidden = themePanelBox.hasAttribute('hidden');
  if (hidden) {
    themePanelBox.removeAttribute('hidden');
    themeToggle.setAttribute('aria-expanded', 'true');
  } else {
    themePanelBox.setAttribute('hidden', '');
    themeToggle.setAttribute('aria-expanded', 'false');
  }
});

applyThemeBtn?.addEventListener('click', () => applyTheme(primaryColor.value, secondaryColor.value));

resetThemeBtn?.addEventListener('click', () => {
  primaryColor.value = defaults.primary;
  secondaryColor.value = defaults.secondary;
  applyTheme(defaults.primary, defaults.secondary);
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const values = Object.fromEntries(data.entries());
  const required = ['name', 'email', 'phone', 'message'];
  const missing = required.find(k => !String(values[k] || '').trim());

  if (missing) {
    formMessage.textContent = 'Please complete all required fields.';
    formMessage.style.color = '#b91c1c';
    return;
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email).trim());
  if (!emailValid) {
    formMessage.textContent = 'Please enter a valid email address.';
    formMessage.style.color = '#b91c1c';
    return;
  }

  formMessage.textContent = 'Demo only: your message was captured in the UI. No backend is connected.';
  formMessage.style.color = '#0f766e';
  contactForm.reset();
});

loadTheme();
