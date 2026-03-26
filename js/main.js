/* ============================================
   GAMEHEALTH — MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ---- BURGER MENU ---- */
  const burger = document.getElementById('burger');
  const navLinks = document.querySelector('.nav-links');
  burger && burger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(15,15,26,0.98)';
    navLinks.style.padding = '20px';
    navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const el = document.querySelector(a.getAttribute('href'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth <= 768) navLinks.style.display = 'none';
    });
  });

  /* ---- ANIMATED COUNTERS ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      if (target >= 1000000000) {
        el.textContent = (current / 1000000000).toFixed(1) + 'B';
      } else if (target >= 1000000) {
        el.textContent = (current / 1000000).toFixed(0) + 'M';
      } else {
        el.textContent = Math.round(current);
      }
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target], .counter').forEach(el => {
    counterObserver.observe(el);
  });

  /* ---- TABS (Effects) ---- */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  /* ---- METER ANIMATIONS ---- */
  const meterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.meter-fill').forEach(fill => {
          const w = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => { fill.style.width = w; }, 100);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.effect-card').forEach(c => meterObserver.observe(c));

  /* ---- PARTICLES ---- */
  const container = document.getElementById('particles');
  if (container) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 1;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * -20;
      const left = Math.random() * 100;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${left}%;
        animation-duration:${duration}s;
        animation-delay:${delay}s;
        opacity:${Math.random() * 0.5 + 0.2};
      `;
      container.appendChild(p);
    }
  }

  /* ---- QUIZ ---- */
  const questions = [
    {
      q: 'Сколько часов в день ты играешь?',
      opts: ['Меньше 1 часа','1–2 часа','3–4 часа','5+ часов'],
      values: [0, 1, 2, 3]
    },
    {
      q: 'Делаешь перерывы во время игры?',
      opts: ['Да, каждые 50 минут','Каждые 1-2 часа','Редко','Никогда'],
      values: [0, 1, 2, 3]
    },
    {
      q: 'Играешь после полуночи?',
      opts: ['Никогда','Редко, только партии','Часто','Почти каждую ночь'],
      values: [0, 1, 2, 3]
    },
    {
      q: 'Бывает ли боль в шее или спине после игры?',
      opts: ['Никогда','Редко','Иногда','Почти всегда'],
      values: [0, 1, 2, 3]
    },
    {
      q: 'Как часто пьёшь воду во время игры?',
      opts: ['Регулярно каждые 20 мин','Пару раз за сессию','Редко','Совсем забываю'],
      values: [0, 1, 2, 3]
    },
    {
      q: 'Спортом занимаешься регулярно?',
      opts: ['Да, 4-5 дней/неделю','Да, 2-3 дня','Редко, прогулки только','Не занимаюсь'],
      values: [0, 1, 2, 3]
    }
  ];

  let currentQ = 0;
  let totalScore = 0;
  const answers = [];

  function renderQuestion() {
    const q = questions[currentQ];
    document.getElementById('quizQuestion').textContent = q.q;
    document.getElementById('questionCounter').textContent = `Вопрос ${currentQ + 1} из ${questions.length}`;
    document.getElementById('progressFill').style.width = `${((currentQ) / questions.length) * 100}%`;

    const optContainer = document.getElementById('quizOptions');
    optContainer.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        totalScore += q.values[i];
        answers.push(q.values[i]);
        currentQ++;
        if (currentQ < questions.length) {
          renderQuestion();
        } else {
          showResult();
        }
      });
      optContainer.appendChild(btn);
    });
  }

  function showResult() {
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('progressFill').style.width = '100%';
    document.getElementById('questionCounter').textContent = 'Тест завершён!';

    const max = questions.length * 3;
    const pct = totalScore / max;

    let emoji, title, text;
    if (pct < 0.25) {
      emoji = '🌟'; title = 'Идеальный геймер!';
      text = 'Ты играешь в умеренное время, заботишься о здоровье и соблюдаешь баланс. Продолжай в том же духе!';
    } else if (pct < 0.5) {
      emoji = '😊'; title = 'Хороший результат';
      text = 'У тебя есть некоторые не совсем здоровые привычки. Почитай наши советы — их легко исправить!';
    } else if (pct < 0.75) {
      emoji = '⚠️'; title = 'Есть зоны риска';
      text = 'Ты играешь слишком много. Сделай перерывы, займись спортом и нормализуй сон. Твоё тело скажет спасибо.';
    } else {
      emoji = '🚨'; title = 'Тревожный сигнал!';
      text = 'Ты находишься в зоне риска игровой зависимости. Серьёзно рассмотри наши советы и поговори со специалистом.';
    }

    document.getElementById('resultEmoji').textContent = emoji;
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultText').textContent = text;
  }

  window.resetQuiz = function() {
    currentQ = 0;
    totalScore = 0;
    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('quizResult').style.display = 'none';
    renderQuestion();
  };

  renderQuestion();

  /* ---- SCROLL REVEAL ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.effect-card, .stat-card, .tip-card, .psych-card, .brain-fact-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });

  /* ---- ACTIVE NAV ON SCROLL ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'white' : '';
      a.style.background = a.getAttribute('href') === `#${current}` ? 'rgba(124,58,237,0.15)' : '';
    });
  });

});
