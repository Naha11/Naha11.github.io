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
