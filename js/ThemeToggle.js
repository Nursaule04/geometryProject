class ThemeToggle {
    constructor(toggleButtonId) {
        this.toggleButton = document.getElementById(toggleButtonId);
        this.body = document.body;
        this.sunIcon = document.getElementById('sun-icon');
        this.moonIcon = document.getElementById('moon-icon');
        this.themeKey = 'theme';

        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem(this.themeKey) || 'light';
        this.setTheme(savedTheme);

        this.toggleButton.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.body.classList.remove('light-theme', 'dark-theme');
        this.body.classList.add(`${theme}-theme`);

        // Toggle the visibility of sun and moon icons
        if (theme === 'light') {
            this.sunIcon.style.opacity = 1;
            this.moonIcon.style.opacity = 0;
        } else {
            this.sunIcon.style.opacity = 0;
            this.moonIcon.style.opacity = 1;
        }

        localStorage.setItem(this.themeKey, theme);
    }

    toggleTheme() {
        const currentTheme = this.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle('theme-toggle');
});