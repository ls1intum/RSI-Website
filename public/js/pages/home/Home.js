import { createElement } from '../../core/utils.js';
import { createBadge, createButton } from '../../components/ui/Button.js';

export class HomePage {
    render() {
        const main = createElement('main', {
            className: 'relative isolate overflow-hidden bg-bg text-text'
        });

        const section = createElement('section', {
            className: 'relative isolate overflow-hidden py-40 sm:py-40 lg:py-48',
            'aria-labelledby': 'home-hero-title',
            role: 'region'
        });

        const container = createElement('div', {
            className: 'relative mx-auto max-w-7xl px-6 lg:px-8 mb-10'
        });

        const grid = createElement('div', {
            className: 'grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:items-center'
        });

        const leftContent = createElement('div', {
            className: 'mx-auto max-w-2xl text-center lg:mx-0 lg:text-left'
        });

        leftContent.appendChild(createBadge({
            text: 'Digital Product Creation',
            variant: 'outline',
            size: 'xl',
            shape: 'pill',
            className: 'opacity-0 animate-fade-in [animation-delay:200ms] [animation-fill-mode:forwards]'
        }));

        const h1 = createElement('h1', {
            id: 'home-hero-title',
            className: 'mt-10 text-4xl font-bold tracking-tight text-surface-fg sm:text-6xl lg:text-8xl'
        });

        ['Responsible.', 'Sustainable.', 'Inclusive.'].forEach((line, i) => {
            h1.appendChild(createElement('span', {
                className: `block opacity-0 translate-y-4 animate-fade-up [animation-delay:${400 + i * 200}ms] [animation-fill-mode:forwards]`
            }, line));
        });
        leftContent.appendChild(h1);

        leftContent.appendChild(createElement('p', {
            className: 'mt-6 text-xl leading-8 text-text-muted max-w-xl opacity-0 animate-fade-up [animation-delay:1000ms] [animation-fill-mode:forwards]'
        }, 'Shape the Digital Future – fairly, sustainably, and consciously.'));

        leftContent.appendChild(createElement('p', {
            className: 'mt-4 text-lg leading-7 text-text-muted max-w-xl opacity-0 animate-fade-up [animation-delay:1200ms] [animation-fill-mode:forwards]'
        }, 'We encounter digital products every day – but who actually decides how they are designed? In this interdisciplinary module, participants develop ideas for digital solutions that incorporate social responsibility, ecological sustainability, and inclusion. They will learn methods of Conscious Service Design and work hands-on in teams to develop their own concept. Whether your interests are technical, creative, or societal – students\' perspectives are essential. Participants will build skills that are in high demand in today\'s job market: creative problem-solving, digital design, responsible thinking, and teamwork.'));

        // CTA button using the shared createButton utility
        const ctaContainer = createElement('div', {
            className: 'mt-10 flex items-center justify-center gap-x-6 lg:justify-start opacity-0 animate-fade-up [animation-delay:1300ms] [animation-fill-mode:forwards]'
        });

        const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        arrowSvg.setAttribute('class', 'h-4 w-4');
        arrowSvg.setAttribute('fill', 'none');
        arrowSvg.setAttribute('stroke', 'currentColor');
        arrowSvg.setAttribute('viewBox', '0 0 24 24');
        const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrowPath.setAttribute('stroke-linecap', 'round');
        arrowPath.setAttribute('stroke-linejoin', 'round');
        arrowPath.setAttribute('stroke-width', '2');
        arrowPath.setAttribute('d', 'M13 7l5 5m0 0l-5 5m5-5H6');
        arrowSvg.appendChild(arrowPath);

        const ctaBtn = createButton({
            text: 'Explore Process',
            href: '/process',
            variant: 'outline',
            size: 'lg',
            shape: 'pill',
            color: 'default',
            children: [arrowSvg]
        });
        ctaBtn.setAttribute('aria-label', 'Explore Process');

        ctaContainer.appendChild(ctaBtn);
        leftContent.appendChild(ctaContainer);

        grid.appendChild(leftContent);
        grid.appendChild(createElement('div', { className: 'hidden lg:block' }));

        container.appendChild(grid);
        section.appendChild(container);
        main.appendChild(section);

        return main;
    }
}
