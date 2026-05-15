const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const stars = Array.from({ length: 140 }, () => ({
  x:     Math.random(),
  y:     Math.random(),
  r:     0.4 + Math.random() * 1.8,
  phase: Math.random() * Math.PI * 2,
  speed: 0.002 + Math.random() * 0.004
}));
const shoots = [];
function spawnShoot() {
  shoots.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * 0.5,
    len: 80 + Math.random() * 80,
    speed: 6 + Math.random() * 6,
    alpha: 1,
    angle: Math.PI / 5
  });
}
setInterval(spawnShoot, 3500);

function drawBg(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const grd = ctx.createRadialGradient(
    canvas.width * 0.35, canvas.height * 0.4, 0,
    canvas.width * 0.5,  canvas.height * 0.5, canvas.width * 0.85
  );
  grd.addColorStop(0, '#1e0f00');
  grd.addColorStop(0.5, '#0d0500');
  grd.addColorStop(1, '#000000');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    const alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
    ctx.beginPath();
    ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,225,150,${alpha})`;
    ctx.fill();
  });
  for (let i = shoots.length - 1; i >= 0; i--) {
    const s = shoots[i];
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
    ctx.strokeStyle = `rgba(255,240,180,${s.alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    s.x     += Math.cos(s.angle) * s.speed;
    s.y     += Math.sin(s.angle) * s.speed;
    s.alpha -= 0.018;
    if (s.alpha <= 0) shoots.splice(i, 1);
  }

  requestAnimationFrame(drawBg);
}
requestAnimationFrame(drawBg);
const floatEmojis = ['🎈','🎉','✨','🎀','🌟','🎊','💛','🥳'];
floatEmojis.forEach((em, i) => {
  const el = document.createElement('div');
  el.className = 'float-emoji';
  el.textContent = em;
  el.style.cssText = `
    left: ${5 + (i / floatEmojis.length) * 90}%;
    animation-duration: ${7 + Math.random() * 6}s;
    animation-delay: ${Math.random() * 5}s;
  `;
  document.getElementById('floating-emojis').appendChild(el);
});
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const now = new Date();
document.getElementById('date-chip').textContent =
  `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
function updateClock() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const ss = String(d.getSeconds()).padStart(2,'0');
  const el = document.getElementById('live-clock');
  if (el) el.textContent = `${hh}:${mm}:${ss}`;
}
updateClock();
setInterval(updateClock, 1000);
function updateCountdown() {
  const now  = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  next.setHours(0,0,0,0);
  const diff = next - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const el = document.getElementById('countdown-text');
  if (el) el.textContent =
    `🎂 Today is your day! ${h}h ${m}m ${s}s of celebration remaining`;
}
updateCountdown();
setInterval(updateCountdown, 1000);
function openEnvelope() {
  const env     = document.getElementById('envelope');
  const screen  = document.getElementById('envelope-screen');
  const cardScn = document.getElementById('card-scene');

  env.classList.add('opening');

  setTimeout(() => {
    screen.classList.add('hidden');
    cardScn.classList.add('visible');
    song.play().catch(() => {});
    playing = true;
    musicBtn.textContent = '♪ Pause';
    musicBtn.classList.add('playing');

    autoConfetti();
    showToast('🥳 Welcome! Today is all about you!');
  }, 950);
}
let playing = false;
const song     = document.getElementById('song');
const musicBtn = document.getElementById('music-btn');

function toggleMusic() {
  if (!playing) {
    song.play().catch(() => {});
    musicBtn.textContent = '♪ Pause';
    musicBtn.classList.add('playing');
    playing = true;
  } else {
    song.pause();
    musicBtn.textContent = '♪ Play';
    musicBtn.classList.remove('playing');
    playing = false;
  }
}

const confettiColors = [
  '#c9933a','#e8c47a','#c0404a','#e87c85',
  '#5a7a5c','#fff8f0','#d4a853','#9b7fd4','#f472b6'
];

function spawnPiece(x, y) {
  const p    = document.createElement('div');
  p.className = 'particle';
  const size  = 5 + Math.random() * 9;
  const drift = (Math.random() - 0.5) * 220;
  p.style.cssText = `
    left: ${x}px; top: ${y}px;
    width: ${size}px; height: ${size}px;
    background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
    border-radius: ${Math.random() > 0.45 ? '50%' : '2px'};
    animation-duration: ${1.8 + Math.random() * 2.4}s;
    animation-delay: ${Math.random() * 0.5}s;
    margin-left: ${drift}px;
  `;
  document.getElementById('particles').appendChild(p);
  setTimeout(() => p.remove(), 5000);
}

function autoConfetti() {
  for (let i = 0; i < 55; i++) {
    setTimeout(() => spawnPiece(
      Math.random() * window.innerWidth, -10
    ), Math.random() * 1400);
  }
}

const celebrateQuotes = [
  { emoji: '🎂', text: 'Another year of being absolutely fabulous!' },
  { emoji: '✨', text: 'May your day be as bright as your smile!' },
  { emoji: '🎈', text: 'Older? Yes. Wiser? Definitely. Cooler? Always!' },
  { emoji: '🌟', text: 'You were born to shine — today especially!' },
  { emoji: '🥳', text: 'Life is short — eat the cake & enjoy every moment!' },
  { emoji: '💛', text: 'You make the world a better place just by being in it!' },
  { emoji: '🎀', text: 'Today is your day — own it!' },
  { emoji: '🎉', text: 'Wishing you 365 days of happiness ahead!' },
  { emoji: '🌸', text: 'Every candle on your cake is a wish come true!' },
  { emoji: '🦋', text: 'Here\'s to new adventures and beautiful moments!' },
];
let lastQuoteIdx = -1;

function burstConfetti() {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight * 0.3;
  for (let i = 0; i < 90; i++) {
    setTimeout(() => spawnPiece(
      cx + (Math.random() - 0.5) * 340,
      cy + (Math.random() - 0.5) * 90
    ), Math.random() * 500);
  }
  const emojis = ['🎉','🎊','🎈','✨','🥳','💛','🌟','🎀','🎂','🍾'];
  emojis.forEach((em, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.textContent = em;
      el.style.cssText = `
        position: fixed;
        font-size: ${1.3 + Math.random() * 0.8}rem;
        left: ${15 + Math.random() * 70}%;
        bottom: 12%;
        z-index: 999;
        pointer-events: none;
        animation: floatUp 2.2s ease forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2400);
    }, i * 100);
  });
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed; inset: 0;
    background: rgba(255,220,100,0.14);
    z-index: 998; pointer-events: none;
    animation: flashOut 0.65s ease forwards;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 750);
  const card = document.getElementById('card');
  card.style.animation = 'none';
  setTimeout(() => { card.style.animation = 'cardShake 0.55s ease'; }, 10);
  setTimeout(() => { card.style.animation = ''; }, 700);
  let idx;
  do { idx = Math.floor(Math.random() * celebrateQuotes.length); }
  while (idx === lastQuoteIdx);
  lastQuoteIdx = idx;
  const q = celebrateQuotes[idx];

  const toast = document.createElement('div');
  toast.textContent = `${q.emoji}  ${q.text}`;
  toast.style.cssText = `
    position: fixed;
    bottom: 8%; left: 50%;
    transform: translateX(-50%) translateY(40px);
    background: rgba(26,16,8,0.93);
    color: #e8c47a;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(0.8rem, 2.3vw, 1rem);
    padding: 12px 26px;
    border-radius: 99px;
    border: 1.5px solid #c9933a;
    z-index: 9999; pointer-events: none;
    white-space: nowrap; max-width: 88vw;
    text-align: center;
    animation: quotePopup 3.8s ease forwards;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
  ['10%','90%'].forEach((left, side) => {
    for (let i = 0; i < 18; i++) {
      setTimeout(() => spawnPiece(
        parseFloat(left) / 100 * window.innerWidth,
        window.innerHeight * 0.5
      ), i * 60);
    }
  });
}
function showToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position: fixed; top: 6%; left: 50%;
    transform: translateX(-50%);
    background: rgba(26,16,8,0.9);
    color: #e8c47a; font-size: 0.85rem;
    padding: 10px 22px; border-radius: 99px;
    border: 1px solid rgba(201,147,58,0.5);
    z-index: 9999; pointer-events: none;
    animation: quotePopup 3s ease forwards;
    white-space: nowrap; max-width: 90vw;
    font-family: 'DM Sans', sans-serif;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}
const wishPool = [
  { emoji: '🌺', quote: 'May every dream you chase this year catch you right back.' },
  { emoji: '🥂', quote: 'Here\'s to you — the most wonderful kind of human.' },
  { emoji: '🌙', quote: 'Born to sparkle. Today, you outshine every star.' },
  { emoji: '🎁', quote: 'The world got better the day you arrived in it.' },
  { emoji: '🦚', quote: 'May your year be as colourful and magnificent as you are.' },
  { emoji: '🍰', quote: 'Cake, laughter, and you — the perfect trio.' },
  { emoji: '🌈', quote: 'Another chapter begins. Make it your most beautiful yet.' },
  { emoji: '🕯️', quote: 'Every candle you blow out carries a wish right to the universe.' },
];
let lastWishIdx = -1;

function showRandomWish() {
  let idx;
  do { idx = Math.floor(Math.random() * wishPool.length); }
  while (idx === lastWishIdx);
  lastWishIdx = idx;
  const w = wishPool[idx];

  document.getElementById('modal-emoji').textContent = w.emoji;
  document.getElementById('modal-quote').textContent = w.quote;
  const modal = document.getElementById('modal');
  modal.classList.add('open');
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('open');
  modal.style.display = 'none';
}
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('mousemove', e => {
  const cs = document.getElementById('card-scene');
  if (!cs.classList.contains('visible')) return;
  if (Math.random() > 0.91) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${e.clientX}px; top: ${e.clientY}px;
      width: 5px; height: 5px;
      background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
      border-radius: 50%;
      animation-duration: 1.3s;
    `;
    document.getElementById('particles').appendChild(p);
    setTimeout(() => p.remove(), 1500);
  }
});
document.addEventListener('keydown', e => {
  const cs = document.getElementById('card-scene');
  if (!cs.classList.contains('visible')) return;
  if (e.code === 'Space') { e.preventDefault(); burstConfetti(); }
  if (e.code === 'KeyM')  toggleMusic();
  if (e.code === 'KeyW')  showRandomWish();
});
