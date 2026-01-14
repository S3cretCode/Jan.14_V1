/* ============================================
   ChargedUP: Main JavaScript
   Core functionality for all pages
   ============================================ */

(function () {
    'use strict';

    /* ============================================
       Constants
       ============================================ */
    const STORAGE_KEYS = {
        THEME: 'chargedup-theme',
        TEXT_SIZE: 'chargedup-text-size',
        CHEMISTRY_DATA: 'chargedup-chemistry-data'
    };

    /* ============================================
       Theme Management
       ============================================ */
    function initTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const savedTextSize = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE);
        if (savedTextSize) {
            document.documentElement.setAttribute('data-text-size', savedTextSize);
        }
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }

    function setTextSize(size) {
        if (size === 'default') {
            document.documentElement.removeAttribute('data-text-size');
            localStorage.removeItem(STORAGE_KEYS.TEXT_SIZE);
        } else {
            document.documentElement.setAttribute('data-text-size', size);
            localStorage.setItem(STORAGE_KEYS.TEXT_SIZE, size);
        }
    }

    /* ============================================
       Mobile Navigation
       ============================================ */
    function initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navList = document.querySelector('.nav__list');

        if (navToggle && navList) {
            navToggle.addEventListener('click', () => {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navToggle.classList.toggle('active');
                navList.classList.toggle('active');
            });

            // Close menu when clicking a link
            navList.querySelectorAll('.nav__link').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navList.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }

    /* ============================================
       Mode Toggle (Chemistry/Physics)
       ============================================ */
    function initModeToggle() {
        const modeButtons = document.querySelectorAll('.mode-toggle__btn');

        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;

                // Update button states
                modeButtons.forEach(b => {
                    b.classList.remove('mode-toggle__btn--active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('mode-toggle__btn--active');
                btn.setAttribute('aria-pressed', 'true');

                // Navigate to appropriate page
                if (mode === 'chemistry') {
                    window.location.href = 'chemistry.html';
                } else if (mode === 'physics') {
                    window.location.href = 'physics.html';
                }
            });
        });
    }

    /* ============================================
       Collapsible Sections (Show Work, Technical Notes)
       ============================================ */
    function initCollapsibles() {
        // Handle .show-work elements
        const showWorkHeaders = document.querySelectorAll('.show-work__header');

        showWorkHeaders.forEach(header => {
            // Set initial state
            const content = header.nextElementSibling;
            const toggle = header.querySelector('.show-work__toggle');
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            if (!isExpanded && content) {
                content.style.display = 'none';
            }

            header.style.cursor = 'pointer';
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');

            // Click handler
            header.addEventListener('click', () => {
                toggleShowWork(header, content, toggle);
            });

            // Keyboard handler
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleShowWork(header, content, toggle);
                }
            });
        });

        // Handle native <details> elements
        const detailsElements = document.querySelectorAll('details');
        detailsElements.forEach(details => {
            const summary = details.querySelector('summary');
            if (summary) {
                summary.style.cursor = 'pointer';
            }
        });
    }

    function toggleShowWork(header, content, toggle) {
        const isCurrentlyExpanded = header.getAttribute('aria-expanded') === 'true';
        const newState = !isCurrentlyExpanded;

        header.setAttribute('aria-expanded', newState);

        if (content) {
            if (newState) {
                content.style.display = 'block';
                // Animate in
                content.style.opacity = '0';
                content.style.transform = 'translateY(-10px)';
                requestAnimationFrame(() => {
                    content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                });
            } else {
                content.style.display = 'none';
            }
        }

        if (toggle) {
            if (newState) {
                toggle.textContent = 'Hide Details ▲';
            } else {
                toggle.textContent = toggle.textContent.includes('Work') ? 'Show Work ▼' : 'Show Details ▼';
            }
        }
    }

    /* ============================================
       Tooltips
       ============================================ */
    function initTooltips() {
        const tooltipTriggers = document.querySelectorAll('[data-tooltip]');

        tooltipTriggers.forEach(trigger => {
            const tooltipText = trigger.getAttribute('data-tooltip');

            trigger.addEventListener('mouseenter', (e) => {
                showTooltip(e.target, tooltipText);
            });

            trigger.addEventListener('mouseleave', () => {
                hideTooltip();
            });

            trigger.addEventListener('focus', (e) => {
                showTooltip(e.target, tooltipText);
            });

            trigger.addEventListener('blur', () => {
                hideTooltip();
            });
        });
    }

    function showTooltip(element, text) {
        hideTooltip(); // Remove any existing tooltip

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.id = 'active-tooltip';
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 8}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            background: var(--color-bg-tertiary);
            color: var(--color-text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            max-width: 250px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid var(--color-border);
            pointer-events: none;
        `;
    }

    function hideTooltip() {
        const tooltip = document.getElementById('active-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /* ============================================
       Glossary Search & Filter
       ============================================ */
    function initGlossary() {
        const searchInput = document.getElementById('glossary-search');
        const filterTabs = document.querySelectorAll('.glossary-filter__tab');
        const glossaryItems = document.querySelectorAll('.glossary-item');

        if (!searchInput || !glossaryItems.length) return;

        let currentCategory = 'all';

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            filterGlossary(e.target.value.toLowerCase(), currentCategory);
        });

        // Category filter
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('glossary-filter__tab--active'));
                tab.classList.add('glossary-filter__tab--active');
                currentCategory = tab.dataset.category;
                filterGlossary(searchInput.value.toLowerCase(), currentCategory);
            });
        });

        function filterGlossary(searchTerm, category) {
            glossaryItems.forEach(item => {
                const term = item.querySelector('.glossary-term').textContent.toLowerCase();
                const definition = item.querySelector('.glossary-definition').textContent.toLowerCase();
                const itemCategory = item.dataset.category;

                const matchesSearch = term.includes(searchTerm) || definition.includes(searchTerm);
                const matchesCategory = category === 'all' || itemCategory === category;

                item.style.display = (matchesSearch && matchesCategory) ? 'block' : 'none';
            });
        }
    }

    /* ============================================
       Hero Canvas Animation
       ============================================ */
    function initHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function createParticles() {
            particles = [];
            const count = Math.floor((canvas.width * canvas.height) / 15000);

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1,
                    color: Math.random() > 0.5 ? '#00D1FF' : '#3EF1C6'
                });
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.6;
                ctx.fill();
            });

            // Draw connections
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = '#00D1FF';
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                });
            });

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        }

        resize();
        createParticles();
        animate();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    /* ============================================
       Preset Buttons
       ============================================ */
    function initPresetButtons() {
        const presetButtons = document.querySelectorAll('.preset-btn');

        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = btn.dataset.preset || btn.dataset.physicsPreset;

                // Dispatch custom event for calculators to handle
                const event = new CustomEvent('presetSelected', {
                    detail: { preset: preset },
                    bubbles: true
                });
                btn.dispatchEvent(event);

                // Visual feedback
                presetButtons.forEach(b => b.classList.remove('preset-btn--active'));
                btn.classList.add('preset-btn--active');
            });
        });
    }

    /* ============================================
       URL Parameter Handling
       ============================================ */
    function getUrlParams() {
        return new URLSearchParams(window.location.search);
    }

    function setUrlParams(params) {
        const url = new URL(window.location);
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                url.searchParams.set(key, value);
            } else {
                url.searchParams.delete(key);
            }
        });
        window.history.replaceState({}, '', url);
    }

    /* ============================================
       Data Storage (Chemistry → Physics transfer)
       ============================================ */
    function saveChemistryData(data) {
        localStorage.setItem(STORAGE_KEYS.CHEMISTRY_DATA, JSON.stringify(data));
    }

    function getChemistryData() {
        const data = localStorage.getItem(STORAGE_KEYS.CHEMISTRY_DATA);
        return data ? JSON.parse(data) : null;
    }

    function clearChemistryData() {
        localStorage.removeItem(STORAGE_KEYS.CHEMISTRY_DATA);
    }

    /* ============================================
       Export Functions
       ============================================ */
    function exportToJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    }

    /* ============================================
       Notifications
       ============================================ */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#3EF1C6' : type === 'error' ? '#ff4757' : '#00D1FF'};
            color: #071733;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /* ============================================
       Print Functionality
       ============================================ */
    function printPage() {
        window.print();
    }

    /* ============================================
       Settings Panel (Floating Action Button)
       ============================================ */
    const SettingsPanel = {
        isOpen: false,
        fab: null,
        panel: null,

        init() {
            this.createElements();
            this.bindEvents();
            this.updateActiveButtons();
        },

        createElements() {
            // Create FAB button
            const fab = document.createElement('button');
            fab.className = 'settings-fab';
            fab.setAttribute('aria-label', 'Settings');
            fab.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
            `;
            fab.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(135deg, #00D1FF, #3EF1C6);
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(0, 209, 255, 0.4);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                color: #071733;
            `;

            // Create settings panel
            const panel = document.createElement('div');
            panel.className = 'settings-panel';
            panel.innerHTML = `
                <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem; color: #3EF1C6;">⚙️ Settings</div>
                
                <div style="margin-bottom: 1rem;">
                    <span style="font-size: 0.85rem; color: #94A3B8; display: block; margin-bottom: 0.5rem;">Theme</span>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="settings-panel__btn" data-theme="dark" style="padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #334155; background: transparent; color: #F8FAFC; cursor: pointer;">🌙 Dark</button>
                        <button class="settings-panel__btn" data-theme="light" style="padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #334155; background: transparent; color: #F8FAFC; cursor: pointer;">☀️ Light</button>
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <span style="font-size: 0.85rem; color: #94A3B8; display: block; margin-bottom: 0.5rem;">Text Size</span>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="settings-panel__btn" data-textsize="small" style="padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #334155; background: transparent; color: #F8FAFC; cursor: pointer; font-size: 0.8rem;">Small</button>
                        <button class="settings-panel__btn" data-textsize="default" style="padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #334155; background: transparent; color: #F8FAFC; cursor: pointer; font-size: 0.9rem;">Default</button>
                        <button class="settings-panel__btn" data-textsize="large" style="padding: 0.5rem 0.75rem; border-radius: 6px; border: 1px solid #334155; background: transparent; color: #F8FAFC; cursor: pointer; font-size: 1rem;">Large</button>
                    </div>
                </div>

                <div style="border-top: 1px solid #334155; padding-top: 1rem; margin-top: 0.5rem;">
                    <button id="clear-data-btn" style="padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #ef4444; background: transparent; color: #ef4444; cursor: pointer; width: 100%;">🗑️ Clear All Data</button>
                </div>
            `;
            // CSS handles all styling for .settings-panel class

            document.body.appendChild(fab);
            document.body.appendChild(panel);

            this.fab = fab;
            this.panel = panel;
        },

        bindEvents() {
            this.fab.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });

            // Theme buttons
            this.panel.querySelectorAll('[data-theme]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    setTheme(theme);
                    this.updateActiveButtons();
                });
            });

            // Text size buttons
            this.panel.querySelectorAll('[data-textsize]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const size = btn.dataset.textsize;
                    setTextSize(size);
                    this.updateActiveButtons();
                });
            });

            // Clear data button
            const clearBtn = this.panel.querySelector('#clear-data-btn');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    localStorage.clear();
                    showNotification('All data cleared!', 'success');
                    setTimeout(() => location.reload(), 1000);
                });
            }

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.panel.contains(e.target) && !this.fab.contains(e.target)) {
                    this.close();
                }
            });

            // Close on Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Hover effect on FAB
            this.fab.addEventListener('mouseenter', () => {
                this.fab.style.transform = 'scale(1.1)';
                this.fab.style.boxShadow = '0 6px 30px rgba(0, 209, 255, 0.6)';
            });
            this.fab.addEventListener('mouseleave', () => {
                if (!this.isOpen) {
                    this.fab.style.transform = 'scale(1)';
                    this.fab.style.boxShadow = '0 4px 20px rgba(0, 209, 255, 0.4)';
                }
            });
        },

        toggle() {
            this.isOpen ? this.close() : this.open();
        },

        open() {
            this.isOpen = true;
            this.fab.classList.add('active');
            this.panel.classList.add('active');
        },

        close() {
            this.isOpen = false;
            this.fab.classList.remove('active');
            this.panel.classList.remove('active');
        },

        updateActiveButtons() {
            const currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
            const currentTextSize = localStorage.getItem(STORAGE_KEYS.TEXT_SIZE) || 'default';

            this.panel.querySelectorAll('[data-theme]').forEach(btn => {
                const isActive = btn.dataset.theme === currentTheme;
                btn.style.background = isActive ? '#3EF1C6' : 'transparent';
                btn.style.color = isActive ? '#071733' : '#F8FAFC';
            });

            this.panel.querySelectorAll('[data-textsize]').forEach(btn => {
                const isActive = btn.dataset.textsize === currentTextSize;
                btn.style.background = isActive ? '#00D1FF' : 'transparent';
                btn.style.color = isActive ? '#071733' : '#F8FAFC';
            });
        }
    };

    function initSettingsPanel() {
        SettingsPanel.init();
    }

    /* ============================================
       Initialize All
       ============================================ */
    function init() {
        initTheme();
        initMobileNav();
        initModeToggle();
        initCollapsibles();
        initTooltips();
        initGlossary();
        initHeroCanvas();
        initPresetButtons();
        initSettingsPanel();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose global API
    window.ChargedUP = {
        setTheme,
        setTextSize,
        saveChemistryData,
        getChemistryData,
        clearChemistryData,
        exportToJSON,
        copyToClipboard,
        showNotification,
        printPage,
        getUrlParams,
        setUrlParams,
        STORAGE_KEYS
    };

})();

/* ============================================
   Add notification animation styles
   ============================================ */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
