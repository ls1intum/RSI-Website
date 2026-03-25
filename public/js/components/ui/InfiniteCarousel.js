import { createElement } from '../../core/utils.js';

export class InfiniteCarousel {
    constructor({
                    items = [],
                    renderItem,
                    slideWidth = 'clamp(320px, 92vw, 520px)',
                    gap = 16,
                    ariaLabel = 'Carousel',
                    autoplay = false,
                    autoplayInterval = 3000,
                    pauseOnHover = true
                }) {
        // FIX: Ensure items is always an array to prevent spread syntax errors
        this.items = Array.isArray(items) ? items : [];
        this.n = this.items.length;
        this.renderItem = renderItem;
        this.slideWidth = slideWidth;
        this.gap = gap;
        this.ariaLabel = ariaLabel;
        this.autoplay = autoplay;
        this.autoplayInterval = autoplayInterval;
        this.pauseOnHover = pauseOnHover;

        this.globalIndex = this.n;
        this.active = 0;
        this.isJumping = false;

        this.trackRef = null;
        this.indicators = [];
        this.slideElements = []; // Keep track of slide DOM nodes
        this.autoplayTimer = null;
        this.scrollEndTimer = null;
        this.hovering = false;

        this.handleScroll = this.handleScroll.bind(this);
    }

    centerSlideAt(index, behavior = 'smooth') {
        if (!this.trackRef || this.n === 0) return;
        const child = this.trackRef.children.item(index);
        if (!child) return;

        const left = child.offsetLeft - (this.trackRef.clientWidth - child.clientWidth) / 2;
        this.trackRef.scrollTo({ left, behavior });

        this.globalIndex = index;
        const newActive = index % this.n;

        if (this.active !== newActive || behavior === 'auto') {
            this.active = newActive;
            this.updateUI();
        }
    }

    scrollOne(dir) {
        if (this.isJumping || !this.n) return;
        const newIndex = this.globalIndex + (dir === 'left' ? -1 : 1);
        this.centerSlideAt(newIndex, 'smooth');
    }

    handleScroll() {
        if (!this.trackRef || this.isJumping || !this.n) return;

        const trackCenter = this.trackRef.scrollLeft + this.trackRef.clientWidth / 2;
        let minDistance = Infinity;
        let newGlobalIndex = this.globalIndex;

        for (let i = 0; i < this.trackRef.children.length; i++) {
            const slide = this.trackRef.children[i];
            const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
            const distance = Math.abs(trackCenter - slideCenter);

            if (distance < minDistance) {
                minDistance = distance;
                newGlobalIndex = i;
            }
        }

        if (newGlobalIndex !== this.globalIndex) {
            this.globalIndex = newGlobalIndex;
            this.active = newGlobalIndex % this.n;
            this.updateUI();
        }

        if (this.scrollEndTimer) clearTimeout(this.scrollEndTimer);

        this.scrollEndTimer = setTimeout(() => {
            const i = this.globalIndex;
            if (i < this.n) {
                this.globalIndex = i + this.n;
                this.jump();
            } else if (i >= this.n * 2) {
                this.globalIndex = i - this.n;
                this.jump();
            }
        }, 150);
    }

    jump() {
        this.isJumping = true;
        this.trackRef.style.scrollBehavior = 'auto';

        setTimeout(() => {
            this.centerSlideAt(this.globalIndex, 'auto');
            setTimeout(() => {
                this.isJumping = false;
                this.trackRef.style.scrollBehavior = 'smooth';
            }, 50);
        }, 0);
    }

    updateUI() {
        // Update dots
        this.indicators.forEach((dot, i) => {
            if (i === this.active) {
                dot.classList.add('carousel-indicator-dot--active');
            } else {
                dot.classList.remove('carousel-indicator-dot--active');
            }
        });

        // Update slide classes for CSS transitions
        this.slideElements.forEach((slide, i) => {
            if (i === this.globalIndex) {
                slide.classList.add('carousel-slide--active');
                slide.classList.remove('carousel-slide--inactive');
                slide.setAttribute('aria-current', 'true');
            } else {
                slide.classList.add('carousel-slide--inactive');
                slide.classList.remove('carousel-slide--active');
                slide.removeAttribute('aria-current');
            }
        });
    }

    setupAutoplay() {
        if (!this.autoplay || !this.n) return;
        const stop = () => clearInterval(this.autoplayTimer);
        const start = () => {
            stop();
            this.autoplayTimer = setInterval(() => this.scrollOne('right'), this.autoplayInterval);
        };
        if (this.pauseOnHover && this.hovering) stop();
        else start();
        return stop;
    }

    render() {
        if (this.n === 0) return createElement('div');

        const wrapper = createElement('div', { className: 'carousel', 'aria-live': 'polite' });

        wrapper.addEventListener('mouseenter', () => { this.hovering = true; this.setupAutoplay(); });
        wrapper.addEventListener('mouseleave', () => { this.hovering = false; this.setupAutoplay(); });

        const container = createElement('div', { className: 'carousel-container' });

        this.trackRef = createElement('div', {
            id: 'infinite-carousel-track',
            role: 'region',
            'aria-label': this.ariaLabel,
            tabIndex: 0,
            className: 'carousel-track',
            style: 'scroll-behavior: smooth;'
        });

        this.trackRef.addEventListener('scroll', this.handleScroll, { passive: true });

        // Safe spread now because this.items is guaranteed to be an array
        const slides = [...this.items, ...this.items, ...this.items];

        slides.forEach((item, i) => {
            const baseIdx = i % this.n;
            const slide = createElement('div', {
                className: 'carousel-slide carousel-slide--inactive',
                style: `width: ${this.slideWidth};`,
                role: 'group',
                'aria-roledescription': 'slide',
                'aria-label': `Slide ${baseIdx + 1}`
            });

            const content = createElement('div', { className: 'h-full w-full' });
            content.appendChild(this.renderItem(item, baseIdx));
            slide.appendChild(content);
            this.slideElements.push(slide);
            this.trackRef.appendChild(slide);
        });

        const createBtn = (dir, svgPath) => {
            const cssModifier = dir === 'left' ? 'prev' : 'next';
            const btn = createElement('button', {
                type: 'button',
                'aria-label': dir === 'left' ? 'Previous' : 'Next',
                className: `carousel-button carousel-button--${cssModifier}`
            });
            btn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${svgPath}"></path></svg>`;
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.scrollOne(dir); });
            return btn;
        };

        container.appendChild(this.trackRef);
        container.appendChild(createBtn('left', 'M15 19l-7-7 7-7'));  // Left chevron
        container.appendChild(createBtn('right', 'M9 5l7 7-7 7'));    // Right chevron
        wrapper.appendChild(container);

        const indicatorsContainer = createElement('div', { className: 'carousel-indicators' });
        this.items.forEach((_, i) => {
            const dot = createElement('span', { className: 'carousel-indicator-dot' });
            this.indicators.push(dot);
            indicatorsContainer.appendChild(dot);
        });
        wrapper.appendChild(indicatorsContainer);

        setTimeout(() => this.centerSlideAt(this.n, 'auto'), 0);
        this.setupAutoplay();

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.scrollOne('left');
            if (e.key === 'ArrowRight') this.scrollOne('right');
        });

        return wrapper;
    }
}