/* ================================================================
   🎉 СЕКРЕТ АХАНА — браузерная игра ко Дню Рождения
   10 мини-игр → 10 фрагментов пазла → финальная фотография
   ================================================================ */

const IMG = 'assets/family.jpeg';
const IMG_W = 1080, IMG_H = 734;
const COLS = 5, ROWS = 2, TOTAL = COLS * ROWS;
const SAVE_KEY = 'ahan_secret_progress_v1';

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
  const melody = [
    [523.25, 0], [659.25, 0], [783.99, 0], [1046.5, 0],
    [783.99, 0], [659.25, 0], [587.33, 0], [493.88, 0]
  ];
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
    music(on) {
      clearInterval(musicTimer); musicTimer = null;
      if (!on || !state.sound) return;
      musicTimer = setInterval(() => {
        const n = melody[step % melody.length][0];
        tone(n, .35, 'sine', .05);
        tone(n / 2, .4, 'sine', .035);
        step++;
      }, 420);
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
    title: 'Найди подарок', icon: '🎁', desc: 'Среди праздничного хаоса спрятался подарок. Найди его 3 раза!',
    start(host, win, setStatus) {
      let round = 0;
      const decoys = ['🎈', '🍬', '🎂', '📦', '🍭', '🧁', '🎊', '🎵', '🍰', '🎀'];
      const play = () => {
        host.innerHTML = '';
        setStatus(`Раунд ${round + 1}/3`);
        const n = 20 + round * 10;
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
              if (round >= 3) { win(); } else { toast('Нашёл! Ещё раз 🎁'); play(); }
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
      const W = 13, H = 9;                 // нечётные размеры для генератора
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
    title: 'Память', icon: '🧠', desc: 'Найди 4 пары одинаковых карточек.',
    start(host, win, setStatus) {
      const icons = ['🎂', '🎈', '🎁', '🎉'];
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
    title: 'Лопни шарики', icon: '🎈', desc: 'Лопни 15 шаров за 20 секунд!',
    start(host, win, setStatus) {
      const NEED = 15, TIME = 20;
      let popped = 0, left = TIME, balloons = [], running = true;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Тапай по шарикам — лопай их быстрее!'));
      const field = el('div', 'balloon-field'); host.appendChild(field);
      const colors = ['🎈', '🟣', '🔵', '🟡', '🟢', '🔴'];

      const upd = () => setStatus(`${popped}/${NEED} · ⏱ ${left}с`);
      upd();

      const spawner = setInterval(() => {
        if (!running) return;
        const b = el('div', 'balloon', colors[rnd(colors.length)]);
        const x = 5 + Math.random() * 85;
        b.style.left = x + '%';
        b.style.top = '100%';
        b._y = 100; b._sp = .35 + Math.random() * .45; b._sw = Math.random() * 2;
        b.addEventListener('pointerdown', ev => {
          ev.preventDefault();
          if (!running || b._dead) return;
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
        { id: 4, name: '🕯 Свечи', color: '#ffd45e' }
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
    title: 'Кто тебя больше любит?', icon: '💖', desc: 'Отвечай правильно. Неправильные ответы убегают!',
    start(host, win, setStatus) {
      const QS = [
        { q: 'Кого сегодня поздравляют?', a: 'Гульнара' },
        { q: 'Кто главный герой праздника?', a: 'Ахан' },
        { q: 'Кто получает подарки?', a: 'Ахан' },
        { q: 'У кого сегодня День Рождения?', a: 'Гульнара' },
        { q: 'Кто самый крутой(ая) сегодня?', a: 'Моя мама' }
      ];
      const WRONG = ['Галимжан', 'Алуа', 'Рахим'];
      let idx = 0;

      const qEl = el('h3', 'quiz-question');
      const field = el('div', 'quiz-field');
      const cnt = el('p', 'quiz-count');
      host.innerHTML = '';
      host.appendChild(qEl); host.appendChild(field); host.appendChild(cnt);

      let correctBtn = null, wrongBtns = [];

      function place(btn, x, y) { btn.style.left = x + 'px'; btn.style.top = y + 'px'; }
      function bounds() { return { w: field.clientWidth, h: field.clientHeight }; }
      function centerOf(b) {
        const r = b.getBoundingClientRect(), f = field.getBoundingClientRect();
        return { x: r.left - f.left + r.width / 2, y: r.top - f.top + r.height / 2 };
      }
      function flee(btn) {
        const { w, h } = bounds();
        const bw = btn.offsetWidth, bh = btn.offsetHeight;
        const cc = correctBtn ? centerOf(correctBtn) : { x: -999, y: -999 };
        for (let t = 0; t < 30; t++) {
          const x = Math.random() * (w - bw - 8) + 4;
          const y = Math.random() * (h - bh - 8) + 4;
          const dx = x + bw / 2 - cc.x, dy = y + bh / 2 - cc.y;
          if (Math.hypot(dx, dy) > 110) { place(btn, x, y); return; }
        }
        place(btn, Math.random() * (w - bw - 8) + 4, Math.random() * (h - bh - 8) + 4);
      }

      function render() {
        field.innerHTML = '';
        const cur = QS[idx];
        qEl.textContent = `Вопрос ${idx + 1}. ${cur.q}`;
        cnt.textContent = `Правильных ответов: ${idx}/${QS.length}`;
        setStatus(`${idx}/${QS.length}`);
        wrongBtns = [];

        correctBtn = el('div', 'answer correct', cur.a);
        field.appendChild(correctBtn);
        const { w, h } = bounds();
        place(correctBtn, Math.max(8, w / 2 - correctBtn.offsetWidth / 2), Math.max(8, h / 2 - correctBtn.offsetHeight / 2 + (Math.random() - .5) * 60));
        correctBtn.onclick = () => {
          Sound.good();
          field.innerHTML = '';
          const ok = el('div', 'quiz-ok', '✅ Верно!');
          ok.style.position = 'absolute'; ok.style.left = '50%'; ok.style.top = '45%';
          ok.style.transform = 'translate(-50%,-50%)';
          field.appendChild(ok);
          idx++;
          setTimeout(() => { if (idx >= QS.length) win(); else render(); }, 850);
        };

        WRONG.filter(w2 => w2 !== cur.a).forEach(txt => {
          const b = el('div', 'answer', txt);
          field.appendChild(b);
          flee(b);
          b.addEventListener('pointerdown', ev => { ev.preventDefault(); Sound.pop(); flee(b); });
          b.addEventListener('click', ev => { ev.preventDefault(); flee(b); });
          wrongBtns.push(b);
        });
      }

      const onMove = ev => {
        const f = field.getBoundingClientRect();
        const mx = ev.clientX - f.left, my = ev.clientY - f.top;
        wrongBtns.forEach(b => {
          const c = centerOf(b);
          if (Math.hypot(c.x - mx, c.y - my) < 100) flee(b);
        });
      };
      field.addEventListener('pointermove', onMove);
      addCleanup(() => field.removeEventListener('pointermove', onMove));

      requestAnimationFrame(render);
    }
  },

  /* --------- 7. Найди отличия --------- */
  {
    title: 'Найди отличия', icon: '🔍', desc: 'Найди 3 отличия на правой картинке.',
    start(host, win, setStatus) {
      const items = [
        { e: '🎈', x: 10, y: 16 },
        { e: '🎈', x: 74, y: 12, alt: '🎀' },      // отличие 1
        { e: '⭐', x: 32, y: 26 },
        { e: '🎂', x: 46, y: 63, big: true },
        { e: '🎁', x: 16, y: 74, alt: null },       // отличие 2 (исчезает)
        { e: '🍭', x: 84, y: 70 },
        { e: '🍬', x: 62, y: 45, alt: '🍫' },       // отличие 3
        { e: '🥳', x: 52, y: 88 },
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
      host.appendChild(el('p', 'game-msg', 'Кликай по отличиям на ПРАВОЙ картинке.'));
      const wrap = el('div', 'diff-wrap');
      const left = build(false), right = build(true);
      wrap.appendChild(left); wrap.appendChild(right);
      host.appendChild(wrap);
      setStatus('0/3');

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
          setStatus(found.length + '/3');
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
    title: 'Секретный код', icon: '🔐', desc: 'Разгадай цифру-ключ.',
    start(host, win, setStatus) {
      let code = '';
      host.innerHTML = '';
      host.appendChild(el('p', 'code-hint', '🔎 Подсказка: сколько букв в имени «Гульнара»?'));
      const disp = el('div', 'code-display', '_'); host.appendChild(disp);
      const msg = el('p', 'game-msg', 'Введи цифру и нажми ✅'); host.appendChild(msg);
      const pad = el('div', 'keypad');
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✅'];
      keys.forEach(k => {
        const b = el('button', null, k);
        b.onclick = () => {
          Sound.click();
          if (k === '⌫') code = code.slice(0, -1);
          else if (k === '✅') {
            if (code === '8') {
              Sound.good(); msg.textContent = '🔓 Замок открыт!'; msg.classList.remove('code-wrong');
              setTimeout(win, 500);
            } else {
              Sound.bad(); msg.textContent = '❌ Не тот код. Посчитай буквы ещё раз!';
              msg.classList.add('code-wrong'); code = '';
            }
          } else if (code.length < 2) code += k;
          disp.textContent = code || '_';
        };
        pad.appendChild(b);
      });
      host.appendChild(pad);
      setStatus('🔒');
      const key = e => {
        if (/^[0-9]$/.test(e.key)) { code = (code + e.key).slice(0, 2); disp.textContent = code; }
        if (e.key === 'Backspace') { code = code.slice(0, -1); disp.textContent = code || '_'; }
        if (e.key === 'Enter') pad.lastChild.click();
      };
      addEventListener('keydown', key);
      addCleanup(() => removeEventListener('keydown', key));
    }
  },

  /* --------- 9. Поймай подарок --------- */
  {
    title: 'Поймай подарок', icon: '🧺', desc: 'Поймай 20 подарков корзиной. Бомбы — мимо!',
    start(host, win, setStatus) {
      const NEED = 20;
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
        const bomb = Math.random() < .18;
        const it = el('div', 'falling', bomb ? '💣' : ['🎁', '🎀', '🍬', '🧁'][rnd(4)]);
        it._x = 5 + Math.random() * 88; it._y = -8; it._sp = .55 + Math.random() * .55; it._bomb = bomb;
        it.style.left = it._x + '%'; it.style.top = it._y + '%';
        field.appendChild(it); items.push(it);
      }, 480);

      let raf;
      const tick = () => {
        items.slice().forEach(it => {
          it._y += it._sp;
          it.style.top = it._y + '%';
          if (it._y > 82 && it._y < 96 && Math.abs(it._x - bx) < 9) {
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
    title: 'Последний пазл', icon: '📦', desc: 'Последний фрагмент спрятан в одной из коробок.',
    start(host, win, setStatus) {
      const N = 12;
      const winner = rnd(N);
      let opened = 0;
      host.innerHTML = '';
      host.appendChild(el('p', 'game-msg', 'Открывай коробки, пока не найдёшь фрагмент!'));
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
            b.classList.add('opened'); b.textContent = ['😅', '🕸', '🧦', '🪶', '🍃'][rnd(5)];
            Sound.click(); opened++;
            setStatus('Открыто: ' + opened);
          }
        };
        grid.appendChild(b);
      }
      host.appendChild(grid);
      setStatus('Открыто: 0');
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
  const pw = Math.min(430, innerWidth * .88) / COLS - 6;
  for (let i = 0; i < TOTAL; i++) {
    const t = el('div', 'piece-thumb' + (hasPiece(i) ? ' got' : ''));
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
  pieceStyle(pv, i, Math.min(300, innerWidth * .8));
  const left = TOTAL - state.pieces.length;
  $('#rewardText').textContent = left > 0
    ? `Фрагмент ${i + 1} твой! Осталось собрать: ${left}.`
    : 'Все 10 фрагментов собраны! Пора сложить фотографию 🧩';
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
  const maxByHeight = (innerHeight * .74 - 60) / (ratio + perRow);
  const width = Math.max(280, Math.min(760, innerWidth * .96, maxByHeight));
  stage.style.width = width + 'px';

  const bw = width, bh = bw * ratio;
  const pw = bw / COLS, ph = bh / ROWS;
  tray.style.height = (ph * trayRows + 16) + 'px';
  let locked = 0;

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
    const bx = 4 + (k % COLS) * (bw - pw - 8) / (COLS - 1);
    const by = 8 + ((k / COLS) | 0) * (ph + 2);
    p.style.left = bx + 'px';
    p.style.top = (bh + 14 + by) + 'px';
    p.dataset.idx = i;

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
      if (Math.hypot(cx - tx, cy - ty) < Math.min(pw, ph) * .5) {
        p.style.left = tx + 'px'; p.style.top = ty + 'px';
        p.classList.add('locked');
        Sound.good();
        locked++;
        if (locked === TOTAL) setTimeout(finalScreen, 500);
      }
    };
    p.addEventListener('pointerup', end);
    p.addEventListener('pointercancel', end);

    stage.appendChild(p);
  });
}

function finalScreen() {
  state.puzzleDone = true; save();
  show('screen-final');
  Sound.fanfare();
  Confetti.burst(200, true);
  setTimeout(() => Confetti.burst(160), 900);
  setTimeout(() => Confetti.burst(160, true), 1900);
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
  state = defaultState(); save(); renderMap(); show('screen-map');
};
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
