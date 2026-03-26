// Копирование текста
function copyText(id, btn) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = '✓ Скопировано';
    btn.style.background = 'var(--cyan)';
    btn.style.color = '#000';
    btn.style.borderColor = 'var(--cyan)';
    setTimeout(() => {
      btn.textContent = id === 'kaspi-num' ? 'Скопировать номер' : 'Скопировать адрес';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}

// Анимированные счётчики
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.target === '100' ? '%' : '+');
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-number').forEach(animateCounter);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// Форма заявки → Telegram
function sendToTelegram() {
  const name = document.getElementById('order-name').value.trim();
  const task = document.getElementById('order-task').value.trim();
  if (!name || !task) { alert('Заполните имя и описание задачи'); return; }
  const msg = encodeURIComponent(`Привет! Меня зовут ${name}.\n\nЗадача: ${task}`);
  window.open(`https://t.me/akhnnoname?text=${msg}`, '_blank');
}

// Плавное появление секций
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .stack-item, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Активный пункт навигации при скролле
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  sections.forEach(s => {
    const top = s.offsetTop - 100;
    const bottom = top + s.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < bottom) {
        link.style.color = 'var(--cyan)';
        link.style.textShadow = '0 0 8px var(--cyan)';
      } else {
        link.style.color = '';
        link.style.textShadow = '';
      }
    }
  });
});
