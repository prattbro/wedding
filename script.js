/* ============================================
   WEDDING INVITATION – JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------
     0. SPLASH SCREEN & CURTAIN ANIMATION
     ---------------------------------------- */
  const splashScreen = document.getElementById('splashScreen');
  const splashContent = document.getElementById('splashContent');
  const knotBtn = document.getElementById('knotBtn');

  // Lock scrolling while splash is visible
  document.body.classList.add('no-scroll');

  function openCurtains() {
    // Start curtain animation
    splashScreen.classList.add('opened');

    // After curtains finish opening, remove splash entirely
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      document.body.classList.remove('no-scroll');

      // Start background music attempt (browsers allow after interaction)
      const bgMusic = document.getElementById('bgMusic');
      bgMusic.play().then(() => {
        document.getElementById('musicIcon').textContent = '🎵';
        document.getElementById('musicToggle').classList.add('playing');
        isPlaying = true;
      }).catch(() => {});

    }, 1600); // matches curtain transition duration
  }

  // Click anywhere on splash to open
  splashContent.addEventListener('click', openCurtains);

  /* ----------------------------------------
     1. SCROLL-REVEAL (Bidirectional)
        Scroll down → elements animate IN
        Scroll up   → elements animate OUT
     ---------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        // Remove 'active' so it animates back out
        entry.target.classList.remove('active');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------
     1b. SCROLL-DEPTH PARALLAX
         Sections scale/shift based on how
         close they are to the viewport center
     ---------------------------------------- */
  const sections = document.querySelectorAll('.section .section-inner');

  function updateScrollDepth() {
    const viewportCenter = window.scrollY + window.innerHeight / 2;

    sections.forEach(inner => {
      const rect = inner.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distFromCenter = elementCenter / window.innerHeight; // 0 = top, 0.5 = center, 1 = bottom

      // Map distance from viewport center to scale & translateZ
      // Closer to center → scale(1), farther → scale down & shift back
      const normalizedDist = Math.abs(distFromCenter - 0.5) * 2; // 0 at center, 1 at edges
      const clampedDist = Math.min(normalizedDist, 1);

      const scale = 1 - clampedDist * 0.08;      // 1.0 → 0.92
      const translateY = clampedDist * 20;          // 0 → 20px
      const opacity = 1 - clampedDist * 0.25;       // 1.0 → 0.75

      inner.style.transform = `scale(${scale}) translateY(${translateY * (distFromCenter > 0.5 ? 1 : -1)}px)`;
      inner.style.opacity = opacity;
    });
  }

  window.addEventListener('scroll', updateScrollDepth, { passive: true });
  updateScrollDepth();


  /* ----------------------------------------
     2. FLOATING PARTICLES
     ---------------------------------------- */
  const particlesContainer = document.getElementById('particles');
  const particleColors = ['#d4a853', '#c9a87c', '#c97b7b', '#b08968', '#e8c89e'];
  const particleCount = 30;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 8 + 3;
    const left = Math.random() * 100;
    const duration = Math.random() * 15 + 10;
    const delay = Math.random() * 15;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    particlesContainer.appendChild(particle);
  }


  /* ----------------------------------------
     2b. FALLING ROSE PETALS
     ---------------------------------------- */
  const roseContainer = document.getElementById('roseContainer');
  const petalColors = [
    '#e8a0a0', '#d4737b', '#c97b7b', '#e8b4b4',
    '#d98a8a', '#cc6677', '#f2c4c4', '#b85c6a'
  ];
  const petalCount = 25;

  function createPetalSVG(color) {
    return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2 C28 8, 38 16, 36 26 C34 34, 26 40, 20 38 C14 40, 6 34, 4 26 C2 16, 12 8, 20 2Z"
            fill="${color}" opacity="0.8"/>
      <path d="M20 6 C25 12, 30 18, 28 24 C26 30, 22 34, 20 33 C18 34, 14 30, 12 24 C10 18, 15 12, 20 6Z"
            fill="${color}" opacity="0.5"/>
    </svg>`;
  }

  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.classList.add('rose-petal');

    const size = Math.random() * 20 + 14;       // 14–34px
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 8;     // 8–18s
    const delay = Math.random() * 20;
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];

    petal.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    petal.innerHTML = createPetalSVG(color);

    roseContainer.appendChild(petal);
  }


  /* ----------------------------------------
     2c. BACKGROUND MUSIC TOGGLE
     ---------------------------------------- */
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');
  const bgMusic = document.getElementById('bgMusic');
  var isPlaying = false;

  bgMusic.volume = 0.3; // Soft background volume

  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      musicIcon.textContent = '🔇';
      musicToggle.classList.remove('playing');
      isPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicIcon.textContent = '🎵';
        musicToggle.classList.add('playing');
        isPlaying = true;
      }).catch(err => {
        console.log('Audio playback requires user interaction first:', err);
      });
    }
  });


  /* ----------------------------------------
     3. COUNTDOWN TIMER
     ---------------------------------------- */
  // ✏️ SET YOUR WEDDING DATE HERE
  const weddingDate = new Date('2026-11-30T20:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('days').textContent    = '🎉';
      document.getElementById('hours').textContent   = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById('days').textContent    = String(days).padStart(3, '0');
    document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ----------------------------------------
     4. PARALLAX EFFECT ON HERO
     ---------------------------------------- */
  const hero = document.getElementById('hero');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const heroContent = hero.querySelector('.hero-content');
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.6;
    }
  }, { passive: true });


  /* ----------------------------------------
     5. NAVBAR PROGRESS (Scroll Indicator)
     ---------------------------------------- */
  // Optional: creates a tiny progress bar at the very top of the page
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #d4a853, #c97b7b, #b08968);
    z-index: 9999;
    transition: width 0.1s linear;
    width: 0%;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });


  /* ----------------------------------------
     6. RSVP FORM HANDLER
     ---------------------------------------- */
  const rsvpForm = document.getElementById('rsvpForm');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name       = document.getElementById('guestName').value;
    const attendance = document.getElementById('attendance').value;
    const guests     = document.getElementById('guests').value;
    const message    = document.getElementById('message').value;

    // Replace this with your actual form submission logic
    // e.g., send to a backend API, Google Sheets, Firebase, etc.
    console.log('RSVP Submitted:', { name, attendance, guests, message });

    // Show confirmation
    const btn = rsvpForm.querySelector('.rsvp-btn');
    btn.textContent = '✓ Accepted';
    btn.classList.add('accepted');
    btn.disabled = true;

    // Create a confirmation message
    const confirmMsg = document.createElement('p');
    confirmMsg.textContent = `Thank you, ${name}! Your RSVP has been received.`;
    confirmMsg.style.cssText = `
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      color: #6b9a6b;
      margin-top: 15px;
      font-style: italic;
      animation: fadeInMsg 0.5s ease forwards;
    `;
    rsvpForm.appendChild(confirmMsg);

    // Add the fade-in animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInMsg {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    // Reset after a while so the user could try again if needed
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
      confirmMsg.remove();
      rsvpForm.reset();
    }, 5000);
  });


  /* ----------------------------------------
     7. SMOOTH REVEAL FOR HERO CONTENT
        (triggers immediately, re-hides on scroll away)
     ---------------------------------------- */
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('active');
    });
  }, 300);

});
