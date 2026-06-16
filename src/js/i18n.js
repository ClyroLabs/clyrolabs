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

        // Update basic text content
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (langData[key]) {
                // If it has children (icons etc), we might need to be careful
                // For now, let's assume if it's a simple key we replace innerHTML
                el.innerHTML = langData[key];
            }
        });

        // Update placeholders
        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(input => {
            const key = input.getAttribute('data-i18n-placeholder');
            if (langData[key]) {
                input.placeholder = langData[key];
            }
        });

        // Update meta tags and other content attributes
        const metaElements = document.querySelectorAll('[data-i18n-content]');
        metaElements.forEach(el => {
            const key = el.getAttribute('data-i18n-content');
            if (langData[key]) {
                el.setAttribute('content', langData[key]);
            }
        });

        // Update document title if key exists
        if (langData['site_title']) {
            document.title = langData['site_title'];
        }

        // Special handling for elements with nested structure (like icons)
        this.handleSpecialElements(langData);
    }

    handleSpecialElements(langData) {
        // Hero badge (preserving the emoji/icon if it's there, but we added i18n to span mostly)
        const heroBadge = document.querySelector('.hero-badge');
        if (heroBadge && langData['hero_badge']) {
            // Find the text node after the emoji
            const textNode = Array.from(heroBadge.childNodes).find(node => node.nodeType === 3 && node.textContent.trim().length > 0);
            if (textNode) {
                textNode.textContent = ` ${langData['hero_badge']}`;
            }
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new I18nManager();
});
