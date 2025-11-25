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

// Fetch GitHub Languages
async function fetchGitHubLanguages() {
    const container = document.getElementById('github-languages');
    
    try {
        // Vérifier le cache localStorage
        const cachedData = localStorage.getItem('github_languages_cache');
        const cacheTime = localStorage.getItem('github_languages_cache_time');
        const now = Date.now();
        
        // Utiliser le cache s'il existe et qu'il n'est pas expiré (4 heures)
        if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 4 * 60 * 60 * 1000) {
            displayLanguages(JSON.parse(cachedData), container);
            return;
        }
        
        // Récupérer les repos avec seulement les champs nécessaires
        const reposResponse = await fetch(
            'https://api.github.com/users/ANome1/repos?sort=stars&per_page=50&type=public',
            { signal: AbortSignal.timeout(5000) } // Timeout de 5 secondes
        );
        
        if (!reposResponse.ok) {
            throw new Error(`Erreur API: ${reposResponse.status}`);
        }
        
        const repos = await reposResponse.json();
        
        if (!Array.isArray(repos)) {
            throw new Error('Réponse invalide');
        }
        
        // Compter les langages
        const languageCounts = {};
        
        for (const repo of repos) {
            if (repo.language && repo.language !== null) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
        }
        
        // Trier par fréquence et garder les 6 meilleurs
        const sortedLangs = Object.entries(languageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
        
        // Sauvegarder en cache
        localStorage.setItem('github_languages_cache', JSON.stringify(sortedLangs));
        localStorage.setItem('github_languages_cache_time', now.toString());
        
    } catch (error) {
        console.error('Erreur lors de la récupération des langages:', error);
        container.innerHTML = '<div class="language-error">Impossible de charger les langages GitHub</div>';
    }
}

// Fonction pour afficher les langages
function displayLanguages(sortedLangs, container) {
    if (sortedLangs.length === 0) {
        container.innerHTML = '<div class="language-error">Aucun langage trouvé</div>';
        return;
    }
    
    // Couleurs pour chaque langage
    const langColors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Go': '#00add8',
        'Python': '#3572a5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Java': '#b07219',
        'C': '#555555',
        'C++': '#f34b7d',
        'C#': '#239120',
        'Ruby': '#cc342d',
        'PHP': '#777bb4',
        'Swift': '#fa7343',
        'Kotlin': '#7f52ff',
        'Rust': '#ce422b',
        'Shell': '#89e051',
        'Objective-C': '#438eff'
    };
    
    // Créer le HTML
    let html = '<div class="languages-list">';
    
    // Barre de progression
    html += '<div class="languages-bar">';
    const total = sortedLangs.reduce((sum, [, count]) => sum + count, 0);
    
    sortedLangs.forEach(([lang, count]) => {
        const percentage = (count / total) * 100;
        const color = langColors[lang] || '#8b5cf6';
        html += `<div class="lang-bar-segment" style="width: ${percentage}%; background-color: ${color};" title="${lang}: ${count} repos"></div>`;
    });
    
    html += '</div>';
    
    // Liste des langages
    html += '<div class="languages-details">';
    sortedLangs.forEach(([lang, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const color = langColors[lang] || '#8b5cf6';
        html += `
            <div class="language-item">
                <span class="lang-color" style="background-color: ${color};"></span>
                <span class="lang-name">${lang}</span>
                <span class="lang-percentage">${percentage}%</span>
            </div>
        `;
    });
    html += '</div>';
    html += '</div>';
    
    container.innerHTML = html;
}

// Charger les langages au chargement de la page
document.addEventListener('DOMContentLoaded', fetchGitHubLanguages);
