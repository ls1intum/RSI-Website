// components/ui/Grid.js
import { createElement, cn, normalizeSrc, formatDate } from '../../lib/utils.js';

export function GridCard({ article, basePath, badge, className }) {
    const src = normalizeSrc(article.heroSrc);

    const imageContainer = createElement('div', { className: 'relative aspect-[4/3]' });
    if (src) {
        imageContainer.appendChild(createElement('img', {
            src,
            alt: article.heroAlt || article.title,
            className: 'object-cover w-full h-full transition-transform duration-200 group-hover:scale-[1.02]'
        }));
    } else {
        imageContainer.appendChild(createElement('div', {
            className: 'flex h-full w-full items-center justify-center text-xs text-text-muted bg-surface/60'
        }, 'No image'));
    }

    const contentDiv = createElement('div', {
        className: 'border border-surface-border border-t-0 rounded-b-2xl p-4'
    });

    if (badge) {
        contentDiv.appendChild(createElement('span', {
            className: 'mb-2 inline-block text-xs font-medium uppercase tracking-wide text-text-muted'
        }, badge));
    }

    contentDiv.appendChild(createElement('h3', {
        className: 'text-lg font-semibold leading-snug text-surface-fg line-clamp-2'
    }, article.title));

    const lead = article.description || article.lead;
    if (lead) {
        contentDiv.appendChild(createElement('p', {
            className: 'mt-2 text-sm text-text-muted line-clamp-3'
        }, lead));
    }

    if (article.date) {
        contentDiv.appendChild(createElement('p', {
            className: 'mt-3 text-xs text-text-muted'
        }, formatDate(article.date)));
    }

    return createElement('a', {
        href: `/${basePath}/${article.slug}`,
        className: cn(
            'group block rounded-2xl overflow-hidden transition-transform duration-200',
            'hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary',
            className
        )
    }, imageContainer, contentDiv);
}

export function Grid({ articles = [], basePath, title, id }) {
    const section = createElement('section', {
        className: 'mx-auto max-w-6xl px-4 py-16',
        id,
        'aria-labelledby': id,
        'aria-label': !id ? (title || basePath) : undefined
    });

    if (title) {
        section.appendChild(createElement('h2', {
            id,
            className: 'mb-6 text-2xl font-bold tracking-tight text-surface-fg'
        }, title));
    }

    if (articles.length > 0) {
        const ul = createElement('ul', {
            className: 'grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        });

        articles.forEach(article => {
            const li = createElement('li', { className: 'list-none' });
            li.appendChild(GridCard({ article, basePath }));
            ul.appendChild(li);
        });

        section.appendChild(ul);
    } else {
        section.appendChild(createElement('div', {
            className: 'flex h-24 items-center justify-center text-sm text-text-muted border border-surface-border border-dashed rounded-lg'
        }, 'No articles yet. Check back soon.'));
    }

    return section;
}