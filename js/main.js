const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
const colors = ['#ff6ec7', '#ffd166', '#4dd6ff', '#a78bfa', '#8affc1'];
let pieces = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

resize();
addEventListener('resize', resize);

function burst(x, y, count, power) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = (Math.random() * 0.7 + 0.3) * power;
    pieces.push({
      x: x,
      y: y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - power * 0.45,
      s: Math.random() * 7 + 4,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      c: colors[(Math.random() * colors.length) | 0],
      life: 1
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces = pieces.filter(p => p.life > 0);
  for (const p of pieces) {
    p.vy += 0.12;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life -= 0.006;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
    ctx.restore();
  }
  requestAnimationFrame(tick);
}

function makeBalloon() {
  const b = document.createElement('span');
  b.className = 'balloon';
  b.style.left = Math.random() * 92 + '%';
  b.style.background = 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.75), ' + colors[(Math.random() * colors.length) | 0] + ')';
  b.style.animationDuration = Math.random() * 6 + 9 + 's';
  b.style.setProperty('--swayx', (Math.random() * 80 - 40) + 'px');
  b.addEventListener('animationend', () => b.remove());
  document.getElementById('balloons').appendChild(b);
}

if (!prefersReduce) {
  tick();
  setTimeout(() => burst(innerWidth / 2, innerHeight * 0.35, 130, 9), 400);
  document.addEventListener('click', e => burst(e.clientX, e.clientY, 22, 6));
  for (let i = 0; i < 6; i++) setTimeout(makeBalloon, i * 350);
  setInterval(makeBalloon, 1100);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  io.observe(el);
});

const wishes = [
  'Сандра, с днём рождения! Пусть каждый день будет как эти фото — громким, весёлым и с тортом 🎂',
  'Желаю, чтобы жизнь подкидывала только приятные сюрпризы — а мы всегда были рядом, чтобы разделить их с тобой 💖',
  'Пусть мечты сбываются так же легко, как ты делаешь смешные лица на камеру 😄',
  'Счастья, ярких приключений и людей рядом, с которыми хочется попадать в истории 🤍',
  'Оставайся такой же весёлой, дерзкой и настоящей! С днём рождения, звезда ⭐',
  'Миллион поводов для смеха и ноль причин для грусти. Обнимаю крепко-крепко! 🎉'
];

const modal = document.getElementById('modal');
const wishText = document.getElementById('wishText');
let lastWish = -1;

function openGift() {
  let n;
  do {
    n = (Math.random() * wishes.length) | 0;
  } while (n === lastWish);
  lastWish = n;
  wishText.textContent = wishes[n];
  modal.hidden = false;
  if (!prefersReduce) burst(innerWidth / 2, innerHeight / 2, 160, 11);
}

document.getElementById('giftBox').addEventListener('click', openGift);
document.getElementById('moreBtn').addEventListener('click', openGift);
document.getElementById('closeModal').addEventListener('click', () => {
  modal.hidden = true;
});
modal.addEventListener('click', e => {
  if (e.target === modal) modal.hidden = true;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') modal.hidden = true;
});
