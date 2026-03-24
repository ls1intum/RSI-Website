import { createElement } from '../../lib/utils.js';

export class Navbar {
    constructor() {
        this.navItems = [
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
            { label: 'Process', href: '/process' },
            { label: 'Methods', href: '/methods' },
        ];

        this.menuOpen = false;
        this.elevated = false;

        this.element = null;
        this.mobileMenu = null;
        this.mobileButton = null;

        this.handleScroll = this.handleScroll.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    render() {
        const header = createElement('header', {
            className: 'sticky top-0 z-50 bg-transparent backdrop-blur transition-colors duration-300'
        });

        const nav = createElement('nav', {
            className: 'mx-auto w-full max-w-[1336px] px-4 lg:px-6',
            'aria-label': 'Global'
        });

        const navContainer = createElement('div', {
            className: 'h-16 flex items-center justify-between pb-1 relative'
        });

        navContainer.appendChild(this._createLogo());
        navContainer.appendChild(this._createDesktopNav());
        navContainer.appendChild(this._createMobileButton());

        nav.appendChild(navContainer);
        nav.appendChild(this._createMobileMenu());

        header.appendChild(nav);
        this.element = header;

        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this.handleScroll();
        this.updateActiveLinks();

        return header;
    }

    _createLogo() {
        const logo = createElement('a', {
            href: '/',
            className: 'flex items-center gap-3 shrink-0 text-lg font-semibold tracking-tight text-surface-fg leading-none',
            'aria-label': 'Conscious Design'
        });

        logo.innerHTML = `
            <img src="/svg/logo.svg" alt="Course logo" width="28" height="28" />
            <span class="hidden lg:inline">
                Responsible, Sustainable, and Inclusive Digital Product Creation
            </span>
            <span class="lg:hidden">
                Conscious Digital Product Creation
            </span>
        `;

        return logo;
    }

    _createDesktopNav() {
        const container = createElement('div', {
            className: 'hidden md:flex items-center gap-8'
        });

        this.navItems.forEach(item => container.appendChild(this._createNavItem(item, false)));

        return container;
    }

    _createNavItem(item, isMobile) {
        const isModal = item.modal;
        const tag = isModal ? 'button' : 'a';

        const props = {
            className: 'nav-item relative text-base font-medium transition-colors block px-2 py-1 after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-full after:bg-brand-accent after:transition-transform after:origin-left'
        };

        if (isModal) {
            props.type = 'button';
            props['aria-haspopup'] = 'dialog';
            props.className += ' text-text-muted hover:text-surface-fg after:scale-x-0 hover:after:scale-x-100';
        } else {
            props.href = item.href;
            props['data-href'] = item.href;
        }

        const element = createElement(tag, props, item.label);

        element.addEventListener('click', () => {
            if (isModal) {
                document.dispatchEvent(new CustomEvent('open-reflection-modal'));
            }
            if (isMobile) this.closeMenu();
        });

        return element;
    }

    _createMobileButton() {
        const button = createElement('button', {
            className: 'md:hidden p-2 rounded-md text-surface-fg hover:bg-surface-border transition',
            'aria-label': 'Toggle menu'
        });

        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;

        button.addEventListener('click', () => this.toggleMenu());
        this.mobileButton = button;
        return button;
    }

    _createMobileMenu() {
        const menu = createElement('div', { className: 'md:hidden hidden' });

        const content = createElement('div', {
            className: 'flex flex-col gap-2 mt-2 px-0 sm:px-2 pb-4'
        });

        this.navItems.forEach(item => content.appendChild(this._createNavItem(item, true)));

        menu.appendChild(content);
        this.mobileMenu = menu;
        return menu;
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        this._syncMenuDOM();
    }

    closeMenu() {
        if (!this.menuOpen) return;
        this.menuOpen = false;
        this._syncMenuDOM();
    }

    _syncMenuDOM() {
        const path = this.mobileButton.querySelector('path');

        if (this.menuOpen) {
            this.mobileMenu.classList.remove('hidden');
            path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            document.addEventListener('mousedown', this.handleClickOutside);
        } else {
            this.mobileMenu.classList.add('hidden');
            path.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            document.removeEventListener('mousedown', this.handleClickOutside);
        }
    }

    handleClickOutside(event) {
        if (
            (this.mobileMenu && this.mobileMenu.contains(event.target)) ||
            (this.mobileButton && this.mobileButton.contains(event.target))
        ) return;
        this.closeMenu();
    }

    handleScroll() {
        const shouldElevate = window.scrollY > 4;
        if (shouldElevate !== this.elevated) {
            this.elevated = shouldElevate;
            this.element.classList.toggle('border-b', this.elevated);
            this.element.classList.toggle('border-surface-border', this.elevated);
        }
    }

    updateActiveLinks() {
        const currentPath = window.location.pathname;
        const links = this.element.querySelectorAll('.nav-item');

        links.forEach(link => {
            if (link.tagName.toLowerCase() === 'button') return;

            const href = link.getAttribute('data-href');
            const isActive = href === currentPath;

            link.classList.remove(
                'text-surface-fg', 'text-text-muted', 'hover:text-surface-fg',
                'after:scale-x-100', 'after:scale-x-0', 'hover:after:scale-x-100'
            );

            if (isActive) {
                link.classList.add('text-surface-fg', 'after:scale-x-100');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.add('text-text-muted', 'hover:text-surface-fg', 'after:scale-x-0', 'hover:after:scale-x-100');
                link.removeAttribute('aria-current');
            }
        });
    }
}
