/**
 * Mohit Srivastav - Ultra-Animated Cyber Portfolio Engine
 * Version: 2.0.0 (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSoundEngine();
  initCustomCursor();
  initParticleCanvas();
  initTypingEffect();
  initThemeToggle();
  initNavbarScroll();
  initMobileMenu();
  initSkillsFilter();
  initUniversal3DTilt();
  initMagneticElements();
  initCountersAndBars();
  initResumeActions();
  initContactForm();
  initBackToTop();
  initScrollAnimations();
});

/* ==========================================================================
   1. Procedural Web Audio Synthesizer (Sci-Fi UI Sound Effects)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');

  // Check saved audio preference
  const savedSound = localStorage.getItem('mohit_portfolio_sound');
  if (savedSound !== null) {
    soundEnabled = savedSound === 'true';
    updateSoundIcon(soundIcon);
  }

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.playUiSound = function(type = 'hover') {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.06);
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('mohit_portfolio_sound', soundEnabled);
      updateSoundIcon(soundIcon);
      if (soundEnabled) {
        window.playUiSound('success');
        showToast('Sound Effects Enabled 🔊', 'info');
      } else {
        showToast('Sound Effects Muted 🔇', 'info');
      }
    });
  }

  function updateSoundIcon(icon) {
    if (!icon) return;
    if (soundEnabled) {
      icon.className = 'fa-solid fa-volume-high';
      icon.style.color = 'var(--accent-cyan)';
    } else {
      icon.className = 'fa-solid fa-volume-xmark';
      icon.style.color = 'var(--text-muted)';
    }
  }

  // Attach sound to interactive elements
  document.querySelectorAll('a, button, .filter-tab, .chip, .skill-card, .project-card').forEach((el) => {
    el.addEventListener('mouseenter', () => window.playUiSound('hover'));
    el.addEventListener('click', () => window.playUiSound('click'));
  });
}

/* ==========================================================================
   2. Custom Cyber Glowing Cursor & Spark Trail Physics
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const trail = document.getElementById('cursor-trail');
  const canvas = document.getElementById('cursor-canvas');
  if (!cursor || !trail || !canvas || window.innerWidth < 768) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let trailX = mouseX;
  let trailY = mouseY;

  const sparks = [];

  class Spark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.alpha = 1;
      this.color = Math.random() > 0.5 ? '#00f2fe' : '#8b5cf6';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.035;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.alpha, 0);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;

    if (Math.random() > 0.6) {
      sparks.push(new Spark(mouseX, mouseY));
    }
  });

  window.addEventListener('click', (e) => {
    // Spawn spark burst on click
    for (let i = 0; i < 18; i++) {
      sparks.push(new Spark(e.clientX, e.clientY));
    }
  });

  // Smooth lerp for outer trail
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;

    trail.style.left = `${trailX}px`;
    trail.style.top = `${trailY}px`;

    // Render Canvas Sparks
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = sparks.length - 1; i >= 0; i--) {
      sparks[i].update();
      sparks[i].draw();
      if (sparks[i].alpha <= 0) {
        sparks.splice(i, 1);
      }
    }

    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hover detection
  const interactiveSelectors = 'a, button, .filter-tab, .chip, .skill-card, .project-card, .tilt-card';
  document.querySelectorAll(interactiveSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. Interactive Neural Network Canvas & Shooting Stars
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 85);
  const particles = [];
  const shootingStars = [];

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1;
      this.vx = (Math.random() - 0.5) * 0.85;
      this.vy = (Math.random() - 0.5) * 0.85;
      this.baseColor = Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gravity attraction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 2.8;
          const dirY = (dy / dist) * force * 2.8;
          this.x += dirX;
          this.y += dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.fillStyle = this.baseColor + (isDark ? '0.75)' : '0.45)');
      ctx.fill();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = 0;
      this.len = Math.random() * 80 + 40;
      this.speed = Math.random() * 8 + 6;
      this.size = Math.random() * 1.5 + 0.8;
      this.angle = Math.PI / 4; // 45 degrees diagonal
      this.active = true;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      if (this.x > width || this.y > height) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      ctx.save();
      const grad = ctx.createLinearGradient(
        this.x,
        this.y,
        this.x - Math.cos(this.angle) * this.len,
        this.y - Math.sin(this.angle) * this.len
      );
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.9)');
      grad.addColorStop(1, 'rgba(139, 92, 246, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = this.size;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - Math.cos(this.angle) * this.len,
        this.y - Math.sin(this.angle) * this.len
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Periodic shooting stars
  setInterval(() => {
    if (Math.random() > 0.4 && shootingStars.length < 3) {
      shootingStars.push(new ShootingStar());
    }
  }, 2400);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? 'rgba(0, 242, 254, ' : 'rgba(0, 114, 255, ';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * (isDark ? 0.28 : 0.16);
          ctx.beginPath();
          ctx.strokeStyle = lineColor + opacity + ')';
          ctx.lineWidth = 0.85;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      shootingStars[i].update();
      shootingStars[i].draw();
      if (!shootingStars[i].active) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. Dynamic Typing Text Animation
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'IT & Web Development Professional',
    'Logistics & SAP ERP Specialist',
    'IIT Indore Web Certified Developer',
    'Advanced Excel & MIS Specialist',
    'Modern Frontend Engineer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1900;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   5. Dark / Light Theme Toggle with LocalStorage
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const savedTheme = localStorage.getItem('mohit_portfolio_theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mohit_portfolio_theme', newTheme);

    showToast(`Switched to ${newTheme.toUpperCase()} theme`, 'info');
  });
}

/* ==========================================================================
   6. Navbar Scroll & Active Section Highlighting
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = menuToggle.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   8. Skills Filter Matrix
   ========================================================================== */
function initSkillsFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92) translateY(20px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1) translateY(0)';
          }, 60);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   9. Universal 3D Tilt with Specular Glare on Cards
   ========================================================================== */
function initUniversal3DTilt() {
  if (window.innerWidth < 768) return;
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   10. Magnetic Physics on Hover Targets
   ========================================================================== */
function initMagneticElements() {
  if (window.innerWidth < 1024) return;
  const targets = document.querySelectorAll('.magnetic-target');

  targets.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.4s ease';
    });

    el.addEventListener('mouseenter', () => {
      el.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   11. Smooth Counting Numbers & Animated Progress Bars
   ========================================================================== */
function initCountersAndBars() {
  const counters = document.querySelectorAll('.counter');
  const progressBars = document.querySelectorAll('.animated-bar');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          const targetValue = parseFloat(targetEl.getAttribute('data-target'));
          const isDecimal = targetEl.getAttribute('data-decimal') === '1';

          let current = 0;
          const duration = 1800; // ms
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = targetValue / steps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= targetValue) {
              current = targetValue;
              clearInterval(timer);
            }
            targetEl.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
          }, stepTime);

          counterObserver.unobserve(targetEl);
        }
      });
    },
    { threshold: 0.2 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  // Progress bars filling
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-progress');
          bar.style.width = targetWidth;
          barObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.2 }
  );

  progressBars.forEach((bar) => barObserver.observe(bar));
}

/* ==========================================================================
   12. Resume Print & Copy Actions
   ========================================================================== */
function initResumeActions() {
  const printBtn = document.getElementById('print-resume-btn');
  const copyBtn = document.getElementById('copy-resume-text-btn');

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = `MOHIT SRIVASTAV
Ballabgarh, Haryana | +91 7236021681 | Srivastavmohit381@gmail.com
LinkedIn: linkedin.com/in/mohit-srivastav-757166382
GitHub: github.com/srivastavmohit381-max

PROFESSIONAL SUMMARY:
Motivated IT and Web Development professional with 1 year and 8 months of experience in logistics, store operations, export documentation, and ERP-based processes. Skilled in Advanced Excel, hardware troubleshooting, Windows/Linux installation, and HTML/CSS/JavaScript. Currently expanding expertise in modern web development.

CORE SKILLS:
- HTML5, CSS3, JavaScript (ES6+)
- Advanced Excel (VLOOKUP, Pivot Tables, Lookup Functions, Reports)
- ERP Systems, SAP Transactions, Export Documentation, Logistics Coordination
- Windows/Linux Installation & Hardware Troubleshooting
- GitHub, Vercel, Firebase Deployment
- Data Entry, MIS Reporting, Communication & Time Management

PROFESSIONAL EXPERIENCE:
1. Logistics Executive | Tecumseh Products India Pvt. Ltd. | Dec 2025 – Present
- Manage export shipments from booking to port delivery.
- Prepare Invoice, Packing List, Bill of Lading, Certificate of Origin and related documents.
- Coordinate with shipping lines, CHA and transporters.
- Maintain shipment trackers and Excel reports using VLOOKUP and Pivot Tables.

2. Store Assistant | Bony Polymers Pvt. Ltd. | Jan 2025 – Nov 2025
- Maintained GRN, Gate Entry and Material Issue records.
- Handled SAP ERP stock transactions.
- Prepared MIS reports and coordinated with Accounts and Purchase teams.

EDUCATION:
- B.Sc. (Zoology & Botany) - Moti Harishchandra Mahavidyalaya, Azamgarh / Maharaja Suhel Dev State University
- Class 12 (2024)

CERTIFICATIONS:
- Web Development Foundation Course – IIT Indore
- Diploma in Information Technology (DIT) – Shashi Chandra Computer Institute`;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const copyBtnText = document.getElementById('copy-btn-text');
        if (copyBtnText) copyBtnText.textContent = 'Copied to Clipboard!';
        showToast('Resume text copied to clipboard successfully!', 'success');
        if (window.playUiSound) window.playUiSound('success');
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy Plain Text';
        }, 3000);
      });
    });
  }
}

/* ==========================================================================
   13. Contact Form & WhatsApp Integration
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const whatsappBtn = document.getElementById('send-whatsapp-btn');
  const alertBox = document.getElementById('form-status-alert');

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const name = document.getElementById('form-name')?.value.trim() || 'Colleague / Recruiter';
      const email = document.getElementById('form-email')?.value.trim() || 'N/A';
      const subject = document.getElementById('form-subject')?.value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('form-message')?.value.trim() || 'Hello Mohit, I would like to connect with you!';

      const text = `*New Inquiry from Portfolio Website*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Subject:* ${encodeURIComponent(subject)}%0A*Message:* ${encodeURIComponent(message)}`;
      const url = `https://wa.me/917236021681?text=${text}`;
      window.open(url, '_blank');
      showToast('Opening WhatsApp with your message...', 'info');
      if (window.playUiSound) window.playUiSound('success');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-form-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
      }

      setTimeout(() => {
        if (alertBox) {
          alertBox.className = 'form-alert success';
          alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been prepared. Mohit will get back to you shortly.';
          alertBox.style.display = 'flex';
        }

        showToast('Message sent successfully!', 'success');
        if (window.playUiSound) window.playUiSound('success');
        form.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';
        }
      }, 1000);
    });
  }
}

/* ==========================================================================
   14. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   15. Scroll Animations (Lightweight Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) translateX(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach((el) => {
    const animType = el.getAttribute('data-animate');
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.75s cubic-bezier(0.4, 0, 0.2, 1), transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)';

    if (animType === 'fade-up') {
      el.style.transform = 'translateY(40px)';
    } else if (animType === 'fade-left') {
      el.style.transform = 'translateX(40px)';
    } else if (animType === 'fade-right') {
      el.style.transform = 'translateX(-40px)';
    } else {
      el.style.transform = 'translateY(30px)';
    }

    observer.observe(el);
  });
}

/* ==========================================================================
   16. Live Demo Modal Handlers
   ========================================================================== */
window.openDemoModal = function(type) {
  const modal = document.getElementById('demo-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  if (!modal || !body) return;
  if (window.playUiSound) window.playUiSound('click');

  if (type === 'logistics') {
    title.innerHTML = '<i class="fa-solid fa-ship"></i> Logistics & Export MIS Simulator';
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          Interactive mock simulator illustrating how Mohit manages export bookings, BL verification, and Excel tracker lookups.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px;">
          <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-cyan);">24 Containers</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Current Active Booking</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.4rem; font-weight: 800; color: #10b981;">100% Verified</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">COO & Statutory Docs</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 12px; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.4rem; font-weight: 800; color: #8b5cf6;">Nhava Sheva</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Primary Port of Loading</div>
          </div>
        </div>

        <div style="background: var(--bg-primary); padding: 16px; border-radius: 8px; border: 1px solid var(--border-color);">
          <div style="font-weight: 700; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>Live Container Shipment Tracking</span>
            <span style="font-size: 0.75rem; color: var(--accent-emerald);"><i class="fa-solid fa-circle-dot"></i> Live Feed</span>
          </div>
          <table style="width: 100%; font-size: 0.82rem; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-muted);">
                <th style="padding: 6px;">Invoice / BL No.</th>
                <th style="padding: 6px;">Destination Port</th>
                <th style="padding: 6px;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px 6px; font-weight: 600;">EXP/2026/041</td>
                <td style="padding: 8px 6px;">Jebel Ali, UAE</td>
                <td style="padding: 8px 6px;"><span style="background: rgba(16,185,129,0.2); color: #10b981; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">ON VESSEL</span></td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 8px 6px; font-weight: 600;">EXP/2026/042</td>
                <td style="padding: 8px 6px;">Rotterdam, Netherlands</td>
                <td style="padding: 8px 6px;"><span style="background: rgba(234,179,8,0.2); color: #eab308; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">CUSTOMS CLEARANCE</span></td>
              </tr>
              <tr>
                <td style="padding: 8px 6px; font-weight: 600;">EXP/2026/043</td>
                <td style="padding: 8px 6px;">Hamburg, Germany</td>
                <td style="padding: 8px 6px;"><span style="background: rgba(0,242,254,0.2); color: var(--accent-cyan); padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">GATE-IN COMPLETED</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <button class="btn btn-primary btn-sm" onclick="closeDemoModal()" style="align-self: flex-end;">Close Simulator</button>
      </div>
    `;
  } else if (type === 'erp') {
    title.innerHTML = '<i class="fa-solid fa-boxes-stacked"></i> SAP ERP Store Management Simulator';
    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          Simulation of Mohit's core store assistant workflows at Bony Polymers: Goods Receipt Note (GRN), Gate Entry, and Stock Reconciliations.
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div style="background: var(--bg-tertiary); padding: 14px; border-radius: 8px;">
            <h4 style="font-size: 0.9rem; margin-bottom: 6px; color: var(--accent-cyan);"><i class="fa-solid fa-arrow-down-to-bracket"></i> Inward GRN Module</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Vendor PO verification, physical item count tallying, and system GRN generation.</p>
          </div>
          <div style="background: var(--bg-tertiary); padding: 14px; border-radius: 8px;">
            <h4 style="font-size: 0.9rem; margin-bottom: 6px; color: #8b5cf6;"><i class="fa-solid fa-arrow-up-from-bracket"></i> Material Issue Slip</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">Departmental requisition logging, inventory debit, and production line issue tracking.</p>
          </div>
        </div>

        <div style="background: var(--bg-primary); padding: 14px; border-radius: 8px; border: 1px solid var(--border-color);">
          <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 8px;">SAP Transaction Codes Executed:</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            <span style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 0.78rem;">MIGO (Goods Movement)</span>
            <span style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 0.78rem;">MB52 (Stock Overview)</span>
            <span style="background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 3px 8px; border-radius: 4px; font-family: monospace; font-size: 0.78rem;">ME23N (Purchase Orders)</span>
          </div>
        </div>

        <button class="btn btn-primary btn-sm" onclick="closeDemoModal()" style="align-self: flex-end;">Close Simulator</button>
      </div>
    `;
  }

  modal.style.display = 'flex';
};

window.closeDemoModal = function() {
  const modal = document.getElementById('demo-modal');
  if (modal) modal.style.display = 'none';
};

window.addEventListener('click', (e) => {
  const modal = document.getElementById('demo-modal');
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

/* ==========================================================================
   17. Toast Notification Helper
   ========================================================================== */
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--accent-cyan);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-25px)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

/* ==========================================================================
   18. Clipboard Copy Utility
   ========================================================================== */
window.copyToClipboard = function(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied "${text}" to clipboard!`, 'success');
    if (window.playUiSound) window.playUiSound('success');
    if (buttonElement) {
      const originalHtml = buttonElement.innerHTML;
      buttonElement.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
      setTimeout(() => {
        buttonElement.innerHTML = originalHtml;
      }, 2000);
    }
  });
};
