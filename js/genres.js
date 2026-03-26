/* GENRES PAGE JS */
document.addEventListener('DOMContentLoaded', () => {

  /* Score bar animation on scroll */
  const scoreObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.score-fill').forEach(fill => {
          const w = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => { fill.style.width = w; }, 150);
        });
        scoreObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.genre-card').forEach(c => scoreObserver.observe(c));

  /* Card reveal */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.genre-card, .age-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObs.observe(el);
  });

  /* Genres Wheel (Canvas) */
  const container = document.getElementById('genresWheel');
  if (!container) return;
  const canvas = document.createElement('canvas');
  canvas.width = 300; canvas.height = 300;
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const genres = [
    { label: 'Action', color: '#ee0979', val: 0.95 },
    { label: 'RPG', color: '#7c3aed', val: 0.88 },
    { label: 'Strategy', color: '#0369a1', val: 0.92 },
    { label: 'Sports', color: '#065f46', val: 0.85 },
    { label: 'Horror', color: '#1c1c2e', val: 0.75 },
    { label: 'Casual', color: '#d97706', val: 0.80 },
    { label: 'MMO', color: '#0891b2', val: 0.90 },
    { label: 'VR', color: '#6d28d9', val: 0.95 },
  ];

  const cx = 150, cy = 150, r = 110;
  const slice = (Math.PI * 2) / genres.length;
  let angle = -Math.PI / 2;
  let hovered = -1;

  function draw() {
    ctx.clearRect(0, 0, 300, 300);
    genres.forEach((g, i) => {
      const start = angle + i * slice;
      const end = start + slice - 0.04;
      const isHov = hovered === i;
      const radius = isHov ? r + 12 : r;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = g.color;
      ctx.globalAlpha = isHov ? 1 : 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;

      /* Label */
      const midAngle = start + (slice - 0.04) / 2;
      const lx = cx + (radius * 0.65) * Math.cos(midAngle);
      const ly = cy + (radius * 0.65) * Math.sin(midAngle);
      ctx.save();
      ctx.translate(lx, ly);
      ctx.fillStyle = 'white';
      ctx.font = isHov ? 'bold 11px Inter' : '10px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(g.label, 0, 0);
      ctx.restore();
    });

    /* Center */
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.fillStyle = '#0f0f1a';
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 13px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Жанры', cx, cy);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left - cx;
    const my = e.clientY - rect.top - cy;
    const dist = Math.sqrt(mx*mx + my*my);
    if (dist < 44 || dist > r + 14) { hovered = -1; draw(); return; }
    let a = Math.atan2(my, mx) - (-Math.PI/2);
    if (a < 0) a += Math.PI * 2;
    hovered = Math.floor(a / slice);
    draw();
  });
  canvas.addEventListener('mouseleave', () => { hovered = -1; draw(); });

  /* Animate entry */
  let progress = 0;
  function animate() {
    progress += 0.04;
    if (progress >= 1) { progress = 1; draw(); return; }
    ctx.clearRect(0,0,300,300);
    genres.forEach((g, i) => {
      const start = angle + i * slice;
      const end = start + slice * progress - 0.04 * progress;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = g.color; ctx.globalAlpha = 0.75;
      ctx.fill(); ctx.globalAlpha = 1;
    });
    requestAnimationFrame(animate);
  }
  animate();

  /* Navbar scroll */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
});
