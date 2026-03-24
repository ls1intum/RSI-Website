// lib/utils.js

export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export function createElement(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (key === 'className') el.className = cn(value);
        else if (key === 'innerHTML') el.innerHTML = value;
        else if (key === 'onClick') el.addEventListener('click', value);
        else if (key.startsWith('aria-') || key.startsWith('data-')) el.setAttribute(key, value);
        else el[key] = value;
    }
    children.forEach(child => {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child instanceof Node) el.appendChild(child);
    });
    return el;
}

/**
 * Attaches an IntersectionObserver to all `.fade-up-hidden` elements currently
 * in the DOM. When an element enters the viewport it transitions to visible and
 * is no longer observed (animates once).
 */
export function initScrollAnimations() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('fade-up-hidden');
                entry.target.classList.add('fade-up-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    document.querySelectorAll('.fade-up-hidden').forEach(el => observer.observe(el));
}

export function normalizeArray(data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
}

export function normalizeSteps(steps) {
    if (!steps) return [];
    if (Array.isArray(steps)) return steps.map(s => typeof s === 'string' ? { description: s } : s);
    return [];
}

export function normalizeSrc(src) {
    if (!src) return null;
    if (src.startsWith('data:')) return src;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    if (src.startsWith('public/')) return src.replace(/^public\//, '');
    if (src.startsWith('/')) return src;
    return `/${src}`;
}

export function formatDate(dateString) {
    if (!dateString) return '';
    return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(dateString));
}
