// components/ui/Breadcrumb.js
import { createElement, cn } from '../../core/utils.js';

export function Breadcrumb({ items = [], containerClassName = '', className = '', separator = '/' }) {
    if (!items || items.length === 0) return createElement('span');

    const ol = createElement('ol', { className: 'flex flex-wrap items-center' });

    items.forEach((item, index) => {
        const isLast = index === items.length - 1;
        const li = createElement('li', { className: 'flex items-center' });

        if (isLast || !item.href) {
            li.appendChild(createElement('span', {
                'aria-current': 'page',
                className: 'text-[#282828] font-medium line-clamp-1',
                title: typeof item.label === 'string' ? item.label : undefined
            }, item.label));
        } else {
            li.appendChild(createElement('a', {
                href: item.href,
                className: 'hover:underline focus:underline outline-none'
            }, item.label));
        }

        if (!isLast) {
            li.appendChild(createElement('span', {
                className: 'mx-2 select-none',
                'aria-hidden': 'true'
            }, separator));
        }

        ol.appendChild(li);
    });

    const nav = createElement('nav', {
        'aria-label': 'Breadcrumb',
        className: cn('text-sm text-[#5F6980]', className)
    }, ol);

    return createElement('div', {
        className: cn('max-w-8xl pt-10 mb-7', containerClassName)
    }, nav);
}
