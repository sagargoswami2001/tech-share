// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== PARTICLES =====
const pc = document.getElementById('particles');
const pcColors = ['#4f8ef7','#a855f7','#22d3a2','#f97316','#eab308'];
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const s = Math.random() * 4 + 1.5;
  p.style.cssText = `width:${s}px;height:${s}px;background:${pcColors[Math.floor(Math.random()*pcColors.length)]};left:${Math.random()*100}%;animation-duration:${Math.random()*12+8}s;animation-delay:${Math.random()*10}s;`;
  pc.appendChild(p);
}

// ===== TERMINAL =====
const cmds = [
  { cmd: 'ssh sagar@techshare-server', out: ['Welcome to Tech Share Training Center!', 'Last login: Tue Apr 22 09:00:00 2026'] },
  { cmd: 'kubectl get nodes', out: ['NAME           STATUS   ROLES    AGE', 'master-node    Ready    control  5d', 'worker-node1   Ready    <none>   5d'] },
  { cmd: 'docker run -d nginx:alpine', out: ['Pulling nginx:alpine...', 'Container started: a1b2c3d4e5'] },
  { cmd: 'terraform apply -auto-approve', out: ['Plan: 4 to add, 0 to change', 'Apply complete! 4 resources added.'] },
  { cmd: 'aws ec2 describe-instances --region ap-south-1', out: ['InstanceId: i-0abc123def456', 'State: running | Type: t3.micro'] },
  { cmd: 'systemctl status nginx && ufw status', out: ['● nginx.service: active (running)', 'Status: active (4 rules)'] },
  { cmd: 'python3 -c "print(\'Hello DevOps!\')"', out: ['Hello DevOps!'] },
];
const termBody = document.getElementById('termBody');
let ci = 0;

function typeCmd(text, cb) {
  const line = termBody.querySelector('.tl:last-child');
  const tc = line.querySelector('.tc');
  let i = 0;
  const iv = setInterval(() => {
    if (i < text.length) { tc.textContent += text[i++]; }
    else { clearInterval(iv); line.querySelector('.tcur').style.display = 'none'; setTimeout(cb, 350); }
  }, 50);
}

function addOut(lines, cb) {
  lines.forEach((l, idx) => {
    setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'to'; d.textContent = l;
      termBody.appendChild(d);
      termBody.scrollTop = termBody.scrollHeight;
      if (idx === lines.length - 1) setTimeout(cb, 500);
    }, idx * 100);
  });
}

function newPrompt() {
  const d = document.createElement('div');
  d.className = 'tl';
  d.innerHTML = '<span class="tp">sagar@techshare:~$</span> <span class="tc"></span><span class="tcur">▌</span>';
  termBody.appendChild(d);
  termBody.scrollTop = termBody.scrollHeight;
}

function runCmd() {
  const { cmd, out } = cmds[ci % cmds.length]; ci++;
  typeCmd(cmd, () => {
    addOut(out, () => {
      const all = termBody.querySelectorAll('.tl,.to');
      if (all.length > 12) Array.from(all).slice(0, all.length - 10).forEach(el => el.remove());
      newPrompt();
      setTimeout(runCmd, 1000);
    });
  });
}
setTimeout(runCmd, 800);

// ===== COUNTER =====
function animCount(el, target, dur = 1400) {
  let start;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ===== SCROLL REVEAL + COUNTERS =====
let counted = false;
const revEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
revEls.forEach(el => ro.observe(el));

const aboutSection = document.getElementById('about');
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-n').forEach(el => animCount(el, parseInt(el.dataset.target)));
    }
  });
}, { threshold: 0.4 });
if (aboutSection) co.observe(aboutSection);

// ===== TESTIMONIAL SLIDER =====
let curSlide = 0;
const tCards = document.querySelectorAll('.tcard');
const tDots = document.querySelectorAll('.tdot');

function goSlide(n) {
  tCards[curSlide].classList.remove('active');
  tDots[curSlide].classList.remove('active');
  curSlide = n;
  tCards[curSlide].classList.add('active');
  tDots[curSlide].classList.add('active');
}

setInterval(() => goSlide((curSlide + 1) % tCards.length), 4500);

// ===== IST TIMESTAMP HELPER =====
function getISTTime() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' IST';
}

// ===== CONTACT FORM (Formspree → sagargoswami7417@gmail.com) =====
const cform = document.getElementById('cform');
const fsuccess = document.getElementById('fsuccess');
if (cform) {
  cform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('fsubmit');
    btn.textContent = 'Sending... ⏳'; btn.disabled = true;

    const data = new FormData(cform);
    // Inject IST timestamp so it appears in every Formspree email
    data.append('enquiry_time_IST', getISTTime());

    try {
      const res = await fetch('https://formspree.io/f/xgorndjy', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        fsuccess.style.display = 'block';
        fsuccess.textContent = '✅ Enquiry sent! Sagar sir will reply within 24 hours.';
        cform.reset();
        setTimeout(() => { fsuccess.style.display = 'none'; }, 7000);
      } else {
        const name = data.get('name') || '';
        const email = data.get('email') || '';
        const course = data.get('course') || '';
        const msg = data.get('message') || '';
        const subject = encodeURIComponent('New Enquiry from Tech Share Website');
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nCourse: ${course}\nMessage: ${msg}\nTime (IST): ${getISTTime()}`);
        window.location.href = `mailto:sagargoswami7417@gmail.com?subject=${subject}&body=${body}`;
      }
    } catch {
      const name = data.get('name') || '';
      const course = data.get('course') || '';
      const subject = encodeURIComponent('New Enquiry from Tech Share Website');
      const body = encodeURIComponent(`Name: ${name}\nCourse: ${course}\nTime (IST): ${getISTTime()}`);
      window.location.href = `mailto:sagargoswami7417@gmail.com?subject=${subject}&body=${body}`;
    }
    btn.textContent = 'Send Enquiry 🚀'; btn.disabled = false;
  });
}

// ===== ACTIVE NAV HIGHLIGHT =====
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${cur}` ? '#fff' : '';
  });
});

// ===== HERO IMAGE FALLBACK =====
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  heroImg.onerror = () => {
    heroImg.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px';
    placeholder.innerHTML = '<div style="font-size:5rem">👨‍💻</div><div style="color:#7f93b0;font-size:0.9rem;text-align:center">Sagar Goswami<br>Tech Share Instructor</div>';
    heroImg.parentElement.appendChild(placeholder);
  };
}

// ===== FAQ ACCORDION =====
function toggleFaq(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ===== FREE DOWNLOAD FORM =====
const dlForm = document.getElementById('dl-form');
const dlSuccess = document.getElementById('dl-success');
if (dlForm) {
  dlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('dl-btn');
    btn.textContent = 'Preparing... ⏳'; btn.disabled = true;
    const data = new FormData(dlForm);
    // Inject IST timestamp
    data.append('download_time_IST', getISTTime());
    try {
      await fetch('https://formspree.io/f/xgorndjy', {
        method: 'POST', body: data,
        headers: { 'Accept': 'application/json' }
      });
    } catch(err) { /* still open brochure */ }
    window.open('brochure.html', '_blank');
    dlSuccess.style.display = 'block';
    dlForm.reset();
    btn.textContent = '📥 Download Brochure Free'; btn.disabled = false;
    setTimeout(() => { dlSuccess.style.display = 'none'; }, 7000);
  });
}
