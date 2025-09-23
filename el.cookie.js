/*
 * El'Cookie v1.0
 * © 2025 El'System
 * Crafted with love by Andrey Shuin
 * Licensed under the MIT License
 */

(function () {
    'use strict';

    //region CONFIG
    const CONFIG = {
        COOKIE_CATEGORIES: {
            MARKETING: 'marketing',
            OTHER: 'other'
        },
        COOKIE_NAME: 'cookie_consent',
        COOKIE_EXPIRY_ALL_DAYS: 365,
        COOKIE_EXPIRY_REQUIRED_DAYS: 1,
        API_OPEN_SETTINGS_CLASS: 'open-cookie-settings',
        LINKS: {
            policy: '/policy/'
        }
    };

    //region LAZY INIT
    let initializedComponents = null;

    const initializeComponents = () => {
        if (initializedComponents) return initializedComponents;

        const generateId = () => {
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
            const randomPart = Math.random().toString(36).slice(2, 9);
            return randomLetter + randomPart;
        };

        const STYLE_ID = generateId();

        const BANNER_CONFIG = {
            BUTTONS: {
                all: 'Разрешить все',
                selected: 'Разрешить выбранные',
                required: 'Разрешить обязательные',
                settings: 'Настройки'
            },
            TEXT: {
                text: `Наш сайт использует файлы cookie для аналитики и персонализации. Продолжая использовать сайт после ознакомления с этим сообщением и предоставления своего выбора, вы соглашаетесь с нашей <a href="${CONFIG.LINKS.policy}" target="_blank">Политикой обработки персональных данных</a>`
            },
            IDS: {
                banner: generateId(),
                content: generateId(),
                text: generateId(),
                buttons: generateId(),
                btnAll: generateId(),
                btnRequired: generateId(),
                btnSettings: generateId()
            },
            CLASSES: {
                banner: generateId(),
                visible: generateId(),
                hidden: generateId(),
                content: generateId(),
                text: generateId(),
                buttons: generateId(),
                button: generateId()
            }
        };

        const SETTINGS_CONFIG = {
            IDS: {
                modal: generateId(),
                header: generateId(),
                description: generateId(),
                block1: generateId(),
                block2: generateId(),
                block3: generateId(),
                toggle1: generateId(),
                toggle2: generateId(),
                toggle3: generateId(),
                expand1: generateId(),
                expand2: generateId(),
                expand3: generateId(),
                text1: generateId(),
                text2: generateId(),
                text3: generateId(),
                buttonContainer: generateId(),
                btnAllowAll: generateId(),
                btnAllowSelected: generateId(),
                closeBtn: generateId(),
                dimmer: generateId()
            },
            CLASSES: {
                modal: generateId(),
                visible: generateId(),
                hidden: generateId(),
                header: generateId(),
                description: generateId(),
                settingsBlock: generateId(),
                settingsHeader: generateId(),
                expandIcon: generateId(),
                toggle: generateId(),
                settingsText: generateId(),
                settingsTextExpanded: generateId(),
                buttonContainer: generateId(),
                button: generateId(),
                closeBtn: generateId()
            }
        };

        //region STYLES
        const getAllStyles = () => `
        :root {
            --cc-animate-fast: .6s;
            --cc-bg: #fff;
            --cc-color-main: #000;
            --cc-color-main__hover: #333;
            --cc-color-inactive: #e9e9e9;
            --cc-color-inactive__hover: #c8c8c8ff;
            --text-gray: #7f7f7f;
            --text-gray__hover: #666666ff;
            --dimmer-bg: rgba(242, 244, 245, .5);
        }

        #${SETTINGS_CONFIG.IDS.dimmer} {
            position: fixed;
            background-color: var(--dimmer-bg);
            backdrop-filter: blur(3px);
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            transition: opacity var(--cc-animate-fast);
            opacity: 0;
            display: none;
            z-index: 9999;
        }

        #${BANNER_CONFIG.IDS.banner},
        .${SETTINGS_CONFIG.CLASSES.modal} {
            position: fixed;
            z-index: 10000;
            background: var(--cc-bg);
            border-radius: 1rem;
            padding: 2.5rem;
            opacity: 0;
            transition: opacity var(--cc-animate-fast), transform var(--cc-animate-fast);
            font-size: .9rem;
            font-weight: 500;
            letter-spacing: 0.03em;
        }

        #${BANNER_CONFIG.IDS.banner} {
            box-shadow: 0 -2px 24px rgba(0,0,0,0.1);
            transform: translateY(10%);
            width: min-content;
            bottom: 2rem;
            left: 2rem;
        }

        @media (max-width: 800px) {
            #${BANNER_CONFIG.IDS.banner} {
                width: 100%;
                left: 0;
                bottom: 0;
                border-radius: 0;
            }
        }

        #${BANNER_CONFIG.IDS.banner}.${BANNER_CONFIG.CLASSES.visible} {
            opacity: 1;
            transform: translateY(0);
        }

        #${BANNER_CONFIG.IDS.banner}.#${BANNER_CONFIG.IDS.hidden} {
            opacity: 0;
            transform: translateY(10%);
        }

        .${SETTINGS_CONFIG.CLASSES.modal} {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -45%);
            box-shadow: 0 4px 64px rgba(0,0,0,0.15);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        @media (max-width: 500px) {
            #${BANNER_CONFIG.IDS.banner},
            .${SETTINGS_CONFIG.CLASSES.modal} {
                padding: 2rem;
            }
            .${SETTINGS_CONFIG.CLASSES.modal} {
                width: 100%;
            }
        }

        .${SETTINGS_CONFIG.CLASSES.modal}.${SETTINGS_CONFIG.CLASSES.visible} {
            opacity: 1;
            transform: translate(-50%, -50%);
        }

        .${SETTINGS_CONFIG.CLASSES.modal}..${SETTINGS_CONFIG.CLASSES.hidden} {
            opacity: 0;
            transform: translate(-50%, -45%);
        }

        #${BANNER_CONFIG.IDS.banner} a,
        .${SETTINGS_CONFIG.CLASSES.modal} a {
            transition: var(--cc-animate-fast);
            color: var(--cc-color-main);
        }
        
        #${BANNER_CONFIG.IDS.banner} a:hover,
        .${SETTINGS_CONFIG.CLASSES.modal} a:hover {
            color: var(--cc-color-main__hover);
        }

        .${BANNER_CONFIG.CLASSES.buttons},
        .${SETTINGS_CONFIG.CLASSES.buttonContainer} {
            margin-top: 2rem;
            display: flex;
            gap: 1.6rem;
            flex-wrap: wrap;
        }

        @media (max-width: 600px) {
            .${BANNER_CONFIG.CLASSES.buttons} {
                flex-wrap: wrap;
            }
        }

        @media (max-width: 500px) {
            .${SETTINGS_CONFIG.CLASSES.buttonContainer} {
                flex-direction: column;
            }
        }

        .${BANNER_CONFIG.CLASSES.button},
        .${SETTINGS_CONFIG.CLASSES.button} {
            font-size: .9rem;
            cursor: pointer;
            border-radius: 5em;
            color: var(--text-gray);
            transition: background var(--cc-animate-fast);
            font-weight: bold;
            display: block;
            transform: translateX(0);
            background: none;
            white-space: nowrap;
            border: none;
            padding: 0;
        }

        .${BANNER_CONFIG.CLASSES.button}:hover,
        .${SETTINGS_CONFIG.CLASSES.button}:hover {
            color: var(--text-gray__hover);
        }

        #${BANNER_CONFIG.IDS.btnAll},
        #${SETTINGS_CONFIG.IDS.btnAllowAll} {
            padding: 1em 1.6em;
            background: var(--cc-color-main);
            border-color: var(--cc-color-main);
            color: white;
        }
            
        #${BANNER_CONFIG.IDS.btnAll} {
            width: 560px;
        }
            
        #${BANNER_CONFIG.IDS.btnAll}:hover,
        #${SETTINGS_CONFIG.IDS.btnAllowAll}:hover {
            background: var(--cc-color-main__hover);
        }

        @media (max-width: 800px) {
            #${BANNER_CONFIG.IDS.btnAll} {
                width: 100%;
            }
        }

        /* Settings-specific styles */
        .${SETTINGS_CONFIG.CLASSES.header} {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }

        .${SETTINGS_CONFIG.CLASSES.closeBtn} {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        }

        .${SETTINGS_CONFIG.CLASSES.description} {
            font-size: .9rem;
            letter-spacing: .03em;
            margin-bottom: 2rem;
            line-height: 1.2;
        }

        .${SETTINGS_CONFIG.CLASSES.settingsBlock} {
            margin-bottom: 1rem;
        }

        .${SETTINGS_CONFIG.CLASSES.settingsHeader} {
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-weight: 500;
            padding-bottom: .5rem;
            gap: 1rem;
        }

        .${SETTINGS_CONFIG.CLASSES.expandIcon} {
            font-size:1rem;
            transition: transform var(--cc-animate-fast);
            width: 1rem;
            height: 1rem;
            flex-shrink: 0;
            background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIGlkPSJMYXllcl8xIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlPi5HcmFwaGljLVN0eWxle2ZpbGw6bm9uZTtzdHJva2U6IzFkMWQxYjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjJweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlLz48cG9seWxpbmUgY2xhc3M9IkdyYXBoaWMtU3R5bGUiIGRhdGEtbmFtZT0iJmx0O1BhdGgmZ3Q7IiBpZD0iX1BhdGhfIiBwb2ludHM9IjIwLjU5IDcuNjYgMTEuOSAxNi4zNCAzLjQxIDcuODYiLz48L3N2Zz4=');
            background-size: contain;
            margin-left: auto;
        }

        .${SETTINGS_CONFIG.CLASSES.expandIcon}.${SETTINGS_CONFIG.CLASSES.toggle} {
            transform: rotate(-.5turn);
        }

        .${SETTINGS_CONFIG.CLASSES.settingsText} {
            line-height: 1.2;
            font-size: 0.8rem;
            letter-spacing: .03em;
            color: var(--text-gray);
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: all var(--cc-animate-fast) ease;
        }

        .${SETTINGS_CONFIG.CLASSES.settingsText}.${SETTINGS_CONFIG.CLASSES.settingsTextExpanded} {
            max-height: 16rem;
            opacity: 1;
        }

        /* Switch styles */
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            flex-shrink: 0;
            transform: translate(0);
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--cc-color-inactive);
            transition: var(--cc-animate-fast);
            border-radius: 24px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: var(--cc-color-main);
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }

        input:disabled + .slider {
            opacity: 0.3;
            cursor: not-allowed;
        }
        `;

        initializedComponents = {
            BANNER_CONFIG,
            SETTINGS_CONFIG,
            getAllStyles,
            generateId,
            STYLE_ID
        };

        return initializedComponents;
    };

    //region MANAGERS
    const CookieManager = {
        get: (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            return parts.length === 2 ? parts.pop().split(';').shift() : undefined;
        },
        set: (name, value, days) => {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `${name}=${value};${expires};path=/`;
        }
    };

    const StorageManager = {
        getConsentTimestamp: () => localStorage.getItem('cookie_consent_timestamp'),
        setConsentTimestamp: () => {
            localStorage.setItem('cookie_consent_timestamp', new Date().getTime().toString());
        },
        isExpired: (timestamp, days) => {
            if (!timestamp) return true;
            const oneDay = 24 * 60 * 60 * 1000;
            const requiredTime = days * oneDay;
            const now = new Date().getTime();
            const diffMs = now - parseInt(timestamp, 10);
            return diffMs > requiredTime;
        }
    };

    //region PERMISSION CHECKER
    /**
     * Checks if user has given consent for specific cookie categories and executes callback
     * @param {string} category - Cookie category (marketing, other)
     * @param {function} callback - Function to execute when consent is granted
     * 
     * @example
     * PermissionChecker.check('marketing', () => {
     *   console.log('Marketing consent granted');
     * });
     * 
     * PermissionChecker.check('other', () => {
     *   console.log('Optional cookies consent granted');
     * });
     */
    const PermissionChecker = {
        check: (category, callback) => {
            if (typeof window.checkCookiesPermission === 'undefined') {
                return;
            }

            if (window.checkCookiesPermission?.(category)) {
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }
    };

    const PermissionManager = {
        check: (category) => {
            const consent = CookieManager.get(CONFIG.COOKIE_NAME);
            if (!consent) return false;
            return consent.split(',').includes(category);
        },
        restore: () => {
            window.checkCookiesPermission = (category) => {
                const consent = CookieManager.get(CONFIG.COOKIE_NAME);
                if (!consent) return false;
                return consent.split(',').includes(category);
            };
        }
    };

    //region CONSENT CHECK
    const ConsentManager = {
        check() {
            const consent = CookieManager.get(CONFIG.COOKIE_NAME);
            const timestamp = StorageManager.getConsentTimestamp();

            if (consent && !StorageManager.isExpired(timestamp, CONFIG.COOKIE_EXPIRY_ALL_DAYS)) {
                PermissionManager.restore();
                return;
            }

            if (!consent && timestamp) {
                if (!StorageManager.isExpired(timestamp, CONFIG.COOKIE_EXPIRY_REQUIRED_DAYS)) {
                    window.checkCookiesPermission = () => false;
                    return;
                }
                this.showBannerIfNeeded();
                return;
            }

            if (!consent && !timestamp) {
                this.showBannerIfNeeded();
                return;
            }

            if (consent) {
                PermissionManager.restore();
            } else {
                window.checkCookiesPermission = () => false;
            }
        },

        showBannerIfNeeded() {
            const components = initializeComponents();
            injectCommonStyles(components.getAllStyles, components.STYLE_ID);

            const BannerComponent = createBannerComponent(components);
            BannerComponent.show();
        }
    };

    //region STYLES LOGIC
    const injectCommonStyles = (getStyleFunction, styleId) => {
        if (document.getElementById(styleId)) return styleId;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = getStyleFunction();
        document.head.appendChild(style);
        return styleId;
    };

    const removeCommonStyles = (styleId, components) => {
        const { BANNER_CONFIG, SETTINGS_CONFIG } = components;
        const banner = document.getElementById(BANNER_CONFIG.IDS.banner);
        const settings = document.getElementById(SETTINGS_CONFIG.IDS.modal);

        if (!banner && !settings) {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.parentNode?.removeChild(existingStyle);
            }
        }
    };

    //region COMPONENTS FACTORIES
    const createBannerComponent = (components) => {
        const { BANNER_CONFIG: config } = components;

        return {
            show() {
                this.remove();
                injectCommonStyles(components.getAllStyles, components.STYLE_ID);

                const banner = document.createElement('div');
                banner.id = config.IDS.banner;
                banner.className = config.CLASSES.banner;

                banner.innerHTML = `
                    <div class="${config.CLASSES.content}" id="${config.IDS.content}">
                        <div class="${config.CLASSES.text}" id="${config.IDS.text}">
                            ${config.TEXT.text}
                        </div>
                        <div class="${config.CLASSES.buttons}" id="${config.IDS.buttons}">
                            <button class="${config.CLASSES.button}" id="${config.IDS.btnAll}">${config.BUTTONS.all}</button>
                            <button class="${config.CLASSES.button}" id="${config.IDS.btnRequired}">${config.BUTTONS.required}</button>
                            <button class="${config.CLASSES.button}" id="${config.IDS.btnSettings}">${config.BUTTONS.settings}</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(banner);
                banner.offsetHeight;
                banner.classList.add(config.CLASSES.visible);
                this.bindEvents(components);
            },

            remove() {
                const existing = document.getElementById(config.IDS.banner);
                if (existing) {
                    existing.classList.remove(config.CLASSES.visible);
                    existing.classList.add(config.CLASSES.hidden);
                    setTimeout(() => {
                        existing.parentNode?.removeChild(existing);
                        removeCommonStyles(components.STYLE_ID, components);
                    }, 300);
                }
            },

            bindEvents(components) {
                document.getElementById(config.IDS.btnAll)?.addEventListener('click', () => {
                    const nonRequiredCategories = [CONFIG.COOKIE_CATEGORIES.MARKETING, CONFIG.COOKIE_CATEGORIES.OTHER];
                    CookieManager.set(CONFIG.COOKIE_NAME, nonRequiredCategories.join(','), CONFIG.COOKIE_EXPIRY_ALL_DAYS);
                    StorageManager.setConsentTimestamp();
                    this.remove();
                    PermissionManager.restore();
                });

                document.getElementById(config.IDS.btnRequired)?.addEventListener('click', () => {
                    StorageManager.setConsentTimestamp();
                    this.remove();
                    window.checkCookiesPermission = () => false;
                });

                document.getElementById(config.IDS.btnSettings)?.addEventListener('click', () => {
                    this.remove();
                    const SettingsComponent = createSettingsComponent(components);
                    SettingsComponent.show();
                });
            }
        };
    };

    const createSettingsComponent = (components) => {
        const { SETTINGS_CONFIG: config } = components;
        let outsideClickHandler = null;

        return {
            show() {
                this.remove();
                injectCommonStyles(components.getAllStyles, components.STYLE_ID);
                this.showDimmer();

                const modal = document.createElement('div');
                modal.id = config.IDS.modal;
                modal.className = config.CLASSES.modal;

                const currentConsent = CookieManager.get(CONFIG.COOKIE_NAME);
                const timestamp = StorageManager.getConsentTimestamp();

                let hasMarketing = false;
                let hasOther = false;

                if (currentConsent) {
                    const permissions = currentConsent.split(',');
                    hasMarketing = permissions.includes(CONFIG.COOKIE_CATEGORIES.MARKETING);
                    hasOther = permissions.includes(CONFIG.COOKIE_CATEGORIES.OTHER);
                } else if (timestamp) {
                    hasMarketing = false;
                    hasOther = false;
                } else {
                    hasMarketing = true;
                    hasOther = true;
                }

                const SETTINGS_CONTENT = {
                    description: `Технические cookie нужны для стабильной работы. Аналитические и другие cookie помогают нам делать сайт лучше для вас: понимать, что вам интересно, и улучшать навигацию. Эти данные анонимны. Разрешая их, вы вносите свой вклад в развитие нашего сайта. Подробности в <a href="${CONFIG.LINKS.policy}" target="_blank">Политике обработки персональных данных</a>`,
                    blocks: [
                        {
                            id: 'block1',
                            title: 'Технические Cookies',
                            description: 'Эти файлы cookie необходимы для правильной работы сайта и его основных функций (например, навигация, сохранение сессии, работа форм). Без них сайт не сможет функционировать должным образом. Они не собирают информацию для маркетинга или отслеживания. Этот тип cookie нельзя отключить',
                            checked: true,
                            disabled: true
                        },
                        {
                            id: 'block2',
                            title: 'Аналитические/Рекламные cookie',
                            description: 'Эти файлы cookie позволяют нам собирать информацию о том, как посетители используют наш сайт (например, какие страницы посещают чаще, сколько времени проводят на сайте, возникают ли ошибки). Эта информация собирается в агрегированном или обезличенном виде и используется для анализа и улучшения работы сайта. Данные обрабатываются Яндекс.Метрикой согласно её политике конфиденциальности (см. сайт Яндекса). Эти cookie активны только с вашего согласия',
                            checked: hasMarketing,
                            disabled: false
                        },
                        {
                            id: 'block3',
                            title: 'Функциональные (остальные) cookie',
                            description: 'Эти файлы cookie позволяют сайту запоминать сделанный вами выбор и предоставлять расширенные функции для вашего удобства. Они также могут использоваться для обеспечения работы встроенных на сайт сервисов (например, видеоплееров от Vimeo, виджетов социальных сетей VK), которые улучшают ваш опыт взаимодействия с сайтом. Эти сервисы могут устанавливать свои cookie для корректной работы и запоминания предпочтений. Эти cookie активны только с вашего согласия',
                            checked: hasOther,
                            disabled: false
                        }
                    ]
                };

                const generateCookieBlock = (block) => {
                    const { id, title, description, checked, disabled } = block;
                    const blockNum = id.slice(-1);

                    return `
                        <div class="${config.CLASSES.settingsBlock}" id="${config.IDS[id]}">
                            <div class="${config.CLASSES.settingsHeader}" id="${config.IDS[id] + '-header'}">
                                <label class="switch">
                                    <input type="checkbox" id="${config.IDS[`toggle${blockNum}`]}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                                    <span class="slider round"></span>
                                </label>
                                <span>${title}</span>
                                <span class="${config.CLASSES.expandIcon}" id="${config.IDS[`expand${blockNum}`]}"></span>
                            </div>
                            <div class="${config.CLASSES.settingsText}" id="${config.IDS[`text${blockNum}`]}">
                                ${description}
                            </div>
                        </div>
                    `;
                };

                const cookieBlocksHTML = SETTINGS_CONTENT.blocks.map(generateCookieBlock).join('');

                modal.innerHTML = `
                    <div class="${config.CLASSES.header}" id="${config.IDS.header}">
                        Настройка cookie
                        <button class="${config.CLASSES.closeBtn}" id="${config.IDS.closeBtn}">✕</button>
                    </div>
                    <div class="${config.CLASSES.description}" id="${config.IDS.description}">
                        ${SETTINGS_CONTENT.description}
                    </div>
                    ${cookieBlocksHTML}
                    <div class="${config.CLASSES.buttonContainer}" id="${config.IDS.buttonContainer}">
                        <button class="${config.CLASSES.button}" id="${config.IDS.btnAllowAll}">${components.BANNER_CONFIG.BUTTONS.all}</button>
                        <button class="${config.CLASSES.button}" id="${config.IDS.btnAllowSelected}">${components.BANNER_CONFIG.BUTTONS.selected}</button>
                    </div>
                `;

                document.body.appendChild(modal);
                modal.offsetHeight;
                modal.classList.add(config.CLASSES.visible);

                this.bindEvents(components);

                setTimeout(() => {
                    outsideClickHandler = (e) => {
                        const modalElement = document.getElementById(config.IDS.modal);

                        if (!modalElement) {
                            document.removeEventListener('click', outsideClickHandler);
                            return;
                        }

                        if (modalElement && !modalElement.contains(e.target)) {
                            if (!document.getElementById(config.IDS.modal)?.contains(e.target)) {
                                this.remove();
                                if (!StorageManager.getConsentTimestamp()) {
                                    const BannerComponent = createBannerComponent(components);
                                    BannerComponent.show();
                                }
                            }
                        }
                    };
                    document.addEventListener('click', outsideClickHandler);
                }, 100);
            },

            bindEvents(components) {
                const toggleText = (textId, expandIcon) => {
                    const textElement = document.getElementById(textId);
                    const isExpanded = textElement.classList.contains(config.CLASSES.settingsTextExpanded);
                    textElement.classList.toggle(config.CLASSES.settingsTextExpanded, !isExpanded);
                    expandIcon.classList.toggle(config.CLASSES.toggle, !isExpanded);
                };

                for (const i of [1, 2, 3]) {
                    const blockId = `block${i}`;
                    const expandId = `expand${i}`;
                    const textId = `text${i}`;

                    const blockHeaderId = `${config.IDS[blockId]}-header`;
                    const expandElementId = config.IDS[expandId];
                    const textElementId = config.IDS[textId];

                    const expandElement = document.getElementById(expandElementId);

                    expandElement?.addEventListener('click', (e) => {
                        e.stopPropagation();
                        toggleText(textElementId, expandElement);
                    });

                    document.getElementById(blockHeaderId)?.addEventListener('click', (e) => {
                        if (e.target !== expandElement && !e.target.closest('.switch')) {
                            toggleText(textElementId, expandElement);
                        }
                    });
                }

                document.getElementById(config.IDS.btnAllowAll)?.addEventListener('click', () => {
                    const nonRequiredCategories = [CONFIG.COOKIE_CATEGORIES.MARKETING, CONFIG.COOKIE_CATEGORIES.OTHER];
                    CookieManager.set(CONFIG.COOKIE_NAME, nonRequiredCategories.join(','), CONFIG.COOKIE_EXPIRY_ALL_DAYS);
                    StorageManager.setConsentTimestamp();
                    this.remove();
                    PermissionManager.restore();
                });

                document.getElementById(config.IDS.btnAllowSelected)?.addEventListener('click', () => {
                    const marketingChecked = document.getElementById(config.IDS.toggle2)?.checked ?? false;
                    const otherChecked = document.getElementById(config.IDS.toggle3)?.checked ?? false;

                    const selectedPermissions = [];
                    if (marketingChecked) selectedPermissions.push(CONFIG.COOKIE_CATEGORIES.MARKETING);
                    if (otherChecked) selectedPermissions.push(CONFIG.COOKIE_CATEGORIES.OTHER);

                    if (selectedPermissions.length > 0) {
                        CookieManager.set(CONFIG.COOKIE_NAME, selectedPermissions.join(','), CONFIG.COOKIE_EXPIRY_ALL_DAYS);
                    } else {
                        CookieManager.set(CONFIG.COOKIE_NAME, '', 0);
                    }

                    StorageManager.setConsentTimestamp();
                    this.remove();
                    PermissionManager.restore();
                });

                document.getElementById(config.IDS.closeBtn)?.addEventListener('click', () => {
                    this.remove();
                    if (!StorageManager.getConsentTimestamp()) {
                        const BannerComponent = createBannerComponent(components);
                        BannerComponent.show();
                    }
                });
            },

            remove() {
                if (outsideClickHandler) {
                    document.removeEventListener('click', outsideClickHandler);
                    outsideClickHandler = null;
                }

                const existing = document.getElementById(config.IDS.modal);
                if (existing) {
                    this.hideDimmer();
                    existing.classList.remove(config.CLASSES.visible);
                    existing.classList.add(config.CLASSES.hidden);
                    setTimeout(() => {
                        existing.parentNode?.removeChild(existing);
                        removeCommonStyles(components.STYLE_ID, components);
                    }, 300);
                }
            },

            showDimmer() {
                const dimmer = document.createElement('div');
                dimmer.id = config.IDS.dimmer;
                dimmer.style.display = 'block';
                dimmer.style.opacity = '0';
                document.body.appendChild(dimmer);
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        dimmer.style.opacity = '1';
                    });
                });
            },

            hideDimmer() {
                const dimmer = document.getElementById(config.IDS.dimmer);
                if (dimmer) {
                    dimmer.style.opacity = '0';
                    setTimeout(() => {
                        if (dimmer.parentNode) {
                            dimmer.parentNode.removeChild(dimmer);
                        }
                    }, 200);
                }
            }
        };
    };

    //region API
    window.checkCookiesPermission = PermissionManager.check;
    window.PermissionChecker = PermissionChecker;

    window.openCookieSettings = () => {
        const components = initializeComponents();
        const existingBanner = document.getElementById(components.BANNER_CONFIG.IDS.banner);
        if (existingBanner) {
            existingBanner.classList.remove(components.BANNER_CONFIG.CLASSES.visible);
            existingBanner.classList.add(components.BANNER_CONFIG.CLASSES.hidden);
            setTimeout(() => {
                existingBanner.parentNode?.removeChild(existingBanner);
            }, 300);
        }
        injectCommonStyles(components.getAllStyles, components.STYLE_ID);
        const SettingsComponent = createSettingsComponent(components);
        SettingsComponent.show();
    };

    ConsentManager.check();

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains(CONFIG.API_OPEN_SETTINGS_CLASS)) {
            e.preventDefault();
            window.openCookieSettings();
        }
    });

})();