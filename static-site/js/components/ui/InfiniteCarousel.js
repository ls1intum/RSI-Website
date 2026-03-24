import { createElement } from '../../lib/utils.js';

export class InfiniteCarousel {
    constructor({
        items = [],
        renderItem,
        slideWidth = 'clamp(320px, 92vw, 520px)',
        gap = 16,
        ariaLabel = 'Carousel',
        autoplay = false,
        autoplayInterval = 3000,
        pauseOnHover = true,
        showIndicators = true,
    }) {
        this.items = Array.isArray(items) ? items : [];
        this.n = this.items.length;
        this.renderItem = renderItem;
        this.slideWidth = slideWidth;
        this.gap = gap;
        this.ariaLabel = ariaLabel;
        this.autoplay = autoplay;
        this.autoplayInterval = autoplayInterval;
        this.pauseOnHover = pauseOnHover;
        this.showIndicators = showIndicators;

        this.globalIndex = this.n;
        this.active = 0;
        this.isJumping = false;
        this.manualLock = false;

        this.trackRef = null;
        this.indicators = [];
        this.slideElements = [];
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
            this._updateUI();
        }
    }

    scrollOne(dir) {
        if (!this.n) return;
        const delta = (dir === 'left' || dir === 'prev') ? -1 : 1;
        this.centerSlideAt(this.globalIndex + delta, 'smooth');
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
            this._updateUI();
        }

        if (this.scrollEndTimer) clearTimeout(this.scrollEndTimer);
        this.scrollEndTimer = setTimeout(() => {
            const i = this.globalIndex;
            if (i < this.n) {
                this.globalIndex = i + this.n;
                this._jump();
            } else if (i >= this.n * 2) {
                this.globalIndex = i - this.n;
                this._jump();
            }
        }, 150);
    }

    _jump() {
        this.isJumping = true;
        this.trackRef.style.scrollBehavior = 'auto';
        setTimeout(() => {
            this.centerSlideAt(this.globalIndex, 'auto');
            setTimeout(() => {
                this.isJumping = false;
                this.trackRef.style.scrollBehavior = 'smooth';
                // If a manual interaction had locked the controls, release it now
                try { this.manualLock = false; } catch (e) {}
            }, 50);
        }, 0);
    }

    _updateUI() {
        this.indicators.forEach((dot, i) => {
            dot.classList.toggle('carousel-indicator-dot--active', i === this.active);
        });

        this.slideElements.forEach((slide, i) => {
            const isActive = i === this.globalIndex;
            slide.classList.toggle('carousel-slide--active', isActive);
            slide.classList.toggle('carousel-slide--inactive', !isActive);
            if (isActive) slide.setAttribute('aria-current', 'true');
            else slide.removeAttribute('aria-current');
        });
    }

    _setupAutoplay() {
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

    _createNavButton(dir, svgPath) {
        const btn = createElement('button', {
            type: 'button',
            'aria-label': dir === 'prev' ? 'Previous' : 'Next',
            className: `carousel-button carousel-button--${dir}`
        });
        btn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${svgPath}"></path></svg>`;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Prevent quick double-clicks advancing the carousel twice
            if (this.manualLock) return;
            this.manualLock = true;
            this.scrollOne(dir);
            // Release manual lock after short delay as fallback; _jump() will release it on normalization.
            setTimeout(() => { try { this.manualLock = false; } catch (e) {} }, 800);
        });
        return btn;
    }

    render() {
        if (this.n === 0) return createElement('div');

        const wrapper = createElement('div', { className: 'carousel', 'aria-live': 'polite' });

        wrapper.addEventListener('mouseenter', () => { this.hovering = true; this._setupAutoplay(); });
        wrapper.addEventListener('mouseleave', () => { this.hovering = false; this._setupAutoplay(); });

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

        // Render 3× the items for seamless infinite looping
        [...this.items, ...this.items, ...this.items].forEach((item, i) => {
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

        container.appendChild(this.trackRef);
        container.appendChild(this._createNavButton('prev', 'M15 19l-7-7 7-7'));
        container.appendChild(this._createNavButton('next', 'M9 5l7 7-7 7'));
        wrapper.appendChild(container);

        if (this.showIndicators) {
            const indicatorsContainer = createElement('div', { className: 'carousel-indicators' });
            this.items.forEach(() => {
                const dot = createElement('span', { className: 'carousel-indicator-dot' });
                this.indicators.push(dot);
                indicatorsContainer.appendChild(dot);
            });
            wrapper.appendChild(indicatorsContainer);
        }

        setTimeout(() => this.centerSlideAt(this.n, 'auto'), 0);
        this._setupAutoplay();

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.scrollOne('prev');
            if (e.key === 'ArrowRight') this.scrollOne('next');
        });

        return wrapper;
    }
}
