// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const themeIcon = document.getElementById('theme-icon');
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrollPercentage + '%';
});

// Scroll Reveal Animation
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(reveal => revealObserver.observe(reveal));

// Stagger Animation
const staggerItems = document.querySelectorAll('.stagger-item');
staggerItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
});

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
    });
});

// Contact Form Handler
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    const submitButton = this.querySelector('button[type="submit"]');
    const formStatus = document.querySelector('.form-status');
    const originalButtonText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    formStatus.textContent = '';
    
    try {
        const mailtoLink = `mailto:contact@prettyflacko.fr?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Nom: ${formData.name}\n` +
            `Email: ${formData.email}\n\n` +
            `Message:\n${formData.message}`
        )}`;
        
        window.location.href = mailtoLink;
        
        formStatus.textContent = '✓ Votre client mail va s\'ouvrir...';
        formStatus.style.color = 'var(--accent)';
        
        document.getElementById('contact-form').reset();
        
    } catch (error) {
        formStatus.textContent = '✗ Une erreur est survenue. Veuillez réessayer.';
        formStatus.style.color = 'var(--accent-2)';
    } finally {
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }, 2000);
    }
});
