const wishText = document.getElementById('wishText');
const wishCount = document.getElementById('wishCount');
const messageCard = document.getElementById('messageCard');
const orb = document.getElementById('orb');
const wishBtn = document.getElementById('wishBtn');
const shakeBtn = document.getElementById('shakeBtn');
const shakeHint = document.getElementById('shakeHint');

const predictions = buildPredictions();
let pool = shuffle([...predictions]);
let cursor = 0;
let lastWishTime = 0;

const motionSupported = typeof DeviceMotionEvent !== 'undefined';
shakeHint.textContent = motionSupported
  ? 'Потряси шар мышью или встряхни смартфон'
  : 'Потряси шар мышью или нажми кнопку';

function nextWish() {
  if (cursor >= pool.length) {
    pool = shuffle([...predictions]);
    cursor = 0;
  }
  return pool[cursor++];
}

function animateCard() {
  messageCard.classList.remove('reveal');
  void messageCard.offsetWidth;
  messageCard.classList.add('reveal');
}

function animateOrb() {
  orb.classList.remove('rumble');
  void orb.offsetWidth;
  orb.classList.add('rumble');
}

function triggerWish() {
  const now = Date.now();
  if (now - lastWishTime < 900) {
    return;
  }
  lastWishTime = now;
  wishText.textContent = nextWish();
  animateCard();
  animateOrb();
  enableMotion();
}

wishBtn.addEventListener('click', triggerWish);
shakeBtn.addEventListener('click', triggerWish);
orb.addEventListener('click', triggerWish);

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    triggerWish();
  }
});

const pointerState = {
  active: false,
  lastX: 0,
  lastY: 0,
  lastT: 0,
  energy: 0,
};

orb.addEventListener('pointerdown', (event) => {
  pointerState.active = true;
  pointerState.lastX = event.clientX;
  pointerState.lastY = event.clientY;
  pointerState.lastT = performance.now();
  pointerState.energy = 0;
  orb.setPointerCapture(event.pointerId);
  enableMotion();
});

orb.addEventListener('pointermove', (event) => {
  if (!pointerState.active) {
    return;
  }
  const now = performance.now();
  const dx = event.clientX - pointerState.lastX;
  const dy = event.clientY - pointerState.lastY;
  const distance = Math.hypot(dx, dy);
  const dt = Math.max(16, now - pointerState.lastT);
  const speed = distance / dt;
  pointerState.energy = pointerState.energy * 0.7 + speed * 15;
  pointerState.lastX = event.clientX;
  pointerState.lastY = event.clientY;
  pointerState.lastT = now;

  if (pointerState.energy > 4.5) {
    pointerState.energy = 0;
    triggerWish();
  }
});

['pointerup', 'pointercancel', 'pointerleave'].forEach((eventName) => {
  orb.addEventListener(eventName, () => {
    pointerState.active = false;
  });
});

let motionEnabled = false;
let lastMagnitude = 0;

async function enableMotion() {
  if (motionEnabled || !motionSupported) {
    return;
  }
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const response = await DeviceMotionEvent.requestPermission();
      motionEnabled = response === 'granted';
    } catch (error) {
      motionEnabled = false;
    }
  } else {
    motionEnabled = true;
  }
}

window.addEventListener('devicemotion', (event) => {
  if (!motionEnabled || !event.accelerationIncludingGravity) {
    return;
  }
  const { x, y, z } = event.accelerationIncludingGravity;
  const magnitude = Math.sqrt(x * x + y * y + z * z);
  const delta = Math.abs(magnitude - lastMagnitude);
  lastMagnitude = magnitude;

  if (delta > 12) {
    triggerWish();
  }
});

function buildPredictions() {
  const intros = [
    'В 2026 году ты почувствуешь, что внутренний компас совпал с твоими планами.',
    'Пусть начало года станет для тебя мягким перезапуском без суеты.',
    'В 2026 ты найдешь спокойствие в темпе, который подходит именно тебе.',
    'Этот год будет о честных выборах и приятной ясности.',
    'В 2026 тебя ждет редкое ощущение: ты на своем месте.',
    'Пусть в 2026 у тебя появится пространство для вдохновения, а не только для дел.',
    'Ты войдешь в год с ощущением силы, но без лишней жесткости.',
    'В 2026 случайные встречи окажутся точными и важными.',
    'Пусть год принесет больше света, чем новостей.',
    'В 2026 ты начнешь видеть свои границы как ресурс.',
    'Этот год откроет для тебя новые способы быть в потоке.',
    'В 2026 ты позволишь себе смелые решения без драм.',
    'Пусть в 2026 у тебя будет больше времени на то, что делает тебя живым.',
    'В 2026 ты по-новому ощутишь вкус простых радостей.',
    'Этот год подарит ясность там, где раньше была неопределенность.',
    'В 2026 ты научишься беречь энергию и тратить ее на главное.',
    'Пусть год станет красивой точкой роста, а не гонкой.',
    'В 2026 ты станешь внимательнее к себе, и это сработает.',
    'Этот год покажет, что устойчивость может быть легкой.',
    'В 2026 ты получишь право выбирать свою скорость.',
  ];

  const middles = [
    'Ты наконец отфильтруешь шум и оставишь только то, что поддерживает тебя.',
    'В работе и проектах появится ясная линия: меньше хаоса, больше смысла.',
    'Ты соберешь вокруг себя людей, с которыми можно быть настоящим.',
    'Фокус на здоровье и привычках тихо, но уверенно принесет результаты.',
    'Важные задачи начнут решаться легче, потому что ты перестанешь тащить лишнее.',
    'Твоя смелость проявится в маленьких шагах, которые дадут большой эффект.',
    'Ты выберешь качество вместо спешки и почувствуешь, как это меняет все.',
    'Идеи, которые долго созревали, получат правильный момент для запуска.',
    'Ты мягко наведешь порядок в финансах и почувствуешь свободу.',
    'Старые сомнения уступят место спокойной уверенности.',
    'Твой талант станет заметнее, когда ты позволишь себе выйти в свет.',
    'Ты перестанешь сравнивать себя и увидишь свой путь яснее.',
    'В твоем расписании появится время для творчества и воздуха.',
    'Ты научишься говорить "нет" так, чтобы это уважали.',
    'Важные новости придут вовремя и окажутся хорошими.',
    'Ты укрепишь связи, которые делают жизнь теплее.',
    'В 2026 твои навыки вырастут так, что ты сам это заметишь.',
    'Ты найдешь баланс между цифровым и живым, и это даст энергию.',
    'Ты увидишь, что перемены могут быть мягкими и радостными.',
    'Ты сможешь отпраздновать свои победы без чувства вины.',
  ];

  const closes = [
    'Пусть удача будет похожа на теплый свет и всегда будет рядом.',
    'Пусть рядом будут люди, которые искренне за тебя радуются.',
    'Пусть каждый месяц приносит одну приятную неожиданность.',
    'Пусть новые привычки станут твоей спокойной суперсилой.',
    'Пусть дом будет местом силы, а не списком дел.',
    'Пусть твои мечты получат четкий план и мягкое движение вперед.',
    'Пусть в 2026 у тебя будет больше свободного дыхания.',
    'Пусть музыка, улицы и путешествия дарят ощущение свежести.',
    'Пусть в твоем телефоне будет меньше тревоги и больше вдохновения.',
    'Пусть теплые слова находят тебя вовремя.',
    'Пусть у тебя будет достаточно энергии для своего, а не только для чужого.',
    'Пусть каждый шаг укрепляет твою уверенность.',
    'Пусть твое будущее звучит как любимый плейлист.',
    'Пусть добрые совпадения случаются чаще, чем ты ожидаешь.',
    'Пусть перемены приходят с легкостью и остаются надолго.',
    'Пусть 2026 станет годом, где ты себе нравишься.',
    'Пусть твой фокус приносит ощутимый результат и спокойствие.',
    'Пусть у тебя будет чем гордиться и за что благодарить.',
    'Пусть будет больше простых дней, которые хочется запомнить.',
    'Пусть этот год станет твоим красивым обновлением.',
  ];

  const results = [];
  for (const intro of intros) {
    for (const middle of middles) {
      for (const close of closes) {
        results.push(`${intro} ${middle} ${close}`);
      }
    }
  }
  return results;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

const canvas = document.getElementById('sky');
const context = canvas.getContext('2d');
const snowflakes = [];
const stars = [];
let width = 0;
let height = 0;
let wind = 0;
let targetWind = 0;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  resetSky();
}

function resetSky() {
  snowflakes.length = 0;
  stars.length = 0;

  const snowTotal = reduceMotion ? 60 : Math.min(220, Math.floor((width * height) / 8000));
  const starTotal = reduceMotion ? 80 : Math.min(160, Math.floor((width * height) / 12000));

  for (let i = 0; i < snowTotal; i += 1) {
    snowflakes.push(createSnowflake());
  }

  for (let i = 0; i < starTotal; i += 1) {
    stars.push(createStar());
  }
}

function createSnowflake() {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.2 + 0.6,
    speed: Math.random() * 0.8 + 0.3,
    drift: Math.random() * 0.4 - 0.2,
    swing: Math.random() * 1.4 + 0.2,
    phase: Math.random() * Math.PI * 2,
  };
}

function createStar() {
  return {
    x: Math.random() * width,
    y: Math.random() * height * 0.9,
    radius: Math.random() * 1.6 + 0.4,
    alpha: Math.random() * 0.6 + 0.2,
    twinkle: Math.random() * 0.6 + 0.4,
    phase: Math.random() * Math.PI * 2,
  };
}

function animateSky(time) {
  context.clearRect(0, 0, width, height);

  for (const star of stars) {
    const flicker = 0.6 + 0.4 * Math.sin(time * 0.001 * star.twinkle + star.phase);
    context.globalAlpha = star.alpha * flicker;
    context.fillStyle = '#f9f4ea';
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fill();
  }

  context.globalAlpha = 1;
  wind += (targetWind - wind) * 0.02;

  for (const flake of snowflakes) {
    flake.y += flake.speed;
    flake.x += wind + flake.drift + Math.sin(time * 0.001 + flake.phase) * flake.swing * 0.3;

    if (flake.y > height + 10) {
      flake.y = -10;
      flake.x = Math.random() * width;
    }
    if (flake.x > width + 10) {
      flake.x = -10;
    }
    if (flake.x < -10) {
      flake.x = width + 10;
    }

    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    context.beginPath();
    context.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    context.fill();
  }

  requestAnimationFrame(animateSky);
}

window.addEventListener('mousemove', (event) => {
  const midpoint = width / 2 || 1;
  targetWind = ((event.clientX - midpoint) / midpoint) * 0.6;
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
requestAnimationFrame(animateSky);
requestAnimationFrame(() => {
  wishText.textContent = nextWish();
});
