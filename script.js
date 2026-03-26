// ─── ПЕРЕВОДЫ ───────────────────────────────────────────────────────────────
const translations = {
  ru: {
    nav_services: 'УСЛУГИ', nav_stack: 'СТЕК', nav_portfolio: 'РАБОТЫ',
    nav_payment: 'ОПЛАТА', nav_about: 'ОБО МНЕ', nav_contact: 'КОНТАКТ',
    available: 'Доступен для заказов',
    hero_sub: 'Telegram-боты & автоматизация',
    hero_desc: 'Разрабатываю ботов, автоматизирую процессы и собираю данные.\nБыстро, качественно и точно под ваш бизнес.',
    btn_telegram: 'Написать в Telegram', btn_kwork: 'Kwork профиль',
    stat1: 'готовых бота', stat2: 'дня на задачу', stat3: 'ответ',
    cnt1: 'выполненных проекта', cnt2: 'час — время ответа',
    cnt3: 'дня на простую задачу', cnt4: '% поддержка после сдачи',
    process_title: 'КАК РАБОТАЕМ', guar_title: 'ГАРАНТИИ', rev_title: 'ОТЗЫВЫ',
    order_title: 'ЗАЯВКА', order_desc: 'Опишите задачу — отвечу в течение часа и сообщу точную цену',
    btn_send: 'Отправить в Telegram',
    order_note: '// Нажимая кнопку, вы перейдёте в Telegram с готовым сообщением',
    ph_name: 'Ваше имя', ph_task: 'Опишите задачу (бот, сайт, парсинг...)',
    payment_desc: 'Принимаю оплату удобным для вас способом',
    kaspi_desc: 'Перевод на Kaspi Gold — быстро и без комиссии',
    usdt_desc: 'Оплата криптовалютой — USDT в сети Tron (TRC20)',
    copy_num: 'Скопировать номер', copy_addr: 'Скопировать адрес',
    payment_note: 'После оплаты — скиньте скрин в Telegram',
    contact_desc: 'Напишите — обсудим задачу и я сообщу точную цену без лишних слов',
    s1_title: 'Telegram-бот', s2_title: 'Автоматизация',
    s3_title: 'Парсинг данных', s4_title: 'Сайт-визитка',
    s1_desc: 'Запись клиентов, приём заказов, рассылки, оплата через ЮKassa. Любая логика — под ваш бизнес.',
    s2_desc: 'Python-скрипты для Excel и Google Sheets. Автозаполнение, формулы, интеграции с API.',
    s3_desc: 'Соберу данные с любого сайта — товары, цены, контакты. Выдам в Excel или Google Sheets.',
    s4_desc: 'Одностраничный сайт для бизнеса или фрилансера. Имя, услуги, кнопки связи. Быстро.',
    badge_hit: 'ХИТ',
    r1_text: '"Бот работает отлично! Всё сделано быстро и чисто. Под наши задачи сделал функционал, которого нигде не нашли."',
    r2_text: '"Автоматизировал наши таблицы Excel — экономим около трёх часов в день. Объяснил как пользоваться, всё понятно."',
    r3_text: '"Сайт-визитку сделал за два дня. Смотрится профессионально, загружается быстро. Рекомендую как надёжного исполнителя."',
    r1_name: 'Магазин одежды', r2_name: 'Малый бизнес', r3_name: 'Фрилансер',
    faq1_q: 'Какой срок выполнения?', faq2_q: 'Нужна ли предоплата?',
    faq3_q: 'Что если результат не понравится?', faq4_q: 'Можно ли добавить функции позже?',
    faq5_q: 'Работаете с зарубежными клиентами?',
    faq1_a: 'Простые задачи — 1–2 дня. Боты со сложной логикой — до 5 дней. Сроки обговариваем заранее и фиксируем.',
    faq2_a: 'Да, 50% до начала работы. Остаток — после сдачи и вашего одобрения результата.',
    faq3_a: 'Дорабатываю до результата бесплатно, если задача не изменилась по сравнению с изначальной договорённостью.',
    faq4_a: 'Да, я всегда на связи. Доработки обсуждаем отдельно — объём и стоимость зависят от задачи.',
    faq5_a: 'Да, принимаю оплату в USDT (TRC20). Работаю полностью удалённо — для вас нет разницы где вы находитесь.',
    ps1_title: 'Обсуждение', ps2_title: 'Разработка', ps3_title: 'Тестирование', ps4_title: 'Сдача',
    ps1_desc: 'Пишете в Telegram, описываете задачу. Отвечаю в течение часа, задаю вопросы и называю цену.',
    ps2_desc: 'Начинаю работу после предоплаты 50%. Информирую вас по ходу разработки.',
    ps3_desc: 'Проверяю всё самостоятельно перед сдачей. Показываю демо — вы тестируете и сообщаете правки.',
    ps4_desc: 'Передаю исходный код и объясняю, как им пользоваться. Остаюсь на связи после сдачи.',
    g1_title: 'Исходный код', g2_title: 'Правки бесплатно', g3_title: 'Поддержка 14 дней', g4_title: 'Сдача в срок',
    g1_desc: 'Весь код передаю вам. Он ваш — можете изменять, передавать кому угодно.',
    g2_desc: 'Если что-то работает не так, как договорились, — исправлю бесплатно.',
    g3_desc: 'После сдачи 14 дней отвечаю на вопросы и помогаю с настройкой.',
    g4_desc: 'Называю реальные сроки и придерживаюсь их. Предупреждаю заранее, если что-то меняется.',
    about_p1: 'Я — NAHA_AI. Разрабатываю Telegram-ботов и пишу Python-скрипты для автоматизации бизнес-процессов.',
    about_p2: 'Работаю быстро и по делу — без лишних слов и затянутых сроков. После сдачи объясняю, как пользоваться результатом, и остаюсь на связи.',
    ab1: 'Отвечаю в течение часа', ab2: 'Сдаю в срок, простое — за 1–2 дня',
    ab3: 'Код публикую на GitHub — можно проверить', ab4: 'Даю инструкцию и поддержку после сдачи',
    p1_title: 'Бот-визитка', p2_title: 'Бот записи клиентов', p3_title: 'Бот приёма заказов', p4_title: 'Сайт-визитка',
    p1_desc: 'Telegram-бот для бизнеса: меню, кнопки, контакты, описание услуг. aiogram 3.x.',
    p2_desc: 'Бот для онлайн-записи: выбор услуги, дата/время, уведомление администратору. aiogram 3.x.',
    p3_desc: 'Бот для магазина: каталог, корзина, оформление заказа, уведомления. aiogram 3.x.',
    p4_desc: 'Одностраничный сайт в стиле киберпанк+самурай. HTML/CSS/JS, GitHub Pages.',
  },
  en: {
    nav_services: 'SERVICES', nav_stack: 'STACK', nav_portfolio: 'WORKS',
    nav_payment: 'PAYMENT', nav_about: 'ABOUT', nav_contact: 'CONTACT',
    available: 'Available for orders',
    hero_sub: 'Telegram bots & automation',
    hero_desc: 'I build bots, automate processes and collect data.\nFast, clean and tailored to your business.',
    btn_telegram: 'Write on Telegram', btn_kwork: 'Kwork profile',
    stat1: 'completed bots', stat2: 'days per task', stat3: 'response',
    cnt1: 'projects done', cnt2: 'hour response time',
    cnt3: 'days for simple task', cnt4: '% support after delivery',
    process_title: 'HOW WE WORK', guar_title: 'GUARANTEES', rev_title: 'REVIEWS',
    order_title: 'ORDER', order_desc: 'Describe the task — I will reply within an hour and give you an exact price',
    btn_send: 'Send via Telegram',
    order_note: '// Clicking the button will open Telegram with a pre-filled message',
    ph_name: 'Your name', ph_task: 'Describe the task (bot, site, parsing...)',
    payment_desc: 'I accept payment in a way that is convenient for you',
    kaspi_desc: 'Transfer to Kaspi Gold — fast and fee-free',
    usdt_desc: 'Crypto payment — USDT on Tron network (TRC20)',
    copy_num: 'Copy number', copy_addr: 'Copy address',
    payment_note: 'After payment — send a screenshot to Telegram',
    contact_desc: 'Write to me — we will discuss the task and I will give you an exact price',
    s1_title: 'Telegram Bot', s2_title: 'Automation',
    s3_title: 'Data Parsing', s4_title: 'Landing Page',
    s1_desc: 'Client booking, order intake, newsletters, payment via YooKassa. Any logic for your business.',
    s2_desc: 'Python scripts for Excel and Google Sheets. Auto-fill, formulas, API integrations.',
    s3_desc: 'I will collect data from any website — products, prices, contacts. Delivered as Excel or Google Sheets.',
    s4_desc: 'One-page website for business or freelancers. Name, services, contact buttons. Fast.',
    badge_hit: 'HOT',
    r1_text: '"The bot works great! Everything was done quickly and cleanly. Built features we couldn\'t find anywhere else."',
    r2_text: '"Automated our Excel spreadsheets — saving about three hours a day. Explained how to use it, very clear."',
    r3_text: '"Built the landing page in two days. Looks professional, loads fast. I recommend him as a reliable developer."',
    r1_name: 'Clothing Store', r2_name: 'Small Business', r3_name: 'Freelancer',
    faq1_q: 'What is the turnaround time?', faq2_q: 'Is a deposit required?',
    faq3_q: 'What if I am not satisfied with the result?', faq4_q: 'Can features be added later?',
    faq5_q: 'Do you work with international clients?',
    faq1_a: 'Simple tasks — 1–2 days. Bots with complex logic — up to 5 days. Timelines are agreed in advance.',
    faq2_a: 'Yes, 50% upfront. The remainder is paid after delivery and your approval.',
    faq3_a: 'I will revise until the result matches the original agreement, at no extra charge.',
    faq4_a: 'Yes, I am always in touch. Additional work is discussed separately depending on scope.',
    faq5_a: 'Yes, I accept USDT (TRC20). I work fully remotely — your location does not matter.',
    ps1_title: 'Discussion', ps2_title: 'Development', ps3_title: 'Testing', ps4_title: 'Delivery',
    ps1_desc: 'Write in Telegram and describe the task. I reply within an hour, ask questions and give a price.',
    ps2_desc: 'I start work after 50% prepayment. I keep you informed throughout development.',
    ps3_desc: 'I test everything myself before delivery. I show a demo — you test it and provide feedback.',
    ps4_desc: 'I hand over the source code and explain how to use it. I remain available after delivery.',
    g1_title: 'Source Code', g2_title: 'Free Revisions', g3_title: '14-Day Support', g4_title: 'On-Time Delivery',
    g1_desc: 'All code is yours. You can modify or share it with anyone.',
    g2_desc: 'If something does not work as agreed — I will fix it for free.',
    g3_desc: '14 days after delivery I answer questions and help with setup.',
    g4_desc: 'I give realistic timelines and stick to them. I notify you in advance if anything changes.',
    about_p1: 'I am NAHA_AI. I build Telegram bots and write Python scripts for business process automation.',
    about_p2: 'I work fast and to the point — no unnecessary words or delays. After delivery I explain everything and stay in touch.',
    ab1: 'I reply within an hour', ab2: 'On time delivery, simple tasks in 1–2 days',
    ab3: 'Code is published on GitHub — you can review it', ab4: 'I provide instructions and support after delivery',
    p1_title: 'Business Card Bot', p2_title: 'Client Booking Bot', p3_title: 'Order Intake Bot', p4_title: 'Landing Page',
    p1_desc: 'Telegram bot for business: menu, buttons, contacts, service descriptions. aiogram 3.x.',
    p2_desc: 'Online booking bot: service selection, date/time, admin notifications. aiogram 3.x.',
    p3_desc: 'Shop bot: catalog, cart, order placement, notifications. aiogram 3.x.',
    p4_desc: 'One-page cyberpunk+samurai style site. HTML/CSS/JS, GitHub Pages.',
  },
  kz: {
    nav_services: 'ҚЫЗМЕТТЕР', nav_stack: 'СТЕК', nav_portfolio: 'ЖҰМЫСТАР',
    nav_payment: 'ТӨЛЕМ', nav_about: 'МЕН ТУРАЛЫ', nav_contact: 'БАЙЛАНЫС',
    available: 'Тапсырысқа қолжетімді',
    hero_sub: 'Telegram боттар & автоматтандыру',
    hero_desc: 'Боттар жасаймын, үдерістерді автоматтандырамын және деректер жинаймын.\nТез, сапалы және сіздің бизнесіңізге сай.',
    btn_telegram: 'Telegram-ға жазу', btn_kwork: 'Kwork профилі',
    stat1: 'дайын бот', stat2: 'күн тапсырмаға', stat3: 'жауап',
    cnt1: 'орындалған жоба', cnt2: 'сағат — жауап уақыты',
    cnt3: 'күн қарапайым тапсырмаға', cnt4: '% тапсырғаннан кейінгі қолдау',
    process_title: 'ЖҰМЫС ТӘРТІБІ', guar_title: 'КЕПІЛДІКТЕР', rev_title: 'ПІКІРЛЕР',
    order_title: 'ӨТІНІМ', order_desc: 'Тапсырманы сипаттаңыз — бір сағат ішінде жауап беремін',
    btn_send: 'Telegram-ға жіберу',
    order_note: '// Түймені басқанда дайын хабармен Telegram ашылады',
    ph_name: 'Атыңыз', ph_task: 'Тапсырманы сипаттаңыз (бот, сайт, парсинг...)',
    payment_desc: 'Сізге ыңғайлы тәсілмен төлем қабылдаймын',
    kaspi_desc: 'Kaspi Gold-қа аудару — тез және комиссиясыз',
    usdt_desc: 'Крипто төлем — USDT Tron желісінде (TRC20)',
    copy_num: 'Нөмірді көшіру', copy_addr: 'Мекенжайды көшіру',
    payment_note: 'Төлегеннен кейін — скриншотты Telegram-ға жіберіңіз',
    contact_desc: 'Жазыңыз — тапсырманы талқылаймыз және нақты бағаны айтамын',
    s1_title: 'Telegram боты', s2_title: 'Автоматтандыру',
    s3_title: 'Деректер жинау', s4_title: 'Сайт-визитка',
    s1_desc: 'Клиент жазылымы, тапсырыс қабылдау, жылжымалы хабар, ЮKassa арқылы төлем.',
    s2_desc: 'Excel және Google Sheets үшін Python скрипттер. Автотолтыру, формулалар, API интеграциясы.',
    s3_desc: 'Кез келген сайттан деректер жинаймын — тауарлар, бағалар, байланыстар. Excel немесе Google Sheets.',
    s4_desc: 'Бизнес немесе фрилансер үшін бір беттік сайт. Аты, қызметтер, байланыс түймелері.',
    badge_hit: 'ХИТ',
    r1_text: '"Бот тамаша жұмыс істейді! Барлығы жылдам және таза орындалды. Басқа жерде таба алмаған функционал жасады."',
    r2_text: '"Excel кестелерін автоматтандырды — күніне үш сағатқа жуық уақыт үнемдейміз. Қолдануды түсіндірді."',
    r3_text: '"Сайт-визитканы екі күнде жасады. Кәсіби көрінеді, жылдам жүктеледі. Сенімді орындаушы ретінде ұсынамын."',
    r1_name: 'Киім дүкені', r2_name: 'Шағын бизнес', r3_name: 'Фрилансер',
    faq1_q: 'Орындау мерзімі қандай?', faq2_q: 'Алдын ала төлем қажет пе?',
    faq3_q: 'Нәтиже ұнамаса ше?', faq4_q: 'Кейінірек функционал қосуға болады ма?',
    faq5_q: 'Шетелдік клиенттермен жұмыс жасайсыз ба?',
    faq1_a: 'Қарапайым тапсырмалар — 1–2 күн. Күрделі боттар — 5 күнге дейін. Мерзім алдын ала белгіленеді.',
    faq2_a: 'Иә, жұмысты бастамас бұрын 50%. Қалғаны — тапсырып, мақұлдаулыңызды алғаннан кейін.',
    faq3_a: 'Бастапқы келісім бойынша нәтижеге жеткенше тегін жөндеймін.',
    faq4_a: 'Иә, мен әрдайым байланыстамын. Қосымша жұмыстар жеке талқыланады.',
    faq5_a: 'Иә, USDT (TRC20) қабылдаймын. Толық қашықтан жұмыс жасаймын.',
    ps1_title: 'Талқылау', ps2_title: 'Жасау', ps3_title: 'Тестілеу', ps4_title: 'Тапсыру',
    ps1_desc: 'Telegram-ға жазып, тапсырманы сипаттаңыз. Бір сағат ішінде жауап беремін.',
    ps2_desc: '50% алдын ала төлем алғаннан кейін жұмысты бастаймын.',
    ps3_desc: 'Тапсырмас бұрын барлығын тексеремін. Демо көрсетемін.',
    ps4_desc: 'Бастапқы кодты тапсырамын және қолдануды түсіндіремін.',
    g1_title: 'Бастапқы код', g2_title: 'Тегін түзетулер', g3_title: '14 күндік қолдау', g4_title: 'Мерзімінде тапсыру',
    g1_desc: 'Барлық код сізге тапсырылады. Оны өзгертуге немесе беруге болады.',
    g2_desc: 'Келісімге сай жұмыс жасамаса — тегін түзетемін.',
    g3_desc: 'Тапсырғаннан кейін 14 күн сұрақтарға жауап беремін.',
    g4_desc: 'Нақты мерзімдер атаймын және оларды сақтаймын.',
    about_p1: 'Мен — NAHA_AI. Telegram боттар жасаймын және бизнес-үдерістерді автоматтандыру үшін Python скрипттер жазамын.',
    about_p2: 'Жылдам және нақты жұмыс жасаймын. Тапсырғаннан кейін қолдануды түсіндіремін.',
    ab1: 'Бір сағат ішінде жауап беремін', ab2: 'Мерзімінде тапсырамын',
    ab3: 'Код GitHub-та жарияланады', ab4: 'Нұсқаулық пен қолдау беремін',
    p1_title: 'Визитка боты', p2_title: 'Жазылым боты', p3_title: 'Тапсырыс боты', p4_title: 'Сайт-визитка',
    p1_desc: 'Бизнес үшін Telegram боты: мәзір, түймелер, байланыстар.',
    p2_desc: 'Онлайн жазылым боты: қызмет таңдау, күн/уақыт, хабарламалар.',
    p3_desc: 'Дүкен боты: каталог, себет, тапсырыс рәсімдеу.',
    p4_desc: 'Киберпанк+самурай стиліндегі бір беттік сайт. HTML/CSS/JS.',
  }
};

let currentLang = 'ru';

function applyTranslations(lang) {
  currentLang = lang;
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'H2') {
        el.innerHTML = t[key] + '<span class="accent">.</span>';
      } else {
        el.textContent = t[key];
      }
    }
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key]) el.placeholder = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  // About section has accent span
  const aboutP1 = document.querySelector('[data-i18n="about_p1"]');
  if (aboutP1 && t.about_p1) {
    aboutP1.innerHTML = t.about_p1.replace('NAHA_AI', '<span class="accent">NAHA_AI</span>');
  }
  // Копирование кнопок — возвращаем оригинальные тексты
  document.querySelectorAll('.copy-btn').forEach(btn => {
    const key = btn.getAttribute('data-i18n');
    if (t[key]) btn.textContent = t[key];
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
});

// ─── МОБИЛЬНОЕ МЕНЮ ─────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
});

function closeMobileNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}

// ─── PROGRESS BAR ───────────────────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
});

// ─── SCROLL TO TOP ───────────────────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── PARTICLES CANVAS ───────────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }
  createParticles();
  window.addEventListener('resize', createParticles);

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,255,${p.alpha})`;
      ctx.fill();
    });
    // Линии между близкими частицами
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,245,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();

// ─── TYPING EFFECT (TERMINAL) ────────────────────────────────────────────────
const terminalLines = [
  { type: 'cmd', text: 'whoami' },
  { type: 'out', text: 'NAHA_AI — Python / Bot Developer', cls: '' },
  { type: 'cmd', text: 'skills --list' },
  { type: 'out', text: 'Python, aiogram, parsing, automation', cls: '' },
  { type: 'cmd', text: 'status' },
  { type: 'out', text: '✓ Available for work', cls: 'accent' },
  { type: 'cmd', text: 'contact --telegram' },
  { type: 'out', text: '@akhnnoname', cls: '', cursor: true }
];

let terminalStarted = false;

function typeTerminal() {
  if (terminalStarted) return;
  terminalStarted = true;
  const body = document.getElementById('terminal-body');
  body.innerHTML = '';
  let lineIdx = 0;

  function typeLine() {
    if (lineIdx >= terminalLines.length) return;
    const line = terminalLines[lineIdx];
    lineIdx++;
    const p = document.createElement('p');
    if (line.type === 'cmd') {
      p.innerHTML = '<span class="cmd">$</span> ';
      body.appendChild(p);
      let i = 0;
      const text = line.text;
      const timer = setInterval(() => {
        p.innerHTML = '<span class="cmd">$</span> ' + text.slice(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          setTimeout(typeLine, 200);
        }
      }, 40);
    } else {
      p.className = 'out' + (line.cls ? ' ' + line.cls : '');
      body.appendChild(p);
      let i = 0;
      const text = line.text;
      const timer = setInterval(() => {
        p.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) {
          clearInterval(timer);
          if (line.cursor) p.innerHTML += ' <span class="cursor">█</span>';
          setTimeout(typeLine, line.cursor ? 0 : 300);
        }
      }, 25);
    }
  }
  typeLine();
}

const terminalObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) typeTerminal(); });
}, { threshold: 0.3 });
const terminalSection = document.getElementById('about');
if (terminalSection) terminalObserver.observe(terminalSection);

// ─── 3D TILT EFFECT ──────────────────────────────────────────────────────────
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── АНИМИРОВАННЫЕ СЧЁТЧИКИ ──────────────────────────────────────────────────
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

// ─── ФОРМА ЗАЯВКИ → TELEGRAM ─────────────────────────────────────────────────
function sendToTelegram() {
  const t = translations[currentLang];
  const name = document.getElementById('order-name').value.trim();
  const task = document.getElementById('order-task').value.trim();
  if (!name || !task) {
    alert(currentLang === 'en' ? 'Please fill in your name and task description' :
          currentLang === 'kz' ? 'Аты мен тапсырманы толтырыңыз' :
          'Заполните имя и описание задачи');
    return;
  }
  const msg = encodeURIComponent(`Привет! Меня зовут ${name}.\n\nЗадача: ${task}`);
  window.open(`https://t.me/akhnnoname?text=${msg}`, '_blank');
}

// ─── КОПИРОВАНИЕ ТЕКСТА ──────────────────────────────────────────────────────
function copyText(id, btn) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '✓ ' + (currentLang === 'en' ? 'Copied' : currentLang === 'kz' ? 'Көшірілді' : 'Скопировано');
    btn.style.background = 'var(--cyan)';
    btn.style.color = '#000';
    btn.style.borderColor = 'var(--cyan)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 2000);
  });
}

// ─── FAQ АККОРДЕОН ───────────────────────────────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');
  // Закрываем все
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  // Открываем текущий, если был закрыт
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ─── АКТИВНЫЙ ПУНКТ НАВИГАЦИИ ────────────────────────────────────────────────
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

// ─── ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ─────────────────────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .stack-item, .contact-card, .review-card, .faq-item').forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});
