/* =========================================================================
   NAHA — осенняя визитка
   ========================================================================= */
(() => {
'use strict';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[(Math.random() * arr.length) | 0];

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const isMobile = matchMedia('(max-width: 700px)').matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} },
};

/* осенняя палитра листьев: жёлтые, зелёные, красные (+ оранжевые) */
const LEAF_COLORS = [
  '#f2c230', '#e8b632', '#d9a21b', '#f5d35a',
  '#7a9a3c', '#8fb043', '#5f7f2a', '#a3b94c',
  '#c0392b', '#a8261c', '#d4462f', '#8e1f16',
  '#e0812f', '#d0681f',
];

/* ─── ПЕРЕВОДЫ ─────────────────────────────────────────────────────────── */
const I18N = {
  en: {
    nav_services: 'Services', nav_portfolio: 'Work', nav_process: 'Process', nav_payment: 'Payment', nav_faq: 'FAQ',
    btn_write: 'Message me', skip: 'Skip',
    available: 'Taking orders — reply within an hour',
    hero_t1: 'A bot that', hero_t2: 'sells for you', hero_t3: 'while you sleep',
    hero_desc: 'I build Telegram bots, Python automation and websites for small businesses. Clients book, orders get placed, reports get collected — without you.',
    btn_telegram: 'Discuss in Telegram', btn_works: 'See my work',
    stat2: 'days for a simple bot', stat1: 'starting price', cnt1: 'projects in portfolio',
    notify_title: 'New booking',
    services_title: 'What I do', services_lead: 'The price is fixed before work starts. Below are starting prices for a simple version.',
    s1_title: 'Telegram bot', badge_hit: 'most ordered',
    s1_desc: 'Client booking, order intake, newsletters, payments. Any logic for your business.',
    s1_l1: 'Business card bot', s1_l2: 'Bookings & orders', s1_l3: 'Payments', from: 'from',
    s2_title: 'Automation', s2_desc: 'Python scripts for Excel and Google Sheets. Auto-fill, formulas, API integrations.',
    s2_l2: 'Auto reports', s2_l3: 'Telegram link-up',
    s3_title: 'Data scraping', s3_desc: 'I collect data from any site — products, prices, contacts — and deliver it in Excel or Google Sheets.',
    s3_l2: 'Any website', s3_l3: 'Scheduled runs',
    s4_title: 'Landing page', s4_desc: 'A one-page site for a business or freelancer. Name, services, contact buttons. Fast.',
    s4_l2: 'Free hosting', s4_l3: 'Responsive',
    s5_title: 'Discord bot', s5_desc: 'A bot for your Discord server: welcomes, slash commands, auto-replies. Turnkey.',
    s5_l1: 'Slash commands', s5_l2: 'Welcomes', s5_l3: 'Custom logic',
    work_title: 'Work', f_all: 'All', f_bot: 'Bots', f_auto: 'Automation', f_web: 'Sites & UI',
    open: 'Open →', download: 'Download ZIP ↓', cnk_art: 'dishes', isekai_art: 'dungeon rank',
    p18_desc: 'Accessibility audit for Framer, published in their marketplace. Checks contrast, alt text and headings against WCAG 2.1 AA — separately in light and dark themes. React + TypeScript, 180 tests.',
    p17_desc: 'A Windows desktop reimagined as the interface of Olympus: artifact icons, clock, weather, system monitor, obsidian windows and a lock screen. HTML/CSS/JS, SVG.',
    p16_desc: 'Paper 1.21.11 plugin replacing the Crop & Kettle datapack: 175 dishes, 19 decor blocks in 3D via ItemDisplay, a distiller, wine aging, 140 recipes.',
    p15_desc: 'An isekai-style MMO RPG server: races, classes, F–SS dungeons, race wars and an economy. Fabric, Kotlin + Java, own DB layer on Exposed.',
    p1_title: 'Business card bot', p1_desc: 'Menu, buttons, contacts and service list. aiogram 3.',
    p2_title: 'Booking bot', p2_desc: 'Service choice, date and time, admin notification. aiogram 3.',
    p3_title: 'Order bot', p3_desc: 'Catalog, cart, checkout, notifications. aiogram 3.',
    p8_title: 'Discord bot', p8_desc: '/ping /info /help slash commands, welcomes new members. discord.py.',
    t_parser: 'Scraper', t_auto: 'Automation', t_db: 'Database', t_web: 'Front-end', t_site: 'Website',
    p9_desc: 'Watches Kwork for new requests by keyword and sends them to Telegram. Playwright, runs 24/7.',
    p10_desc: 'Contacts of cafés, salons and garages via OpenStreetMap — into Excel with phones and addresses.',
    p11_title: 'Price monitor', p11_desc: 'Competitor prices, change history, Telegram alerts. Python + aiohttp.',
    p12_title: 'Sales dashboard', p12_desc: 'Data import, charts, triggers and alerts in Google Sheets. Apps Script.',
    p13_title: 'Client CRM database', p13_desc: 'Clients, orders, payments, analytics. PostgreSQL + migrations.',
    p5_title: 'Report generator', p5_desc: 'Excel report with charts, formatting and a summary sheet. Python + openpyxl.',
    p6_title: 'Scraping to Excel', p6_desc: 'Data from any site into a clean table. Python + BeautifulSoup.',
    p7_title: 'Business ledger template', p7_desc: 'Income and expenses over 12 months, yearly report, dropdowns.',
    p14_title: 'TechFlow landing', p14_desc: 'Responsive landing for an IT company with animations. HTML/CSS/JS.',
    p4_title: 'This website', p4_desc: 'Autumn portfolio with a live bot demo, work filter and three languages. HTML/CSS/JS, GitHub Pages.',
    process_title: 'How we work',
    ps1_title: 'Discussion', ps1_desc: 'You describe the task in Telegram. I reply within an hour, ask questions and name the price.', ps1_time: '≈ 1 hour',
    ps2_title: 'Development', ps2_desc: 'I start after a 50% deposit and show progress along the way.', ps2_time: '1–5 days',
    ps3_title: 'Testing', ps3_desc: 'I test everything myself, then give you a demo — you try it and send edits.', ps3_time: 'before delivery',
    ps4_title: 'Delivery', ps4_desc: 'I hand over the source code, explain how to use it and stay in touch.', ps4_time: '+14 days support',
    g1_title: 'The code is yours', g1_desc: 'You get all the source code. Change it and share it with anyone.',
    g2_title: 'Free fixes', g2_desc: 'If something does not work as agreed, I fix it for free.',
    g3_title: '14-day support', g3_desc: 'For two weeks after delivery I answer questions and help with setup.',
    g4_title: 'Honest deadlines', g4_desc: 'I give realistic deadlines and keep them. If something changes, I warn you early.',
    nav_about: 'About me',
    about_p1: "I'm Akhan, a developer who goes by NAHA. I write Telegram bots and Python scripts that take routine off a business.",
    about_p2: 'I work fast and to the point. My code is on GitHub — you can check it before ordering. After delivery I explain how to use the result and stay in touch.',
    rev_title: 'Reviews', rev_empty: 'No reviews yet. If we have worked together, I would appreciate yours.',
    ph_rev_name: 'Your name', ph_rev_text: 'Your review', btn_review: 'Leave a review',
    payment_desc: '50% before work starts, the rest after you accept the result.',
    kaspi_desc: 'Transfer by phone number, no fee', usdt_desc: 'Crypto on the Tron network',
    copy_num: 'Copy', copy_addr: 'Copy', payment_note: 'After paying, send a screenshot in Telegram',
    faq_title: 'FAQ', faq_lead: 'No answer here? Ask in Telegram, it is faster.',
    faq1_q: 'How long does it take?', faq1_a: 'Simple tasks take 1–2 days. Bots with complex logic take up to 5 days. We agree on the deadline in advance.',
    faq2_q: 'Is a deposit required?', faq2_a: 'Yes, 50% before work starts. The rest after delivery and your approval.',
    faq3_q: 'What if I do not like the result?', faq3_a: 'I revise for free until the result matches what we agreed at the start.',
    faq4_q: 'Can features be added later?', faq4_a: 'Yes. Extra work is discussed separately — scope and price depend on the task.',
    faq5_q: 'Do you work with international clients?', faq5_a: 'Yes, I accept USDT (TRC20). I work fully remotely — your country does not matter.',
    order_title: 'Tell me what you want to automate', order_desc: 'I will reply within an hour with an exact price.',
    l_name: 'Your name', ph_name: 'Name', l_task: 'Task', ph_task: 'e.g. a booking bot for a salon, 3 stylists, client reminders',
    btn_send: 'Send via Telegram', order_note: 'Telegram opens with a ready message — just press Send.',
    footer: 'Telegram bots & automation', to_top: 'Back to top ↑',
    on_request: 'code on request',
    copied: 'Copied', err_order: 'Fill in your name and describe the task.', err_review: 'Fill in your name and review.',
  },
  kz: {
    nav_services: 'Қызметтер', nav_portfolio: 'Жұмыстар', nav_process: 'Процесс', nav_payment: 'Төлем', nav_faq: 'Сұрақтар',
    btn_write: 'Жазу', skip: 'Өткізу',
    available: 'Тапсырыс қабылдаймын — бір сағатта жауап беремін',
    hero_t1: 'Сіз ұйықтап', hero_t2: 'жатқанда сататын', hero_t3: 'бот',
    hero_desc: 'Шағын бизнеске Telegram боттар, Python-автоматтандыру және сайттар жасаймын. Клиенттер жазылады, тапсырыстар рәсімделеді, есептер жиналады — сіздің қатысуыңызсыз.',
    btn_telegram: 'Telegram-да талқылау', btn_works: 'Жұмыстарды көру',
    stat2: 'күнде қарапайым бот', stat1: 'бастапқы баға', cnt1: 'портфолиодағы жоба',
    notify_title: 'Жаңа жазылым',
    services_title: 'Не істеймін', services_lead: 'Баға жұмыс басталғанға дейін бекітіледі. Төменде қарапайым нұсқаның бастапқы бағасы.',
    s1_title: 'Telegram боты', badge_hit: 'ең көп тапсырыс',
    s1_desc: 'Клиент жазылымы, тапсырыс қабылдау, хабарламалар, төлем. Бизнесіңізге сай кез келген логика.',
    s1_l1: 'Визитка бот', s1_l2: 'Жазылым мен тапсырыс', s1_l3: 'Төлем қабылдау', from: 'бастап',
    s2_title: 'Автоматтандыру', s2_desc: 'Excel және Google Sheets үшін Python скрипттер. Автотолтыру, формулалар, API.',
    s2_l2: 'Авто-есептер', s2_l3: 'Telegram байланысы',
    s3_title: 'Деректер жинау', s3_desc: 'Кез келген сайттан тауар, баға, байланыс жинаймын — Excel немесе Google Sheets-ке.',
    s3_l2: 'Кез келген сайт', s3_l3: 'Кесте бойынша',
    s4_title: 'Сайт-визитка', s4_desc: 'Бизнес не фрилансерге бір беттік сайт. Аты, қызметтер, байланыс түймелері.',
    s4_l2: 'Тегін хостинг', s4_l3: 'Бейімделгіш',
    s5_title: 'Discord боты', s5_desc: 'Discord серверіне бот: қарсы алу, слэш-командалар, автожауаптар.',
    s5_l1: 'Слэш-командалар', s5_l2: 'Қарсы алу', s5_l3: 'Өз логикасы',
    work_title: 'Жұмыстар', f_all: 'Барлығы', f_bot: 'Боттар', f_auto: 'Автоматтандыру', f_web: 'Сайттар мен UI',
    open: 'Ашу →', download: 'ZIP жүктеу ↓', cnk_art: 'тағам', isekai_art: 'данж рангі',
    p1_title: 'Визитка боты', p2_title: 'Жазылым боты', p3_title: 'Тапсырыс боты', p8_title: 'Discord боты',
    t_parser: 'Парсер', t_auto: 'Автоматтандыру', t_db: 'Дерекқор', t_web: 'Беттеу', t_site: 'Сайт',
    p11_title: 'Баға мониторингі', p12_title: 'Сату дашборды', p13_title: 'CRM клиент базасы',
    p5_title: 'Есеп генераторы', p6_title: 'Excel-ге парсинг', p7_title: 'Бизнес есеп үлгісі', p4_title: 'Осы сайт',
    process_title: 'Жұмыс қалай өтеді',
    ps1_title: 'Талқылау', ps1_desc: 'Telegram-да тапсырманы жазасыз. Бір сағатта жауап беремін, сұрақ қойып, бағасын айтамын.', ps1_time: '≈ 1 сағат',
    ps2_title: 'Жасау', ps2_desc: '50% алдын ала төлемнен кейін бастаймын, барысын көрсетіп отырамын.', ps2_time: '1–5 күн',
    ps3_title: 'Тестілеу', ps3_desc: 'Бәрін өзім тексеремін, сосын демо беремін — сіз сынап, түзетулер жібересіз.', ps3_time: 'тапсыруға дейін',
    ps4_title: 'Тапсыру', ps4_desc: 'Бастапқы кодты беріп, қолдануды түсіндіремін. Байланыста қаламын.', ps4_time: '+14 күн қолдау',
    g1_title: 'Код сіздікі', g1_desc: 'Барлық бастапқы код сізге беріледі. Өзгертуге және беруге болады.',
    g2_title: 'Тегін түзету', g2_desc: 'Келісілгендей жұмыс істемесе — тегін түзетемін.',
    g3_title: '14 күн қолдау', g3_desc: 'Тапсырғаннан кейін екі апта сұрақтарға жауап беремін.',
    g4_title: 'Адал мерзім', g4_desc: 'Нақты мерзім айтып, сақтаймын. Өзгеріс болса, алдын ала ескертемін.',
    nav_about: 'Мен туралы',
    about_p1: 'Мен Ахан, NAHA деген атпен жұмыс істейтін әзірлеушімін. Бизнестен күнделікті жұмысты алатын Telegram боттар мен Python скрипттер жазамын.',
    about_p2: 'Тез әрі нақты жұмыс істеймін. Кодты GitHub-қа саламын — тапсырысқа дейін тексеруге болады. Тапсырғаннан кейін қолдануды түсіндіремін.',
    rev_title: 'Пікірлер', rev_empty: 'Әзірге пікір жоқ. Бірге жұмыс істеген болсақ, пікіріңізге қуаныштымын.',
    ph_rev_name: 'Атыңыз', ph_rev_text: 'Пікіріңіз', btn_review: 'Пікір қалдыру',
    payment_desc: 'Жұмыс басталғанға дейін 50%, қалғаны нәтижені қабылдағаннан кейін.',
    kaspi_desc: 'Нөмір бойынша аударым, комиссиясыз', usdt_desc: 'Tron желісіндегі криптовалюта',
    copy_num: 'Көшіру', copy_addr: 'Көшіру', payment_note: 'Төлегеннен кейін скриншотты Telegram-ға жіберіңіз',
    faq_title: 'Жиі сұрақтар', faq_lead: 'Жауап таппасаңыз — Telegram-да сұраңыз, тезірек.',
    faq1_q: 'Орындау мерзімі қандай?', faq1_a: 'Қарапайым тапсырма — 1–2 күн. Күрделі боттар — 5 күнге дейін. Мерзім алдын ала келісіледі.',
    faq2_q: 'Алдын ала төлем керек пе?', faq2_a: 'Иә, жұмыс басталғанға дейін 50%. Қалғаны тапсырып, мақұлдағаннан кейін.',
    faq3_q: 'Нәтиже ұнамаса ше?', faq3_a: 'Басында келіскен нәтижеге жеткенше тегін түзетемін.',
    faq4_q: 'Кейін функция қосуға бола ма?', faq4_a: 'Иә. Қосымша жұмыс бөлек талқыланады — көлемі мен бағасы тапсырмаға байланысты.',
    faq5_q: 'Шетелдік клиенттермен жұмыс істейсіз бе?', faq5_a: 'Иә, USDT (TRC20) қабылдаймын. Толық қашықтан жұмыс істеймін.',
    order_title: 'Нені автоматтандыру керек екенін айтыңыз', order_desc: 'Бір сағатта жауап беріп, нақты бағасын айтамын.',
    l_name: 'Атыңыз', ph_name: 'Аты', l_task: 'Тапсырма', ph_task: 'Мысалы: салонға жазылым боты, 3 шебер, клиенттерге еске салу',
    btn_send: 'Telegram-ға жіберу', order_note: 'Дайын хабармен Telegram ашылады — тек «Жіберу» басыңыз.',
    footer: 'Telegram боттар және автоматтандыру', to_top: 'Жоғары ↑',
    on_request: 'код сұраныс бойынша',
    copied: 'Көшірілді', err_order: 'Атыңыз бен тапсырманы толтырыңыз.', err_review: 'Атыңыз бен пікіріңізді толтырыңыз.',
  },
};
const RU_EXTRA = { copied: 'Скопировано', err_order: 'Заполните имя и опишите задачу.', err_review: 'Заполните имя и отзыв.' };
const CHAT = {
  ru: { hi: 'Здравствуйте! Хочу записаться', pick: 'Добрый день! Выберите услугу:', svc: ['Стрижка', 'Борода', 'Комплекс'],
        slot: 'Свободно завтра:', done: 'Готово ✓ Вы записаны на завтра, 14:30. Напомню за час до визита.',
        typing: 'печатает…', online: 'в сети', note: 'Айдана · Стрижка · завтра, 14:30' },
  en: { hi: 'Hi! I want to book', pick: 'Hello! Pick a service:', svc: ['Haircut', 'Beard', 'Combo'],
        slot: 'Free tomorrow:', done: 'Done ✓ You are booked for tomorrow, 2:30 PM. I will remind you an hour before.',
        typing: 'typing…', online: 'online', note: 'Aidana · Haircut · tomorrow, 2:30 PM' },
  kz: { hi: 'Сәлеметсіз бе! Жазылғым келеді', pick: 'Қайырлы күн! Қызметті таңдаңыз:', svc: ['Шаш алу', 'Сақал', 'Кешен'],
        slot: 'Ертең бос:', done: 'Дайын ✓ Ертең 14:30-ға жазылдыңыз. Бір сағат бұрын еске саламын.',
        typing: 'жазып жатыр…', online: 'желіде', note: 'Айдана · Шаш алу · ертең, 14:30' },
};

let lang = 'ru';
const RU = { ...RU_EXTRA };
$$('[data-i18n]').forEach(el => { RU[el.dataset.i18n] ??= el.textContent.trim(); });
$$('[data-i18n-ph]').forEach(el => { RU[el.dataset.i18nPh] ??= el.placeholder; });
const t = key => (lang !== 'ru' && I18N[lang][key]) || RU[key] || key;

function applyLang(l) {
  lang = I18N[l] || l === 'ru' ? l : 'ru';
  document.documentElement.lang = lang === 'kz' ? 'kk' : lang;
  $$('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
    if (el.classList.contains('split')) splitWords(el, true);
  });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  store.set('naha_lang', lang);
  renderReviews();
  chat.restart();
}
$$('.lang-btn').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));

/* ─── ЗВУК ─────────────────────────────────────────────────────────────── */
const sound = (() => {
  let ctx = null;
  let on = store.get('naha_sound') === '1';
  const btn = $('#sound-toggle');
  const sync = () => btn && btn.setAttribute('aria-pressed', String(on));
  const ensure = () => { if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); } if (ctx && ctx.state === 'suspended') ctx.resume(); return ctx; };
  function click(pitch = 1) {
    if (!on || !ensure()) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(680 * pitch, now);
    o.frequency.exponentialRampToValueAtTime(260 * pitch, now + .09);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(.12, now + .008);
    g.gain.exponentialRampToValueAtTime(0.0001, now + .14);
    o.connect(g).connect(ctx.destination); o.start(now); o.stop(now + .16);
  }
  function rustle(vol = .08) {
    if (!on || !ensure()) return;
    const now = ctx.currentTime, len = .35;
    const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2) * (Math.random() < .3 ? 1 : .35);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = .8;
    const g = ctx.createGain(); g.gain.value = vol;
    src.connect(f).connect(g).connect(ctx.destination); src.start(now);
  }
  btn?.addEventListener('click', () => { on = !on; store.set('naha_sound', on ? '1' : '0'); sync(); if (on) rustle(.1); });
  sync();
  document.addEventListener('click', e => {
    const el = e.target.closest('a, button, summary, .chip');
    if (el && el !== btn) click(el.classList.contains('btn-accent') ? .8 : 1);
  });
  return { click, rustle };
})();

/* ─── ТЕМА ─────────────────────────────────────────────────────────────── */
const isLight = () => {
  const th = document.documentElement.dataset.theme;
  return th ? th === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
};
$('#theme-toggle')?.addEventListener('click', () => {
  const next = isLight() ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  store.set('naha_theme', next);
  sound.rustle(.06);
  leaves.burst(isMobile ? 8 : 16);
});

/* ─── РЕАЛИСТИЧНЫЕ ЛИСТЬЯ (спрайты рисуются один раз) ──────────────────── */
const LEAF_PAL = [
  ['#f8d85a', '#d69a14', '#8a5a08'], ['#f2c230', '#c47f10', '#7a4a06'],   // жёлтые
  ['#b8cf62', '#6f8f2a', '#3e5512'], ['#9cbc4a', '#56741c', '#2f440c'],   // зелёные
  ['#e8563a', '#a8261c', '#5e120b'], ['#d2402a', '#8e1f16', '#4a0d08'],   // красные
  ['#f3a043', '#c4591c', '#6e2a0a'],                                      // оранжевый
];
function leafPath(ctx, shape, s) {
  ctx.beginPath();
  if (shape === 0) { // кленовый
    const pts = [[0,-1],[.13,-.62],[.34,-.8],[.36,-.5],[.62,-.62],[.52,-.34],[.95,-.32],[.72,-.12],[.86,.06],[.56,.12],[.66,.36],[.3,.26],[.14,.52],[.05,.44],[0,.56],[-.05,.44],[-.14,.52],[-.3,.26],[-.66,.36],[-.56,.12],[-.86,.06],[-.72,-.12],[-.95,-.32],[-.52,-.34],[-.62,-.62],[-.36,-.5],[-.34,-.8],[-.13,-.62]];
    pts.forEach(([x, y], i) => i ? ctx.lineTo(x * s, y * s) : ctx.moveTo(x * s, y * s));
    ctx.closePath();
  } else if (shape === 1) { // дубовый
    ctx.moveTo(0, -s);
    const side = k => {
      const lobes = 4;
      for (let i = 1; i <= lobes; i++) {
        const y0 = -s + (i - .5) * (1.75 * s / lobes), y1 = -s + i * (1.75 * s / lobes);
        const w = s * (.28 + .22 * Math.sin(i / lobes * Math.PI));
        ctx.quadraticCurveTo(k * w * 1.25, y0 - s * .08, k * w * .55, y1 - s * .02);
      }
      ctx.lineTo(0, s * .8);
    };
    side(1); ctx.moveTo(0, -s); side(-1);
  } else { // берёзовый / липовый
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * .72, -s * .55, s * .78, s * .35, 0, s * .78);
    ctx.bezierCurveTo(-s * .78, s * .35, -s * .72, -s * .55, 0, -s);
  }
}
const leafSprites = (() => {
  const SIZE = 128, list = [];
  const canBlur = (() => { try { const c = document.createElement('canvas').getContext('2d'); c.filter = 'blur(2px)'; return c.filter === 'blur(2px)'; } catch { return false; } })();
  for (const pal of LEAF_PAL) for (let shape = 0; shape < 3; shape++) {
    const cv = document.createElement('canvas'); cv.width = cv.height = SIZE;
    const c = cv.getContext('2d'), s = SIZE * .42;
    c.translate(SIZE / 2, SIZE / 2);
    // черешок
    c.strokeStyle = pal[2]; c.lineWidth = 2.2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, s * .5); c.quadraticCurveTo(s * .06, s * .8, -s * .04, s * 1.1); c.stroke();
    c.save(); leafPath(c, shape, s); c.clip();
    const g = c.createLinearGradient(-s, -s, s, s);
    g.addColorStop(0, pal[0]); g.addColorStop(.55, pal[1]); g.addColorStop(1, pal[2]);
    c.fillStyle = g; c.fillRect(-s * 1.2, -s * 1.2, s * 2.4, s * 2.4);
    for (let i = 0; i < 14; i++) { // пятна и неоднородность
      c.fillStyle = Math.random() < .5 ? `rgba(80,30,5,${rand(.06, .16)})` : `rgba(255,235,160,${rand(.05, .14)})`;
      c.beginPath(); c.ellipse(rand(-s, s), rand(-s, s), rand(2, s * .35), rand(2, s * .25), rand(0, 3), 0, 6.28); c.fill();
    }
    c.strokeStyle = 'rgba(255,240,190,.35)'; c.lineWidth = 1.4; // прожилки
    c.beginPath(); c.moveTo(0, s * .55); c.lineTo(0, -s * .92); c.stroke();
    c.lineWidth = .9;
    const veins = shape === 0 ? [[-.9, -.3], [.9, -.3], [-.62, .36], [.62, .36], [-.34, -.8], [.34, -.8]] : [[-.55, -.55], [.55, -.55], [-.62, -.15], [.62, -.15], [-.55, .25], [.55, .25]];
    veins.forEach(([x, y]) => { c.beginPath(); c.moveTo(0, shape === 0 ? s * .2 : y * s + s * .25); c.quadraticCurveTo(x * s * .4, y * s * .9 + s * .1, x * s * .85, y * s); c.stroke(); });
    const hl = c.createLinearGradient(-s, 0, s, 0); // объём: свет слева, тень справа
    hl.addColorStop(0, 'rgba(255,255,255,.16)'); hl.addColorStop(.5, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(40,15,0,.22)');
    c.fillStyle = hl; c.fillRect(-s * 1.2, -s * 1.2, s * 2.4, s * 2.4);
    c.restore();
    c.save(); leafPath(c, shape, s); c.strokeStyle = 'rgba(50,20,5,.45)'; c.lineWidth = 1.2; c.stroke(); c.restore();
    let blur = cv;
    if (canBlur) {
      blur = document.createElement('canvas'); blur.width = blur.height = SIZE;
      const b = blur.getContext('2d'); b.filter = 'blur(3px)'; b.drawImage(cv, 0, 0);
    }
    list.push({ sharp: cv, blur });
  }
  return list;
})();
function drawLeafSprite(ctx, spr, x, y, size, rot, flip, alpha, blurred) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rot); ctx.scale(flip, 1);
  ctx.globalAlpha = alpha * (.62 + .38 * Math.abs(flip));
  ctx.drawImage(blurred ? spr.blur : spr.sharp, -size / 2, -size / 2, size, size);
  ctx.restore();
}

/* ─── ЛИСТОПАД ПО ВСЕМУ САЙТУ ──────────────────────────────────────────── */
const leaves = (() => {
  const cv = $('#leaves'); const ctx = cv.getContext('2d');
  let W, H, dpr, list = [], running = false, last = 0, wind = 0, scrollV = 0, lastY = scrollY;
  const mouse = { x: -999, y: -999 };
  const COUNT = reduceMotion ? 0 : isMobile ? 12 : 22;
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function make(top) {
    const near = Math.random() < .12;
    return {
      x: rand(-40, W + 40), y: top ? rand(-H * .3, -30) : rand(-H, H),
      s: near ? rand(46, 70) : rand(18, isMobile ? 30 : 36), near, spr: pick(leafSprites),
      vy: near ? rand(70, 110) : rand(30, 62), sway: rand(24, 60), ph: rand(0, 6.28), phs: rand(.7, 1.6),
      rot: rand(0, 6.28), vr: rand(-1.4, 1.4), flipPh: rand(0, 6.28), flipS: rand(1.4, 3.2),
      vx: 0, a: near ? .75 : rand(.8, .95),
    };
  }
  function frame(ts) {
    if (!running) return;
    const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    scrollV = lerp(scrollV, 0, .06);
    wind = lerp(wind, Math.sin(ts / 4000) * 18, .02);
    ctx.clearRect(0, 0, W, H);
    for (const l of list) {
      l.ph += l.phs * dt; l.flipPh += l.flipS * dt;
      const dx = l.x - mouse.x, dy = l.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 9000) { const d = Math.sqrt(d2) || 1; l.vx += dx / d * 220 * dt; l.vr += (Math.random() - .5) * 6 * dt; }
      l.vx *= .96;
      l.x += (Math.sin(l.ph) * l.sway + wind + l.vx) * dt;
      l.y += (l.vy + scrollV * (l.near ? -1 : -.6)) * dt;
      l.rot += (l.vr + Math.cos(l.ph) * .8) * dt;
      if (l.y > H + 60) Object.assign(l, make(true), { y: -40 });
      if (l.y < -H * .4) l.y = H + 40;
      if (l.x < -80) l.x = W + 70; else if (l.x > W + 80) l.x = -70;
      drawLeafSprite(ctx, l.spr, l.x, l.y, l.s, l.rot, Math.cos(l.flipPh), l.a, l.near);
    }
    requestAnimationFrame(frame);
  }
  function start() {
    if (!COUNT || running) return;
    resize(); list = Array.from({ length: COUNT }, () => make(false));
    running = true; last = performance.now(); requestAnimationFrame(frame);
  }
  addEventListener('resize', () => running && resize());
  addEventListener('scroll', () => { const y = scrollY; scrollV = clamp(lerp(scrollV, (y - lastY) * 30, .3), -900, 900); lastY = y; }, { passive: true });
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mouse.x = e.clientX; mouse.y = e.clientY; } }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
    else if (list.length && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  });
  return {
    start,
    burst(n) {
      if (!running) return;
      for (let i = 0; i < n; i++) { const l = make(true); l.y = rand(-80, -10); l.vy *= 1.4; list.push(l); }
      setTimeout(() => { list.splice(COUNT); }, 9000);
    },
  };
})();

/* ─── ПРЕЛОАДЕР: ШАГ В ОСЕННИЙ ПАРК (фото + WebGL) ─────────────────────── */
function runIntro(done) {
  const loader = $('#loader');
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true;
    loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    store.sset('naha_intro', '1');
    setTimeout(() => loader.remove(), 1300);
    done();
  };
  if (!loader) return done();
  if (reduceMotion || store.sget('naha_intro')) { loader.remove(); document.body.classList.remove('is-loading'); return done(); }
  document.body.classList.add('is-loading');
  $('#loader-skip').addEventListener('click', finish);

  const glc = $('#loader-gl'), lc = $('#loader-leaves'), lctx = lc.getContext('2d');
  const gl = glc.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  const img = new Image();
  img.src = innerWidth < 900 ? 'img/autumn-sm.jpg' : 'img/autumn.jpg';
  const bail = setTimeout(finish, 6000); // если фото не загрузилось — сразу на сайт

  let W, H, dpr;
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    lc.width = W * dpr; lc.height = H * dpr; lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const q = isMobile ? 1 : Math.min(dpr, 1.25);
    glc.width = W * q; glc.height = H * q;
    if (gl) gl.viewport(0, 0, glc.width, glc.height);
  }
  resize(); addEventListener('resize', resize);

  const vs = 'attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
  const fs = `precision highp float;
varying vec2 v;uniform sampler2D img;uniform vec2 res;uniform float ia,t,z,e;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
void main(){
 float sa=res.x/res.y;vec2 iuv=v;
 if(sa>ia)iuv.y=.5+(v.y-.5)*ia/sa;else iuv.x=(sa<1.?.72:.5)+(v.x-.5)*sa/ia;
 vec2 vp=vec2(.31,.74);
 float d=clamp(distance(iuv,vp)*1.5,0.,1.);
 iuv=vp+(iuv-vp)/(1.+z*(.16+.8*d*d));
 iuv.y+=sin(t*5.6)*.0022*(1.-e);iuv.x+=sin(t*2.8)*.0014*(1.-e);
 float can=smoothstep(.66,.18,iuv.y);
 iuv+=can*.0018*vec2(n(iuv*16.+t*.9)-.5,n(iuv*16.-t*.7+3.)-.5);
 float wm=smoothstep(.665,.7,iuv.x)*smoothstep(.975,.94,iuv.x)*smoothstep(.685,.72,iuv.y)*smoothstep(1.,.965,iuv.y);
 iuv.x+=wm*sin(iuv.y*230.-t*2.3)*.0017;
 iuv.y+=wm*sin(iuv.x*150.+t*1.7)*.0011;
 vec3 c=texture2D(img,clamp(iuv,.001,.999)).rgb;
 float lum=dot(c,vec3(.299,.587,.114));
 float sp=pow(n(iuv*vec2(170.,560.)+vec2(t*.5,t*1.6)),16.)*wm;
 c+=vec3(1.,.9,.7)*sp*3.*smoothstep(.35,.85,lum);
 vec2 sun=vec2(.775,.5);vec2 dv=(iuv-sun)*vec2(ia,1.);float ds=length(dv);float an=atan(dv.y,dv.x);
 float rays=pow(n(vec2(an*8.,t*.22)),3.)*.9+pow(n(vec2(an*21.+3.,-t*.18)),4.)*.6;
 c+=vec3(1.,.76,.42)*rays*smoothstep(1.1,0.,ds)*.2;
 c+=vec3(1.,.8,.5)*smoothstep(.4,0.,ds)*(.1+.04*sin(t*1.3));
 float fog=fbm(vec2(iuv.x*3.-t*.06,iuv.y*7.+t*.02))*smoothstep(.5,.95,iuv.y);
 c=mix(c,vec3(1.,.86,.64),fog*.16);
 c=pow(c,vec3(.96))*vec3(1.05,1.,.93);
 c*=mix(.5,1.,smoothstep(1.2,.3,distance(v,vec2(.5))));
 c*=smoothstep(0.,1.1,t);
 c=mix(c,vec3(1.,.95,.86),e*smoothstep(1.6,0.,ds)*e);
 gl_FragColor=vec4(c,1.);}`;

  let prog = null, U = {};
  if (gl) {
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) prog = null;
  }
  if (prog) {
    gl.useProgram(prog);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['img', 'res', 'ia', 't', 'z', 'e'].forEach(k => { U[k] = gl.getUniformLocation(prog, k); });
  }

  // листья сцены: дальние, средние и ближние размытые
  const VPX = .31, VPY = .7;
  const mk = layer => ({
    layer, x: rand(-.1, 1.1), y: rand(-1.1, 1), spr: pick(leafSprites),
    s: layer === 2 ? rand(70, 110) : layer === 1 ? rand(26, 44) : rand(10, 18),
    vy: layer === 2 ? rand(.16, .26) : layer === 1 ? rand(.08, .14) : rand(.04, .07),
    ph: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-1.8, 1.8), f: rand(0, 6.28), fs: rand(1.6, 3.4),
  });
  const air = [
    ...Array.from({ length: isMobile ? 14 : 26 }, () => mk(0)),
    ...Array.from({ length: isMobile ? 10 : 18 }, () => mk(1)),
    ...Array.from({ length: isMobile ? 2 : 4 }, () => mk(2)),
  ];

  const DUR = 6200;
  let t0, last, alive = true;
  function frame(now) {
    if (!alive) return;
    const el = now - t0, p = clamp(el / DUR, 0, 1), dt = Math.min(.05, (now - last) / 1000); last = now;
    const z = p < .72 ? p / .72 * .55 : .55 + Math.pow((p - .72) / .28, 2) * 1.6;
    const e = clamp((p - .76) / .24, 0, 1);
    if (prog) {
      gl.uniform2f(U.res, glc.width, glc.height); gl.uniform1f(U.ia, img.width / img.height);
      gl.uniform1f(U.t, el / 1000); gl.uniform1f(U.z, z); gl.uniform1f(U.e, e);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    lctx.clearRect(0, 0, W, H);
    const push = .08 + z * .5;
    for (const l of air) {
      l.ph += dt * 1.2; l.f += l.fs * dt; l.rot += l.vr * dt;
      l.y += l.vy * dt;
      l.x += (Math.sin(l.ph) * .04 - .02) * dt + (l.x - VPX) * push * dt * (l.layer + 1) * .5;
      l.y += (l.y - VPY) * push * dt * (l.layer + 1) * .25;
      if (l.y > 1.15 || l.x < -.2 || l.x > 1.2) Object.assign(l, mk(l.layer), { y: rand(-.2, -.05) });
      drawLeafSprite(lctx, l.spr, l.x * W, l.y * H, l.s * (isMobile ? .75 : 1) * (1 + z * .4 * l.layer), l.rot, Math.cos(l.f),
        l.layer === 0 ? .8 : .95, l.layer === 2);
    }
    if (el >= DUR) { alive = false; finish(); return; }
    requestAnimationFrame(frame);
  }
  img.onload = () => {
    clearTimeout(bail);
    if (prog) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U.img, 0);
    } else {
      glc.replaceWith(Object.assign(img, { className: 'loader-fallback', alt: '' }));
    }
    loader.classList.add('is-ready');
    t0 = last = performance.now();
    requestAnimationFrame(frame);
  };
  img.onerror = () => { clearTimeout(bail); finish(); };
}

/* ─── HERO: ШЕЙДЕР-АУРА ────────────────────────────────────────────────── */
function startAura() {
  const cv = $('#aura'); if (!cv || reduceMotion) return;
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
  if (!gl) return;
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform float light;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r;vec2 p=uv*vec2(r.x/r.y,1.);
 float q=fbm(p*1.4+vec2(t*.025,-t*.018));
 float f=fbm(p*1.8+q*1.6+vec2(-t*.02,t*.015));
 float g=smoothstep(.85,.0,distance(uv,m));
 vec3 base=mix(vec3(.086,.07,.051),vec3(.96,.93,.878),light);
 vec3 amber=mix(vec3(.62,.3,.08),vec3(.93,.62,.3),light);
 vec3 red=mix(vec3(.5,.13,.08),vec3(.86,.45,.36),light);
 vec3 green=mix(vec3(.28,.34,.1),vec3(.62,.7,.42),light);
 vec3 gold=mix(vec3(.75,.55,.12),vec3(.97,.82,.45),light);
 vec3 c=base;
 c=mix(c,amber,smoothstep(.35,.85,f)*(.35+.55*g));
 c=mix(c,red,smoothstep(.55,.9,fbm(p*2.6-t*.03+4.))*.45);
 c=mix(c,green,smoothstep(.6,.92,fbm(p*2.2+t*.02+9.))*.35);
 c+=gold*pow(g,3.)*.28*(1.-light*.6);
 c=mix(c,base,smoothstep(.45,.0,uv.y)*.6);
 gl_FragColor=vec4(c,1.);}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const uR = U('r'), uT = U('t'), uM = U('m'), uL = U('light');
  const scale = isMobile ? .35 : .5;
  let visible = true, mx = .7, my = .6, tx = .7, ty = .6, lightV = isLight() ? 1 : 0;
  function resize() { cv.width = cv.clientWidth * scale; cv.height = cv.clientHeight * scale; gl.viewport(0, 0, cv.width, cv.height); }
  resize(); addEventListener('resize', resize);
  $('.hero').addEventListener('pointermove', e => {
    const b = cv.getBoundingClientRect(); tx = (e.clientX - b.left) / b.width; ty = 1 - (e.clientY - b.top) / b.height;
  });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestAnimationFrame(frame); }).observe(cv);
  const t0 = performance.now();
  function frame(now) {
    if (!visible || document.hidden) return;
    mx = lerp(mx, tx, .04); my = lerp(my, ty, .04);
    lightV = lerp(lightV, isLight() ? 1 : 0, .08);
    gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, (now - t0) / 1000);
    gl.uniform2f(uM, mx, my); gl.uniform1f(uL, lightV);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible) requestAnimationFrame(frame); });
  requestAnimationFrame(frame);
}

/* ─── HERO: ЖИВОЙ ЧАТ ──────────────────────────────────────────────────── */
const chat = (() => {
  const box = $('#chat'), status = $('#chat-status'), notify = $('#notify'), nbody = $('#notify-body');
  let run = 0, visible = true, started = false;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const add = (cls, html) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; box.appendChild(d); while (box.children.length > 7) box.firstChild.remove(); return d; };
  async function typing(id, ms) {
    status.textContent = CHAT[lang].typing;
    const d = add('typing', '<i></i><i></i><i></i>'); await wait(ms); d.remove();
    if (id === run) status.textContent = CHAT[lang].online;
  }
  async function loop() {
    const id = ++run;
    const ok = () => id === run;
    box.innerHTML = ''; notify.classList.remove('is-on');
    status.textContent = CHAT[lang].online;
    while (ok()) {
      while (!visible && ok()) await wait(400);
      const c = CHAT[lang];
      box.innerHTML = ''; notify.classList.remove('is-on');
      await wait(700); if (!ok()) return;
      add('msg user', c.hi); await wait(600); if (!ok()) return;
      await typing(id, 900); if (!ok()) return;
      const m1 = add('msg bot', `${c.pick}<div class="msg-kb">${c.svc.map(s => `<span>${s}</span>`).join('')}</div>`);
      await wait(1300); if (!ok()) return;
      m1.querySelector('.msg-kb span').classList.add('is-tap'); await wait(350); if (!ok()) return;
      add('msg user', c.svc[0]); await wait(400);
      await typing(id, 800); if (!ok()) return;
      const m2 = add('msg bot', `${c.slot}<div class="msg-kb"><span>11:00</span><span>14:30</span><span>18:00</span></div>`);
      await wait(1300); if (!ok()) return;
      m2.querySelectorAll('.msg-kb span')[1].classList.add('is-tap'); await wait(350); if (!ok()) return;
      add('msg user', '14:30'); await wait(400);
      await typing(id, 1000); if (!ok()) return;
      add('msg bot', c.done); await wait(500); if (!ok()) return;
      nbody.textContent = c.note; notify.classList.add('is-on'); sound.rustle(.03);
      await wait(4200);
    }
  }
  if (box) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(box);
  return {
    start() { if (!box || started) return; started = true; loop(); },
    restart() { if (started) loop(); },
  };
})();

/* ─── РАЗБИВКА ЗАГОЛОВКОВ НА СЛОВА ─────────────────────────────────────── */
function splitWords(el, instant) {
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((w, i) => `<span class="w"><i style="--i:${i}">${w}</i></span>`).join(' ');
  if (instant) el.classList.add('is-in');
}

/* ─── ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ────────────────────────────────────────────── */
function startReveal() {
  const heroTitle = $$('.hero-title > span');
  heroTitle.forEach((s, i) => { s.classList.add('split'); s.style.setProperty('--d', `${i * 180}ms`); splitWords(s); });
  const heads = $$('.sec-head h2, .about h2, .faq h2, .cta-title');
  heads.forEach(h => { h.classList.add('split'); splitWords(h); });

  const groups = [
    '.hero-copy > .status, .hero-copy > .hero-desc, .hero-copy > .hero-actions, .hero-copy > .hero-facts',
    '.hero-demo', '.sec-head > .sec-lead, .sec-head > .filters, .sec-head > .sec-idx',
    '.svc', '.feat', '.work', '.step', '.g', '.about-text > :not(h2)', '.reviews', '.pay-row, .pay-foot',
    '.faq-side > :not(h2)', '.faq-list details', '.cta-grid > div > :not(h2)', '.order',
  ];
  const els = [];
  groups.forEach(sel => {
    const list = $$(sel);
    const byParent = new Map();
    list.forEach(el => {
      const k = el.parentElement; const i = byParent.get(k) || 0; byParent.set(k, i + 1);
      el.classList.add('reveal'); el.style.setProperty('--d', `${Math.min(i, 8) * 80 + (el.closest('.hero') ? 350 : 0)}ms`);
      els.push(el);
    });
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in'); io.unobserve(e.target);
      if (e.target.classList.contains('reveal')) setTimeout(() => e.target.style.removeProperty('--d'), 1500);
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  [...els, ...heroTitle, ...heads].forEach(el => io.observe(el));
}

/* ─── КУРСОР, МАГНИТ, ПОДСВЕТКА, НАКЛОН, ПРЕВЬЮ ────────────────────────── */
function startPointerFx() {
  // подсветка карточек работает и от касаний
  const spots = $$('.feat, .g, .reviews, .order, .step');
  spots.forEach(el => el.classList.add('spot'));
  document.addEventListener('pointermove', e => {
    const el = e.target.closest?.('.spot, .btn-accent'); if (!el) return;
    const b = el.getBoundingClientRect();
    const x = e.clientX - b.left, y = e.clientY - b.top;
    el.style.setProperty('--sx', x + 'px'); el.style.setProperty('--sy', y + 'px');
    el.style.setProperty('--hx', x + 'px'); el.style.setProperty('--hy', y + 'px');
  }, { passive: true });

  if (!finePointer || reduceMotion) return;
  document.documentElement.classList.add('has-cursor');
  const dot = $('#cursor-dot'), ring = $('#cursor-ring'), pv = $('#preview');
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, px = x, py = y, shown = false;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    if (!shown) { shown = true; rx = x; ry = y; px = x; py = y; }
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    ring.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .chip, input, textarea, .work'));
  });
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => { dot.style.opacity = ring.style.opacity = 0; });
  document.addEventListener('pointerenter', () => { dot.style.opacity = ring.style.opacity = ''; });

  // магнитные кнопки
  const mags = $$('.btn, .icon-btn, .logo');
  addEventListener('pointermove', e => {
    for (const m of mags) {
      const b = m.getBoundingClientRect();
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const near = Math.abs(dx) < b.width / 2 + 40 && Math.abs(dy) < b.height / 2 + 30;
      m.style.translate = near ? `${dx * .22}px ${dy * .3}px` : '';
    }
  }, { passive: true });

  // наклон больших карточек
  $$('.feat').forEach(card => {
    card.addEventListener('pointermove', e => {
      const b = card.getBoundingClientRect();
      const nx = (e.clientX - b.left) / b.width - .5, ny = (e.clientY - b.top) / b.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-ny * 5}deg) rotateY(${nx * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  // превью работ
  const grads = {
    bot: 'linear-gradient(135deg,#5f7f2a,#e8b632)', auto: 'linear-gradient(135deg,#d9a21b,#d0681f)',
    web: 'linear-gradient(135deg,#a8261c,#e0812f)', mc: 'linear-gradient(135deg,#2f3a1a,#8fb043)',
  };
  $$('.work').forEach(w => {
    w.addEventListener('pointerenter', () => {
      pv.querySelector('.preview-tag').textContent = w.querySelector('.tag').textContent;
      pv.querySelector('.preview-title').textContent = w.querySelector('strong').textContent;
      pv.style.setProperty('--pv', grads[w.dataset.cat]);
      pv.classList.add('is-on');
    });
    w.addEventListener('pointerleave', () => pv.classList.remove('is-on'));
  });

  (function tick() {
    rx = lerp(rx, x, .18); ry = lerp(ry, y, .18);
    px = lerp(px, x, .12); py = lerp(py, y, .12);
    dot.style.transform = `translate(${x}px, ${y}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    const vx = clamp((x - px) * .4, -14, 14);
    pv.style.translate = `${px}px ${py}px`;
    pv.style.rotate = `${vx}deg`;
    requestAnimationFrame(tick);
  })();
}

/* ─── ПАРАЛЛАКС ПЕЙЗАЖА И ЛИНИЯ ПРОЦЕССА ───────────────────────────────── */
function startScrollFx() {
  const steps = $('.steps'), stepEls = $$('.step');
  const topbar = $('#topbar'), heroPhoto = $('.hero-photo');
  let lastY = scrollY, ticking = false;
  function update() {
    ticking = false;
    const y = scrollY;
    if (!reduceMotion && heroPhoto && y < innerHeight * 1.2) heroPhoto.style.transform = `translate3d(0, ${y * .35}px, 0)`;
    if (steps) {
      const b = steps.getBoundingClientRect(), vh = innerHeight;
      const p = clamp((vh * .75 - b.top) / (b.height + vh * .2), 0, 1);
      steps.style.setProperty('--p', p.toFixed(3));
      stepEls.forEach((s, i) => s.classList.toggle('is-lit', isMobile ? s.getBoundingClientRect().top < vh * .7 : p >= (i + .3) / stepEls.length));
    }
    topbar.classList.toggle('is-scrolled', y > 10);
    const menuOpen = $('#nav').classList.contains('is-open');
    topbar.classList.toggle('is-hidden', !menuOpen && y > 500 && y > lastY + 2);
    if (y < lastY - 2) topbar.classList.remove('is-hidden');
    lastY = y;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  const links = $$('.nav a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));
}

/* ─── МЕНЮ ─────────────────────────────────────────────────────────────── */
const burger = $('#burger'), nav = $('#nav');
function setMenu(open) {
  nav.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
$$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ─── ФИЛЬТР РАБОТ ─────────────────────────────────────────────────────── */
$$('.chip').forEach(chip => chip.addEventListener('click', () => {
  const f = chip.dataset.filter;
  $$('.chip').forEach(c => c.classList.toggle('active', c === chip));
  $$('.feat').forEach(el => el.classList.toggle('is-filtered-out', f !== 'all' && el.dataset.cat !== f));
  let i = 0;
  $$('.work').forEach(el => {
    const show = f === 'all' || el.dataset.cat === f;
    el.classList.toggle('is-hidden', !show);
    if (show && !reduceMotion) {
      el.classList.remove('is-in'); el.style.setProperty('--d', `${i++ * 50}ms`);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
    }
  });
}));

/* ─── СЧЁТЧИК ──────────────────────────────────────────────────────────── */
$$('.count').forEach(el => {
  const target = +el.dataset.target;
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; io.disconnect();
    const t0 = performance.now();
    (function step(now) {
      const p = clamp((now - t0) / 1600, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
  io.observe(el);
});

/* ─── КОПИРОВАНИЕ ──────────────────────────────────────────────────────── */
$$('.copy-btn').forEach(btn => btn.addEventListener('click', async () => {
  const text = $('#' + btn.dataset.copy).textContent.trim();
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch {} ta.remove();
  }
  btn.textContent = '✓ ' + t('copied'); btn.classList.add('is-done');
  setTimeout(() => { btn.textContent = t(btn.dataset.i18n); btn.classList.remove('is-done'); }, 1800);
}));

/* ─── ЗАЯВКА ───────────────────────────────────────────────────────────── */
$('#order-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = $('#order-name'), task = $('#order-task'), err = $('#order-error');
  [name, task].forEach(f => f.classList.toggle('is-invalid', !f.value.trim()));
  if (!name.value.trim() || !task.value.trim()) { err.textContent = t('err_order'); return; }
  err.textContent = '';
  const msg = encodeURIComponent(`Привет! Меня зовут ${name.value.trim()}.\n\nЗадача: ${task.value.trim()}`);
  window.open(`https://t.me/akhnnoname?text=${msg}`, '_blank', 'noopener');
});
$$('.field').forEach(f => f.addEventListener('input', () => f.classList.remove('is-invalid')));

/* ─── ОТЗЫВЫ ───────────────────────────────────────────────────────────── */
let stars = 5;
const starBtns = $$('.star-btn');
const paintStars = n => starBtns.forEach(s => s.classList.toggle('active', +s.dataset.star <= n));
starBtns.forEach(b => {
  b.addEventListener('click', () => { stars = +b.dataset.star; paintStars(stars); });
  b.addEventListener('pointerenter', () => paintStars(+b.dataset.star));
});
$('#stars-input').addEventListener('pointerleave', () => paintStars(stars));
paintStars(stars);

const getReviews = () => { try { return JSON.parse(store.get('naha_reviews') || '[]'); } catch { return []; } };
const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };
function renderReviews() {
  const list = $('#reviews-list'), empty = $('#review-empty');
  const rs = getReviews();
  empty.hidden = rs.length > 0;
  list.innerHTML = rs.map(r => `
    <article class="review">
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="review-text">${esc(r.text)}</p>
      <div class="review-meta">${esc(r.name)} · ${esc(r.date)}</div>
    </article>`).join('');
}
$('#review-form').addEventListener('submit', e => {
  e.preventDefault();
  const n = $('#review-name'), tx = $('#review-text'), err = $('#review-error');
  [n, tx].forEach(f => f.classList.toggle('is-invalid', !f.value.trim()));
  if (!n.value.trim() || !tx.value.trim()) { err.textContent = t('err_review'); return; }
  err.textContent = '';
  const rs = getReviews();
  rs.unshift({ name: n.value.trim(), text: tx.value.trim(), stars, date: new Date().toLocaleDateString('ru-RU') });
  store.set('naha_reviews', JSON.stringify(rs));
  n.value = ''; tx.value = ''; stars = 5; paintStars(5);
  renderReviews();
  leaves.burst(10);
});

/* ─── TIDIO: прячем всплывающий баблик ─────────────────────────────────── */
(function hideTidio() {
  const hide = () => {
    const c = document.getElementById('tidio-chat'); if (!c) return;
    c.querySelectorAll(':scope > *:not(#tidio-chat-iframe)').forEach(el => {
      el.style.setProperty('display', 'none', 'important');
      el.style.setProperty('pointer-events', 'none', 'important');
    });
  };
  const iv = setInterval(hide, 400); setTimeout(() => clearInterval(iv), 15000);
})();

/* ─── СТАРТ ────────────────────────────────────────────────────────────── */
const saved = store.get('naha_lang');
if (saved && saved !== 'ru' && I18N[saved]) applyLang(saved); else renderReviews();

runIntro(() => {
  startReveal();
  startPointerFx();
  startScrollFx();
  startAura();
  chat.start();
  leaves.start();
});
})();
