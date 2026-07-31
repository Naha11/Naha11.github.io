/* ================================================================
   🎉 СЕКРЕТ АХАНА — браузерная игра ко Дню Рождения
   10 мини-игр → 10 фрагментов пазла → финальная фотография
   ================================================================ */

const IMG = 'assets/family.jpeg';
const IMG_W = 1080, IMG_H = 734;
const COLS = 5, ROWS = 4, TOTAL = COLS * ROWS;
const SAVE_KEY = 'ahan_secret_progress_v2';
const PIECE_RATIO = (IMG_W / COLS) / (IMG_H / ROWS);   // ширина/высота одного фрагмента

/* шутки-подколы, которые сыплются между уровнями */
const JOKES = [
  'Ахан сказал, что этот уровень был лёгкий. Ахан врёт.',
  'Мама бы прошла быстрее. Но мы никому не скажем.',
  'Ты официально круче, чем 87% гостей праздника.',
  'Осторожно: следующий уровень видел, как ты играешь.',
  'Торт пытался сбежать, но передумал.',
  'Уровень пройден! Аплодисменты и один воображаемый шарик 🎈',
  'Где-то заплакал один непройденный уровень.',
  'Ты потратил на это столько же времени, сколько мама на макияж. Уважение.',
  'Секретный отдел поздравлений одобряет.',
  'Если бы за это давали медаль — тебе бы дали половинку.',
  'Ахан требует пересчёта голосов. Отклонено.',
  'Мама уже гордится. Даже не спрашивай.'
];
const joke = () => JOKES[(Math.random() * JOKES.length) | 0];

/* ---------------- Состояние и сохранение ---------------- */
const defaultState = () => ({ unlocked: 1, pieces: [], puzzleDone: false, sound: true });
let state = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (raw && typeof raw.unlocked === 'number' && Array.isArray(raw.pieces)) {
      return Object.assign(defaultState(), raw);
    }
  } catch (e) { /* повреждённое сохранение — начинаем заново */ }
  return defaultState();
}
function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
function hasPiece(i) { return state.pieces.includes(i); }

/* ---------------- Звук (WebAudio, без внешних файлов) ---------------- */
const Sound = (() => {
  let ctx = null, musicTimer = null, step = 0;
  const TUNES = {
    game: [523.25, 659.25, 783.99, 1046.5, 783.99, 659.25, 587.33, 493.88],
    credits: [392, 523.25, 659.25, 587.33, 523.25, 440, 493.88, 523.25, 659.25, 783.99, 659.25, 523.25]
  };
  let melody = TUNES.game;
  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur = .14, type = 'triangle', vol = .18, delay = 0) {
    if (!state.sound) return;
    const c = ac(), t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + .015);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + .05);
  }
  return {
    click() { tone(660, .08, 'square', .12); },
    pop() { tone(300 + Math.random() * 500, .09, 'sawtooth', .14); },
    good() { tone(659, .12); tone(880, .16, 'triangle', .18, .1); },
    bad() { tone(180, .22, 'sawtooth', .14); tone(120, .26, 'sawtooth', .12, .08); },
    reward() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, .3, 'triangle', .2, i * .11)); },
    fanfare() {
      [523, 659, 784, 1046, 880, 1046, 1318, 1568].forEach((f, i) => tone(f, .45, 'triangle', .22, i * .16));
      [261, 329, 392, 523].forEach((f, i) => tone(f, .8, 'sine', .14, i * .32));
    },
    music(on, tune) {
      clearInterval(musicTimer); musicTimer = null;
      if (tune && TUNES[tune]) { melody = TUNES[tune]; step = 0; }
      if (!on || !state.sound) return;
      const slow = melody === TUNES.credits;
      musicTimer = setInterval(() => {
        const n = melody[step % melody.length];
        tone(n, slow ? .5 : .35, 'sine', slow ? .07 : .05);
        tone(n / 2, slow ? .55 : .4, 'sine', .035);
        if (slow && step % 4 === 0) tone(n * 2, .3, 'triangle', .03);
        step++;
      }, slow ? 500 : 420);
    },
    warm() { ac(); }
  };
})();

/* ---------------- Конфетти ---------------- */
const Confetti = (() => {
  const cv = document.getElementById('confetti');
  const cx = cv.getContext('2d');
  let parts = [], raf = null;
  function resize() { cv.width = innerWidth; cv.height = innerHeight; }
  addEventListener('resize', resize); resize();
  const colors = ['#ff4fa3', '#a35bff', '#3ff0ff', '#ffd45e', '#42e6a4', '#ffffff'];
  function burst(count = 130, big = false) {
    for (let i = 0; i < count; i++) {
      parts.push({
        x: Math.random() * cv.width,
        y: big ? Math.random() * cv.height * .4 - 60 : -20 - Math.random() * 120,
        vx: (Math.random() - .5) * 3,
        vy: 2 + Math.random() * 4,
        s: 5 + Math.random() * 8,
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .25,
        c: colors[(Math.random() * colors.length) | 0],
        life: 1
      });
    }
    if (!raf) loop();
  }
  function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(p => p.y < cv.height + 40 && p.life > 0);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .05; p.r += p.vr; p.life -= .0025;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.globalAlpha = Math.max(0, p.life);
      cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6);
      cx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; cx.clearRect(0, 0, cv.width, cv.height); }
  }
  return { burst };
})();

/* ---------------- Фоновые частицы ---------------- */
(function bgParticles() {
  const host = document.getElementById('bgParticles');
  const set = ['🎈', '✨', '🎊', '⭐', '🎉', '🎁', '💜'];
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    s.textContent = set[(Math.random() * set.length) | 0];
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = (14 + Math.random() * 22) + 'px';
    s.style.animationDuration = (14 + Math.random() * 16) + 's';
    s.style.animationDelay = (-Math.random() * 25) + 's';
    host.appendChild(s);
  }
})();

/* ---------------- Утилиты ---------------- */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const rnd = n => (Math.random() * n) | 0;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1);[a[i], a[j]] = [a[j], a[i]]; } return a; };
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

let toastTimer;
function toast(msg, ms = 1800) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), ms);
}

/* фрагмент фотографии как фон элемента */
function pieceStyle(node, index, widthPx) {
  const col = index % COLS, row = (index / COLS) | 0;
  const w = widthPx, h = widthPx * (IMG_H / ROWS) / (IMG_W / COLS);
  node.style.backgroundSize = (w * COLS) + 'px ' + (h * ROWS) + 'px';
  node.style.backgroundPosition = (-col * w) + 'px ' + (-row * h) + 'px';
  return { w, h };
}

/* очистка активных таймеров/слушателей уровня */
let cleanups = [];
function addCleanup(fn) { cleanups.push(fn); }
function runCleanups() { cleanups.forEach(f => { try { f(); } catch (e) { } }); cleanups = []; }

/* ---------------- Экраны ---------------- */
function show(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
  scrollTo({ top: 0, behavior: 'smooth' });
}

/* ================================================================
   МИНИ-ИГРЫ
   Каждая: start(host, win) — рисует себя в host и зовёт win() при победе
   ================================================================ */
const LEVELS = [
  /* --------- 1. Найди подарок --------- */
  {
    title: 'Найди подарок', icon: '🎁', desc: 'Найди 🎁 четыре раза подряд. С каждым разом хлама больше.',
    start(host, win, setStatus) {
      let round = 0;
      const decoys = ['🎈', '🍬', '🎂', '📦', '🍭', '🧁', '🎊', '🎵', '🍰', '🎀', '🛍', '💝', '🪅'];
      const play = () => {
        host.innerHTML = '';
        setStatus(`Раунд ${round + 1}/4`);
        const n = 24 + round * 18;
        const cols = Math.min(8, Math.ceil(Math.sqrt(n)));
        const grid = el('div', 'find-grid');
        grid.style.gridTemplateColumns = `repeat(${cols},minmax(0,1fr))`;
        grid.style.maxWidth = '520px';
        const giftAt = rnd(n);
        for (let i = 0; i < n; i++) {
          const it = el('div', 'find-item', i === giftAt ? '🎁' : decoys[rnd(decoys.length)]);
          it.onclick = () => {
            if (i === giftAt) {
              Sound.good(); round++;
              if (round >= 4) { win(); } else { toast(['Нашёл! Ещё разок 🎁', 'Быстро! А теперь сложнее 😈', 'Последний раунд, не подведи!'][round - 1]); play(); }
            } else {
              Sound.bad(); it.classList.add('wrong');
              setTimeout(() => it.classList.remove('wrong'), 400);
            }
          };
          grid.appendChild(it);
        }
        host.appendChild(el('p', 'game-msg', 'Кликни на 🎁 — только на подарок!'));
        host.appendChild(grid);
      };
      play();
    }
  },

  /* --------- 2. Лабиринт --------- */
  {
    title: 'Лабиринт', icon: '🌀', desc: 'Проведи шарик к выходу. Коснулся стены — начинаешь заново.',
    start(host, win, setStatus) {
      const W = 17, H = 11;                // нечётные размеры для генератора
      let grid, px, py, tries = 0, done = false;

      function gen() {
        grid = Array.from({ length: H }, () => Array(W).fill(1));
        const stack = [[1, 1]]; grid[1][1] = 0;
        const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]];
        while (stack.length) {
          const [x, y] = stack[stack.length - 1];
          const opts = shuffle(dirs.slice()).filter(([dx, dy]) => {
            const nx = x + dx, ny = y + dy;
            return nx > 0 && ny > 0 && nx < W - 1 && ny < H - 1 && grid[ny][nx] === 1;
          });
          if (!opts.length) { stack.pop(); continue; }
          const [dx, dy] = opts[0], nx = x + dx, ny = y + dy;
          grid[y + dy / 2][x + dx / 2] = 0; grid[ny][nx] = 0;
          stack.push([nx, ny]);
        }
        grid[H - 2][W - 2] = 0;
      }

      function draw() {
        const g = $('#mazeGrid'); if (!g) return;
        [...g.children].forEach((c, i) => {
          const x = i % W, y = (i / W) | 0;
          c.className = 'mz ' + (grid[y][x] ? 'wall' : 'path');
          if (x === W - 2 && y === H - 2) c.classList.add('exit');
          if (x === px && y === py) c.classList.add('ball');
        });
      }

      function reset(msg) {
        px = 1; py = 1; tries++;
        setStatus('Попытка ' + tries);
        if (msg) { Sound.bad(); toast(msg); }
        draw();
      }

      function move(dx, dy) {
        if (done) return;
        const nx = px + dx, ny = py + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) { reset('🧱 Стена! Начинаем заново'); return; }
        if (grid[ny][nx] === 1) { reset('🧱 Стена! Начинаем заново'); return; }
        px = nx; py = ny; Sound.click(); draw();
        if (px === W - 2 && py === H - 2) { done = true; win(); }
      }

      gen();
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Стрелки на клавиатуре или кнопки ниже. Синий шарик → зелёный выход.'));
      const g = el('div', 'maze'); g.id = 'mazeGrid';
      g.style.gridTemplateColumns = `repeat(${W},1fr)`;
      g.style.width = 'min(520px,92%)';
      for (let i = 0; i < W * H; i++) g.appendChild(el('div', 'mz'));
      host.appendChild(g);

      const pad = el('div', 'dpad');
      const mk = (t, dx, dy, gc, gr) => {
        const b = el('button', null, t);
        b.style.gridColumn = gc; b.style.gridRow = gr;
        b.onclick = () => move(dx, dy);
        pad.appendChild(b);
      };
      mk('⬆', 0, -1, '2', '1'); mk('⬅', -1, 0, '1', '2'); mk('⬇', 0, 1, '2', '2'); mk('➡', 1, 0, '3', '2');
      host.appendChild(pad);

      const key = e => {
        const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] }[e.key];
        if (m) { e.preventDefault(); move(m[0], m[1]); }
      };
      addEventListener('keydown', key, { passive: false });
      addCleanup(() => removeEventListener('keydown', key));
      reset();
    }
  },

  /* --------- 3. Память --------- */
  {
    title: 'Память', icon: '🧠', desc: 'Найди 6 пар. Мозг, не подведи.',
    start(host, win, setStatus) {
      const icons = ['🎂', '🎈', '🎁', '🎉', '🍰', '🥳'];
      const deck = shuffle([...icons, ...icons]);
      let open = [], matched = 0, lock = false, moves = 0;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Переворачивай карточки и находи пары.'));
      const grid = el('div', 'mem-grid');
      deck.forEach((ic, i) => {
        const card = el('div', 'mem-card');
        card.innerHTML = `<div class="mem-inner">
            <div class="mem-face mem-front">❓</div>
            <div class="mem-face mem-back">${ic}</div></div>`;
        card.dataset.ic = ic;
        card.onclick = () => {
          if (lock || card.classList.contains('flip')) return;
          card.classList.add('flip'); Sound.click(); open.push(card);
          if (open.length === 2) {
            moves++; setStatus('Ходов: ' + moves); lock = true;
            const [a, b] = open;
            if (a.dataset.ic === b.dataset.ic) {
              setTimeout(() => {
                a.classList.add('matched'); b.classList.add('matched');
                Sound.good(); open = []; lock = false; matched++;
                if (matched === icons.length) win();
              }, 380);
            } else {
              setTimeout(() => {
                a.classList.remove('flip'); b.classList.remove('flip');
                Sound.bad(); open = []; lock = false;
              }, 750);
            }
          }
        };
        grid.appendChild(card);
      });
      host.appendChild(grid);
      setStatus('Ходов: 0');
    }
  },

  /* --------- 4. Лопни шарики --------- */
  {
    title: 'Лопни шарики', icon: '🎈', desc: 'Лопни 18 шаров за 20 секунд. Чёрные (💣) не трогай!',
    start(host, win, setStatus) {
      const NEED = 18, TIME = 20;
      let popped = 0, left = TIME, balloons = [], running = true;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Тапай по шарикам — лопай их быстрее!'));
      const field = el('div', 'balloon-field'); host.appendChild(field);
      const colors = ['🎈', '🟣', '🔵', '🟡', '🟢', '🔴'];

      const upd = () => setStatus(`${popped}/${NEED} · ⏱ ${left}с`);
      upd();

      const spawner = setInterval(() => {
        if (!running) return;
        const bomb = Math.random() < .22;
        const b = el('div', 'balloon' + (bomb ? ' bomb' : ''), bomb ? '💣' : colors[rnd(colors.length)]);
        const x = 5 + Math.random() * 85;
        b.style.left = x + '%';
        b.style.top = '100%';
        b._y = 100; b._sp = .4 + Math.random() * .6; b._sw = Math.random() * 2;
        b.addEventListener('pointerdown', ev => {
          ev.preventDefault();
          if (!running || b._dead) return;
          if (bomb) {
            b._dead = true; b.remove(); balloons = balloons.filter(x => x !== b);
            popped = Math.max(0, popped - 3); Sound.bad(); upd();
            toast('💣 Ба-бах! −3 шарика'); return;
          }
          b._dead = true; popped++; Sound.pop(); upd();
          const fx = el('div', 'pop-fx', '💥');
          fx.style.left = b.style.left; fx.style.top = b.style.top;
          field.appendChild(fx); setTimeout(() => fx.remove(), 500);
          b.remove(); balloons = balloons.filter(x => x !== b);
          if (popped >= NEED) { running = false; finish(true); }
        });
        field.appendChild(b); balloons.push(b);
      }, 330);

      let raf;
      const tick = () => {
        balloons.forEach(b => {
          b._y -= b._sp;
          b.style.top = b._y + '%';
          b.style.transform = `translateX(${Math.sin(b._y / 12) * b._sw * 8}px)`;
          if (b._y < -12) { b.remove(); balloons = balloons.filter(x => x !== b); }
        });
        if (running) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      const timer = setInterval(() => {
        left--; upd();
        if (left <= 0) { running = false; finish(false); }
      }, 1000);

      function stop() { running = false; clearInterval(spawner); clearInterval(timer); cancelAnimationFrame(raf); }
      addCleanup(stop);

      function finish(ok) {
        stop();
        if (ok) win();
        else {
          Sound.bad();
          host.innerHTML = '';
          host.appendChild(el('p', 'game-msg', `⏰ Время вышло! Лопнуто ${popped} из ${NEED}.`));
          const again = el('button', 'btn', 'Попробовать снова');
          again.onclick = () => { runCleanups(); LEVELS[3].start(host, win, setStatus); };
          host.appendChild(again);
        }
      }
    }
  },

  /* --------- 5. Собери торт --------- */
  {
    title: 'Собери торт', icon: '🎂', desc: 'Перетащи слои снизу вверх в правильном порядке.',
    start(host, win, setStatus) {
      const layers = [
        { id: 0, name: '🍫 Основа', color: '#8a5a2b' },
        { id: 1, name: '🍓 Крем', color: '#ff9ec4' },
        { id: 2, name: '🍰 Бисквит', color: '#ffd9a0' },
        { id: 3, name: '🍦 Глазурь', color: '#b7ecff' },
        { id: 4, name: '🍒 Ягоды', color: '#ff8080' },
        { id: 5, name: '🕯 Свечи', color: '#ffd45e' }
      ];
      let placed = 0;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Слой за слоем: основа внизу, свечи сверху.'));
      const area = el('div', 'cake-area');
      const slots = el('div', 'cake-slots');
      layers.forEach((l, i) => {
        const s = el('div', 'cake-slot', (i + 1) + '. ' + l.name);
        s.dataset.slot = l.id;
        slots.appendChild(s);
      });
      const tray = el('div', 'cake-tray');
      shuffle(layers.slice()).forEach(l => {
        const d = el('div', 'cake-layer', l.name);
        d.style.background = `linear-gradient(135deg,${l.color},#fff8)`;
        d.dataset.id = l.id;
        makeDraggable(d, (x, y) => {
          const target = document.elementFromPoint(x, y)?.closest('.cake-slot');
          $$('.cake-slot').forEach(s => s.classList.remove('hover'));
          if (target && target.dataset.slot === d.dataset.id && !target.classList.contains('filled')) {
            target.classList.add('filled');
            target.textContent = '';
            target.style.background = `linear-gradient(135deg,${l.color},#fff8)`;
            target.style.color = '#3a0030';
            target.style.fontWeight = 'bold';
            target.textContent = l.name;
            d.remove(); placed++; Sound.good();
            setStatus(`${placed}/${layers.length}`);
            if (placed === layers.length) setTimeout(win, 350);
            return true;
          }
          Sound.bad();
          return false;
        }, (x, y) => {
          const t = document.elementFromPoint(x, y)?.closest('.cake-slot');
          $$('.cake-slot').forEach(s => s.classList.toggle('hover', s === t));
        });
        tray.appendChild(d);
      });
      area.appendChild(tray); area.appendChild(slots);
      host.appendChild(area);
      setStatus('0/' + layers.length);
    }
  },

  /* --------- 6. Кто тебя больше любит? --------- */
  {
    title: 'Кто тебя больше любит?', icon: '💖', desc: 'Все имена убегают. Но правильное иногда устаёт — лови момент!',
    start(host, win, setStatus) {
      const NAMES = ['Алуа', 'Галимжан', 'Ахан', 'Гульнара', 'Рахим'];
      const QS = [
        { q: 'Кого сегодня поздравляют?', a: 'Гульнара' },
        { q: 'Кто главный герой праздника?', a: 'Ахан' },
        { q: 'Кто получает подарки?', a: 'Ахан' },
        { q: 'У кого сегодня День Рождения?', a: 'Гульнара' },
        { q: 'Кто сегодня самая крутая?', a: 'Гульнара' },
        { q: 'Кто хочет, чтобы ему пополнили каспи 10к тг? 😏', a: 'Ахан', still: true }
      ];
      let idx = 0, buttons = [], correctBtn = null, tired = false, escapes = 0, needEscapes = 4, tiredTimer = null, still = false;

      const qEl = el('h3', 'quiz-question');
      const field = el('div', 'quiz-field');
      const cnt = el('p', 'quiz-count');
      host.innerHTML = '';
      host.appendChild(qEl); host.appendChild(field); host.appendChild(cnt);

      function bounds() { return { w: field.clientWidth, h: field.clientHeight }; }
      function centerOf(b) {
        const r = b.getBoundingClientRect(), f = field.getBoundingClientRect();
        return { x: r.left - f.left + r.width / 2, y: r.top - f.top + r.height / 2 };
      }
      function put(btn, x, y) { btn.style.left = x + 'px'; btn.style.top = y + 'px'; }
      /* отпрыгнуть в случайную сторону, подальше от пальца/курсора и от соседей */
      function flee(btn, fromX, fromY) {
        const { w, h } = bounds();
        const bw = btn.offsetWidth, bh = btn.offsetHeight;
        let best = null, bestScore = -1;
        for (let t = 0; t < 24; t++) {
          const x = 4 + Math.random() * Math.max(1, w - bw - 8);
          const y = 4 + Math.random() * Math.max(1, h - bh - 8);
          const cx = x + bw / 2, cy = y + bh / 2;
          let score = fromX == null ? 999 : Math.hypot(cx - fromX, cy - fromY);
          buttons.forEach(o => {
            if (o === btn) return;
            const c = centerOf(o);
            score = Math.min(score, Math.hypot(cx - c.x, cy - c.y) * 1.6);
          });
          if (score > bestScore) { bestScore = score; best = [x, y]; }
          if (score > 150) break;
        }
        put(btn, best[0], best[1]);
      }
      function makeTired() {
        tired = true; escapes = 0;
        correctBtn.classList.add('tired');
        clearTimeout(tiredTimer);
        tiredTimer = setTimeout(() => {
          if (!tired) return;
          tired = false;
          correctBtn.classList.remove('tired');
          needEscapes = 4;
          flee(correctBtn, null, null);
        }, 1600);
        addCleanup(() => clearTimeout(tiredTimer));
      }
      function runAway(btn, x, y) {
        if (btn === correctBtn) {
          if (tired || still) return;
          escapes++;
          flee(btn, x, y);
          if (escapes >= needEscapes) makeTired();
        } else flee(btn, x, y);
        Sound.pop();
      }

      function render() {
        field.innerHTML = '';
        clearTimeout(tiredTimer);
        tired = false; escapes = 0; needEscapes = 4;
        const cur = QS[idx];
        still = !!cur.still;
        qEl.textContent = `Вопрос ${idx + 1}. ${cur.q}`;
        cnt.textContent = still
          ? `Правильных ответов: ${idx}/${QS.length} · кто-то даже не пытается убегать 👀`
          : `Правильных ответов: ${idx}/${QS.length} · подсказка: правильное имя устаёт первым`;
        setStatus(`${idx}/${QS.length}`);
        buttons = [];

        NAMES.forEach(name => {
          const b = el('div', 'answer', name);
          field.appendChild(b);
          buttons.push(b);
          if (name === cur.a) correctBtn = b;
          b.addEventListener('pointerdown', ev => {
            ev.preventDefault();
            if (b === correctBtn && (tired || still)) {
              clearTimeout(tiredTimer);
              Sound.good();
              field.innerHTML = '';
              const ok = el('div', 'quiz-ok', '✅ Верно!');
              ok.style.position = 'absolute'; ok.style.left = '50%'; ok.style.top = '45%';
              ok.style.transform = 'translate(-50%,-50%)';
              field.appendChild(ok);
              buttons = []; idx++;
              setTimeout(() => { if (idx >= QS.length) win(); else render(); }, 850);
              return;
            }
            const c = centerOf(b);
            runAway(b, c.x, c.y);
          });
        });
        buttons.forEach(b => flee(b, null, null));
        if (still) {           // «каспи-вопрос»: Ахан невозмутимо стоит в центре
          const { w, h } = bounds();
          put(correctBtn, w / 2 - correctBtn.offsetWidth / 2, h / 2 - correctBtn.offsetHeight / 2);
          buttons.filter(b => b !== correctBtn).forEach(b => flee(b, w / 2, h / 2));
        }
      }

      /* убегание от курсора (ПК) и от пальца (телефон) */
      const onMove = ev => {
        const f = field.getBoundingClientRect();
        const mx = ev.clientX - f.left, my = ev.clientY - f.top;
        buttons.forEach(b => {
          if (b === correctBtn && (tired || still)) return;
          const c = centerOf(b);
          if (Math.hypot(c.x - mx, c.y - my) < 105) runAway(b, mx, my);
        });
      };
      field.addEventListener('pointermove', onMove);
      addCleanup(() => { field.removeEventListener('pointermove', onMove); clearTimeout(tiredTimer); });

      requestAnimationFrame(render);
    }
  },

  /* --------- 7. Найди отличия --------- */
  {
    title: 'Найди отличия', icon: '🔍', desc: 'Пять отличий на правой картинке. Глаза в кулак!',
    start(host, win, setStatus) {
      const items = [
        { e: '🎈', x: 10, y: 16 },
        { e: '🎈', x: 74, y: 12, alt: '🎀' },      // отличие 1
        { e: '⭐', x: 32, y: 26, alt: '🌙' },       // отличие 2
        { e: '🎂', x: 46, y: 63, big: true },
        { e: '🎁', x: 16, y: 74, alt: null },       // отличие 3 (исчезает)
        { e: '🍭', x: 84, y: 70 },
        { e: '🍬', x: 62, y: 45, alt: '🍫' },       // отличие 4
        { e: '🥳', x: 52, y: 88 },
        { e: '🐱', x: 26, y: 46, alt: null },       // отличие 5 (кот сбежал)
        { e: '🎊', x: 90, y: 32 }
      ];
      const diffs = items.map((it, i) => ('alt' in it) ? i : -1).filter(i => i >= 0);
      let found = [];

      function build(right) {
        const p = el('div', 'diff-panel');
        items.forEach((it, i) => {
          let ch = it.e;
          if (right && 'alt' in it) ch = it.alt;
          if (ch === null) return;
          const d = el('div', 'diff-item', ch);
          d.style.left = it.x + '%'; d.style.top = it.y + '%';
          if (it.big) d.style.fontSize = 'clamp(34px,8vw,58px)';
          p.appendChild(d);
        });
        return p;
      }

      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Кликай по отличиям на ПРАВОЙ картинке. Их ровно 5.'));
      const wrap = el('div', 'diff-wrap');
      const left = build(false), right = build(true);
      wrap.appendChild(left); wrap.appendChild(right);
      host.appendChild(wrap);
      setStatus('0/' + diffs.length);

      right.addEventListener('click', ev => {
        const r = right.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width * 100;
        const py = (ev.clientY - r.top) / r.height * 100;
        const hit = diffs.find(i => !found.includes(i) &&
          Math.abs(items[i].x - px) < 9 && Math.abs(items[i].y - py) < 11);
        if (hit !== undefined) {
          found.push(hit); Sound.good();
          const m = el('div', 'diff-mark');
          m.style.left = items[hit].x + '%'; m.style.top = items[hit].y + '%';
          right.appendChild(m);
          setStatus(found.length + '/' + diffs.length);
          if (found.length === diffs.length) setTimeout(win, 450);
        } else {
          Sound.bad(); right.classList.add('shake');
          setTimeout(() => right.classList.remove('shake'), 400);
        }
      });
    }
  },

  /* --------- 8. Секретный код --------- */
  {
    title: 'Секретный код', icon: '🔐', desc: 'Две подсказки — один код.',
    start(host, win, setStatus) {
      let code = '';
      host.innerHTML = '';
      const h = el('div'); h.style.textAlign = 'center';
      h.appendChild(el('p', 'code-hint', '🔎 Первая цифра: сколько букв в имени «Гульнара»?'));
      h.appendChild(el('p', 'code-hint', '🔎 Вторая цифра: сколько букв в имени «Ахан»?'));
      host.appendChild(h);
      const disp = el('div', 'code-display', '__'); host.appendChild(disp);
      const msg = el('p', 'game-msg', 'Введи 2 цифры и нажми ✅'); host.appendChild(msg);
      const pad = el('div', 'keypad');
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✅'];
      keys.forEach(k => {
        const b = el('button', null, k);
        b.onclick = () => {
          Sound.click();
          if (k === '⌫') code = code.slice(0, -1);
          else if (k === '✅') {
            if (code === '84') {
              Sound.good(); msg.textContent = '🔓 Замок открыт!'; msg.classList.remove('code-wrong');
              setTimeout(win, 500);
            } else {
              Sound.bad();
              msg.textContent = code === '8' ? '❌ Почти! Не хватает второй цифры.' : '❌ Не тот код. Посчитай буквы ещё раз!';
              msg.classList.add('code-wrong'); code = '';
            }
          } else if (code.length < 2) code += k;
          disp.textContent = code || '__';
        };
        pad.appendChild(b);
      });
      host.appendChild(pad);
      setStatus('🔒');
      const key = e => {
        if (/^[0-9]$/.test(e.key)) { code = (code + e.key).slice(0, 2); disp.textContent = code; }
        if (e.key === 'Backspace') { code = code.slice(0, -1); disp.textContent = code || '__'; }
        if (e.key === 'Enter') pad.lastChild.click();
      };
      addEventListener('keydown', key);
      addCleanup(() => removeEventListener('keydown', key));
    }
  },

  /* --------- 9. Поймай подарок --------- */
  {
    title: 'Поймай подарок', icon: '🧺', desc: 'Поймай 22 подарка. Бомбы обходи стороной!',
    start(host, win, setStatus) {
      const NEED = 22;
      let caught = 0, running = true, items = [], bx = 50;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Двигай корзину мышкой, пальцем или стрелками.'));
      const field = el('div', 'catch-field'); host.appendChild(field);
      const basket = el('div', 'basket', '🧺');
      basket.style.left = '50%'; field.appendChild(basket);
      const upd = () => setStatus(`${caught}/${NEED}`); upd();

      const moveTo = clientX => {
        const r = field.getBoundingClientRect();
        bx = Math.max(6, Math.min(94, (clientX - r.left) / r.width * 100));
        basket.style.left = bx + '%';
      };
      const pm = e => moveTo(e.clientX);
      field.addEventListener('pointermove', pm);
      field.addEventListener('pointerdown', pm);
      const key = e => {
        if (e.key === 'ArrowLeft') { bx = Math.max(6, bx - 6); basket.style.left = bx + '%'; }
        if (e.key === 'ArrowRight') { bx = Math.min(94, bx + 6); basket.style.left = bx + '%'; }
      };
      addEventListener('keydown', key);

      const spawner = setInterval(() => {
        if (!running) return;
        const bomb = Math.random() < .2;
        const it = el('div', 'falling', bomb ? '💣' : ['🎁', '🎀', '🍬', '🧁'][rnd(4)]);
        it._x = 5 + Math.random() * 88; it._y = -8; it._sp = .6 + Math.random() * .5 + caught * .005; it._bomb = bomb;
        it.style.left = it._x + '%'; it.style.top = it._y + '%';
        field.appendChild(it); items.push(it);
      }, 480);

      let raf;
      const tick = () => {
        items.slice().forEach(it => {
          it._y += it._sp;
          it.style.top = it._y + '%';
          if (it._y > 80 && it._y < 97 && Math.abs(it._x - bx) < 10) {
            it.remove(); items = items.filter(z => z !== it);
            if (it._bomb) {
              Sound.bad(); caught = Math.max(0, caught - 2); upd(); toast('💣 Бомба! −2');
            } else {
              Sound.pop(); caught++; upd();
              if (caught >= NEED) { finish(); }
            }
          } else if (it._y > 105) { it.remove(); items = items.filter(z => z !== it); }
        });
        if (running) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      function stop() {
        running = false; clearInterval(spawner); cancelAnimationFrame(raf);
        removeEventListener('keydown', key);
        field.removeEventListener('pointermove', pm);
        field.removeEventListener('pointerdown', pm);
      }
      addCleanup(stop);
      function finish() { stop(); win(); }
    }
  },

  /* --------- 10. Последний пазл --------- */
  {
    title: 'Коробки-обманки', icon: '📦', desc: 'Фрагмент в одной из 16 коробок. Игра подскажет «горячо/холодно».',
    start(host, win, setStatus) {
      const N = 16;
      const winner = rnd(N);
      let opened = 0;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Открывай коробки — после каждой скажу, насколько ты близко.'));
      const grid = el('div', 'box-grid');
      for (let i = 0; i < N; i++) {
        const b = el('div', 'mystery-box', '📦');
        b.onclick = () => {
          if (b.classList.contains('opened') || b.classList.contains('win')) return;
          if (i === winner) {
            b.classList.add('win'); b.textContent = '🧩';
            Sound.reward(); Confetti.burst(70);
            setStatus('Найдено!');
            setTimeout(win, 700);
          } else {
            b.classList.add('opened'); b.textContent = ['😅', '🕸', '🧦', '🪶', '🍃', '🧻', '🥒'][rnd(7)];
            Sound.click(); opened++;
            setStatus('Открыто: ' + opened);
            const d = Math.abs(i % 4 - winner % 4) + Math.abs((i / 4 | 0) - (winner / 4 | 0));
            toast(d <= 1 ? '🔥 Горячо! Совсем рядом' : d <= 2 ? '🌤 Тепло' : d <= 3 ? '❄️ Холодно' : '🧊 Ледяной космос');
          }
        };
        grid.appendChild(b);
      }
      host.appendChild(grid);
      setStatus('Открыто: 0');
    }
  },

  /* --------- 11. Поймай кнопку --------- */
  {
    title: 'Поймай кнопку', icon: '🏃', desc: 'Кнопка не хочет, чтобы её нажимали. Поймай её 3 раза.',
    start(host, win, setStatus) {
      let caught = 0, escapes = 0, tired = false, limit = 5;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Кнопка убегает, но иногда выдыхается. Лови момент!'));
      const field = el('div', 'quiz-field'); host.appendChild(field);
      const btn = el('div', 'answer correct runner', 'Нажми меня');
      field.appendChild(btn);
      const upd = () => setStatus(`${caught}/3`); upd();

      const put = (x, y) => { btn.style.left = x + 'px'; btn.style.top = y + 'px'; };
      const randomSpot = () => {
        const w = field.clientWidth - btn.offsetWidth - 8, h = field.clientHeight - btn.offsetHeight - 8;
        put(4 + Math.random() * Math.max(1, w), 4 + Math.random() * Math.max(1, h));
      };
      requestAnimationFrame(randomSpot);

      function getTired() {
        tired = true;
        btn.classList.add('tired');
        btn.textContent = ['уф… перекур', 'всё, я устала', 'ладно, жми', 'сдаюсь…'][rnd(4)];
        const t = setTimeout(() => {
          if (!tired) return;
          tired = false; btn.classList.remove('tired'); btn.textContent = 'Нажми меня';
          escapes = 0; randomSpot();
        }, 1300);
        addCleanup(() => clearTimeout(t));
      }

      function runAway() {
        if (tired) return;
        escapes++; Sound.pop(); randomSpot();
        if (escapes >= limit) getTired();
      }

      field.addEventListener('pointermove', e => {
        const f = field.getBoundingClientRect(), r = btn.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < 110) runAway();
      });
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (!tired) { runAway(); return; }
        tired = false; escapes = 0; caught++; limit += 2;
        btn.classList.remove('tired'); btn.textContent = 'Нажми меня';
        Sound.good(); upd();
        if (caught >= 3) { win(); return; }
        toast(['Поймал! Она обиделась 😤', 'Ещё разок — теперь она злее!'][caught - 1]);
        randomSpot();
      });
    }
  },

  /* --------- 12. Задуй свечи --------- */
  {
    title: 'Задуй свечи', icon: '🕯', desc: 'Потуши все 12 свечей. Они подло загораются обратно.',
    start(host, win, setStatus) {
      const N = 12;
      let lit = Array(N).fill(true), left = 30, running = true;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Тапай по огонькам. Все 12 должны погаснуть одновременно!'));
      const row = el('div', 'candles');
      const nodes = [];
      for (let i = 0; i < N; i++) {
        const c = el('div', 'candle');
        c.innerHTML = '<span class="flame">🔥</span><span class="stick">🕯️</span>';
        c.onclick = () => {
          if (!running || !lit[i]) return;
          lit[i] = false; c.classList.add('out'); Sound.pop(); check();
        };
        nodes.push(c); row.appendChild(c);
      }
      host.appendChild(row);
      const upd = () => setStatus(`${lit.filter(x => !x).length}/${N} · ⏱ ${left}с`);
      upd();

      function check() {
        upd();
        if (lit.every(x => !x)) { running = false; stop(); win(); }
      }
      const relight = setInterval(() => {
        if (!running) return;
        const outIdx = lit.map((v, i) => v ? -1 : i).filter(i => i >= 0);
        if (outIdx.length && outIdx.length < N) {
          const i = outIdx[rnd(outIdx.length)];
          lit[i] = true; nodes[i].classList.remove('out'); upd();
        }
      }, 1250);
      const timer = setInterval(() => {
        left--; upd();
        if (left <= 0) {
          running = false; stop(); Sound.bad();
          host.innerHTML = '';
          host.appendChild(el('p', 'game-msg', '😮‍💨 Кислород кончился! Свечи победили... пока что.'));
          const b = el('button', 'btn', 'Вдохнуть поглубже и повторить');
          b.onclick = () => { runCleanups(); LEVELS[11].start(host, win, setStatus); };
          host.appendChild(b);
        }
      }, 1000);
      function stop() { running = false; clearInterval(relight); clearInterval(timer); }
      addCleanup(stop);
    }
  },

  /* --------- 13. Цветочная память (Симон) --------- */
  {
    title: 'Букет по памяти', icon: '💐', desc: 'Повтори последовательность цветов. Она растёт.',
    start(host, win, setStatus) {
      const flowers = ['🌹', '🌻', '🌷', '🌼', '🌺', '🪻'];
      const TARGET = 6;
      let seq = [], input = [], lock = true;
      host.innerHTML = '';
      const info = el('p', 'game-msg', 'Смотри внимательно...');
      host.appendChild(info);
      const grid = el('div', 'simon-grid');
      const nodes = flowers.map((f, i) => {
        const b = el('div', 'simon-btn', f);
        b.onclick = () => tap(i);
        grid.appendChild(b);
        return b;
      });
      host.appendChild(grid);

      function flash(i, ms = 420) {
        nodes[i].classList.add('lit'); Sound.click();
        const t = setTimeout(() => nodes[i].classList.remove('lit'), ms * .7);
        addCleanup(() => clearTimeout(t));
      }
      function playSeq() {
        lock = true; info.textContent = 'Смотри и запоминай...';
        setStatus(`${seq.length}/${TARGET}`);
        seq.forEach((v, k) => {
          const t = setTimeout(() => flash(v, 480), 520 * k + 350);
          addCleanup(() => clearTimeout(t));
        });
        const t2 = setTimeout(() => { lock = false; info.textContent = 'Теперь повтори!'; }, 520 * seq.length + 400);
        addCleanup(() => clearTimeout(t2));
      }
      function next() { seq.push(rnd(flowers.length)); input = []; playSeq(); }
      function tap(i) {
        if (lock) return;
        flash(i, 260); input.push(i);
        const k = input.length - 1;
        if (input[k] !== seq[k]) {
          Sound.bad(); info.textContent = '🥀 Не тот цветок! Букет рассыпался, начинаем заново.';
          seq = []; input = []; lock = true;
          const t = setTimeout(next, 1200); addCleanup(() => clearTimeout(t));
          return;
        }
        if (input.length === seq.length) {
          Sound.good();
          if (seq.length >= TARGET) { win(); return; }
          info.textContent = '💐 Верно! Добавляю ещё цветок...';
          lock = true;
          const t = setTimeout(next, 900); addCleanup(() => clearTimeout(t));
        }
      }
      const t0 = setTimeout(next, 700); addCleanup(() => clearTimeout(t0));
    }
  },

  /* --------- 14. Танцевальный баттл --------- */
  {
    title: 'Танцевальный баттл', icon: '🕺', desc: 'Лови стрелки в зоне. 18 попаданий — и ты король танцпола.',
    start(host, win, setStatus) {
      const KEYS = [{ k: 'ArrowLeft', s: '⬅' }, { k: 'ArrowDown', s: '⬇' }, { k: 'ArrowUp', s: '⬆' }, { k: 'ArrowRight', s: '➡' }];
      const NEED = 18;
      let hits = 0, miss = 0, notes = [], running = true, speed = .8;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Жми стрелку (или тапни колонку), когда значок в жёлтой зоне.'));
      const field = el('div', 'dance-field');
      const lanes = KEYS.map((k, i) => {
        const l = el('div', 'lane');
        l.appendChild(el('div', 'lane-target', k.s));
        l.onclick = () => press(i);
        field.appendChild(l);
        return l;
      });
      host.appendChild(field);
      const upd = () => setStatus(`${hits}/${NEED} · промахи ${miss}`); upd();

      const spawner = setInterval(() => {
        if (!running) return;
        const lane = rnd(4);
        const n = el('div', 'note', KEYS[lane].s);
        n._y = -10; n._lane = lane;
        n.style.top = '-10%';
        lanes[lane].appendChild(n);
        notes.push(n);
      }, 720);

      let raf;
      const tick = () => {
        notes.slice().forEach(n => {
          n._y += speed;
          n.style.top = n._y + '%';
          if (n._y > 100) {
            n.remove(); notes = notes.filter(x => x !== n);
            miss++; upd(); Sound.bad();
            if (miss >= 8) restart();
          }
        });
        if (running) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      function press(lane) {
        if (!running) return;
        const n = notes.filter(x => x._lane === lane && x._y > 62 && x._y < 92).sort((a, b) => b._y - a._y)[0];
        if (n) {
          n.remove(); notes = notes.filter(x => x !== n);
          hits++; Sound.pop(); upd();
          speed = .8 + hits * .045;
          lanes[lane].classList.add('hit');
          setTimeout(() => lanes[lane].classList.remove('hit'), 150);
          if (hits >= NEED) { stop(); win(); }
        } else { miss++; Sound.bad(); upd(); if (miss >= 8) restart(); }
      }
      function restart() {
        toast('💃 Слишком много промахов — с начала!');
        notes.forEach(n => n.remove()); notes = [];
        hits = 0; miss = 0; speed = .8; upd();
      }
      const key = e => {
        const i = KEYS.findIndex(k => k.k === e.key);
        if (i >= 0) { e.preventDefault(); press(i); }
      };
      addEventListener('keydown', key, { passive: false });
      function stop() { running = false; clearInterval(spawner); cancelAnimationFrame(raf); removeEventListener('keydown', key); }
      addCleanup(stop);
    }
  },

  /* --------- 15. Мамина викторина --------- */
  {
    title: 'Мамина викторина', icon: '😂', desc: 'Шесть вопросов, на которые знает ответ только семья.',
    start(host, win, setStatus) {
      const QS = [
        { q: 'Что мама делает, когда ты говоришь «я сам приготовлю»?', a: 'Стоит рядом и всё переделывает', w: ['Спокойно уходит', 'Заказывает доставку'] },
        { q: 'Главная суперсила мамы?', a: 'Находит вещи, которых не существует', w: ['Летает', 'Читает мысли соседей'] },
        { q: 'Сколько фото мама сделает за вечер?', a: 'Все. Абсолютно все.', w: ['Одну', 'Ни одной, она стесняется'] },
        { q: 'Что означает мамино «делай что хочешь»?', a: 'Не делай этого ни в коем случае', w: ['Полная свобода', 'Она согласна'] },
        { q: 'Что мама скажет, увидев эту игру?', a: '«Ой, а кто это всё сделал?»', w: ['«Удали немедленно»', '«Скучно»'] },
        { q: 'Идеальный подарок для мамы?', a: 'Чтобы дети были рядом', w: ['Пылесос', 'Тишина в доме'] }
      ];
      const REACT = ['🙃 Ага, конечно.', '😅 Мимо! Мама бы расстроилась.', '🤨 Ты вообще дома живёшь?', '📞 Придётся звонить и уточнять.'];
      let i = 0;
      host.innerHTML = '';
      const q = el('h3', 'quiz-question'); host.appendChild(q);
      const box = el('div', 'answers-col'); host.appendChild(box);
      const react = el('p', 'game-msg'); host.appendChild(react);

      function render() {
        const cur = QS[i];
        q.textContent = `Вопрос ${i + 1}. ${cur.q}`;
        setStatus(`${i}/${QS.length}`);
        box.innerHTML = ''; react.textContent = '';
        shuffle([cur.a, ...cur.w]).forEach(txt => {
          const b = el('div', 'answer-row', txt);
          b.onclick = () => {
            if (txt === cur.a) {
              Sound.good(); b.classList.add('ok'); react.textContent = '✅ Точно! Так и есть.';
              i++;
              setTimeout(() => { if (i >= QS.length) win(); else render(); }, 800);
            } else {
              Sound.bad(); b.classList.add('no'); react.textContent = REACT[rnd(REACT.length)];
              setTimeout(() => b.classList.remove('no'), 600);
            }
          };
          box.appendChild(b);
        });
      }
      render();
    }
  },

  /* --------- 16. Убегающий торт --------- */
  {
    title: 'Убегающий торт', icon: '🏃‍♀️', desc: 'Торт не хочет быть съеденным. Кликни по нему 12 раз.',
    start(host, win, setStatus) {
      const NEED = 12;
      let got = 0, size = 68;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Он прыгает и уменьшается. Догони!'));
      const field = el('div', 'quiz-field'); host.appendChild(field);
      const cake = el('div', 'runaway-cake', '🎂');
      field.appendChild(cake);
      const upd = () => setStatus(`${got}/${NEED}`); upd();

      function jump() {
        const w = field.clientWidth - size, h = field.clientHeight - size;
        cake.style.fontSize = size + 'px';
        cake.style.left = Math.max(0, Math.random() * w) + 'px';
        cake.style.top = Math.max(0, Math.random() * h) + 'px';
      }
      requestAnimationFrame(jump);
      let interval = 1400;
      let timer = setInterval(jump, interval);
      addCleanup(() => clearInterval(timer));

      cake.addEventListener('pointerdown', e => {
        e.preventDefault();
        got++; Sound.pop(); upd();
        size = Math.max(30, 68 - got * 3);
        if (got >= NEED) { clearInterval(timer); Sound.good(); win(); return; }
        if (got % 3 === 0) toast(['🎂 «Не ешь меня!»', '🎂 «Я ещё молодой торт!»', '🎂 «Ладно, ладно, догнал»'][rnd(3)]);
        clearInterval(timer);
        interval = Math.max(500, 1400 - got * 80);
        timer = setInterval(jump, interval);
        jump();
      });
      field.addEventListener('pointermove', e => {
        const r = cake.getBoundingClientRect();
        const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        if (d < 70) jump();
      });
    }
  },

  /* --------- 17. Найди лишнего --------- */
  {
    title: 'Найди лишнего', icon: '👀', desc: 'В сетке один значок отличается. Найди 8 раз за 45 секунд.',
    start(host, win, setStatus) {
      const PAIRS = [['😀', '😄'], ['🍎', '🍏'], ['⭐', '🌟'], ['🌸', '🌺'], ['💙', '💜'], ['🐶', '🐕'], ['🎈', '🎈'], ['🍬', '🍭']];
      const NEED = 8;
      let done = 0, left = 45, running = true;
      host.innerHTML = '';
      const msg = el('p', 'game-msg', 'Кликни на тот, который отличается от остальных.');
      host.appendChild(msg);
      const grid = el('div', 'odd-grid'); host.appendChild(grid);
      const upd = () => setStatus(`${done}/${NEED} · ⏱ ${left}с`); upd();

      function round() {
        const size = 4 + Math.min(3, done);          // от 4×4 до 7×7
        const [base, odd] = PAIRS[rnd(PAIRS.length)];
        const n = size * size, oddAt = rnd(n);
        grid.style.gridTemplateColumns = `repeat(${size},1fr)`;
        grid.innerHTML = '';
        for (let i = 0; i < n; i++) {
          const isOdd = i === oddAt;
          const c = el('div', 'odd-cell', isOdd ? odd : base);
          if (base === odd && isOdd) c.style.opacity = '.72';   // «одинаковая» пара — отличие в прозрачности
          c.onclick = () => {
            if (!running) return;
            if (isOdd) {
              Sound.good(); done++; upd();
              if (done >= NEED) { stop(); win(); } else round();
            } else {
              Sound.bad(); c.classList.add('wrong');
              setTimeout(() => c.classList.remove('wrong'), 350);
            }
          };
          grid.appendChild(c);
        }
      }
      const timer = setInterval(() => {
        left--; upd();
        if (left <= 0) {
          stop(); Sound.bad();
          host.innerHTML = '';
          host.appendChild(el('p', 'game-msg', `👓 Время вышло! Найдено ${done} из ${NEED}. Протри экран и давай ещё.`));
          const b = el('button', 'btn', 'Ещё разок');
          b.onclick = () => { runCleanups(); LEVELS[16].start(host, win, setStatus); };
          host.appendChild(b);
        }
      }, 1000);
      function stop() { running = false; clearInterval(timer); }
      addCleanup(stop);
      round();
    }
  },

  /* --------- 18. Змейка-подарки --------- */
  {
    title: 'Змейка-сладкоежка', icon: '🐍', desc: 'Собери 12 подарков. В себя и в стену — нельзя.',
    start(host, win, setStatus) {
      const W = 15, H = 12, NEED = 12;
      let snake, dir, nextDir, food, got, alive, speed, loop;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Стрелки или кнопки. Хвост растёт с каждым подарком!'));
      const grid = el('div', 'snake-grid');
      grid.style.gridTemplateColumns = `repeat(${W},1fr)`;
      const cells = [];
      for (let i = 0; i < W * H; i++) { const c = el('div', 'sn'); cells.push(c); grid.appendChild(c); }
      host.appendChild(grid);

      const pad = el('div', 'dpad');
      const mk = (t, d, gc, gr) => { const b = el('button', null, t); b.style.gridColumn = gc; b.style.gridRow = gr; b.onclick = () => turn(d); pad.appendChild(b); };
      mk('⬆', [0, -1], '2', '1'); mk('⬅', [-1, 0], '1', '2'); mk('⬇', [0, 1], '2', '2'); mk('➡', [1, 0], '3', '2');
      host.appendChild(pad);

      function reset(msg) {
        snake = [[4, 6], [3, 6], [2, 6]]; dir = [1, 0]; nextDir = [1, 0];
        got = 0; alive = true; speed = 220;
        placeFood(); setStatus(`0/${NEED}`);
        if (msg) { Sound.bad(); toast(msg); }
        clearInterval(loop); loop = setInterval(step, speed);
        draw();
      }
      function placeFood() {
        do { food = [rnd(W), rnd(H)]; } while (snake.some(s => s[0] === food[0] && s[1] === food[1]));
      }
      function turn(d) {
        if (d[0] === -dir[0] && d[1] === -dir[1]) return;
        nextDir = d;
      }
      function step() {
        if (!alive) return;
        dir = nextDir;
        const head = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
        if (head[0] < 0 || head[1] < 0 || head[0] >= W || head[1] >= H) return reset('🧱 Врезался в стену!');
        if (snake.some(s => s[0] === head[0] && s[1] === head[1])) return reset('🌀 Съел сам себя. Больно.');
        snake.unshift(head);
        if (head[0] === food[0] && head[1] === food[1]) {
          got++; Sound.pop(); setStatus(`${got}/${NEED}`);
          if (got >= NEED) { alive = false; clearInterval(loop); Sound.good(); win(); return; }
          placeFood();
          speed = Math.max(90, speed - 10);
          clearInterval(loop); loop = setInterval(step, speed);
        } else snake.pop();
        draw();
      }
      function draw() {
        cells.forEach(c => { c.className = 'sn'; c.textContent = ''; });
        snake.forEach((s, i) => { const c = cells[s[1] * W + s[0]]; if (c) c.className = 'sn ' + (i ? 'body' : 'head'); });
        const f = cells[food[1] * W + food[0]]; if (f) { f.className = 'sn'; f.textContent = '🎁'; }
      }
      const key = e => {
        const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
        if (m) { e.preventDefault(); turn(m); }
      };
      addEventListener('keydown', key, { passive: false });
      addCleanup(() => { clearInterval(loop); removeEventListener('keydown', key); });
      reset();
    }
  },

  /* --------- 19. Налей чай --------- */
  {
    title: 'Налей чай', icon: '🫖', desc: 'Две чашки. Не перелей — мама смотрит.',
    start(host, win, setStatus) {
      const NEED = 2;
      let cup = 0, level = 0, held = false, blocked = false, raf, zone = [70, 92];
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Держи кнопку — чай льётся. Отпусти в зелёной зоне!'));
      const bar = el('div', 'tea-bar');
      const green = el('div', 'tea-zone');
      const fill = el('div', 'tea-fill');
      bar.appendChild(green); bar.appendChild(fill);
      host.appendChild(bar);
      const btn = el('button', 'btn btn-big', '🫖 Наливать');
      host.appendChild(btn);
      const upd = () => setStatus(`${cup}/${NEED}`); upd();

      function setZone() {
        const size = 26 - cup * 4;                 // 26% → 22%: попасть реально
        const start = 48 + Math.random() * (44 - size);
        zone = [start, start + size];
        green.style.bottom = zone[0] + '%';
        green.style.height = size + '%';
      }
      setZone();

      const tick = () => {
        if (held && !blocked) {
          level += .75;                            // наливаем спокойно
          fill.style.height = Math.min(100, level) + '%';
          if (level >= 100) finish(true);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      addCleanup(() => cancelAnimationFrame(raf));

      /* нажали — льём; отпустили — проверяем. Перелив просто блокирует до следующего нажатия */
      function press() {
        if (blocked) return;
        held = true; level = 0; fill.style.height = '0%';
      }
      function release() {
        if (!held) return;
        held = false;
        if (blocked) { blocked = false; level = 0; fill.style.height = '0%'; return; }
        finish(false);
      }
      function finish(overflow) {
        if (overflow) {
          blocked = true; Sound.bad();
          toast('🌊 Перелил! Отпусти кнопку и попробуй снова.');
          fill.style.height = '100%';
          return;
        }
        const ok = level >= zone[0] && level <= zone[1];
        if (ok) {
          cup++; Sound.good(); upd();
          if (cup >= NEED) { win(); return; }
          toast('☕ Идеально! Ещё одна чашка — зона будет уже.');
          setZone();
        } else {
          Sound.bad();
          toast(level < zone[0] ? '🤏 Мало! Это не чай, это намёк.' : '😬 Чуть перелил мимо зоны.');
        }
        level = 0; fill.style.height = '0%';
      }
      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        try { btn.setPointerCapture(e.pointerId); } catch (err) { }
        press();
      });
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      const winUp = () => release();
      addEventListener('pointerup', winUp);        // страховка, если палец ушёл с кнопки
      const kd = e => { if (e.code === 'Space' && !e.repeat) { e.preventDefault(); press(); } };
      const ku = e => { if (e.code === 'Space') { e.preventDefault(); release(); } };
      addEventListener('keydown', kd, { passive: false }); addEventListener('keyup', ku, { passive: false });
      addCleanup(() => {
        removeEventListener('keydown', kd); removeEventListener('keyup', ku);
        removeEventListener('pointerup', winUp);
      });
    }
  },

  /* --------- 20. Финальный босс --------- */
  {
    title: 'Финальный босс', icon: '👑', desc: 'Три испытания подряд: реакция, память и скорость.',
    start(host, win, setStatus) {
      let phase = 1;

      /* фаза 1 — реакция */
      function reaction() {
        let ok = 0, ready = false, t;
        setStatus('Фаза 1/3 · реакция');
        host.innerHTML = '';
        host.appendChild(el('p', 'game-msg', 'Жди зелёного и жми. Раньше времени — не считается!'));
        const pad = el('div', 'react-pad', 'Жди…');
        host.appendChild(pad);
        const arm = () => {
          pad.className = 'react-pad'; pad.textContent = 'Жди…'; ready = false;
          t = setTimeout(() => { ready = true; pad.classList.add('go'); pad.textContent = 'ЖМИ!'; Sound.click(); }, 900 + Math.random() * 2200);
          addCleanup(() => clearTimeout(t));
        };
        pad.onclick = () => {
          if (!ready) { Sound.bad(); clearTimeout(t); pad.textContent = '😅 Рано! Ещё раз…'; setTimeout(arm, 800); return; }
          ok++; Sound.pop();
          if (ok >= 3) { phase = 2; setTimeout(memory, 500); return; }
          toast(`⚡ ${ok}/3 — есть реакция!`);
          arm();
        };
        arm();
      }

      /* фаза 2 — вспышка памяти */
      function memory() {
        setStatus('Фаза 2/3 · память');
        const pool = ['🎂', '🎈', '🎁', '🎉', '🍰', '🥳', '🍭', '🎀'];
        const seq = shuffle(pool.slice()).slice(0, 5);
        let input = [];
        host.innerHTML = '';
        host.appendChild(el('p', 'game-msg', 'Запомни порядок! Смотри 5 секунд…'));
        const strip = el('div', 'flash-strip');
        seq.forEach(s => strip.appendChild(el('div', 'flash-item', s)));
        host.appendChild(strip);
        const t = setTimeout(() => {
          host.innerHTML = '';
          host.appendChild(el('p', 'game-msg', 'Теперь повтори порядок:'));
          const answer = el('div', 'flash-strip answer-strip'); host.appendChild(answer);
          const pad2 = el('div', 'odd-grid'); pad2.style.gridTemplateColumns = 'repeat(4,1fr)';
          pool.forEach(p => {
            const b = el('div', 'odd-cell', p);
            b.onclick = () => {
              input.push(p);
              answer.appendChild(el('div', 'flash-item', p));
              Sound.click();
              const k = input.length - 1;
              if (input[k] !== seq[k]) {
                Sound.bad(); toast('🙈 Не тот порядок! Смотрим заново.');
                setTimeout(memory, 900); input = ['stop'];
                return;
              }
              if (input.length === seq.length) { Sound.good(); phase = 3; setTimeout(marathon, 600); }
            };
            pad2.appendChild(b);
          });
          host.appendChild(pad2);
        }, 5000);
        addCleanup(() => clearTimeout(t));
      }

      /* фаза 3 — клик-марафон */
      function marathon() {
        const NEED = 25, TIME = 12;
        let clicks = 0, left = TIME, running = true;
        setStatus('Фаза 3/3 · скорость');
        host.innerHTML = '';
        host.appendChild(el('p', 'game-msg', `Успей кликнуть по звезде ${NEED} раз за ${TIME} секунд!`));
        const field = el('div', 'quiz-field'); host.appendChild(field);
        const star = el('div', 'runaway-cake', '⭐');
        star.style.fontSize = '58px';
        field.appendChild(star);
        const upd = () => setStatus(`${clicks}/${NEED} · ⏱ ${left}с`); upd();
        const jump = () => {
          star.style.left = Math.random() * Math.max(1, field.clientWidth - 60) + 'px';
          star.style.top = Math.random() * Math.max(1, field.clientHeight - 60) + 'px';
        };
        requestAnimationFrame(jump);
        star.addEventListener('pointerdown', e => {
          e.preventDefault();
          if (!running) return;
          clicks++; Sound.pop(); upd(); jump();
          if (clicks >= NEED) { running = false; clearInterval(timer); Sound.good(); win(); }
        });
        const timer = setInterval(() => {
          left--; upd();
          if (left <= 0) {
            running = false; clearInterval(timer); Sound.bad();
            host.innerHTML = '';
            host.appendChild(el('p', 'game-msg', `⏰ Не успел: ${clicks}/${NEED}. Босс смеётся над тобой.`));
            const b = el('button', 'btn', 'Реванш!');
            b.onclick = () => marathon();
            host.appendChild(b);
          }
        }, 1000);
        addCleanup(() => { running = false; clearInterval(timer); });
      }

      reaction();
    }
  }
];

/* ---------------- Универсальный drag & drop (pointer events) ---------------- */
function makeDraggable(node, onDrop, onMove) {
  let dx = 0, dy = 0, home = null, dragging = false;
  node.addEventListener('pointerdown', e => {
    e.preventDefault();
    const r = node.getBoundingClientRect();
    home = { parent: node.parentNode, next: node.nextSibling, w: r.width, h: r.height };
    dx = e.clientX - r.left; dy = e.clientY - r.top;
    node.classList.add('dragging');
    node.style.position = 'fixed';
    node.style.width = r.width + 'px';
    node.style.left = r.left + 'px';
    node.style.top = r.top + 'px';
    document.body.appendChild(node);
    node.setPointerCapture(e.pointerId);
    dragging = true;
  });
  node.addEventListener('pointermove', e => {
    if (!dragging) return;
    node.style.left = (e.clientX - dx) + 'px';
    node.style.top = (e.clientY - dy) + 'px';
    if (onMove) { node.style.visibility = 'hidden'; onMove(e.clientX, e.clientY); node.style.visibility = ''; }
  });
  const end = e => {
    if (!dragging) return;
    dragging = false;
    node.classList.remove('dragging');
    node.style.visibility = 'hidden';
    const ok = onDrop(e.clientX, e.clientY);
    node.style.visibility = '';
    if (!ok && node.isConnected) {
      node.style.position = ''; node.style.left = ''; node.style.top = ''; node.style.width = '';
      home.parent.insertBefore(node, home.next);
    }
    $$('.cake-slot').forEach(s => s.classList.remove('hover'));
  };
  node.addEventListener('pointerup', end);
  node.addEventListener('pointercancel', end);
}

/* ================================================================
   КАРТА / ЗАПУСК УРОВНЕЙ
   ================================================================ */
function renderMap() {
  const grid = $('#mapGrid'); grid.innerHTML = '';
  LEVELS.forEach((lv, i) => {
    const n = i + 1;
    const done = hasPiece(i);
    const open = n <= state.unlocked;
    const cell = el('div', 'map-cell ' + (done ? 'done' : open ? 'open' : 'locked'));
    cell.innerHTML = `<div class="lvl-ico">${open ? lv.icon : '🔒'}</div><div class="lvl-num">${n}</div>`;
    cell.title = open ? lv.title : 'Закрыто';
    if (open) cell.onclick = () => startLevel(i);
    else cell.onclick = () => { Sound.bad(); toast('Сначала пройди предыдущий уровень 🔒'); };
    grid.appendChild(cell);
  });

  const bar = $('#piecesBar'); bar.innerHTML = '';
  const pw = Math.min(380, innerWidth * .86) / COLS - 5;
  for (let i = 0; i < TOTAL; i++) {
    const t = el('div', 'piece-thumb' + (hasPiece(i) ? ' got' : ''));
    t.style.aspectRatio = PIECE_RATIO;
    pieceStyle(t, i, pw);
    bar.appendChild(t);
  }

  const got = state.pieces.length;
  $('#progressFill').style.width = (got / TOTAL * 100) + '%';
  $('#progressText').textContent = `Фрагментов собрано: ${got} из ${TOTAL}`;
  $('#btnGoPuzzle').disabled = got < TOTAL;
  if (got >= TOTAL) $('#btnGoPuzzle').textContent = state.puzzleDone ? '🖼 Посмотреть фото' : '🧩 Собрать пазл';
}

let currentLevel = 0;
function startLevel(i) {
  runCleanups();
  currentLevel = i;
  const lv = LEVELS[i];
  $('#levelTitle').textContent = `Уровень ${i + 1}. ${lv.title}`;
  $('#levelDesc').textContent = lv.desc;
  $('#levelStatus').textContent = '';
  const host = $('#levelHost'); host.innerHTML = '';
  show('screen-level');
  Sound.warm();
  const setStatus = t => $('#levelStatus').textContent = t;
  let won = false;
  const win = () => { if (won) return; won = true; runCleanups(); levelComplete(i); };
  lv.start(host, win, setStatus);
}

function levelComplete(i) {
  Sound.reward();
  Confetti.burst(110);
  if (!hasPiece(i)) state.pieces.push(i);
  if (state.unlocked < i + 2) state.unlocked = Math.min(TOTAL, i + 2);
  save();

  const pv = $('#rewardPiece');
  pv.style.aspectRatio = PIECE_RATIO;
  pieceStyle(pv, i, Math.min(300, innerWidth * .8));
  const left = TOTAL - state.pieces.length;
  $('#rewardText').textContent = left > 0
    ? `Фрагмент ${i + 1} твой! Осталось собрать: ${left}. ${joke()}`
    : `Все ${TOTAL} фрагментов собраны! Пора сложить фотографию 🧩`;
  $('#btnRewardNext').textContent = left > 0 ? 'Дальше →' : 'К сборке пазла 🧩';
  show('screen-reward');
}

/* ================================================================
   ФИНАЛЬНАЯ СБОРКА ПАЗЛА
   ================================================================ */
function buildPuzzle() {
  const stage = $('#puzzleStage'), board = $('#puzzleBoard'), tray = $('#puzzleTray');
  board.innerHTML = ''; tray.innerHTML = '';
  stage.querySelectorAll('.ppiece').forEach(n => n.remove());

  // подбираем ширину так, чтобы доска + лоток целиком помещались в экран
  const ratio = IMG_H / IMG_W;                    // высота доски = ширина * ratio
  const trayRows = 2;
  const perRow = ratio / ROWS * trayRows;         // высота лотка = ширина * perRow
  const maxByHeight = (innerHeight * .76 - 70) / (ratio + perRow);
  const width = Math.max(280, Math.min(760, innerWidth * .96, maxByHeight));
  stage.style.width = width + 'px';

  const bw = width, bh = bw * ratio;
  const pw = bw / COLS, ph = bh / ROWS;
  tray.style.height = (ph * trayRows + 16) + 'px';
  let locked = 0;
  const all = [];

  /* раскладка оставшихся кусочков в лотке: чем меньше их осталось, тем просторнее */
  function layoutTray() {
    const rest = all.filter(p => !p.classList.contains('locked'));
    const rows = rest.length > COLS * 2 ? 2 : 1;
    const per = Math.ceil(rest.length / rows);
    const gapX = per > 1 ? (bw - pw - 6) / (per - 1) : 0;
    rest.forEach((p, k) => {
      if (p.classList.contains('drag')) return;
      const r = (k / per) | 0, c = k % per;
      p.style.left = (3 + c * gapX) + 'px';
      p.style.top = (bh + 14 + 8 + r * (ph + 4)) + 'px';
      p.style.zIndex = 5 + c;
    });
  }

  for (let i = 0; i < TOTAL; i++) {
    const col = i % COLS, row = (i / COLS) | 0;
    const slot = el('div', 'slot');
    slot.style.cssText = `left:${col * pw}px;top:${row * ph}px;width:${pw}px;height:${ph}px`;
    board.appendChild(slot);
  }

  const order = shuffle([...Array(TOTAL).keys()]);
  order.forEach((i, k) => {
    const p = el('div', 'ppiece');
    p.style.width = pw + 'px'; p.style.height = ph + 'px';
    pieceStyle(p, i, pw);
    p.dataset.idx = i;
    all.push(p);

    let sx, sy, ox, oy, dragging = false;
    p.addEventListener('pointerdown', e => {
      if (p.classList.contains('locked')) return;
      e.preventDefault();
      dragging = true;
      p.classList.add('drag');
      p.setPointerCapture(e.pointerId);
      const r = stage.getBoundingClientRect();
      ox = e.clientX - r.left - parseFloat(p.style.left);
      oy = e.clientY - r.top - parseFloat(p.style.top);
      Sound.click();
    });
    p.addEventListener('pointermove', e => {
      if (!dragging) return;
      const r = stage.getBoundingClientRect();
      p.style.left = (e.clientX - r.left - ox) + 'px';
      p.style.top = (e.clientY - r.top - oy) + 'px';
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      p.classList.remove('drag');
      const col = i % COLS, row = (i / COLS) | 0;
      const tx = col * pw, ty = row * ph;
      const cx = parseFloat(p.style.left), cy = parseFloat(p.style.top);
      if (Math.hypot(cx - tx, cy - ty) < Math.min(pw, ph) * .55) {
        p.style.left = tx + 'px'; p.style.top = ty + 'px';
        p.style.zIndex = 2;
        p.classList.add('locked');
        Sound.good();
        locked++;
        $('#puzzleCount').textContent = `${locked} / ${TOTAL}`;
        layoutTray();
        if (locked === TOTAL) setTimeout(finalScreen, 500);
      } else layoutTray();
    };
    p.addEventListener('pointerup', end);
    p.addEventListener('pointercancel', end);

    stage.appendChild(p);
  });

  layoutTray();
  $('#puzzleCount').textContent = `0 / ${TOTAL}`;
}

/* подсказка: на пару секунд показываем фото-призрак под доской */
function puzzleHint() {
  const board = $('#puzzleBoard');
  board.classList.add('ghost');
  Sound.click();
  setTimeout(() => board.classList.remove('ghost'), 2200);
}

function finalScreen() {
  state.puzzleDone = true; save();
  show('screen-final');
  Sound.fanfare();
  Confetti.burst(200, true);
  setTimeout(() => Confetti.burst(160), 900);
  setTimeout(() => Confetti.burst(160, true), 1900);
  // титры с музыкой — начинаются, когда отгремели фанфары
  setTimeout(() => Sound.music(true, 'credits'), 2600);
}

/* ================================================================
   НАВИГАЦИЯ И СТАРТ
   ================================================================ */
$('#btnStart').onclick = () => {
  Sound.warm(); Sound.click(); Sound.music(true);
  renderMap(); show('screen-map');
};
$('#btnReset').onclick = () => {
  state = defaultState(); save(); renderMap();
  toast('Прогресс сброшен ✨');
};
$('#btnBack').onclick = () => { runCleanups(); Sound.click(); renderMap(); show('screen-map'); };
$('#btnRewardNext').onclick = () => {
  Sound.click();
  renderMap(); show('screen-map');
  const thumb = $('#piecesBar').children[currentLevel];
  if (thumb) { thumb.classList.add('pop'); setTimeout(() => thumb.classList.remove('pop'), 700); }
  if (state.pieces.length >= TOTAL) toast('Все фрагменты собраны! Жми «Собрать пазл» 🧩');
};
$('#btnGoPuzzle').onclick = () => {
  Sound.click();
  if (state.puzzleDone) { show('screen-final'); Confetti.burst(120); return; }
  show('screen-puzzle');
  requestAnimationFrame(() => setTimeout(buildPuzzle, 60));
};
$('#btnAgain').onclick = () => {
  state = defaultState(); save();
  Sound.music(true, 'game');
  renderMap(); show('screen-map');
};
$('#btnHint').onclick = puzzleHint;
$('#soundBtn').onclick = () => {
  state.sound = !state.sound; save();
  $('#soundBtn').textContent = state.sound ? '🔊' : '🔇';
  Sound.music(state.sound);
  if (state.sound) Sound.click();
};

addEventListener('resize', () => {
  if ($('#screen-map').classList.contains('active')) renderMap();
});

/* инициализация */
$('#soundBtn').textContent = state.sound ? '🔊' : '🔇';
renderMap();
if (state.pieces.length > 0) {
  // есть сохранённый прогресс — сразу предлагаем продолжить с карты
  $('#btnStart').textContent = 'Продолжить игру ▶';
}
