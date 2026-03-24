// features/methods/TipsCarousel.js
import { createElement } from '../../lib/utils.js';

/**
 * A simple infinite-loop carousel for short tip strings.
 * Extracted from MethodDetailPage to keep pages thin.
 */
export function TipsCarousel(tips) {
    if (!tips || tips.length === 0) return createElement('span');

    const section = createElement('section', { className: 'fade-up-hidden pt-10' });
    section.appendChild(createElement('h2', {
        className: 'text-3xl sm:text-4xl font-semibold tracking-tight text-fg text-center mb-12'
    }, 'Tips & Tricks'));

    const carouselWrapper = createElement('div', { className: 'carousel' });
    const container = createElement('div', { className: 'carousel-container' });
    const track = createElement('div', { className: 'carousel-track no-scrollbar' });

    const repeatedTips = [...tips, ...tips, ...tips];

    repeatedTips.forEach((tip, index) => {
        const isActive = index >= tips.length && index < tips.length * 2;
        const slide = createElement('div', {
            className: `carousel-slide ${isActive ? 'carousel-slide--active' : 'carousel-slide--inactive'} w-[320px] md:w-[400px]`
        });

        const card = createElement('div', {
            className: 'rounded-2xl border border-border bg-surface p-5 h-full w-full'
        });
        card.appendChild(createElement('p', {
            className: 'text-fg leading-relaxed text-[15px]'
        }, tip));

        slide.appendChild(card);
        track.appendChild(slide);
    });

    container.appendChild(track);

    if (tips.length > 1) {
        const getScrollStep = () => Math.min(track.clientWidth * 0.8, 320);

        const prevBtn = createElement('button', {
            className: 'carousel-button carousel-button--prev',
            'aria-label': 'Previous',
            innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`
        });

        const nextBtn = createElement('button', {
            className: 'carousel-button carousel-button--next',
            'aria-label': 'Next',
            innerHTML: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`
        });

        prevBtn.onclick = () => track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        nextBtn.onclick = () => track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });

        carouselWrapper.appendChild(prevBtn);
        carouselWrapper.appendChild(nextBtn);
    }

    carouselWrapper.appendChild(container);
    section.appendChild(carouselWrapper);

    setTimeout(() => {
        const getSegmentWidth = () => track.scrollWidth / 3;
        track.scrollTo({ left: getSegmentWidth(), behavior: 'auto' });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('carousel-slide--active', entry.isIntersecting);
                entry.target.classList.toggle('carousel-slide--inactive', !entry.isIntersecting);
            });
        }, { root: track, threshold: 0.6 });

        Array.from(track.children).forEach(slide => observer.observe(slide));

        track.addEventListener('scroll', () => {
            const segment = getSegmentWidth();
            if (track.scrollLeft <= 1) {
                track.scrollTo({ left: track.scrollLeft + segment, behavior: 'auto' });
            } else if (track.scrollLeft >= segment * 2 - 1) {
                track.scrollTo({ left: track.scrollLeft - segment, behavior: 'auto' });
            }
        }, { passive: true });
    }, 100);

    return section;
}
