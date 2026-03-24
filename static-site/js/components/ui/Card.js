// components/ui/Card.js
import { createElement, cn } from '../../lib/utils.js';

export function Card({ className, children }) {
    return createElement('div', {
        className: cn('card-base', className)
    }, ...children);
}

export function CardBody({ className, children }) {
    return createElement('div', {
        className: cn('p-6', className)
    }, ...children);
}

export function truncate(str, length) {
    if (!str || str.length <= length) return str;
    return str.slice(0, length) + '...';
}
