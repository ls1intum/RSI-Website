// features/sessions/SessionCard.js
import {cn, createElement} from '../../core/utils.js';

export function SessionCard({
    title,
    description,
    color,
    disabled = false,
    index1,
    className
}) {
    const dotColor = disabled ? '#D0D5DD' : (color ?? '#4F46E5');
    const id = index1 ?? title.replace(/\s+/g, '-').toLowerCase();

    const article = createElement('article', {
        className: cn(
            'rounded-2xl border border-gray-200 bg-[hsl(var(--surface)/0.8)] p-8 flex flex-col transition-transform duration-200 w-full h-full',
            !disabled && 'hover:-translate-y-1 hover:shadow-lg cursor-pointer',
            disabled && 'opacity-60 grayscale',
            className
        ),
        'aria-disabled': disabled ? 'true' : undefined,
        'aria-labelledby': `phase-title-${id}`,
        'aria-describedby': description || disabled ? `phase-desc-${id}` : undefined,
        role: 'region'
    });

    const titleEl = createElement('h3', {
        id: `phase-title-${id}`,
        className: 'text-xl font-semibold text-fg mb-3 flex items-center gap-2'
    });

    titleEl.appendChild(createElement('span', {
        className: 'h-3 w-3 rounded-full shrink-0',
        style: `background-color: ${dotColor}`,
        'aria-hidden': 'true'
    }));
    titleEl.appendChild(document.createTextNode(title));
    article.appendChild(titleEl);

    if (description) {
        article.appendChild(createElement('p', {
            id: `phase-desc-${id}`,
            className: 'text-[15px] leading-relaxed text-[hsl(var(--muted-fg))] flex-1'
        }, description));
    }

    if (disabled) {
        article.appendChild(createElement('p', {
            id: `phase-disabled-${id}`,
            className: 'mt-4 text-sm text-[hsl(var(--muted-fg))] italic'
        }, '🚧 This phase is part of future work and will be developed later.'));
    }

    return article;
}
