class HystModal {
    /**
     * При создании экземпляра класса, мы передаём в него
     * js-объект с настройками. Он становится доступен
     * в конструкторе класса в виде переменной props
     */
    constructor(props) {
        let defaultConfig = {
            linkAttributeName: 'data-hystmodal',
            // ... здесь остальные свойства
        }
        this.config = Object.assign(defaultConfig, props);
        this._closeAfterTransition = this._closeAfterTransition.bind(this);
        // сразу вызываем метод инициализации
        this.init();
    }

    /**
     * В свойство _shadow будет заложен div с визуальной
     * подложкой. Оно сделано статическим, т.к. при создании
     * нескольких экземпляров класса, эта подложка нужна только
     * одна
     */
    static _shadow = false;

    init() {
        /**
         * Создаём триггеры состояния, полезные переменные и.т.д.
         */
        this.isOpened = false; // открыто ли окно
        this.openedWindow = false; //ссылка на открытый .hystmodal
        this._modalBlock = false; //ссылка на открытый .hystmodal__window
        this.starter = false; //ссылка на элемент "открыватель" текущего окна
        this._nextWindows = false; //ссылка на .hystmodal который нужно открыть
        this._scrollPosition = 0; //текущая прокрутка (см. выше)

        this._focusElements = [
            'a[href]',
            'area[href]',
            'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
            'select:not([disabled]):not([aria-hidden])',
            'textarea:not([disabled]):not([aria-hidden])',
            'button:not([disabled]):not([aria-hidden])',
            'iframe',
            'object',
            'embed',
            '[contenteditable]',
            '[tabindex]:not([tabindex^="-"])'
        ];

        if (!HystModal._shadow) {
            HystModal._shadow = document.createElement('div');
            HystModal._shadow.classList.add('hystmodal__shadow');
            document.body.appendChild(HystModal._shadow);
        }

        //Запускаем метод для обработки событий
        this.eventsFeeler();
    }

    eventsFeeler() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest(`[${this.config.linkAttributeName}]`);
            if (target) {
                e.preventDefault();
                const modalSelector = target.getAttribute(this.config.linkAttributeName);
                this.starter = target;
                this.open(modalSelector);
            }
        }.bind(this));

        document.addEventListener('click', function (e) {
            const closeButton = e.target.closest('[data-hystclose]');
            if (closeButton) {
                e.preventDefault();
                this.close();
            }
        }.bind(this));

        document.addEventListener('mousedown', function (e) {
            if (!e.target.classList.contains('hystmodal__wrap')) return;
            this._overlayChecker = true;
        }.bind(this));

        document.addEventListener('mouseup', function (e) {
            if (this._overlayChecker && e.target.classList.contains('hystmodal__wrap')) {
                e.preventDefault();
                this.close();
            }
            this._overlayChecker = false;
        }.bind(this));

        window.addEventListener("keydown", function (e) {
            if (e.which == 27 && this.isOpened) { // Escape
                e.preventDefault();
                this.close();
            }
            if (e.which == 9 && this.isOpened) { // Tab
                this.focusCatcher(e);
            }
        }.bind(this));
    }

    focusContol() {
        const nodes = this.openedWindow.querySelectorAll(this._focusElements);
        if (this.isOpened && this.starter) {
            this.starter.focus();
        } else {
            if (nodes.length) nodes[0].focus();
        }
    }

    focusCatcher(e) {
        const nodes = this.openedWindow.querySelectorAll(this._focusElements);
        const nodesArray = Array.prototype.slice.call(nodes);

        if (!this.openedWindow.contains(document.activeElement)) {
            nodesArray[0].focus();
            e.preventDefault();
        } else {
            const focusedItemIndex = nodesArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedItemIndex === 0) {
                nodesArray[nodesArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
                nodesArray[0].focus();
                e.preventDefault();
            }
        }
    }

    open(selector) {
        this.openedWindow = document.querySelector(selector);
        if (!this.openedWindow) return;

        this._modalBlock = this.openedWindow.querySelector('.hystmodal__window');
        this.openedWindow.classList.add("hystmodal--active");
        HystModal._shadow.classList.add("hystmodal__shadow--show");
        document.body.classList.add("hystmodal__opened");

        // Используем inert для блокировки фонового контента
        this._setInertForBackground(true);

        this.isOpened = true;

        this._setFocusToFirstNode();
        this._bodyScrollControl();
    }

    close() {
        if (!this.isOpened) return;

        // Анимация закрытия окна
        this.openedWindow.classList.add("hystmodal--moved");
        this.openedWindow.addEventListener("transitionend", this._closeAfterTransition);
        this.openedWindow.classList.remove("hystmodal--active");

        // Удаляем класс и стили с body после анимации
        document.body.classList.remove("hystmodal__opened");

        // Используем setTimeout, чтобы дождаться завершения анимации
        setTimeout(() => {
            document.body.style.overflow = '';  // Сбрасываем стиль overflow
        }, 300); // Задержка, чтобы дать анимации время на завершение (300ms соответствует длительности анимации)
    }

    _closeAfterTransition() {
        this.openedWindow.classList.remove("hystmodal--moved");
        this.openedWindow.removeEventListener("transitionend", this._closeAfterTransition);
        HystModal._shadow.classList.remove("hystmodal__shadow--show");
        this.openedWindow.setAttribute('aria-hidden', 'true');
        this.focusContol();
        this._bodyScrollControl();

        // Используем inert для фонового контента
        this._setInertForBackground(false);

        this.isOpened = false;
    }

    _setFocusToFirstNode() {
        const firstFocusableElement = this.openedWindow.querySelector(this._focusElements);
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
    }

    _bodyScrollControl() {
        if (this.isOpened) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    _setInertForBackground(isInert) {
        // Применяем inert ко всем элементам фона (кроме самого модального окна)
        const bodyElements = document.body.children;
        Array.from(bodyElements).forEach(element => {
            if (!element.contains(this.openedWindow)) {
                if (isInert) {
                    element.setAttribute('inert', 'true');
                } else {
                    element.removeAttribute('inert');
                }
            }
        });
    }
}

