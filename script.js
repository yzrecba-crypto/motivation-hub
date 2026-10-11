const quotes = [
  {
    text: 'Discipline is choosing your future before your feelings have time to vote.',
    author: 'Motivation Hub'
  },
  {
    text: 'Your strongest version is not built in comfort; it is built in the quiet work no one sees.',
    author: 'Motivation Hub'
  },
  {
    text: 'Success is not a mood. It is a system, a daily decision, and a stubborn commitment.',
    author: 'Motivation Hub'
  },
  {
    text: 'The difference between delayed goals and achieved goals is a clear plan and a brave next step.',
    author: 'Motivation Hub'
  },
  {
    text: 'Every action you take today becomes the foundation of your future identity.',
    author: 'Motivation Hub'
  },
  {
    text: 'You do not need more motivation; you need a reason to move before the excuses arrive.',
    author: 'Motivation Hub'
  }
];

const defaultChallenges = [
  { id: 1, text: 'Drink water and begin with 10 minutes of deep focus', done: false },
  { id: 2, text: 'Walk or stretch for 10 minutes without your phone', done: false },
  { id: 3, text: 'Write down your top 3 priorities for today', done: false },
  { id: 4, text: 'Finish one important task before checking social media', done: false },
  { id: 5, text: 'Read 5 pages from a growth book or article', done: false }
];

const STORAGE_KEYS = {
  challenges: 'motivation_hub_challenges',
  points: 'motivation_hub_points',
  streak: 'motivation_hub_streak',
  quoteIndex: 'motivation_hub_quote_index',
  user: 'motivation_hub_user',
  music: 'motivation_hub_music'
};

const appState = {
  audioContext: null,
  oscillator: null,
  gainNode: null,
  musicPlaying: false,
  challengePoints: Number(localStorage.getItem(STORAGE_KEYS.points) || 120),
  streak: Number(localStorage.getItem(STORAGE_KEYS.streak) || 5)
};

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function updatePoints(points) {
  appState.challengePoints = points;
  localStorage.setItem(STORAGE_KEYS.points, String(points));
  const pointsDisplay = document.getElementById('points-display');
  if (pointsDisplay) pointsDisplay.textContent = String(points);
  const profilePoints = document.getElementById('profile-points');
  if (profilePoints) profilePoints.textContent = String(points);
}

function updateStreak(value) {
  appState.streak = value;
  localStorage.setItem(STORAGE_KEYS.streak, String(value));
  const streakDisplay = document.getElementById('streak-display');
  if (streakDisplay) streakDisplay.textContent = String(value);
  const profileStreak = document.getElementById('profile-streak');
  if (profileStreak) profileStreak.textContent = `${value} days`;
}

function renderChallenges() {
  const challengeList = document.getElementById('challenge-list');
  if (!challengeList) return;

  const savedChallenges = getLocalStorage(STORAGE_KEYS.challenges, defaultChallenges);
  const completedCount = savedChallenges.filter(item => item.done).length;

  challengeList.innerHTML = savedChallenges
    .map(
      (challenge) => `
        <div class="challenge-item ${challenge.done ? 'done' : ''}">
          <div>
            <span class="checkmark">${challenge.done ? '✓' : '○'}</span>
            <span>${challenge.text}</span>
          </div>
          <button class="btn ${challenge.done ? 'btn-ghost' : 'btn-primary'} challenge-toggle" data-id="${challenge.id}">
            ${challenge.done ? 'Completed' : 'Complete'}
          </button>
        </div>
      `
    )
    .join('');

  const profileCompleted = document.getElementById('profile-completed');
  if (profileCompleted) profileCompleted.textContent = String(completedCount);

  challengeList.querySelectorAll('.challenge-toggle').forEach((button) => {
    button.addEventListener('click', () => toggleChallenge(Number(button.dataset.id)));
  });
}

function toggleChallenge(id) {
  const challenges = getLocalStorage(STORAGE_KEYS.challenges, defaultChallenges);
  const challenge = challenges.find(item => item.id === id);
  if (!challenge) return;

  challenge.done = !challenge.done;
  setLocalStorage(STORAGE_KEYS.challenges, challenges);

  updatePoints(appState.challengePoints + (challenge.done ? 25 : -25));
  updateStreak(challenge.done ? appState.streak + 1 : Math.max(0, appState.streak - 1));

  renderChallenges();
  renderLeaderboard();
}

function renderQuote() {
  const quoteText = document.getElementById('daily-quote-text');
  const quoteAuthor = document.getElementById('daily-quote-author');
  if (!quoteText || !quoteAuthor) return;

  const storedIndex = Number(localStorage.getItem(STORAGE_KEYS.quoteIndex) || 0);
  const selectedQuote = quotes[storedIndex % quotes.length];
  quoteText.textContent = selectedQuote.text;
  quoteAuthor.textContent = `- ${selectedQuote.author}`;
}

function nextQuote() {
  const nextIndex = (Number(localStorage.getItem(STORAGE_KEYS.quoteIndex) || 0) + 1) % quotes.length;
  localStorage.setItem(STORAGE_KEYS.quoteIndex, String(nextIndex));
  renderQuote();
}

function copyQuote() {
  const quoteText = document.getElementById('daily-quote-text');
  if (!quoteText) return;

  const text = quoteText.textContent.trim();
  navigator.clipboard.writeText(text).then(() => {
    const button = document.querySelector('.quote-copy-btn');
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = originalText;
      }, 1000);
    }
  }).catch(() => {
    alert('Copy failed. Please try again.');
  });
}

function renderLeaderboard() {
  const leaderboard = document.getElementById('leaderboard');
  if (!leaderboard) return;

  const base = [
    { name: 'Ariana', score: 2140 },
    { name: 'Marcus', score: 1985 },
    { name: 'Sam', score: 1830 },
    { name: 'You', score: appState.challengePoints },
    { name: 'Nia', score: 1700 }
  ];

  const sorted = [...base].sort((a, b) => b.score - a.score);

  leaderboard.innerHTML = sorted
    .map(
      (entry, index) => `
        <div class="leaderboard-row ${entry.name === 'You' ? 'current-user' : ''}">
          <div class="rank">#${index + 1}</div>
          <div class="name">${entry.name}</div>
          <div class="score">${entry.score} pts</div>
        </div>
      `
    )
    .join('');
}

function initChallenges() {
  const saved = getLocalStorage(STORAGE_KEYS.challenges, defaultChallenges);
  if (!saved || saved.length === 0) {
    setLocalStorage(STORAGE_KEYS.challenges, defaultChallenges);
  }
  renderChallenges();
}

function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('chat-input');
  const chatLog = document.getElementById('chat-log');
  if (!input || !chatLog) return;

  const message = input.value.trim();
  if (!message) return;

  chatLog.insertAdjacentHTML(
    'beforeend',
    `<div class="message user"><p>${escapeHtml(message)}</p></div>`
  );

  const response = generateChatReply(message);
  chatLog.insertAdjacentHTML(
    'beforeend',
    `<div class="message bot"><p>${response}</p></div>`
  );

  input.value = '';
  chatLog.scrollTop = chatLog.scrollHeight;
}

function generateChatReply(message) {
  const lower = message.toLowerCase();

  if (lower.includes('tired') || lower.includes('burned')) {
    return 'Rest is not laziness. Take a 10-minute reset, hydrate, breathe deeply, then choose the next smallest win.';
  }

  if (lower.includes('focus') || lower.includes('distracted')) {
    return 'Turn off distractions, set a 25-minute sprint, and work only on the most important task. Momentum beats motivation.';
  }

  if (lower.includes('motivation') || lower.includes('goal')) {
    return 'Your goal gets real when you stop waiting to feel ready. Choose one action today that moves your future forward.';
  }

  if (lower.includes('anxious') || lower.includes('stress')) {
    return 'You do not need to solve everything today. Focus on the next useful step, then let your calmer mind handle the rest.';
  }

  return 'Keep your promise to yourself small and consistent. One focused hour today is worth more than a dramatic plan you never start.';
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setupMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

function setupAuthForms() {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);
      const user = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        goal: formData.get('goal') || 'discipline'
      };

      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
      alert('Account created for demo purposes. You can continue exploring the site.');
      window.location.href = 'profile.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = formData.get('email');
      const password = formData.get('password');
      const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');

      if (user && user.email === email && user.password === password) {
        alert('Login successful.');
        window.location.href = 'profile.html';
      } else {
        alert('Demo login: use the account you created on the sign-up page.');
      }
    });
  }
}

function setupProfilePage() {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');

  const profileName = document.getElementById('profile-name');
  const profileGoal = document.getElementById('profile-goal');
  const profileEmail = document.getElementById('profile-email');
  const avatar = document.getElementById('profile-avatar');

  if (!user) {
    if (profileName) profileName.textContent = 'Guest Mode';
    if (profileGoal) profileGoal.textContent = 'Goal focus: Discipline';
    if (profileEmail) profileEmail.textContent = 'guest@demo.com';
    if (avatar) avatar.textContent = 'G';
    return;
  }

  if (profileName) profileName.textContent = user.name;
  if (profileGoal) profileGoal.textContent = `Goal focus: ${user.goal}`;
  if (profileEmail) profileEmail.textContent = user.email;
  if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
}

function setupMusicPlayer() {
  const toggleButton = document.getElementById('music-toggle');
  if (!toggleButton) return;

  toggleButton.addEventListener('click', () => {
    if (!appState.audioContext) {
      appState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      appState.oscillator = appState.audioContext.createOscillator();
      appState.gainNode = appState.audioContext.createGain();
      appState.oscillator.type = 'sine';
      appState.oscillator.frequency.value = 180;
      appState.gainNode.gain.value = 0.0001;
      appState.oscillator.connect(appState.gainNode);
      appState.gainNode.connect(appState.audioContext.destination);
      appState.oscillator.start();
    }

    if (appState.musicPlaying) {
      appState.gainNode.gain.value = 0.0001;
      toggleButton.textContent = 'Play';
      appState.musicPlaying = false;
    } else {
      appState.gainNode.gain.value = 0.035;
      toggleButton.textContent = 'Pause';
      appState.musicPlaying = true;
    }
  });
}

function setupHomeButtons() {
  document.querySelector('.quote-next-btn')?.addEventListener('click', nextQuote);
  document.querySelector('.quote-copy-btn')?.addEventListener('click', copyQuote);
  document.querySelector('.js-complete-todays-goal')?.addEventListener('click', () => {
    const total = Number(localStorage.getItem(STORAGE_KEYS.points) || 0) + 50;
    updatePoints(total);
    updateStreak(appState.streak + 1);
    alert('Daily goal complete. +50 points added.');
  });

  document.querySelector('.play-video-btn')?.addEventListener('click', () => {
    const screen = document.querySelector('.video-screen');
    if (!screen) return;
    screen.classList.toggle('video-playing');
  });

  document.getElementById('refresh-leaderboard')?.addEventListener('click', renderLeaderboard);

  const chatForm = document.getElementById('chat-form');
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }
}

function initDefaults() {
  if (!localStorage.getItem(STORAGE_KEYS.points)) {
    localStorage.setItem(STORAGE_KEYS.points, '120');
  }
  if (!localStorage.getItem(STORAGE_KEYS.streak)) {
    localStorage.setItem(STORAGE_KEYS.streak, '5');
  }
  if (!localStorage.getItem(STORAGE_KEYS.challenges)) {
    localStorage.setItem(STORAGE_KEYS.challenges, JSON.stringify(defaultChallenges));
  }

  appState.challengePoints = Number(localStorage.getItem(STORAGE_KEYS.points) || 120);
  appState.streak = Number(localStorage.getItem(STORAGE_KEYS.streak) || 5);
}

function initPage() {
  initDefaults();
  renderQuote();
  renderChallenges();
  renderLeaderboard();
  updatePoints(appState.challengePoints);
  updateStreak(appState.streak);
  setupHomeButtons();
  setupMusicPlayer();
  setupAuthForms();
  setupProfilePage();
  setupMobileMenu();
}

document.addEventListener('DOMContentLoaded', initPage);
