/**
 * CLYRO LABS - MAIN JAVASCRIPT
 * Handles navigation, animations, and interactivity
 */

// Import particles
import './particles.js';

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// =============================================
// MOBILE MENU
// =============================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navMenu?.querySelectorAll('.header-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// =============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// =============================================
const animatedElements = document.querySelectorAll('.animate-fade-up');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optionally unobserve after animation
            // animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

animatedElements.forEach(element => {
    animationObserver.observe(element);
});

// =============================================
// NEWSLETTER FORM
// =============================================
const newsletterForm = document.getElementById('newsletter-form');
const ctaForm = document.getElementById('cta-form');

// Helper to open mailto
function openMailTo(email) {
    const subject = encodeURIComponent("Interesse em Transformar Negócio (Clyro Labs)");
    const body = encodeURIComponent(`Olá,\n\nGostaria de saber mais sobre as soluções da Clyro Labs.\n\nMeu email para contato é: ${email}\n\nAtenciosamente,`);
    window.location.href = `mailto:contato@clyrolabs.tech?subject=${subject}&body=${body}`;
}

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('.input-email');
        const email = emailInput.value.trim();

        if (email && isValidEmail(email)) {
            // Since this is a newsletter, maybe just toast or also mailto?
            // For now, let's keep the toast.
            showToast('Inscrito com sucesso! 🎉', 'success');
            emailInput.value = '';
        } else {
            showToast('Por favor, insira um e-mail válido.', 'error');
        }
    });
}

if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = ctaForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (email && isValidEmail(email)) {
            // Open Modal instead of direct mailto
            openContactModal(email);
        } else {
            showToast('Por favor, insira um e-mail válido.', 'error');
        }
    });
}

// =============================================
// MODAL LOGIC
// =============================================
const modal = document.getElementById('contact-modal');
const modalCloseBtn = document.querySelector('.modal-close');
const modalForm = document.getElementById('modal-form');
const modalEmailInput = document.getElementById('modal-email');

function openContactModal(email) {
    if (modal && modalEmailInput) {
        modalEmailInput.value = email;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeContactModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close Modal Events
modalCloseBtn?.addEventListener('click', closeContactModal);
modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeContactModal();
});

// Handle Modal Submission (AJAX to FormSubmit)
if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = modalForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        const formData = new FormData(modalForm);

        // Add recommended FormSubmit configuration
        // Subject is now handled by a hidden input field in the HTML form.
        formData.append('_captcha', 'false');
        formData.append('_template', 'box'); // Usando template 'box' para layout mais profissional

        // FormSubmit automatically creates a header with the data.
        // To include the Logo, usually one needs the paid version or dashboard config,
        // but 'box' is the cleanest free option available via code.

        fetch("https://formsubmit.co/ajax/contato@clyrolabs.tech", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                showToast('Solicitação enviada com sucesso!', 'success');
                closeContactModal();
                modalForm.reset();
                if (ctaForm) ctaForm.reset();
            })
            .catch(error => {
                console.error('Erro no envio:', error);
                showToast('Erro ao enviar. Tente novamente mais tarde.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;

    // Add styles dynamically
    toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
    color: white;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    animation: slideInRight 0.3s ease;
    backdrop-filter: blur(10px);
  `;

    document.body.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(100px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100px); }
  }
`;
document.head.appendChild(style);

// =============================================
// ACTIVE NAVIGATION INDICATOR
// =============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// =============================================
// BUTTON RIPPLE EFFECT
// =============================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();

        ripple.style.cssText = `
      position: absolute;
      width: 100px;
      height: 100px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      pointer-events: none;
      animation: rippleEffect 0.6s linear;
    `;
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleEffect {
    to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// =============================================
// PILLAR CARDS TILT EFFECT
// =============================================
const cards = document.querySelectorAll('.pillar-card, .solution-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// =============================================
// WHATSAPP WIDGET LOGIC
// =============================================
const waFloatBtn = document.getElementById('wa-float-btn');
const waChatWindow = document.getElementById('wa-chat-window');
const waCloseBtn = document.getElementById('wa-close-btn');

function toggleChat() {
    if (waChatWindow) {
        waChatWindow.classList.toggle('active');
    }
}

// Add event listeners with null checks
if (waFloatBtn) {
    waFloatBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent immediate closing if clicking the button triggers document click
        toggleChat();
    });
}

if (waCloseBtn) {
    waCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChat();
    });
}

// Close chat when clicking outside
document.addEventListener('click', (e) => {
    if (waChatWindow && waChatWindow.classList.contains('active')) {
        if (!waChatWindow.contains(e.target) && !waFloatBtn.contains(e.target)) {
            waChatWindow.classList.remove('active');
        }
    }
});

// =============================================
// INITIALIZE ON LOAD
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll check
    handleNavbarScroll();
    highlightNavLink();

    // Add loaded class to body for fade-in effect
    document.body.classList.add('loaded');

    console.log('🚀 Clyro Labs Clone initialized successfully!');
});
