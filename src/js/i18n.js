import translations from './translations.js';

class I18nManager {
    constructor() {
        this.currentLang = localStorage.getItem('clyro-lang') || 'pt-br';
        this.init();
    }

    init() {
        this.renderSelector();
        this.applyTranslations();
        this.setupEventListeners();
    }

    renderSelector() {
        const headerContent = document.querySelector('.header-content');
        const headerCta = document.querySelector('.header-cta');
        
        if (!headerContent || !headerCta) return;

        const selectorHtml = `
            <div class="language-selector" id="language-selector">
                <button class="lang-toggle" id="lang-toggle" aria-label="Select Language">
                    <img src="/images/flags/${this.getFlagCode(this.currentLang)}.png" alt="${this.currentLang}" class="lang-flag" id="current-flag">
                </button>
                <div class="lang-dropdown" id="lang-dropdown">
                    <div class="lang-option" data-lang="pt-br">
                        <img src="/images/flags/br.png" alt="PT-BR">
                        <span>Português</span>
                    </div>
                    <div class="lang-option" data-lang="en">
                        <img src="/images/flags/en.png" alt="EN">
                        <span>English</span>
                    </div>
                    <div class="lang-option" data-lang="es">
                        <img src="/images/flags/es.png" alt="ES">
                        <span>Español</span>
                    </div>
                    <div class="lang-option" data-lang="cn">
                        <img src="/images/flags/cn.png" alt="CN">
                        <span>中文</span>
                    </div>
                    <div class="lang-option" data-lang="ar">
                        <img src="/images/flags/ar.png" alt="AR">
                        <span>العربية</span>
                    </div>
                </div>
            </div>
        `;

        // Insert before header-cta
        headerCta.insertAdjacentHTML('beforebegin', selectorHtml);
    }

    getFlagCode(lang) {
        const codes = {
            'pt-br': 'br',
            'en': 'en',
            'es': 'es',
            'cn': 'cn',
            'ar': 'ar'
        };
        return codes[lang] || 'br';
    }

    setupEventListeners() {
        const toggle = document.getElementById('lang-toggle');
        const dropdown = document.getElementById('lang-dropdown');
        const options = document.querySelectorAll('.lang-option');

        toggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown?.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            dropdown?.classList.remove('active');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                this.changeLanguage(lang);
            });
        });
    }

    changeLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        localStorage.setItem('clyro-lang', lang);
        
        // Update flag in toggle
        const currentFlag = document.getElementById('current-flag');
        if (currentFlag) {
            currentFlag.src = `/images/flags/${this.getFlagCode(lang)}.png`;
            currentFlag.alt = lang;
        }

        // Apply RTL if Arabic
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;

        this.applyTranslations();
    }

    applyTranslations() {
        const langData = translations[this.currentLang];
        if (!langData) return;

        // Data attributes for elements that need translation
        // We will add [data-i18n="key"] to HTML elements
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                el.innerHTML = langData[key];
            }
        });

        // Specific cases for text with icons
        const heroBadge = document.querySelector('.hero-badge');
        if (heroBadge && langData['hero_badge']) {
            heroBadge.childNodes[2].textContent = ` ${langData['hero_badge']}`;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new I18nManager();
});
