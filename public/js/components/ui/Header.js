// components/ui/Header.js
import { createElement, cn } from '../../core/utils.js';

const SIZE_MAP = {
    sm: { title: 'text-2xl md:text-3xl leading-tight', subtitle: 'text-base leading-7', space: 'gap-3' },
    md: { title: 'text-3xl md:text-4xl leading-tight', subtitle: 'text-base md:text-lg leading-7 md:leading-8', space: 'gap-4' },
    lg: { title: 'text-4xl md:text-5xl leading-[1.15]', subtitle: 'text-lg md:text-xl leading-8 md:leading-9', space: 'gap-5' },
    xl: { title: 'text-[42px] md:text-[54px] leading-[1.2] md:leading-[63px] tracking-[-0.02em]', subtitle: 'text-lg md:text-xl leading-8 md:leading-9', space: 'gap-6' },
};

const MAX_WIDTH_MAP = {
    sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl',
    '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl', '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl', '7xl': 'max-w-7xl',
};

export function Header({ id, className, eyebrow, title, subtitle, align = 'left', size = 'xl', maxWidth = '3xl' }) {
    const { title: titleClasses, subtitle: subtitleClasses, space } = SIZE_MAP[size];
    const elements = [];

    if (eyebrow) {
        elements.push(createElement('span', {
            className: 'inline-flex items-center gap-1 font-medium select-none bg-transparent border border-fg text-fg h-8 px-4 text-sm rounded-full capitalize'
        }, eyebrow));
    }

    elements.push(createElement('h1', {
        className: cn('font-inter font-semibold text-fg', titleClasses)
    }, title));

    if (subtitle) {
        elements.push(createElement('p', {
            className: cn('font-inter text-muted-fg', subtitleClasses)
        }, subtitle));
    }

    return createElement('div', {
        id,
        className: cn(
            'flex flex-col px-4',
            space,
            align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left',
            MAX_WIDTH_MAP[maxWidth],
            className
        )
    }, ...elements);
}

export function PageHero({ id, eyebrow, title, subtitle, size = 'xl', align = 'center', background = 'bg-bg' }) {
    return createElement('section', {
        id,
        className: cn('relative overflow-hidden opacity-0 animate-fade-up [animation-fill-mode:forwards]', background)
    },
        Header({ id: `${id}-title`, eyebrow, align, title, subtitle, size, maxWidth: '5xl' })
    );
}
