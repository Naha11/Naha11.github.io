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
let scrollingUntil = 0;
addEventListener('scroll', () => { scrollingUntil = performance.now() + 200; }, { passive: true });
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
    plug_art: 'plugins for your server', plug_title: 'Plugins to spec', plug_desc: 'I build Minecraft server plugins to your technical spec.', plug_link: 'Discuss the task →',
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
    plug_art: 'серверіңізге плагиндер', plug_title: 'ТТ бойынша плагиндер', plug_desc: 'Minecraft серверлеріне техникалық тапсырмаңыз бойынша плагиндер жасаймын.', plug_link: 'Тапсырманы талқылау →',
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
  let W, H, dpr, list = [], running = false, visible = true, last = 0, wind = 0;
  const mouse = { x: -999, y: -999 };
  const COUNT = 0; // листья падают только в заставке
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
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
    if (!running || !visible) return;
    const dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    wind = lerp(wind, Math.sin(ts / 4000) * 18, .02);
    ctx.clearRect(0, 0, W, H);
    for (const l of list) {
      l.ph += l.phs * dt; l.flipPh += l.flipS * dt;
      const dx = l.x - mouse.x, dy = l.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 9000) { const d = Math.sqrt(d2) || 1; l.vx += dx / d * 220 * dt; l.vr += (Math.random() - .5) * 6 * dt; }
      l.vx *= .96;
      l.x += (Math.sin(l.ph) * l.sway + wind + l.vx) * dt;
      l.y += l.vy * dt;
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
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && running) { last = performance.now(); requestAnimationFrame(frame); } }).observe(cv);
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && visible) { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; } }, { passive: true });
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

/* ─── ОСЕННИЙ ЛЕС: процедурная сцена (всё запекается один раз) ────────── */
const Forest = (() => {
  const TREE_PALS = [[0, 1, 1, 6, 0], [4, 5, 5, 6, 4, 1], [6, 6, 1, 4, 0], [0, 2, 4, 6, 1, 5], [2, 3, 0, 1, 2, 6], [1, 6, 4, 0, 5], [0, 0, 1, 2, 6], [5, 4, 6, 6, 1]];
  const srand = seed => { let s = seed % 2147483646 + 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const FOG = '#e3a06e';
  let A = null; // запечённые спрайты

  const newCv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  function withFog(cv) {
    const f = newCv(cv.width, cv.height), c = f.getContext('2d');
    c.drawImage(cv, 0, 0); c.globalCompositeOperation = 'source-in'; c.fillStyle = FOG; c.fillRect(0, 0, f.width, f.height);
    return f;
  }
  const sprite = (cv, meta = {}) => ({ cv, fog: withFog(cv), W: cv.width, H: cv.height, base: .97, ...meta });
  const leafAt = (c, pi, x, y, sz, rot, sy = 1, shape) => {
    const s = leafSprites[pi * 3 + (shape ?? ((Math.random() * 3) | 0))].sharp;
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(1, sy); c.drawImage(s, -sz / 2, -sz / 2, sz, sz); c.restore();
  };
  function shadeAtop(c, W, H, top, sideLight = true) {
    c.globalCompositeOperation = 'source-atop';
    if (sideLight) {
      const gx = c.createLinearGradient(0, 0, W, 0);
      gx.addColorStop(0, 'rgba(40,22,70,.38)'); gx.addColorStop(.5, 'rgba(0,0,0,0)'); gx.addColorStop(1, 'rgba(255,196,110,.26)');
      c.fillStyle = gx; c.fillRect(0, 0, W, H);
    }
    const gy = c.createLinearGradient(0, top, 0, H);
    gy.addColorStop(0, 'rgba(255,215,140,.12)'); gy.addColorStop(.5, 'rgba(0,0,0,0)'); gy.addColorStop(1, 'rgba(30,14,45,.42)');
    c.fillStyle = gy; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = 'source-over';
  }
  function grass(c, R, pick2, x0, x1, y, hMin, hMax, n) {
    c.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const gx = R(x0, x1), h = R(hMin, hMax);
      c.strokeStyle = pick2(['#6b7a2a', '#8a8a34', '#a2873c', '#5a5a22', '#b59a4c', '#c9a857']);
      c.lineWidth = R(.8, 1.8);
      c.beginPath(); c.moveTo(gx, y); c.quadraticCurveTo(gx + R(-3, 3), y - h * .6, gx + R(-h * .45, h * .45), y - h); c.stroke();
    }
  }

  /* ── деревья ── */
  function bakeTree(idx, W0, H0) {
    const r = srand(idx * 7919 + 101), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(W0 * 1.9), H = Math.round(H0 * 1.35);
    const cv = newCv(W, H), c = cv.getContext('2d');
    const pal = TREE_PALS[idx % TREE_PALS.length], tips = [];
    const baseX = W * .5, baseY = H * .97;
    W0 = H0 * .66;
    function limb(x, y, len, ang, w, depth) {
      const x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len, nx = Math.cos(ang), ny = Math.sin(ang);
      const bend = R(-.18, .18) * len, mx = (x + x2) / 2 + nx * bend, my = (y + y2) / 2 + ny * bend, w2 = w * R(.62, .72);
      c.beginPath();
      c.moveTo(x - nx * w / 2, y - ny * w / 2);
      c.quadraticCurveTo(mx - nx * (w + w2) / 4, my - ny * (w + w2) / 4, x2 - nx * w2 / 2, y2 - ny * w2 / 2);
      c.lineTo(x2 + nx * w2 / 2, y2 + ny * w2 / 2);
      c.quadraticCurveTo(mx + nx * (w + w2) / 4, my + ny * (w + w2) / 4, x + nx * w / 2, y + ny * w / 2);
      c.closePath();
      const g = c.createLinearGradient(x - nx * w, y - ny * w, x + nx * w, y + ny * w);
      g.addColorStop(0, '#16111f'); g.addColorStop(.5, '#34231f'); g.addColorStop(.85, '#6e4a33'); g.addColorStop(1, '#c08a52');
      c.fillStyle = g; c.fill();
      if (w > 5) {
        c.lineCap = 'round';
        for (let i = 0; i < Math.min(12, w / 2.5); i++) {
          const o = R(-.42, .42), t0 = R(0, .5), t1 = R(.5, 1);
          c.strokeStyle = r() < .75 ? `rgba(12,6,2,${R(.3, .6)})` : `rgba(190,140,95,${R(.12, .25)})`;
          c.lineWidth = Math.max(.5, w * R(.02, .06));
          c.beginPath(); c.moveTo(lerp(x, x2, t0) + nx * w * o, lerp(y, y2, t0) + ny * w * o);
          c.lineTo(lerp(x, x2, t1) + nx * w2 * o + R(-1, 1), lerp(y, y2, t1) + ny * w2 * o); c.stroke();
        }
        if (depth === 0) { // мох у основания
          c.fillStyle = 'rgba(110,130,40,.35)';
          for (let i = 0; i < 10; i++) { c.beginPath(); c.ellipse(x + R(-w * .4, w * .1), y - R(0, len * .25), R(2, w * .2), R(1, w * .12), 0, 0, 6.28); c.fill(); }
        }
      }
      if (depth >= 6 || len < H0 * .028) { tips.push([x2, y2, depth]); return; }
      if (depth >= 3) tips.push([mx, my, depth]);
      const n = depth === 0 ? 3 : r() < .4 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const spread = depth === 0 ? R(.35, .6) : R(.3, .75);
        limb(x2, y2, len * R(.66, .8), ang + (i === 0 ? -spread : i === 1 ? spread : R(-.2, .2)) + R(-.12, .12), w2, depth + 1);
      }
    }
    c.fillStyle = '#1e140c';
    for (let i = 0; i < 5; i++) {
      const dir = i < 2 ? -1 : i < 4 ? 1 : R(-1, 1);
      c.beginPath(); c.moveTo(baseX - W0 * .03, baseY - H0 * .03);
      c.quadraticCurveTo(baseX + dir * W0 * R(.04, .07), baseY - H0 * .01, baseX + dir * W0 * R(.08, .13), baseY + H0 * .004);
      c.lineTo(baseX + W0 * .03, baseY - H0 * .03); c.fill();
    }
    limb(baseX, baseY, H0 * R(.24, .3), R(-.07, .07), W0 * R(.06, .08), 0);
    for (const [x, y] of tips) {
      const rr = W0 * R(.05, .085);
      c.fillStyle = `rgba(35,14,4,${R(.16, .28)})`;
      c.beginPath(); c.ellipse(x + R(-4, 4), y + rr * .3, rr, rr * .8, 0, 0, 6.28); c.fill();
    }
    let minY = H;
    for (const [x, y, d] of tips) {
      const rr = W0 * R(.04, .075), n = d >= 5 ? 30 : 22;
      minY = Math.min(minY, y - rr);
      for (let i = 0; i < n; i++) {
        const a = r() * 6.28, dd = Math.sqrt(r()) * rr;
        c.save(); c.translate(x + Math.cos(a) * dd, y + Math.sin(a) * dd * .85); c.rotate(r() * 6.28); c.scale(R(.55, 1), 1);
        const sz = W0 * R(.026, .042), spr = leafSprites[P(pal) * 3 + ((r() * 3) | 0)].sharp;
        c.drawImage(spr, -sz / 2, -sz / 2, sz, sz); c.restore();
      }
    }
    c.globalCompositeOperation = 'lighter';
    for (const [x, y] of tips) {
      if (x < baseX - W0 * .05 || r() < .35) continue;
      const rr = W0 * R(.03, .06);
      for (let i = 0; i < 8; i++) { c.globalAlpha = R(.18, .38); leafAt(c, P(pal), x + R(0, rr), y + R(-rr, rr * .4), W0 * R(.02, .034), r() * 6.28, 1, 2); }
    }
    c.globalAlpha = 1;
    shadeAtop(c, W, H, minY);
    for (let i = 0; i < 26; i++) leafAt(c, P(pal), baseX + R(-W0 * .16, W0 * .16), baseY + R(-H0 * .008, H0 * .012), W0 * R(.02, .035), r() * 6.28, .45);
    grass(c, R, P, baseX - W0 * .18, baseX + W0 * .18, baseY + H0 * .006, H0 * .012, H0 * .035, 70);
    // обрезка по содержимому
    const pad = W0 * .1;
    let x0 = baseX - W0 * .2, x1 = baseX + W0 * .2, y0 = baseY - H0 * .3;
    for (const [x, y] of tips) { x0 = Math.min(x0, x - pad); x1 = Math.max(x1, x + pad); y0 = Math.min(y0, y - pad); }
    x0 = Math.max(0, Math.floor(x0)); x1 = Math.min(W, Math.ceil(x1)); y0 = Math.max(0, Math.floor(y0));
    const out = newCv(x1 - x0, H - y0);
    out.getContext('2d').drawImage(cv, -x0, -y0);
    return sprite(out, { ax: (baseX - x0) / (x1 - x0), base: (baseY - y0) / (H - y0), hs: (H - y0) / H0 });
  }

  /* ── кусты ── */
  function bakeBush(k, S) {
    const r = srand(k * 313 + 5), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(260 * S), H = Math.round(190 * S), cv = newCv(W, H), c = cv.getContext('2d');
    const pal = [[2, 3, 3, 0], [4, 5, 6, 4], [0, 1, 6, 1], [3, 2, 1, 4], [6, 4, 0, 5]][k % 5];
    const by = H * .97, tips = [];
    for (let i = 0; i < 26; i++) { const a = R(Math.PI * 1.05, Math.PI * 1.95); const d = Math.sqrt(r()); tips.push([W / 2 + Math.cos(a) * d * W * .4, by + Math.sin(a) * d * H * .78]); }
    c.strokeStyle = '#2a1a0e'; c.lineWidth = 2 * S;
    for (const [x, y] of tips.slice(0, 10)) { c.beginPath(); c.moveTo(W / 2 + R(-8, 8), by); c.quadraticCurveTo(W / 2, (by + y) / 2, x, y); c.stroke(); }
    for (const [x, y] of tips) { c.fillStyle = `rgba(30,12,3,${R(.2, .32)})`; c.beginPath(); c.ellipse(x, y + 6 * S, W * .1, H * .12, 0, 0, 6.28); c.fill(); }
    for (const [x, y] of tips) for (let i = 0; i < 24; i++) {
      const a = r() * 6.28, d = Math.sqrt(r()) * W * .085;
      leafAt(c, P(pal), x + Math.cos(a) * d, y + Math.sin(a) * d * .8, R(13, 22) * S, r() * 6.28, R(.6, 1));
    }
    if (k % 2 === 0) { // ягоды
      for (let i = 0; i < 26; i++) { c.fillStyle = r() < .5 ? '#c21f1a' : '#e23b2a'; c.beginPath(); c.arc(W / 2 + R(-W * .35, W * .35), by - R(H * .1, H * .7), R(2, 3.4) * S, 0, 6.28); c.fill(); }
    }
    c.globalCompositeOperation = 'lighter';
    for (const [x, y] of tips) if (x > W * .5 && r() < .6) { c.globalAlpha = R(.2, .35); leafAt(c, P(pal), x + R(0, 14), y - R(0, 10), R(12, 18) * S, r() * 6.28, 1, 2); }
    c.globalAlpha = 1;
    shadeAtop(c, W, H, H * .15);
    grass(c, R, P, W * .1, W * .9, by + 2, 6 * S, 20 * S, 40);
    return sprite(cv);
  }

  /* ── бревно ── */
  function bakeLog(k, S) {
    const r = srand(k * 71 + 3), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(380 * S), H = Math.round(150 * S), cv = newCv(W, H), c = cv.getContext('2d');
    const x0 = 22 * S, x1 = W - 60 * S, yT = H * .38, yB = H * .92, rad = (yB - yT) / 2, cyL = (yT + yB) / 2;
    c.fillStyle = 'rgba(20,8,2,.35)'; c.beginPath(); c.ellipse(W / 2, yB, W * .46, 10 * S, 0, 0, 6.28); c.fill();
    const g = c.createLinearGradient(0, yT, 0, yB);
    g.addColorStop(0, '#8a6444'); g.addColorStop(.35, '#5a3e28'); g.addColorStop(1, '#1f130a');
    c.fillStyle = g; c.beginPath(); c.moveTo(x0 + rad * .4, yT); c.lineTo(x1, yT); c.lineTo(x1, yB); c.lineTo(x0 + rad * .4, yB);
    c.quadraticCurveTo(x0 - rad * .2, cyL, x0 + rad * .4, yT); c.fill();
    for (let i = 0; i < 26; i++) { // кора
      const y = R(yT + 3, yB - 3), xa = R(x0 + 10, x1 - 60);
      c.strokeStyle = r() < .7 ? 'rgba(15,8,3,.55)' : 'rgba(200,150,100,.18)'; c.lineWidth = R(.8, 2.2) * S;
      c.beginPath(); c.moveTo(xa, y); c.bezierCurveTo(xa + 30 * S, y + R(-3, 3), xa + 60 * S, y + R(-3, 3), xa + R(60, 140) * S, y + R(-2, 2)); c.stroke();
    }
    c.fillStyle = 'rgba(105,135,40,.55)'; // мох
    for (let i = 0; i < 40; i++) { c.beginPath(); c.ellipse(R(x0 + 10, x1 - 10), yT + R(-2, 8) * S, R(4, 14) * S, R(2, 5) * S, 0, 0, 6.28); c.fill(); }
    const eg = c.createRadialGradient(x1, cyL, 0, x1, cyL, rad); // спил с кольцами
    eg.addColorStop(0, '#d9ac72'); eg.addColorStop(.85, '#b58450'); eg.addColorStop(1, '#6e4a2a');
    c.fillStyle = eg; c.beginPath(); c.ellipse(x1, cyL, rad * .55, rad, 0, 0, 6.28); c.fill();
    c.strokeStyle = 'rgba(110,70,35,.55)'; c.lineWidth = 1 * S;
    for (let i = 1; i < 7; i++) { c.beginPath(); c.ellipse(x1 + R(-1, 1), cyL, rad * .55 * i / 7, rad * i / 7, 0, 0, 6.28); c.stroke(); }
    c.strokeStyle = '#3a2414'; c.lineWidth = 2.5 * S; c.beginPath(); c.ellipse(x1, cyL, rad * .55, rad, 0, 0, 6.28); c.stroke();
    if (k % 2) for (let i = 0; i < 4; i++) { // грибы-опята
      const mx = R(x0 + 40, x1 - 60) , my = yT + R(10, 30) * S;
      c.fillStyle = '#e8d2a8'; c.fillRect(mx - 2 * S, my - 8 * S, 4 * S, 10 * S);
      c.fillStyle = '#b8753a'; c.beginPath(); c.ellipse(mx, my - 8 * S, 9 * S, 5 * S, 0, Math.PI, 0); c.fill();
    }
    for (let i = 0; i < 14; i++) leafAt(c, P([0, 1, 4, 6, 2]), R(x0, x1), yT + R(-4, 6) * S, R(14, 22) * S, r() * 6.28, .5);
    grass(c, R, P, x0, W - 20 * S, yB + 3, 8 * S, 26 * S, 50);
    return sprite(cv);
  }

  /* ── цветы ── */
  function bakeFlowers(k, S) {
    const r = srand(k * 97 + 11), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(240 * S), H = Math.round(130 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .97;
    const cols = [['#d8342a', '#f2c230', '#fff4e0'], ['#8e5bc2', '#b78adf', '#f2c230'], ['#f08a2a', '#f2c230', '#d8342a'], ['#fff4e0', '#f2c230', '#e86a9a']][k % 4];
    grass(c, R, P, W * .05, W * .95, by, 10 * S, 40 * S, 70);
    for (let i = 0; i < 30; i++) {
      const x = R(W * .08, W * .92), h = R(25, 90) * S, y = by - h, col = P(cols), pr = R(3.5, 6.5) * S;
      c.strokeStyle = '#5f6a28'; c.lineWidth = 1.2 * S;
      c.beginPath(); c.moveTo(x + R(-6, 6), by); c.quadraticCurveTo(x + R(-5, 5), y + h * .5, x, y); c.stroke();
      c.fillStyle = col;
      for (let p = 0; p < 6; p++) { const a = p / 6 * 6.28 + R(0, .5); c.beginPath(); c.ellipse(x + Math.cos(a) * pr, y + Math.sin(a) * pr * .7, pr * .75, pr * .45, a, 0, 6.28); c.fill(); }
      c.fillStyle = '#6a3a10'; c.beginPath(); c.arc(x, y, pr * .45, 0, 6.28); c.fill();
    }
    shadeAtop(c, W, H, 0);
    return sprite(cv);
  }

  /* ── мухоморы ── */
  function bakeMush(S) {
    const r = srand(55), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(150 * S), H = Math.round(110 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .97;
    for (const [x, h, cr] of [[W * .35, 60, 26], [W * .62, 42, 19], [W * .8, 26, 12]]) {
      const hh = h * S, rr = cr * S;
      const sg = c.createLinearGradient(x - 6, 0, x + 6, 0); sg.addColorStop(0, '#d9c8a8'); sg.addColorStop(1, '#fff6e6');
      c.fillStyle = sg; c.beginPath(); c.moveTo(x - rr * .22, by); c.lineTo(x - rr * .16, by - hh); c.lineTo(x + rr * .16, by - hh); c.lineTo(x + rr * .26, by); c.fill();
      const cg = c.createRadialGradient(x + rr * .3, by - hh - rr * .4, 1, x, by - hh, rr * 1.2);
      cg.addColorStop(0, '#f2553a'); cg.addColorStop(1, '#8e1a10');
      c.fillStyle = cg; c.beginPath(); c.ellipse(x, by - hh, rr, rr * .62, 0, Math.PI, 0); c.fill();
      c.fillStyle = '#fff8ea';
      for (let i = 0; i < 7; i++) { c.beginPath(); c.arc(x + R(-rr * .75, rr * .75), by - hh - R(rr * .1, rr * .5), R(1.5, 3) * S, 0, 6.28); c.fill(); }
    }
    grass(c, R, P, W * .1, W * .95, by, 6 * S, 22 * S, 30);
    for (let i = 0; i < 6; i++) leafAt(c, P([0, 1, 4]), R(W * .1, W * .9), by - R(0, 4), R(12, 18) * S, r() * 6.28, .45);
    return sprite(cv);
  }

  /* ── камни ── */
  function bakeRock(k, S) {
    const r = srand(k * 41 + 9), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(200 * S), H = Math.round(130 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .97;
    c.beginPath();
    const n = 11;
    for (let i = 0; i <= n; i++) { const a = Math.PI + i / n * Math.PI; const rx = W * R(.36, .45), ry = H * R(.6, .82); c.lineTo(W / 2 + Math.cos(a) * rx, by + Math.sin(a) * ry); }
    c.closePath();
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#a89a88'); g.addColorStop(.5, '#6e6254'); g.addColorStop(1, '#2e2720');
    c.fillStyle = g; c.fill();
    c.save(); c.clip();
    for (let i = 0; i < 30; i++) { c.fillStyle = r() < .5 ? 'rgba(20,15,10,.18)' : 'rgba(230,220,200,.12)'; c.beginPath(); c.ellipse(R(0, W), R(0, H), R(3, 16) * S, R(2, 8) * S, R(0, 3), 0, 6.28); c.fill(); }
    c.fillStyle = 'rgba(110,140,45,.6)';
    for (let i = 0; i < 22; i++) { c.beginPath(); c.ellipse(R(W * .2, W * .8), R(H * .1, H * .45), R(4, 14) * S, R(2, 6) * S, 0, 0, 6.28); c.fill(); }
    c.restore();
    for (let i = 0; i < 8; i++) leafAt(c, P([0, 1, 4, 6]), R(W * .1, W * .9), by - R(0, H * .2), R(12, 20) * S, r() * 6.28, .5);
    grass(c, R, P, 0, W, by, 6 * S, 22 * S, 40);
    return sprite(cv);
  }

  /* ── фонарь ── */
  function bakeLamp(S) {
    const W = Math.round(70 * S), H = Math.round(320 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .97, x = W / 2;
    const g = c.createLinearGradient(x - 5 * S, 0, x + 5 * S, 0); g.addColorStop(0, '#0e0a08'); g.addColorStop(1, '#4a3c30');
    c.fillStyle = g; c.fillRect(x - 3.5 * S, H * .16, 7 * S, by - H * .16);
    c.fillRect(x - 9 * S, by - 12 * S, 18 * S, 12 * S);
    c.fillStyle = '#1a120c'; c.beginPath(); c.moveTo(x - 20 * S, H * .08); c.lineTo(x + 20 * S, H * .08); c.lineTo(x + 11 * S, H * .03); c.lineTo(x - 11 * S, H * .03); c.fill();
    const gl = c.createLinearGradient(0, H * .08, 0, H * .17); gl.addColorStop(0, '#fff2c0'); gl.addColorStop(1, '#f2a340');
    c.fillStyle = gl; c.fillRect(x - 14 * S, H * .08, 28 * S, H * .085);
    c.strokeStyle = '#1a120c'; c.lineWidth = 2.5 * S; c.strokeRect(x - 14 * S, H * .08, 28 * S, H * .085);
    c.beginPath(); c.moveTo(x, H * .08); c.lineTo(x, H * .165); c.stroke();
    return sprite(cv, { glow: [[.5, .125, .9]] });
  }

  /* ── камыш ── */
  function bakeReed(k, S) {
    const r = srand(k * 17 + 2), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(120 * S), H = Math.round(200 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .97;
    c.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const x = R(W * .2, W * .8), h = R(.45, .95) * H, bend = R(-18, 18) * S;
      c.strokeStyle = P(['#5f6a28', '#8a7a34', '#6e5a28', '#a38a44', '#7a8a3a']); c.lineWidth = R(1.2, 2.6) * S;
      c.beginPath(); c.moveTo(x, by); c.quadraticCurveTo(x + bend * .3, by - h * .6, x + bend, by - h); c.stroke();
      if (r() < .35) { c.fillStyle = '#4a2a14'; c.beginPath(); c.ellipse(x + bend * .8, by - h * .88, 3.5 * S, 12 * S, bend * .01, 0, 6.28); c.fill(); }
    }
    return sprite(cv);
  }

  /* ── домик ── */
  function bakeHouse(k, S) {
    const r = srand(k * 211 + 17), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
    const W = Math.round(460 * S), H = Math.round(420 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .97;
    const x0 = W * .16, x1 = W * .84, wallTop = H * .5, glow = [];
    c.fillStyle = '#4a4038'; c.fillRect(x0 - 6 * S, by - 16 * S, x1 - x0 + 12 * S, 16 * S); // фундамент
    for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(${R(90, 140)},${R(80, 120)},${R(70, 100)},.9)`; c.beginPath(); c.ellipse(R(x0, x1), by - R(3, 13) * S, R(8, 16) * S, R(4, 7) * S, 0, 0, 6.28); c.fill(); }
    const rows = 9, rh = (by - 16 * S - wallTop) / rows; // сруб
    for (let i = 0; i < rows; i++) {
      const y = wallTop + i * rh, g = c.createLinearGradient(0, y, 0, y + rh);
      g.addColorStop(0, '#9a6c42'); g.addColorStop(.45, '#6e4a2c'); g.addColorStop(1, '#2e1c10');
      c.fillStyle = g; c.beginPath(); c.roundRect(x0 - 10 * S, y, x1 - x0 + 20 * S, rh + 1, rh / 2); c.fill();
      c.fillStyle = '#c29a66'; c.beginPath(); c.ellipse(x0 - 10 * S, y + rh / 2, rh * .32, rh * .48, 0, 0, 6.28); c.fill(); c.beginPath(); c.ellipse(x1 + 10 * S, y + rh / 2, rh * .32, rh * .48, 0, 0, 6.28); c.fill();
    }
    const win = (wx, wy, ww, wh) => { // окна с тёплым светом
      c.fillStyle = '#2a1a10'; c.fillRect(wx - 5 * S, wy - 5 * S, ww + 10 * S, wh + 10 * S);
      const g = c.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#fff0b8'); g.addColorStop(1, '#f09a38');
      c.fillStyle = g; c.fillRect(wx, wy, ww, wh);
      c.strokeStyle = '#2a1a10'; c.lineWidth = 3 * S; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh / 2); c.lineTo(wx + ww, wy + wh / 2); c.stroke();
      c.fillStyle = '#6a4424'; c.fillRect(wx - 8 * S, wy + wh + 4 * S, ww + 16 * S, 6 * S);
      glow.push([(wx + ww / 2) / W, (wy + wh / 2) / H, ww / W * 2.2]);
    };
    win(x0 + 30 * S, wallTop + rh * 2, 62 * S, 62 * S);
    win(x1 - 92 * S, wallTop + rh * 2, 62 * S, 62 * S);
    c.fillStyle = '#3a2414'; c.fillRect(W / 2 - 26 * S, by - 16 * S - 110 * S, 52 * S, 110 * S); // дверь
    c.strokeStyle = '#1e120a'; c.lineWidth = 2 * S; for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(W / 2 - 26 * S + i * 13 * S, by - 126 * S); c.lineTo(W / 2 - 26 * S + i * 13 * S, by - 16 * S); c.stroke(); }
    const cx0 = W * .66; // печная труба
    c.fillStyle = '#6a5a4c'; c.fillRect(cx0, H * .1, 34 * S, wallTop - H * .1);
    for (let i = 0; i < 10; i++) { c.fillStyle = `rgba(${R(60, 110)},${R(50, 90)},${R(40, 70)},.8)`; c.fillRect(cx0 + R(0, 24) * S, H * .1 + R(0, wallTop - H * .1 - 10 * S), 12 * S, 7 * S); }
    const ov = 30 * S; // крыша
    const rg = c.createLinearGradient(0, H * .14, 0, wallTop);
    rg.addColorStop(0, '#4a2a1a'); rg.addColorStop(1, '#23140c');
    c.fillStyle = rg; c.beginPath(); c.moveTo(x0 - ov, wallTop + 6 * S); c.lineTo(W / 2, H * .14); c.lineTo(x1 + ov, wallTop + 6 * S); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(10,5,2,.5)'; c.lineWidth = 1.5 * S;
    for (let i = 1; i < 9; i++) { const t = i / 9; c.beginPath(); c.moveTo(lerp(W / 2, x0 - ov, t), lerp(H * .14, wallTop + 6 * S, t)); c.lineTo(lerp(W / 2, x1 + ov, t), lerp(H * .14, wallTop + 6 * S, t)); c.stroke(); }
    c.strokeStyle = '#1a0e06'; c.lineWidth = 7 * S; c.beginPath(); c.moveTo(x0 - ov, wallTop + 6 * S); c.lineTo(W / 2, H * .14); c.lineTo(x1 + ov, wallTop + 6 * S); c.stroke();
    for (let i = 0; i < 60; i++) { const t = R(0, 1), side = r() < .5 ? x0 - ov : x1 + ov; leafAt(c, P([0, 1, 4, 5, 6]), lerp(W / 2, side, t) + R(-20, 20) * S, lerp(H * .14, wallTop, t) + R(4, 20) * S, R(12, 20) * S, r() * 6.28, .55); }
    glow.push([.5, (by - 70 * S) / H, .12]);
    c.fillStyle = '#ffd98a'; c.beginPath(); c.arc(W / 2 + 40 * S, by - 100 * S, 7 * S, 0, 6.28); c.fill(); // фонарик у двери
    glow.push([(W / 2 + 40 * S) / W, (by - 100 * S) / H, .1]);
    shadeAtop(c, W, H, H * .1);
    for (let i = 0; i < 4; i++) { // кусты у дома
      const bx = r() < .5 ? R(x0 - 20 * S, x0 + 50 * S) : R(x1 - 50 * S, x1 + 20 * S);
      for (let j = 0; j < 26; j++) leafAt(c, P([2, 3, 6, 4]), bx + R(-26, 26) * S, by - R(0, 40) * S, R(12, 18) * S, r() * 6.28, R(.6, 1));
    }
    grass(c, R, P, x0 - 30 * S, x1 + 30 * S, by, 8 * S, 26 * S, 90);
    return sprite(cv, { glow, chimney: [(cx0 + 17 * S) / W, H * .1 / H] });
  }

  function bakeStones(k, S) {
    const r = srand(k * 59 + 23), R = (a, b) => a + r() * (b - a);
    const W = Math.round(180 * S), H = Math.round(90 * S), cv = newCv(W, H), c = cv.getContext('2d'), by = H * .96;
    const n = k === 0 ? 1 : k === 1 ? 3 : 5;
    for (let i = 0; i < n; i++) {
      const x = W / 2 + (n === 1 ? 0 : R(-W * .32, W * .32)), rw = (n === 1 ? R(.32, .4) : R(.1, .2)) * W, rh = rw * R(.5, .7);
      c.fillStyle = 'rgba(25,14,8,.45)'; c.beginPath(); c.ellipse(x + rw * .12, by - rh * .1, rw * 1.08, rh * .35, 0, 0, 6.28); c.fill();
      c.beginPath();
      for (let j = 0; j <= 9; j++) { const a = Math.PI + j / 9 * Math.PI; c.lineTo(x + Math.cos(a) * rw * R(.9, 1.05), by - rh * .15 + Math.sin(a) * rh * R(.85, 1.05)); }
      c.closePath();
      const g = c.createLinearGradient(x - rw, by - rh, x + rw, by);
      const t = R(0, 1);
      g.addColorStop(0, `rgb(${lerp(180, 205, t) | 0},${lerp(165, 188, t) | 0},${lerp(142, 160, t) | 0})`); g.addColorStop(.55, `rgb(${lerp(120, 140, t) | 0},${lerp(108, 124, t) | 0},${lerp(92, 104, t) | 0})`); g.addColorStop(1, '#3e342c');
      c.fillStyle = g; c.fill();
      c.save(); c.clip();
      for (let j = 0; j < 8; j++) { c.fillStyle = r() < .5 ? 'rgba(30,20,12,.18)' : 'rgba(255,240,215,.14)'; c.beginPath(); c.ellipse(x + R(-rw, rw), by - R(0, rh), R(2, rw * .3), R(1, rh * .2), R(0, 3), 0, 6.28); c.fill(); }
      if (r() < .4) { c.fillStyle = 'rgba(110,135,45,.5)'; c.beginPath(); c.ellipse(x - rw * .2, by - rh * .9, rw * .45, rh * .2, 0, 0, 6.28); c.fill(); }
      c.restore();
    }
    for (let i = 0; i < 14; i++) { const gs = R(1.5, 3.5) * S; c.fillStyle = `rgb(${R(120, 175) | 0},${R(108, 155) | 0},${R(90, 125) | 0})`; c.beginPath(); c.ellipse(R(W * .1, W * .9), by - R(0, 4) * S, gs, gs * .6, 0, 0, 6.28); c.fill(); }
    return sprite(cv);
  }

  function bakeGravel(k) {
    const r = srand(k * 37 + 5), R = (a, b) => a + r() * (b - a);
    const cv = newCv(40, 28), c = cv.getContext('2d'), tone = k / 5;
    const n = k < 3 ? 1 : 3;
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 20 : R(9, 31), y = n === 1 ? 15 : R(12, 19), gw = n === 1 ? 14 : R(5, 8), gh = gw * R(.55, .7);
      c.fillStyle = 'rgba(30,18,10,.5)'; c.beginPath(); c.ellipse(x + gw * .15, y + gh * .45, gw * 1.05, gh * .55, 0, 0, 6.28); c.fill();
      const t2 = (tone + R(-.15, .15));
      c.fillStyle = `rgb(${lerp(112, 186, t2) | 0},${lerp(100, 164, t2) | 0},${lerp(86, 134, t2) | 0})`;
      c.beginPath(); c.ellipse(x, y, gw, gh, R(-.4, .4), 0, 6.28); c.fill();
      c.fillStyle = 'rgba(255,238,210,.35)'; c.beginPath(); c.ellipse(x - gw * .3, y - gh * .35, gw * .4, gh * .3, 0, 0, 6.28); c.fill();
    }
    return cv;
  }
  function bakeClod(k) {
    const cv = newCv(40, 20), c = cv.getContext('2d');
    const g = c.createRadialGradient(20, 10, 0, 20, 10, 18);
    g.addColorStop(0, k ? 'rgba(215,180,135,.45)' : 'rgba(45,26,14,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.beginPath(); c.ellipse(20, 10, 18, 8, 0, 0, 6.28); c.fill();
    return cv;
  }

  function bakeFlatLeaves() {
    return Array.from({ length: 18 }, (_, i) => {
      const cv = newCv(64, 32), c = cv.getContext('2d');
      c.translate(32, 16); c.scale(1, .45); c.rotate(Math.random() * 6.28);
      c.drawImage(leafSprites[i % leafSprites.length].sharp, -30, -30, 60, 60);
      return cv;
    });
  }

  function bakeTufts() {
    return Array.from({ length: 6 }, (_, k) => {
      const r = srand(k * 131 + 7), R = (a, b) => a + r() * (b - a), P = a => a[(r() * a.length) | 0];
      const cv = newCv(90, 60), c = cv.getContext('2d');
      grass(c, R, P, 17, 73, 60, 18, 56, 24);
      if (k % 3 === 0) for (let i = 0; i < 3; i++) leafAt(c, P([0, 1, 4, 6]), R(20, 70), R(48, 58), 16, r() * 6.28, .5);
      return sprite(cv);
    });
  }

  function ensureAssets() {
    if (A) return;
    const S = isMobile ? .62 : 1;
    const tW = isMobile ? 300 : 460, tH = isMobile ? 460 : 700;
    A = {
      tree: Array.from({ length: isMobile ? 6 : 8 }, (_, i) => bakeTree(i, tW, tH)),
      bush: Array.from({ length: 5 }, (_, i) => bakeBush(i, S)),
      log: [bakeLog(0, S), bakeLog(1, S)],
      flowers: Array.from({ length: 4 }, (_, i) => bakeFlowers(i, S)),
      mush: [bakeMush(S)],
      rock: [bakeRock(0, S), bakeRock(1, S)],
      lamp: [bakeLamp(S)],
      reed: [bakeReed(0, S), bakeReed(1, S), bakeReed(2, S)],
      house: [bakeHouse(0, S), bakeHouse(1, S)],
      tuft: bakeTufts(),
      gravel: Array.from({ length: 6 }, (_, i) => bakeGravel(i)),
      clod: [bakeClod(0), bakeClod(1)],
      flat: bakeFlatLeaves(),
      stone: [bakeStones(0, S), bakeStones(1, S), bakeStones(2, S), bakeStones(3, S)],
    };
  }

  // высота объекта в мировых единицах
  const SIZE = { stone: .2, tree: 3.9, bush: .95, log: .5, flowers: .34, mush: .2, rock: .42, lamp: 1.9, reed: .95, house: 3.1, tuft: .3 };
  const LAKE_X0 = 1.95, LAKE_X1 = 7.4;

  function create(canvas, opt = {}) {
    const ctx = canvas.getContext('2d');
    const small = isMobile, dens = small ? 1.45 : 1;
    const CAM = .55, FAR = 17;
    const HY = opt.horizon || .5;
    let W, H, dpr, hy, cx, K, sky, far, ground, waterCv;
    const proj = (x, y, z) => ({ x: cx + x * K / z, y: hy + (CAM - y) * K / z, s: K / z });

    ensureAssets();

    const trailEdge = (side, z) => side * (.84 + Math.sin(z * 1.7 + side * 2.1) * .07 + Math.sin(z * 4.3 + side) * .035);
    const trailMid = z => Math.sin(z * .45) * .06;
    function bakeSky() {
      sky = newCv(W, Math.ceil(hy) + 2);
      const c = sky.getContext('2d'), g = c.createLinearGradient(0, 0, 0, hy);
      g.addColorStop(0, '#1f1b3a'); g.addColorStop(.3, '#4a2d52'); g.addColorStop(.55, '#a4486a'); g.addColorStop(.72, '#e0764f'); g.addColorStop(.88, '#f4ad62'); g.addColorStop(1, '#fde0a6');
      c.fillStyle = g; c.fillRect(0, 0, W, hy + 2);
      const r = srand(42), R = (a, b) => a + r() * (b - a);
      for (let i = 0; i < 70; i++) {
        const y = R(.08, .62) * hy, x = R(-.1, 1.1) * W, rw = R(.06, .2) * W, rh = rw * R(.12, .25), warm = y / hy;
        const cg = c.createRadialGradient(x, y + rh * .4, 0, x, y, rw);
        cg.addColorStop(0, `rgba(255,${Math.round(150 + warm * 70)},${Math.round(110 + warm * 40)},${R(.12, .3)})`); cg.addColorStop(1, 'rgba(255,170,120,0)');
        c.fillStyle = cg; c.beginPath(); c.ellipse(x, y, rw, rh, 0, 0, 6.28); c.fill();
      }
      c.fillStyle = 'rgba(40,20,20,.7)'; // птицы
      for (let i = 0; i < 7; i++) {
        const bx = W * R(.55, .8), bY = hy * R(.25, .45), s = R(3, 6);
        c.beginPath(); c.moveTo(bx - s, bY); c.quadraticCurveTo(bx - s / 2, bY - s * .6, bx, bY); c.quadraticCurveTo(bx + s / 2, bY - s * .6, bx + s, bY);
        c.quadraticCurveTo(bx + s / 2, bY - s * .3, bx, bY + 1); c.quadraticCurveTo(bx - s / 2, bY - s * .3, bx - s, bY); c.fill();
      }
    }
    function bakeFar() {
      const bh = Math.ceil(H * .2);
      far = newCv(W, bh);
      const c = far.getContext('2d'), r = srand(9), R = (a, b) => a + r() * (b - a);
      const layer = (count, hMin, hMax, haze, hazeA) => {
        const lc = newCv(W, bh), l = lc.getContext('2d');
        for (let i = 0; i < count; i++) {
          const x = R(0, W), th = bh * R(hMin, hMax);
          if (Math.abs(x - W / 2) < W * .035) continue;
          l.strokeStyle = '#2a1a10'; l.lineWidth = Math.max(1, th * .04);
          l.beginPath(); l.moveTo(x, bh); l.lineTo(x + R(-2, 2), bh - th * .55); l.stroke();
          const pal = LEAF_PAL[(r() * LEAF_PAL.length) | 0];
          for (let k = 0; k < 42; k++) { l.fillStyle = pal[(r() * 3) | 0]; l.beginPath(); l.ellipse(x + R(-th * .3, th * .3), bh - th * R(.45, 1), th * R(.04, .09), th * R(.03, .07), R(0, 3), 0, 6.28); l.fill(); }
        }
        l.globalCompositeOperation = 'source-atop';
        l.fillStyle = haze.replace('A', hazeA); l.fillRect(0, 0, W, bh);
        c.drawImage(lc, 0, 0);
      };
      layer(small ? 120 : 220, .35, .75, 'rgba(232,160,112,A)', .74);
      layer(small ? 90 : 160, .25, .6, 'rgba(176,96,96,A)', .45);
    }
    let trailGrad, trailEdgeGrad, sunGlow, camZ = 0;
    const TRAIL_ZS = []; for (let z = .3; z < FAR * 1.6; z *= 1.06) TRAIL_ZS.push(z);
    function bakeGround() {
      const gh = H - Math.floor(hy);
      ground = newCv(W, gh);
      const c = ground.getContext('2d'), g = c.createLinearGradient(0, 0, 0, gh);
      g.addColorStop(0, '#b0714a'); g.addColorStop(.16, '#6e4128'); g.addColorStop(.55, '#3e2419'); g.addColorStop(1, '#1d1219');
      c.fillStyle = g; c.fillRect(0, 0, W, gh);
      trailGrad = ctx.createLinearGradient(0, hy, 0, H);
      trailGrad.addColorStop(0, '#caa27e'); trailGrad.addColorStop(.12, '#a47552'); trailGrad.addColorStop(.45, '#7a5236'); trailGrad.addColorStop(1, '#4e3322');
      trailEdgeGrad = 'rgba(70,42,24,.35)';
      sunGlow = ctx.createRadialGradient(cx, hy, 0, cx, hy, gh * .5);
      sunGlow.addColorStop(0, 'rgba(255,225,165,.28)'); sunGlow.addColorStop(1, 'rgba(255,200,130,0)');
    }
    function trailPath(grow, off) {
      const zs = TRAIL_ZS;
      ctx.beginPath();
      for (let i = 0; i < zs.length; i++) { const z = zs[i], w = off != null ? -off : trailEdge(-1, z + camZ) - grow, q = proj(trailMid(z + camZ) + w, 0, z); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
      for (let i = zs.length - 1; i >= 0; i--) { const z = zs[i], w = off != null ? off : trailEdge(1, z + camZ) + grow, q = proj(trailMid(z + camZ) + w, 0, z); ctx.lineTo(q.x, q.y); }
      ctx.closePath();
    }
    function drawTrail() {
      ctx.fillStyle = trailEdgeGrad; trailPath(.14); ctx.fill();
      ctx.fillStyle = trailGrad; trailPath(0); ctx.fill();
      ctx.fillStyle = sunGlow; ctx.fillRect(cx - H * .6, hy, H * 1.2, H * .6);
    }

    /* ── объекты мира ── */
    const things = [];
    const LANES = [
      ['tree', -1, 1.45, 2.3, 1.15], ['tree', -1, 3.1, 5.2, 1.3], ['tree', 1, 1.4, 1.7, 2.4], ['tree', 1, 7.7, 11, 1.0], ['tree', -1, 6.5, 9, 1.6],
      ['bush', -1, 1.35, 3.3, .85], ['bush', 1, 1.3, 1.65, 3.4], ['bush', 1, 7.5, 9, 1.6],
      ['flowers', -1, 1.08, 1.35, .75], ['flowers', 1, 1.08, 1.25, 1.7], ['flowers', -1, 2.4, 4, 1.8],
      ['log', -1, 1.9, 3.6, 4.2], ['rock', -1, 1.25, 3.2, 3.1], ['rock', 1, 1.5, 1.8, 5.5], ['mush', -1, 1.3, 2.6, 3.4],
      ['lamp', -1, 1.2, 1.24, 4.4], ['reed', 1, 1.84, 2.0, 1.15], ['reed', 1, 7.25, 7.45, .6],
      ['house', -1, 5.6, 6.6, 9.5], ['house', 1, 9.2, 10.5, 12],
      ['tuft', -1, 1.02, 4, .22], ['tuft', 1, 1.02, 1.75, .35], ['tuft', -1, .8, .95, .28], ['tuft', 1, .8, .95, .3],
      ['stone', -1, .05, .8, 1.5], ['stone', 1, .05, .8, 1.7], ['stone', -1, .82, 1.02, 1.1], ['stone', 1, .82, 1.02, 1.3],
    ];
    const mk = (type, side, x0, x1, z) => ({ type, side, x: side * rand(x0, x1), z, v: (Math.random() * A[type].length) | 0, sc: rand(.85, 1.15), ph: rand(0, 6.28), lane: [x0, x1] });
    for (const [type, side, x0, x1, step] of LANES) {
      for (let z = rand(.4, step); z < FAR; z += step * dens * rand(.7, 1.3)) things.push(mk(type, side, x0, x1, z));
    }
    const mkGrit = z => {
      const kind = Math.random(), onTrail = Math.random() < .85;
      const u = onTrail ? rand(-.8, .8) : rand(-1.1, 1.1);
      return kind < .6 ? { z, u, spr: pick(A.gravel), w: rand(.04, .085), h: .7 }
        : kind < .85 ? { z, u, spr: pick(A.clod), w: rand(.07, .16), h: .5 }
        : { z, u, spr: pick(A.flat), w: rand(.06, .09), h: .5 };
    };
    const grit = Array.from({ length: opt.lite ? (small ? 260 : 520) : (small ? 650 : 1300) }, () => mkGrit(rand(.3, FAR)));
    const gLeaves = Array.from({ length: opt.lite ? (small ? 140 : 260) : (small ? 300 : 600) }, () => ({ x: rand(-4.5, 1.85), z: rand(.3, FAR), spr: pick(A.flat) }));
    const lakeLeaves = Array.from({ length: small ? 18 : 34 }, () => ({ x: rand(LAKE_X0 + .2, LAKE_X1 - .2), z: rand(.4, FAR), spr: pick(leafSprites).sharp, rot: rand(0, 6.28), sp: rand(-.1, .1) }));
    const stream = { z: -999 }; // ручей с мостом убран
    const motes = Array.from({ length: small ? 30 : 60 }, () => ({ x: rand(-.5, .5), y: rand(-.4, .5), s: rand(.6, 2.2), ph: rand(0, 6.28), v: rand(.005, .02) }));
    const rays = Array.from({ length: 9 }, (_, i) => ({ a: (i - 4) * .3 + rand(-.08, .08), w: rand(.02, .05), al: rand(.03, .07), ph: rand(0, 6.28) }));
    const air = opt.air ? [
      ...Array.from({ length: small ? 14 : 26 }, () => mkAir(0)),
      ...Array.from({ length: small ? 10 : 18 }, () => mkAir(1)),
      ...Array.from({ length: small ? 2 : 4 }, () => mkAir(2)),
    ] : [];
    function mkAir(layer) {
      return {
        layer, x: rand(-.1, 1.1), y: rand(-1.1, 1), spr: pick(leafSprites),
        s: layer === 2 ? rand(60, 100) : layer === 1 ? rand(22, 38) : rand(9, 16),
        vy: layer === 2 ? rand(.16, .26) : layer === 1 ? rand(.08, .14) : rand(.04, .07),
        ph: rand(0, 6.28), rot: rand(0, 6.28), vr: rand(-1.8, 1.8), f: rand(0, 6.28), fs: rand(1.6, 3.4),
      };
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, opt.maxDpr || 1.5);
      W = canvas.clientWidth || innerWidth; H = canvas.clientHeight || innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      hy = H * HY; cx = W / 2;
      K = Math.max(Math.min(W, H * 1.25) * .55, H * .42);
      bakeSky(); bakeFar(); bakeGround();
      waterCv = newCv(W, Math.ceil(H - hy) + 4);
    }

    const fogOf = z => Math.pow(clamp((z - 1.2) / (FAR - 1.2), 0, 1), .75) * .82;
    function drawThing(c, o, t, reflect) {
      const z = o.z; if (z < .3) return;
      const T = A[o.type][o.v], p = proj(o.x, 0, z);
      const h = SIZE[o.type] * (T.hs || 1) * o.sc * p.s, w = h * T.W / T.H, ax = T.ax ?? .5;
      if (w < .8 || p.x + w < -10 || p.x - w > W + 10) return;
      const fade = clamp((FAR - z) / 2.2, 0, 1) * (reflect ? .5 : 1);
      if (fade <= 0) return;
      const fogA = fogOf(z);
      c.save();
      c.translate(p.x, p.y);
      if (reflect) c.scale(1, -1);
      if (o.type === 'tree' || o.type === 'reed' || o.type === 'tuft' || o.type === 'flowers') c.rotate(Math.sin(t * (o.type === 'tree' ? .7 : 1.6) + o.ph) * (o.type === 'tree' ? .012 : .035));
      if (o.side > 0) c.scale(-1, 1);
      const oy = -h * T.base;
      c.globalAlpha = fade;
      c.drawImage(T.cv, -w * ax, oy, w, h);
      if (fogA > .02) { c.globalAlpha = fade * fogA; c.drawImage(T.fog, -w * ax, oy, w, h); }
      c.restore();
      if (reflect) return;
      if (T.glow) { // тёплый свет окон и фонарей
        c.globalCompositeOperation = 'lighter';
        for (const [u, v, s] of T.glow) {
          const gx = p.x + (o.side > 0 ? -1 : 1) * (u - ax) * w, gy = p.y + oy + v * h, gr = Math.max(4, s * w * 1.6);
          const g = c.createRadialGradient(gx, gy, 0, gx, gy, gr);
          g.addColorStop(0, `rgba(255,210,130,${.55 * fade * (1 - fogA * .6) * (.9 + .1 * Math.sin(t * 7 + o.ph))})`); g.addColorStop(1, 'rgba(255,170,80,0)');
          c.fillStyle = g; c.fillRect(gx - gr, gy - gr, gr * 2, gr * 2);
        }
        c.globalCompositeOperation = 'source-over';
      }
      if (T.chimney) { // дым из трубы
        const sx = p.x + (o.side > 0 ? -1 : 1) * (T.chimney[0] - ax) * w, sy = p.y + oy + T.chimney[1] * h;
        for (let k = 0; k < 8; k++) {
          const ph = ((t * .16 + k / 8 + o.ph) % 1 + 1) % 1, rr = h * (.03 + ph * .16);
          const g = c.createRadialGradient(sx + Math.sin(ph * 5 + o.ph) * h * .06 * ph - ph * h * .12, sy - ph * h * .55, 0, sx - ph * h * .12, sy - ph * h * .55, rr);
          g.addColorStop(0, `rgba(215,190,175,${.28 * (1 - ph) * fade})`); g.addColorStop(1, 'rgba(215,190,175,0)');
          c.fillStyle = g; c.beginPath(); c.arc(sx - ph * h * .12, sy - ph * h * .55, rr, 0, 6.28); c.fill();
        }
      }
    }
    function drawShadow(o) {
      if (o.type !== 'tree' && o.type !== 'house' && o.type !== 'lamp') return;
      const z = o.z; if (z < .5 || z > FAR - 1) return;
      const wd = o.type === 'house' ? .8 : o.type === 'lamp' ? .03 : .07, len = o.type === 'house' ? 2.2 : 2.8;
      const z2 = Math.max(.35, z - len);
      const a = proj(o.x - wd, 0, z), b = proj(o.x + wd, 0, z), c2 = proj(o.x * 1.2 + .35 + wd, 0, z2), d = proj(o.x * 1.2 - .35 - wd, 0, z2);
      ctx.globalAlpha = .34 * clamp((FAR - z) / 3, 0, 1);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(d.x, d.y); ctx.closePath(); ctx.fill();
    }
    function waterPoly(c, xa, xb, za, zb, add) {
      const p1 = proj(xa, 0, za), p2 = proj(xb, 0, za), p3 = proj(xb, 0, zb), p4 = proj(xa, 0, zb);
      if (!add) c.beginPath();
      c.moveTo(p1.x, p1.y); c.lineTo(p2.x, p2.y); c.lineTo(p3.x, p3.y); c.lineTo(p4.x, p4.y); c.closePath();
    }
    function drawWater(t) {
      const gy0 = Math.floor(hy), gh = waterCv.height;
      const w = waterCv.getContext('2d');
      w.setTransform(1, 0, 0, 1, 0, 0); w.clearRect(0, 0, W, gh);
      const wg = w.createLinearGradient(0, 0, 0, gh);
      wg.addColorStop(0, '#fde0a6'); wg.addColorStop(.1, '#f4ad62'); wg.addColorStop(.3, '#d98a72'); wg.addColorStop(.6, '#9a7092'); wg.addColorStop(1, '#5e6a92');
      w.fillStyle = wg; w.fillRect(0, 0, W, gh);
      w.translate(0, -gy0);
      for (const o of things) if (o.x > LAKE_X0 - .2 && o.type !== 'tuft') drawThing(w, o, t, true); // отражения берега
      w.globalCompositeOperation = 'lighter';
      for (let i = 0; i < (small ? 160 : 320); i++) { // блики на воде
        const u = (i * 37.3 % 100) / 100, v = Math.pow((i * 61.7 % 100) / 100, 1.8);
        const zz = .4 + v * FAR * .9, q = proj(lerp(LAKE_X0, LAKE_X1, u), 0, zz);
        const tw = .5 + .5 * Math.sin(t * 3 + i * 1.7);
        w.fillStyle = `rgba(255,232,190,${.55 * tw * (1 - v * .5)})`;
        w.fillRect(q.x, q.y, 3 + q.s * .12, Math.max(1, q.s * .008));
      }
      w.globalCompositeOperation = 'source-over';
      ctx.save();
      waterPoly(ctx, LAKE_X0, LAKE_X1 + 30, .3, FAR * 1.4);
      const s0 = stream.z, sp = s0 > .3 && s0 < FAR;
      if (sp) { waterPoly(ctx, -40, LAKE_X0 + .1, Math.max(.3, s0 - .32), s0 + .32, true); }
      ctx.clip();
      const st = opt.strip || 2;
      for (let y = 0; y < gh; y += st) { // рябь
        const k = y / gh, dx = Math.sin(y * .45 + t * 2.4) * (.6 + k * 4);
        ctx.drawImage(waterCv, 0, y, W, st, dx, gy0 + y, W, st);
      }
      ctx.fillStyle = 'rgba(227,160,110,.35)'; ctx.fillRect(0, gy0, W, (H - gy0) * .12); // дымка над водой
      const sh = ctx.createLinearGradient(0, gy0, 0, H); // глянец
      sh.addColorStop(0, 'rgba(255,220,170,0)'); sh.addColorStop(1, 'rgba(255,215,175,.16)');
      ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = sh; ctx.fillRect(0, gy0, W, H - gy0); ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
      { // светлая кромка берега
        const a = proj(LAKE_X0, 0, FAR), b = proj(LAKE_X0, 0, .35);
        const lg = ctx.createLinearGradient(a.x, a.y, b.x, b.y); lg.addColorStop(0, 'rgba(255,225,180,.1)'); lg.addColorStop(1, 'rgba(255,225,180,.45)');
        ctx.strokeStyle = lg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      // берег
      for (const l of lakeLeaves) { // листья на воде
        const q = proj(l.x + Math.sin(t * .2 + l.rot) * .05, 0, l.z), sz = .11 * q.s;
        if (sz < 1.2) continue;
        ctx.globalAlpha = 1 - fogOf(l.z);
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(l.rot + t * .05); ctx.scale(1, .4); ctx.drawImage(l.spr, -sz / 2, -sz / 2, sz, sz); ctx.restore();
      }
      ctx.globalAlpha = 1;
      for (let k = 0; k < 4; k++) { // круги на воде
        const ph = (((t / 2.4) + k / 4) % 1 + 1) % 1, zz = 1.6 + k * 1.7, q = proj(3.2 + k * .8, 0, zz);
        ctx.strokeStyle = `rgba(255,236,200,${.4 * (1 - ph)})`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(q.x, q.y, ph * q.s * .5, ph * q.s * .08, 0, 0, 6.28); ctx.stroke();
      }
    }
    function drawBridge(t) {
      const z = stream.z; if (z < .5 || z > FAR) return;
      const za = Math.max(.35, z - .5), zb = z + .5, y = .14, x = 1.3;
      const fogA = fogOf(z);
      const q = (xx, yy, zz) => proj(xx, yy, zz);
      ctx.save(); ctx.globalAlpha = 1;
      // опоры
      ctx.fillStyle = '#2a1a0e';
      let a = q(-x, y, za), b = q(x, y, za), c2 = q(x, -.08, za), d = q(-x, -.08, za);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(d.x, d.y); ctx.fill();
      // настил
      const n = 12;
      for (let i = 0; i < n; i++) {
        const z0 = lerp(zb, za, i / n), z1 = lerp(zb, za, (i + .88) / n);
        const p1 = q(-x, y, z0), p2 = q(x, y, z0), p3 = q(x, y, z1), p4 = q(-x, y, z1);
        ctx.fillStyle = i % 2 ? '#8a6040' : '#7a5236';
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.fill();
      }
      const lg = ctx.createRadialGradient(cx, hy, 0, cx, hy, H); lg.addColorStop(0, 'rgba(255,210,140,.25)'); lg.addColorStop(1, 'rgba(255,210,140,0)');
      ctx.fillStyle = lg; a = q(-x, y, zb); b = q(x, y, zb); c2 = q(x, y, za); d = q(-x, y, za);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(d.x, d.y); ctx.fill();
      // перила
      ctx.lineCap = 'round';
      for (const sx of [-x, x]) {
        const posts = [zb, z, za];
        for (const pz of posts) {
          const p0 = q(sx, y, pz), p1 = q(sx, .95, pz);
          ctx.strokeStyle = '#3a2414'; ctx.lineWidth = Math.max(1.5, .07 * p0.s);
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        }
        for (const hh of [.95, .55]) {
          const p0 = q(sx, hh, zb), p1 = q(sx, hh, za);
          ctx.strokeStyle = hh > .9 ? '#6a4628' : '#4a301a'; ctx.lineWidth = Math.max(1.2, .05 * p1.s);
          ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();
        }
      }
      ctx.restore();
    }

    function frame(t, dz, o = {}) {
      if (dz) {
        camZ += dz;
        for (const th of things) {
          th.z -= dz;
          if (th.z < .3) { const n = mk(th.type, th.side, th.lane[0], th.lane[1], th.z + FAR); Object.assign(th, n); }
        }
        for (const l of gLeaves) { l.z -= dz; if (l.z < .3) { l.z += FAR; l.x = rand(-4.5, 1.85); } }
        for (let i = 0; i < grit.length; i++) { const g = grit[i]; g.z -= dz; if (g.z < .3) grit[i] = mkGrit(g.z + FAR); }
        for (const l of lakeLeaves) { l.z -= dz; l.x += l.sp * dz * .1; if (l.z < .4) { l.z += FAR; l.x = rand(LAKE_X0 + .2, LAKE_X1 - .2); } }
        
      }
      things.sort((a, b) => b.z - a.z);
      const bob = o.bob ? Math.sin(t * 5.4) * H * .0028 : 0;
      ctx.save(); ctx.translate(0, bob);
      ctx.drawImage(sky, 0, -2, W, sky.height + 2);
      const sunY = hy - H * .03, pulse = 1 + Math.sin(t * 1.1) * .03;
      ctx.globalCompositeOperation = 'lighter';
      let sg = ctx.createRadialGradient(cx, sunY, 0, cx, sunY, H * .55 * pulse);
      sg.addColorStop(0, 'rgba(255,245,215,.95)'); sg.addColorStop(.06, 'rgba(255,225,160,.8)'); sg.addColorStop(.25, 'rgba(255,170,90,.28)'); sg.addColorStop(1, 'rgba(255,140,70,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(far, 0, hy - far.height + 1);
      ctx.drawImage(ground, 0, Math.floor(hy));
      drawTrail();
      ctx.globalCompositeOperation = 'lighter';
      sg = ctx.createRadialGradient(cx, hy, 0, cx, hy, W * .22);
      sg.addColorStop(0, 'rgba(255,215,150,.55)'); sg.addColorStop(1, 'rgba(255,170,90,0)');
      ctx.fillStyle = sg; ctx.fillRect(0, hy - H * .25, W, H * .4);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#2a1640';
      for (const th of things) drawShadow(th);
      ctx.globalAlpha = 1;
      for (const g of grit) { // гравий, комья и листья на тропе едут навстречу
        const q = proj(trailMid(g.z + camZ) + g.u, 0, g.z), w = g.w * q.s;
        if (w < .9 || q.y > H + 20) continue;
        const hh = w * g.h;
        ctx.globalAlpha = 1 - clamp((g.z - 4) / (FAR - 4), 0, 1) * .75;
        ctx.drawImage(g.spr, q.x - w / 2, q.y - hh / 2, w, hh);
      }
      ctx.globalAlpha = 1;
      for (const l of gLeaves) {
        const q = proj(l.x, 0, l.z), sz = .085 * q.s;
        if (sz < 1.4 || q.y > H + 20 || q.x < -30 || q.x > W + 30) continue;
        ctx.globalAlpha = 1 - clamp((l.z - 3) / (FAR - 3), 0, 1) * .7;
        ctx.drawImage(l.spr, q.x - sz / 2, q.y - sz / 4, sz, sz / 2);
      }
      ctx.globalAlpha = 1;
      drawWater(t);
      let bridgeDone = false;
      for (const th of things) {
        if (!bridgeDone && th.z < stream.z) { drawBridge(t); bridgeDone = true; }
        drawThing(ctx, th, t, false);
      }
      if (!bridgeDone) drawBridge(t);
      ctx.globalCompositeOperation = 'lighter';
      const R0 = Math.hypot(W, H) * 1.1;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, hy); ctx.clip();
      for (const ry of rays) {
        const a = ry.a + Math.sin(t * .18 + ry.ph) * .05, w = ry.w * (1 + Math.sin(t * .4 + ry.ph) * .25);
        const gr = ctx.createRadialGradient(cx, sunY, 0, cx, sunY, R0);
        gr.addColorStop(0, `rgba(255,215,150,${ry.al * .9})`); gr.addColorStop(.45, `rgba(255,190,120,${ry.al * .22})`); gr.addColorStop(1, 'rgba(255,170,100,0)');
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.moveTo(cx, sunY);
        ctx.lineTo(cx + Math.sin(a - w) * R0, sunY - Math.cos(a - w) * R0 * .6);
        ctx.lineTo(cx + Math.sin(a + w) * R0, sunY - Math.cos(a + w) * R0 * .6);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      for (const m of motes) {
        m.y -= m.v * .016; if (m.y < -.5) m.y = .5;
        const x = cx + (m.x + Math.sin(t * .3 + m.ph) * .03) * W * .8, y = sunY + (m.y - .25) * H * .5;
        const tw = .4 + .6 * Math.abs(Math.sin(t * 1.4 + m.ph));
        ctx.fillStyle = `rgba(255,230,180,${.55 * tw * (1 - Math.abs(m.x) * 1.4)})`;
        ctx.beginPath(); ctx.arc(x, y, m.s, 0, 6.28); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
      if (air.length) {
        const push = .08 + (o.push || 0), dt = .016;
        for (const l of air) {
          l.ph += dt * 1.2; l.f += l.fs * dt; l.rot += l.vr * dt; l.y += l.vy * dt;
          l.x += (Math.sin(l.ph) * .04 - .015) * dt + (l.x - .5) * push * dt * (l.layer + 1) * .5;
          l.y += (l.y - .55) * push * dt * (l.layer + 1) * .25;
          if (l.y > 1.15 || l.x < -.2 || l.x > 1.2) Object.assign(l, mkAir(l.layer), { y: rand(-.2, -.05) });
          drawLeafSprite(ctx, l.spr, l.x * W, l.y * H, l.s * (small ? .75 : 1), l.rot, Math.cos(l.f), l.layer === 0 ? .8 : .95, l.layer === 2);
        }
      }
      const v = ctx.createRadialGradient(cx, H * .55, H * .25, cx, H * .55, Math.hypot(W, H) * .6);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(22,12,34,.62)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      if (o.flash) {
        const f = ctx.createRadialGradient(cx, sunY, 0, cx, sunY, Math.max(W, H) * (.15 + o.flash * 1.3));
        f.addColorStop(0, `rgba(255,246,225,${o.flash})`); f.addColorStop(1, 'rgba(255,220,160,0)');
        ctx.fillStyle = f; ctx.fillRect(0, 0, W, H);
      }
      if (o.fadeIn != null && o.fadeIn < 1) { ctx.fillStyle = `rgba(27,19,12,${1 - o.fadeIn})`; ctx.fillRect(0, 0, W, H); }
    }

    resize();
    return { resize, frame };
  }
  return { create };
})();

/* ─── ПРЕЛОАДЕР: ПРОГУЛКА ПО ОСЕННЕЙ АЛЛЕЕ ────────────────────────────── */
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
  setTimeout(() => { // даём браузеру отрисовать экран до запекания сцены
    let scene;
    try { scene = Forest.create($('#loader-canvas'), { air: true, horizon: .5 }); } catch (e) { console.error(e); return finish(); }
    addEventListener('resize', () => !finished && scene.resize());
    loader.classList.add('is-ready');
    const DUR = 6800, t0 = performance.now();
    let last = t0;
    (function frame(now) {
      if (finished) return;
      const el = Math.max(0, now - t0), p = clamp(el / DUR, 0, 1), dt = Math.min(.05, (now - last) / 1000); last = now;
      const speed = p < .7 ? 1.6 : 1.6 + Math.pow((p - .7) / .3, 2) * 10;
      scene.frame(el / 1000, speed * dt, { bob: true, push: p > .7 ? (p - .7) * 2 : 0, flash: clamp((p - .76) / .24, 0, 1), fadeIn: clamp(el / 900, 0, 1) });
      if (el >= DUR) return finish();
      requestAnimationFrame(frame);
    })(t0);
  }, 30);
}

/* ─── HERO: ТА ЖЕ АЛЛЕЯ, МЕДЛЕННО ──────────────────────────────────────── */
function startHeroScene() {
  const cv = $('#hero-scene'); if (!cv) return;
  let scene;
  try { scene = Forest.create(cv, { horizon: .56, maxDpr: isMobile ? 1 : 1.25, lite: true }); } catch (e) { console.error(e); return; }
  scene.frame(2.5, 0);
  let tm;
  addEventListener('resize', () => { clearTimeout(tm); tm = setTimeout(() => { scene.resize(); scene.frame(2.5, 0); }, 200); });
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
  const dot = $('#cursor-dot'), pv = $('#preview');
  let x = innerWidth / 2, y = innerHeight / 2, px = x, py = y, shown = false, moved = true;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY; moved = true;
    if (!shown) { shown = true; px = x; py = y; }
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    dot.classList.toggle('is-hover', !!e.target.closest('a, button, summary, .chip, input, textarea, .work'));
  });
  addEventListener('pointerdown', () => dot.classList.add('is-down'));
  addEventListener('pointerup', () => dot.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => { dot.style.opacity = 0; });
  document.addEventListener('pointerenter', () => { dot.style.opacity = ''; });

  // магнитные кнопки
  const mags = $$('.btn, .icon-btn, .logo'), off = mags.map(() => [0, 0]);
  let rects = null, magQueued = false;
  const dropRects = () => { rects = null; };
  addEventListener('scroll', dropRects, { passive: true });
  addEventListener('resize', dropRects);
  addEventListener('pointermove', () => {
    if (magQueued) return; magQueued = true;
    requestAnimationFrame(() => {
      magQueued = false;
      if (!rects) rects = mags.map((m, i) => { const b = m.getBoundingClientRect(); return [b.left - off[i][0] + b.width / 2, b.top - off[i][1] + b.height / 2, b.width / 2 + 40, b.height / 2 + 30]; });
      mags.forEach((m, i) => {
        const [cx, cy, rw, rh] = rects[i], dx = x - cx, dy = y - cy;
        const near = Math.abs(dx) < rw && Math.abs(dy) < rh;
        const tx = near ? dx * .22 : 0, ty = near ? dy * .3 : 0;
        if (tx === off[i][0] && ty === off[i][1]) return;
        off[i] = [tx, ty]; m.style.translate = near ? `${tx}px ${ty}px` : '';
      });
    });
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
    if (moved) { dot.style.transform = `translate3d(${x}px, ${y}px, 0)`; moved = false; }
    if (pv.classList.contains('is-on') || Math.abs(px - x) > .5 || Math.abs(py - y) > .5) {
      px = lerp(px, x, .14); py = lerp(py, y, .14);
      pv.style.translate = `${px}px ${py}px`;
      pv.style.rotate = `${clamp((x - px) * .4, -14, 14)}deg`;
    }
    requestAnimationFrame(tick);
  })();
}

/* ─── ПАРАЛЛАКС ПЕЙЗАЖА И ЛИНИЯ ПРОЦЕССА ───────────────────────────────── */
function startScrollFx() {
  const steps = $('.steps'), stepEls = $$('.step');
  const topbar = $('#topbar'), heroPhoto = $('.hero-scene-wrap');
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

/* ─── ЗАЩИТА ТЕКСТА ОТ КОПИРОВАНИЯ ─────────────────────────────────────── */
const copyAllowed = el => !!(el && el.closest && el.closest('input, textarea, .pay-val'));
['copy', 'cut'].forEach(type => document.addEventListener(type, e => {
  const node = document.getSelection()?.anchorNode;
  const el = node && (node.nodeType === 1 ? node : node.parentElement);
  if (!copyAllowed(e.target) && !copyAllowed(el)) e.preventDefault();
}));
document.addEventListener('dragstart', e => { if (!copyAllowed(e.target)) e.preventDefault(); });

/* ─── СТАРТ ────────────────────────────────────────────────────────────── */
const saved = store.get('naha_lang');
if (saved && saved !== 'ru' && I18N[saved]) applyLang(saved); else renderReviews();

function startSmoothScroll() {
  if (reduceMotion || !finePointer || !window.Lenis) return;
  const lenis = new window.Lenis({ lerp: .09, wheelMultiplier: 1, anchors: { offset: -80 } });
  (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
}

runIntro(() => {
  startSmoothScroll();
  startReveal();
  startPointerFx();
  startScrollFx();
  startHeroScene();
  chat.start();
  leaves.start();
});
})();
