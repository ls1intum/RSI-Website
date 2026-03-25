// features/projects/ProjectArticle.js
import { createElement, cn, normalizeSrc, formatDate } from '../../core/utils.js';
import { Breadcrumb } from '../../components/ui/Breadcrumb.js';

/**
 * Renders a full project/article page layout.
 * Accepts pre-sanitized `contentHtml` for the body.
 *
 * heroSrc, heroAlt, and lead are intentionally not passed from ProjectDetailPage
 * so that students fully control the detail page content via their submitted HTML.
 * Those fields are used only by the overview grid (GridCard) via projects.json.
 */
export function ProjectArticle({
                                   title,
                                   heroSrc,
                                   heroAlt,
                                   heroAspect = 'aspect-[16/9]',
                                   lead,
                                   date,
                                   className,
                                   breadcrumbs,
                                   contentHtml
                               }) {
    const article = createElement('article', {
        className: cn('mx-auto mt-10 max-w-3xl px-4 py-10', className)
    });

    if (breadcrumbs && breadcrumbs.length) {
        article.appendChild(Breadcrumb({
            items: breadcrumbs,
            containerClassName: 'max-w-4xl mb-6 pt-0',
            className: 'text-xs md:text-sm'
        }));
    }

    const header = createElement('header', {});

    header.appendChild(createElement('h1', {
        className: 'mb-2 text-3xl font-semibold tracking-tight text-surface-fg md:text-4xl'
    }, title));

    if (date) {
        const dateDiv = createElement('div', { className: 'mt-3 text-xs text-text-muted' });
        dateDiv.appendChild(createElement('time', { dateTime: date }, formatDate(date)));
        header.appendChild(dateDiv);
    }

    if (heroSrc) {
        const imgContainer = createElement('div', {
            className: 'mt-5 overflow-hidden rounded-2xl bg-surface/80'
        });
        const aspectDiv = createElement('div', { className: cn('relative w-full', heroAspect) });
        aspectDiv.appendChild(createElement('img', {
            src: normalizeSrc(heroSrc),
            alt: heroAlt || '',
            className: 'object-cover w-full h-full'
        }));
        imgContainer.appendChild(aspectDiv);
        header.appendChild(imgContainer);
    }

    if (lead) {
        header.appendChild(createElement('p', {
            className: 'mt-6 text-base font-medium leading-7 text-text-muted'
        }, lead));
    }

    article.appendChild(header);

    const body = createElement('div', {
        className: 'mt-8 space-y-6 prose prose-lg submission-content max-w-none'
    });
    body.innerHTML = contentHtml || '';
    article.appendChild(body);

    return article;
}