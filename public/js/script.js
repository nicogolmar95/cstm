// ========== TYPING ==========
const typedEl = document.getElementById('typedText');
const words = ['a medida.', 'que escalan.', 'que resuelven.'];
let wordIdx = 0, charIdx = 0, deleting = false;
function type() {
    const w = words[wordIdx];
    if (!deleting) {
        typedEl.textContent = w.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === w.length) { deleting = true; setTimeout(type, 2000); return; }
        setTimeout(type, 70);
    } else {
        typedEl.textContent = w.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; setTimeout(type, 400); return; }
        setTimeout(type, 35);
    }
}
setTimeout(type, 600);

// ========== NAV SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
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

// ========== SCROLL ANIMATIONS ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.service-card, .process-card, .tech-category, .channel, .fade-in').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ========== FORM ==========
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
    submitBtn.textContent = 'Enviando...';
    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (json.ok) {
            formMsg.textContent = 'Mensaje enviado. Te respondemos en menos de 24hs.';
            formMsg.className = 'form-message success';
            form.reset();
            showToast('Mensaje enviado', 'success');
        } else {
            formMsg.textContent = json.msg || 'Error al enviar.';
            formMsg.className = 'form-message error';
        }
    } catch {
        formMsg.textContent = 'Error de conexion.';
        formMsg.className = 'form-message error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
    }
});

function showToast(msg, type) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    setTimeout(() => t.className = 'toast', 3500);
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const el = document.querySelector(a.getAttribute('href'));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
