// components/layout/PageLayout.js
import { createElement, cn } from '../../core/utils.js';

/**
 * Root wrapper for all page content. Sits below the sticky Navbar.
 */
export function PageLayout({ children, className }) {
    return createElement('main', {
        className: cn('relative isolate mt-16 min-h-screen bg-bg', className)
    }, ...children);
}

/**
 * Animated section container that fades up on scroll.
 * The `delay` prop adds a CSS transition-delay (ms).
 */
export function MotionSection({ id, children = [], className, delay = 0 }) {
    const section = createElement('section', {
        id,
        className: cn('relative mx-auto max-w-7xl px-4 lg:px-6 py-12 fade-up-hidden', className),
        style: delay ? `transition-delay: ${delay}ms;` : ''
    });

    section.appendChild(createElement('div', {}, ...children));
    return section;
}
