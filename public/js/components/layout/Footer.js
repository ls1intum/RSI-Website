import {cn, createElement} from '../../core/utils.js';

export class Footer {
    constructor() {
        this.sections = [
            {
                heading: 'Explore',
                links: [
                    { label: 'home', href: '/' },
                    { label: 'Projects', href: '/projects' }
                ]
            },
            {
                heading: 'Resources',
                links: [
                    { label: 'Process', href: '/process' },
                    { label: 'Methods', href: '/methods' }
                ]
            }
        ];
    }

    render() {
        const year = new Date().getFullYear();

        const footer = createElement('footer', {
            className: 'border-t-2 border-surface-border bg-bg text-text',
            role: 'contentinfo',
            'aria-labelledby': 'footer-heading'
        });

        const container = createElement('div', {
            className: 'mx-auto max-w-[1336px] px-4 lg:px-6 py-12'
        });

        const topGrid = createElement('div', {
            className: 'grid grid-cols-1 gap-12 md:grid-cols-12'
        });

        topGrid.appendChild(this._createBrandSection());
        topGrid.appendChild(this._createLinksSection());
        topGrid.appendChild(this._createCourseSection());

        container.appendChild(topGrid);
        container.appendChild(this._createBottomBar(year));
        footer.appendChild(container);

        return footer;
    }

    _createBrandSection() {
        const section = createElement('div', { className: 'md:col-span-3 flex flex-col gap-3' });

        section.appendChild(createElement('a', {
            href: '/',
            className: 'text-lg font-semibold tracking-tight text-surface-fg',
            'aria-label': 'Course home'
        }, 'Responsible, Sustainable, and Inclusive Digital Product Creation'));

        section.appendChild(createElement('p', {
            className: 'text-sm text-text-muted leading-relaxed max-w-xs'
        }, 'A project week offered by the chair of Applied Educational Technologies at CIT TUM.'));

        return section;
    }

    _createLinksSection() {
        const section = createElement('div', {
            className: 'md:col-span-5 grid grid-cols-2 gap-y-6 gap-x-8',
            'aria-labelledby': 'footer-heading'
        });

        const heading = createElement('h2', {
            id: 'footer-heading',
            className: 'sr-only'
        }, 'Footer navigation');
        section.appendChild(heading);

        this.sections.forEach(sec => {
            const nav = createElement('nav', {
                className: 'space-y-3',
                'aria-label': sec.heading
            });

            nav.appendChild(createElement('div', {
                className: 'text-xs font-semibold tracking-wider uppercase text-text'
            }, sec.heading));

            const ul = createElement('ul', { className: 'space-y-2' });

            sec.links.forEach(link => {
                const li = createElement('li');
                li.appendChild(createElement('a', {
                    href: link.href,
                    className: cn(
                        'relative inline-flex items-center text-sm text-text-muted transition-colors',
                        'hover:text-surface-fg',
                        'after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:scale-x-0 after:bg-brand-primary after:transition-transform after:origin-left hover:after:scale-x-100'
                    )
                }, link.label));
                ul.appendChild(li);
            });

            nav.appendChild(ul);
            section.appendChild(nav);
        });

        return section;
    }

    _createCourseSection() {
        const section = createElement('div', { className: 'md:col-span-4' });
        const card = createElement('div', {
            className: 'rounded-xl border border-surface-border sm:p-6'
        });

        card.appendChild(createElement('div', {
            className: 'text-xs font-semibold tracking-wider uppercase text-text-muted'
        }, 'Project Week'));

        card.appendChild(createElement('h3', {
            className: 'mt-2 text-sm font-semibold leading-5 text-surface-fg'
        }, 'Responsible, Sustainable, and Inclusive Digital Product Creation'));

        const dl = createElement('dl', {
            className: 'mt-3 grid grid-cols-1 gap-1 text-xs text-text-muted'
        });

        [
            { label: 'Instructors', value: 'Prof. Dr. Stephan Krusche, Elisabeth Friesinger' },
            { label: 'Chair', value: 'Applied Educational Technologies' },
            { label: 'School', value: 'Computation, Information and Technology, TUM' }
        ].forEach(({ label, value }) => {
            const div = createElement('div');
            div.appendChild(createElement('dt', { className: 'sr-only' }, label));
            div.appendChild(createElement('span', {
                className: 'font-medium text-surface-fg'
            }, `${label}: `));
            div.appendChild(document.createTextNode(value));
            dl.appendChild(div);
        });

        card.appendChild(dl);
        section.appendChild(card);
        return section;
    }

    _createBottomBar(year) {
        const bar = createElement('div', {
            className: 'mt-10 flex flex-col items-center gap-4 md:flex-row md:left-0'
        });

        bar.appendChild(createElement('div', {
            className: 'text-xs text-text-muted'
        }, `© ${year} Project week: Responsible, Sustainable, and Inclusive Digital Product Creation.`));

        bar.appendChild(createElement('span', {
            className: 'hidden md:inline text-xs text-text-muted',
            'aria-hidden': 'true'
        }, '|'));

        const linksDiv = createElement('div', {
            className: 'flex items-center gap-2 text-xs text-text-muted'
        });

        [
            { href: 'https://aet.cit.tum.de/impressum/', label: 'Impressum' },
            { href: 'https://aet.cit.tum.de/datenschutz/', label: 'Privacy Statement' }
        ].forEach(({ href, label }, i) => {
            if (i > 0) linksDiv.appendChild(createElement('span', { 'aria-hidden': 'true' }, '|'));
            linksDiv.appendChild(createElement('a', {
                href,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'transition-colors hover:text-surface-fg',
                'data-external': 'true'
            }, label));
        });

        bar.appendChild(linksDiv);
        return bar;
    }
}
