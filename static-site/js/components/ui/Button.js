import { cn } from '../../lib/utils.js';

export function createButton({
    text = '',
    href = null,
    variant = 'solid',
    size = 'md',
    shape = 'pill',
    color = 'default',
    className = '',
    children = []
} = {}) {
    const baseClasses = [
        'inline-flex items-center justify-center gap-2 whitespace-nowrap select-none font-medium',
        'transition-colors transition-transform duration-150 ease-in-out',
        'hover:scale-[1.02] active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black',
        'disabled:opacity-50 disabled:pointer-events-none'
    ];

    const sizeClasses = {
        xs: 'h-8 px-3 text-xs',
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        xl: 'h-12 px-6 text-lg'
    };

    const shapeClasses = {
        pill: 'rounded-full',
        rounded: 'rounded-md',
        sharp: 'rounded-none'
    };

    const variantClasses = {
        solid: '',
        outline: 'bg-transparent border',
        link: 'inline-flex items-center gap-2 underline underline-offset-8 decoration-1 hover:decoration-2 hover:opacity-80'
    };

    const colorClasses = {
        default: 'border-black text-black bg-transparent hover:bg-black hover:text-white',
        white: 'border-white text-white bg-transparent hover:bg-white hover:text-black'
    };

    if (variant === 'solid') {
        colorClasses.default = 'bg-black text-white border-black';
        colorClasses.white = 'bg-white text-black border-white';
    }

    const classes = cn(
        ...baseClasses,
        sizeClasses[size],
        shapeClasses[shape],
        variantClasses[variant],
        colorClasses[color],
        className
    );

    const tag = href ? 'a' : 'button';
    const el = document.createElement(tag);
    el.className = classes;
    if (href) el.href = href;
    else el.type = 'button';
    if (text) el.textContent = text;
    children.forEach(child => el.appendChild(child));

    return el;
}

export function createBadge({
    text = '',
    variant = 'solid',
    size = 'md',
    shape = 'pill',
    className = ''
} = {}) {
    const variantClasses = {
        solid: 'bg-black text-white',
        outline: 'bg-transparent border border-black text-black',
        soft: 'bg-black/10 text-black'
    };

    const sizeClasses = {
        sm: 'h-6 px-2 text-xs',
        md: 'h-7 px-2.5 text-sm',
        lg: 'h-8 px-3 text-base',
        xl: 'h-10 px-4 text-lg'
    };

    const shapeClasses = {
        pill: 'rounded-full',
        rounded: 'rounded-md',
        sharp: 'rounded-none'
    };

    const badge = document.createElement('span');
    badge.className = cn(
        'inline-flex items-center gap-1 font-medium select-none',
        variantClasses[variant],
        sizeClasses[size],
        shapeClasses[shape],
        className
    );
    badge.textContent = text;

    return badge;
}
