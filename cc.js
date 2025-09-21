/*
 * Cookie Consent Manager v1.0
 * Copyright (c) 2025 Andrey Shuin
 * Licensed under MIT License
 */

(function () {
    'use strict';

    //region CONFIG

    const DEFAULT_CONSENT_BEHAVIOR = false;

    const generateId = () => `cc-${Math.random().toString(36).slice(2, 10)}`;

    const COOKIE_CATEGORIES = {
        REQUIRED: 'required',
        MARKETING: 'marketing',
        OTHER: 'other'
    };

    const COOKIE_NAME = 'cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    const STYLE_ID = generateId();
    const LINKS = {
        policy: '/policy/'
    }

    const BANNER_CONFIG = {
        BUTTONS: {
            all: 'Разрешить всё',
            selected: 'Разрешить выбранные',
            required: 'Разрешить обязательные',
            settings: 'Настройки'
        },

        TEXT: {
            text: `Наш сайт использует файлы cookie для аналитики и персонализации. Продолжая использовать сайт после ознакомления с этим сообщением и предоставления своего выбора, вы соглашаетесь с нашей <a href="${LINKS.policy}" target="_blank">Политикой обработки персональных данных</a>`
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
            z-index: 100;
        }

        #${BANNER_CONFIG.IDS.banner},
        .${SETTINGS_CONFIG.CLASSES.modal} {
            position: fixed;
            z-index: 1000;
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
            transition: var(--cc-animate-fast);
            font-weight: bold;
            display: block;
            transform: translateX(0);
            background: none;
            white-space: nowrap;
            border: none;
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
            
        #${BANNER_CONFIG.IDS.btnAll}:hover,
        #${SETTINGS_CONFIG.IDS.btnAllowAll}:hover {
            background: var(--cc-color-main__hover);
        }

        @media (max-width: 600px) {
            #${BANNER_CONFIG.IDS.btnAll} {
                width: 100%;
            }
        }

        /* Settings-specific styles */
        .${SETTINGS_CONFIG.CLASSES.header} {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 15px;
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
            margin-bottom: 1.3rem;
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
            padding-bottom: 1rem;
            gap: .5rem;
        }

        .${SETTINGS_CONFIG.CLASSES.expandIcon} {
            font-size:1rem;
            transition: transform var(--cc-animate-fast);
            width: 1rem;
            height: 1rem;
            flex-shrink: 0;
            background-image: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIGlkPSJMYXllcl8xIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlPi5HcmFwaGljLVN0eWxle2ZpbGw6bm9uZTtzdHJva2U6IzFkMWQxYjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjJweDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlLz48cG9seWxpbmUgY2xhc3M9IkdyYXBoaWMtU3R5bGUiIGRhdGEtbmFtZT0iJmx0O1BhdGgmZ3Q7IiBpZD0iX1BhdGhfIiBwb2ludHM9IjIwLjU5IDcuNjYgMTEuOSAxNi4zNCAzLjQxIDcuODYiLz48L3N2Zz4=');
            background-size: contain;
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
            margin-left: auto;
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
            opacity: 0.5;
            cursor: not-allowed;
        }
    `;

    const injectCommonStyles = () => {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = getAllStyles();
        document.head.appendChild(style);
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

        isMoreThanOneDayAgo: (timestamp) => {
            if (!timestamp) return true;
            const oneDay = 24 * 60 * 60 * 1000;
            return (new Date().getTime() - parseInt(timestamp, 10)) > oneDay;
        }
    };

    const PermissionManager = {
        check: (category) => {
            const consent = CookieManager.get(COOKIE_NAME);
            if (!consent) return false;
            return consent.split(',').includes(category);
        },

        restore: () => {
            window.checkCookiesPermission = (category) => {
                const consent = CookieManager.get(COOKIE_NAME);
                if (!consent) return false;
                return consent.split(',').includes(category);
            };
        }
    };

    const ConsentManager = {
        check() {
            const consent = CookieManager.get(COOKIE_NAME);
            const timestamp = StorageManager.getConsentTimestamp();

            if (consent) {
                const permissions = consent.split(',');
                if (permissions.includes(COOKIE_CATEGORIES.REQUIRED)) {
                    if (permissions.length === 1 && StorageManager.isMoreThanOneDayAgo(timestamp)) {
                        injectCommonStyles();
                        BannerComponent.show();
                    }
                }
            } else {
                if (DEFAULT_CONSENT_BEHAVIOR) {
                    window.checkCookiesPermission = () => true;
                } else {
                    window.checkCookiesPermission = (category) => {
                        return category === COOKIE_CATEGORIES.REQUIRED;
                    };
                }
                injectCommonStyles();
                BannerComponent.show();
            }
        }
    };

    //region BANNER

    const BannerComponent = {
        show() {
            this.remove();
            injectCommonStyles();

            const banner = document.createElement('div');
            banner.id = BANNER_CONFIG.IDS.banner;
            banner.className = BANNER_CONFIG.CLASSES.banner;

            const { CLASSES, IDS, TEXT, BUTTONS } = BANNER_CONFIG;

            banner.innerHTML = `
                <div class="${CLASSES.content}" id="${IDS.content}">
                    <div class="${CLASSES.text}" id="${IDS.text}">
                        ${TEXT.text}
                    </div>
                    <div class="${CLASSES.buttons}" id="${IDS.buttons}">
                        <button class="${CLASSES.button}" id="${IDS.btnAll}">${BUTTONS.all}</button>
                        <button class="${CLASSES.button}" id="${IDS.btnRequired}">${BUTTONS.required}</button>
                        <button class="${CLASSES.button}" id="${IDS.btnSettings}">${BUTTONS.settings}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(banner);
            banner.offsetHeight;
            banner.classList.add(BANNER_CONFIG.CLASSES.visible);
            this.bindEvents();
        },

        remove() {
            const existing = document.getElementById(BANNER_CONFIG.IDS.banner);
            if (existing) {
                existing.classList.remove(BANNER_CONFIG.CLASSES.visible);
                existing.classList.add(BANNER_CONFIG.IDS.hidden);
                setTimeout(() => {
                    existing.parentNode?.removeChild(existing);
                }, 300);
            }
        },

        bindEvents() {
            const { btnAll, btnRequired, btnSettings } = BANNER_CONFIG.IDS;

            document.getElementById(btnAll)?.addEventListener('click', () => {
                const permissions = Object.values(COOKIE_CATEGORIES).join(',');
                CookieManager.set(COOKIE_NAME, permissions, COOKIE_EXPIRY_DAYS);
                StorageManager.setConsentTimestamp();
                this.remove();
                PermissionManager.restore();
            });

            document.getElementById(btnRequired)?.addEventListener('click', () => {
                CookieManager.set(COOKIE_NAME, COOKIE_CATEGORIES.REQUIRED, COOKIE_EXPIRY_DAYS);
                StorageManager.setConsentTimestamp();
                this.remove();
                PermissionManager.restore();
            });

            document.getElementById(btnSettings)?.addEventListener('click', () => {
                this.remove();
                SettingsComponent.show();
            });
        }
    };

    //region SETTINGS

    const SettingsComponent = {
        show() {
            this.remove();
            injectCommonStyles();
            this.showDimmer();

            const modal = document.createElement('div');
            modal.id = SETTINGS_CONFIG.IDS.modal;
            modal.className = SETTINGS_CONFIG.CLASSES.modal;

            const currentConsent = CookieManager.get(COOKIE_NAME);
            const permissions = currentConsent ? currentConsent.split(',') : [];
            const hasMarketing = permissions.includes(COOKIE_CATEGORIES.MARKETING);
            const hasOther = permissions.includes(COOKIE_CATEGORIES.OTHER);
            const isNewUser = !currentConsent;

            const { CLASSES, IDS } = SETTINGS_CONFIG;

            const SETTINGS_CONTENT = {
                description: `Технические cookie нужны для стабильной работы. Аналитические и другие cookie помогают нам делать сайт лучше для вас: понимать, что вам интересно, и улучшать навигацию. Эти данные анонимны. Разрешая их, вы вносите свой вклад в развитие нашего сайта. Подробности в <a href="${LINKS.policy}" target="_blank">Политике обработки персональных данных</a>`,
                blocks: [
                    {
                        id: 'block1',
                        title: 'Технические Cookies',
                        description: 'Эти файлы cookie необходимы для правильной работы сайта и его основных функций (например, навигация, сохранение сессии, работа форм). Без них сайт не сможет функционировать должным образом. Они не собирают информацию для маркетинга или отслеживания. Этот тип cookie нельзя отключить',
                        checked: true,
                        disabled: true
                    },
                    {
                        id: 'block2',
                        title: 'Аналитические/Рекламные cookie',
                        description: 'Эти файлы cookie позволяют нам собирать информацию о том, как посетители используют наш сайт (например, какие страницы посещают чаще, сколько времени проводят на сайте, возникают ли ошибки). Эта информация собирается в агрегированном или обезличенном виде и используется для анализа и улучшения работы сайта. Данные обрабатываются Яндекс.Метрикой согласно её политике конфиденциальности (см. сайт Яндекса). Эти cookie активны только с вашего согласия',
                        checked: hasMarketing || isNewUser,
                        disabled: false
                    },
                    {
                        id: 'block3',
                        title: 'Функциональные (остальные) cookie',
                        description: 'Эти файлы cookie позволяют сайту запоминать сделанный вами выбор и предоставлять расширенные функции для вашего удобства. Они также могут использоваться для обеспечения работы встроенных на сайт сервисов (например, видеоплееров от Vimeo, виджетов социальных сетей VK), которые улучшают ваш опыт взаимодействия с сайтом. Эти сервисы могут устанавливать свои cookie для корректной работы и запоминания предпочтений. Эти cookie активны только с вашего согласия',
                        checked: hasOther || isNewUser,
                        disabled: false
                    }
                ]
            };

            const generateCookieBlock = (block) => {
                const { id, title, description, checked, disabled } = block;
                const blockNum = id.slice(-1);

                return `
                    <div class="${CLASSES.settingsBlock}" id="${IDS[id]}">
                        <div class="${CLASSES.settingsHeader}" id="${IDS[id] + '-header'}">
                            <span class="${CLASSES.expandIcon}" id="${IDS[`expand${blockNum}`]}"></span>
                            <span>${title}</span>
                            <label class="switch">
                                <input type="checkbox" id="${IDS[`toggle${blockNum}`]}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <div class="${CLASSES.settingsText}" id="${IDS[`text${blockNum}`]}">
                            ${description}
                        </div>
                    </div>
                `;
            };

            const cookieBlocksHTML = SETTINGS_CONTENT.blocks.map(generateCookieBlock).join('');

            modal.innerHTML = `
                <div class="${CLASSES.header}" id="${IDS.header}">
                    Настройка cookie
                    <button class="${CLASSES.closeBtn}" id="${IDS.closeBtn}">✕</button>
                </div>
                <div class="${CLASSES.description}" id="${IDS.description}">
                    ${SETTINGS_CONTENT.description}
                </div>
                ${cookieBlocksHTML}
                <div class="${CLASSES.buttonContainer}" id="${IDS.buttonContainer}">
                    <button class="${CLASSES.button}" id="${IDS.btnAllowAll}">${BANNER_CONFIG.BUTTONS.all}</button>
                    <button class="${CLASSES.button}" id="${IDS.btnAllowSelected}">${BANNER_CONFIG.BUTTONS.selected}</button>
                </div>
            `;

            document.body.appendChild(modal);
            modal.offsetHeight;
            modal.classList.add(SETTINGS_CONFIG.CLASSES.visible);

            this.bindEvents();

            setTimeout(() => {
                document.addEventListener('click', this.handleOutsideClick);
            }, 0);
        },

        handleOutsideClick: (e) => {
            const modal = document.getElementById(SETTINGS_CONFIG.IDS.modal);
            if (modal && !modal.contains(e.target)) {
                SettingsComponent.remove();
                if (!CookieManager.get(COOKIE_NAME)) {
                    BannerComponent.show();
                }
            }
        },

        remove() {
            const existing = document.getElementById(SETTINGS_CONFIG.IDS.modal);
            if (existing) {
                this.hideDimmer();
                existing.classList.remove(SETTINGS_CONFIG.CLASSES.visible);
                existing.classList.add(SETTINGS_CONFIG.CLASSES.hidden);
                document.removeEventListener('click', this.handleOutsideClick);
                setTimeout(() => {
                    existing.parentNode?.removeChild(existing);
                }, 300);
            }
        },

        bindEvents() {
            const toggleText = (textId, expandIcon) => {
                const textElement = document.getElementById(textId);
                const isExpanded = textElement.classList.contains(SETTINGS_CONFIG.CLASSES.settingsTextExpanded);

                textElement.classList.toggle(SETTINGS_CONFIG.CLASSES.settingsTextExpanded, !isExpanded);
                expandIcon.classList.toggle(SETTINGS_CONFIG.CLASSES.toggle, !isExpanded);
            };

            for (const i of [1, 2, 3]) {
                const blockId = `block${i}`;
                const expandId = `expand${i}`;
                const textId = `text${i}`;

                const blockHeaderId = `${SETTINGS_CONFIG.IDS[blockId]}-header`;
                const expandElementId = SETTINGS_CONFIG.IDS[expandId];
                const textElementId = SETTINGS_CONFIG.IDS[textId];

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

            const { btnAllowAll, btnAllowSelected, toggle2, toggle3 } = SETTINGS_CONFIG.IDS;

            document.getElementById(btnAllowAll)?.addEventListener('click', () => {
                const permissions = Object.values(COOKIE_CATEGORIES).join(',');
                CookieManager.set(COOKIE_NAME, permissions, COOKIE_EXPIRY_DAYS);
                StorageManager.setConsentTimestamp();
                this.remove();
                PermissionManager.restore();
            });

            document.getElementById(btnAllowSelected)?.addEventListener('click', () => {
                const marketingChecked = document.getElementById(toggle2)?.checked ?? false;
                const otherChecked = document.getElementById(toggle3)?.checked ?? false;

                const selectedPermissions = [COOKIE_CATEGORIES.REQUIRED];
                if (marketingChecked) selectedPermissions.push(COOKIE_CATEGORIES.MARKETING);
                if (otherChecked) selectedPermissions.push(COOKIE_CATEGORIES.OTHER);

                CookieManager.set(COOKIE_NAME, selectedPermissions.join(','), COOKIE_EXPIRY_DAYS);
                StorageManager.setConsentTimestamp();
                this.remove();
                PermissionManager.restore();
            });

            document.getElementById(SETTINGS_CONFIG.IDS.closeBtn)?.addEventListener('click', () => {
                this.remove();
                if (!CookieManager.get(COOKIE_NAME)) {
                    BannerComponent.show();
                }
            });
        },

        showDimmer() {
            const dimmer = document.createElement('div');
            dimmer.id = SETTINGS_CONFIG.IDS.dimmer;
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
            const dimmer = document.getElementById(SETTINGS_CONFIG.IDS.dimmer);
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

    //region API

    window.checkCookiesPermission = PermissionManager.check;
    window.openCookieSettings = () => {
        BannerComponent.remove();
        injectCommonStyles();
        SettingsComponent.show();
    };

    ConsentManager.check();

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cc-open-settings')) {
            e.preventDefault();
            window.openCookieSettings();
        }
    });

})();
