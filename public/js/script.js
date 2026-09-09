// ========== TYPING EFFECT ==========
const typedEl = document.getElementById('typedText');
const words = ['que escalan.', 'que resuelven.', 'a medida.', 'que impactan.'];
let wordIdx = 0, charIdx = 0, deleting = false;

function type() {
    const current = words[wordIdx];
    if (!deleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
        setTimeout(type, 80);
    } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 400); return; }
        setTimeout(type, 40);
    }
}
setTimeout(type, 800);

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ========== MOBILE NAV ==========
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ========== STAT COUNTER ==========
function animateStats() {
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = +el.dataset.target;
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}

// ========== SCROLL ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stat')) animateStats();
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .process-step, .stack-item, .info-card, .fade-in').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Stats observed separately
document.querySelectorAll('.stat').forEach(el => observer.observe(el));

// ========== CONTACT FORM ==========
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMsg.className = 'form-message';
    formMsg.style.display = 'none';

    const data = {
        nombre: form.nombre.value.trim(),
        email: form.email.value.trim(),
        empresa: form.empresa.value.trim(),
        telefono: form.telefono.value.trim(),
        mensaje: form.mensaje.value.trim()
    };

    if (!data.nombre || !data.email || !data.mensaje) {
        formMsg.textContent = 'Completa los campos obligatorios.';
        formMsg.className = 'form-message error';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Enviando...';

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.ok) {
            formMsg.textContent = 'Mensaje enviado. Te respondo en menos de 24hs.';
            formMsg.className = 'form-message success';
            form.reset();
            showToast('Mensaje enviado correctamente', 'success');
        } else {
            formMsg.textContent = json.msg || 'Error al enviar. Intenta de nuevo.';
            formMsg.className = 'form-message error';
        }
    } catch (err) {
        formMsg.textContent = 'Error de conexion. Intenta de nuevo.';
        formMsg.className = 'form-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Enviar mensaje';
    }
});

// ========== TOAST ==========
function showToast(msg, type) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast ' + type + ' show';
    setTimeout(() => { toast.className = 'toast'; }, 3500);
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
