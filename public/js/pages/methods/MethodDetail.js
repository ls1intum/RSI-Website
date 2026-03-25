import { createElement, initScrollAnimations, normalizeArray, normalizeSteps } from '../../core/utils.js';
import { fetchMethods } from '../../core/api.js';
import { Breadcrumb } from '../../components/ui/Breadcrumb.js';
import { TipsCarousel } from '../../features/methods/TipsCarousel.js';

export class MethodDetailPage {
    constructor(id) {
        this.id = id;
    }

    async render() {
        let method = null;
        try {
            const methods = await fetchMethods();
            method = methods.find(m => String(m.id) === String(this.id));
        } catch (error) {
            console.error('Error loading method:', error);
        }

        if (!method) {
            return createElement('main',
                { className: 'min-h-screen bg-bg pb-24' },
                createElement('div', { className: 'py-20 px-6 text-center' },
                    createElement('h1', { className: 'text-2xl text-fg' }, 'Method not found')
                )
            );
        }

        const inputs   = normalizeArray(method.inputs || method.input);
        const templates = normalizeArray(method.templates);
        const tips     = normalizeArray(method.tips);
        const prompts  = normalizeArray(method.prompts);
        const steps    = normalizeSteps(method.steps);

        const outerWrapper = createElement('div', {
            className: 'relative flex flex-col min-h-screen bg-bg'
        });

        // Breadcrumb
        outerWrapper.appendChild(Breadcrumb({
            items: [
                { label: 'Home', href: '/' },
                { label: 'Methods', href: '/methods' },
                { label: method.title }
            ],
            containerClassName: 'max-w-7xl mx-auto px-4 pt-6'
        }));

        // Hero
        const heroWrapper = createElement('div', {
            className: 'relative z-10 flex flex-col items-center text-center px-4 py-16 gap-6 max-w-3xl mx-auto fade-up-hidden'
        });

        heroWrapper.appendChild(createElement('div', {
            className: 'flex gap-3 flex-wrap justify-center'
        }, createElement('span', {
            className: 'inline-flex px-4 py-1 rounded-full border border-border text-sm font-semibold uppercase'
        }, method.phase || 'Uncategorized')));

        heroWrapper.appendChild(createElement('h1', {
            className: 'text-4xl sm:text-5xl font-bold text-fg leading-snug tracking-tight'
        }, method.title));

        if (method.overview) {
            heroWrapper.appendChild(createElement('p', {
                className: 'text-base sm:text-xl text-muted-fg leading-relaxed'
            }, method.overview));
        }

        outerWrapper.appendChild(heroWrapper);

        // Content sections
        const content = createElement('div', {
            className: 'relative z-10 max-w-5xl mx-auto px-4 pb-24 space-y-20 text-base sm:text-lg'
        });

        // Purpose & Preparation
        if (method.purpose || inputs.length) {
            const section = createElement('section');

            if (method.purpose) {
                const purposeDiv = createElement('div', { className: 'mb-10 fade-up-hidden' });
                purposeDiv.appendChild(createElement('h2', {
                    className: 'text-2xl sm:text-3xl font-semibold text-fg mb-4'
                }, 'Purpose'));
                purposeDiv.appendChild(createElement('p', {
                    className: 'text-muted-fg leading-7 sm:leading-8 text-lg'
                }, method.purpose));
                section.appendChild(purposeDiv);
            }

            if (inputs.length) {
                const prepDiv = createElement('div', { className: 'fade-up-hidden' });
                prepDiv.appendChild(createElement('h2', {
                    className: 'text-2xl sm:text-3xl font-semibold text-fg mb-6'
                }, 'Preparation'));

                const ol = createElement('ol', { className: 'space-y-5' });
                inputs.forEach((x, i) => {
                    const li = createElement('li', { className: 'flex items-start gap-4' });
                    li.appendChild(createElement('span', {
                        className: 'inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-full border border-black text-sm font-semibold text-black'
                    }, String(i + 1)));
                    li.appendChild(createElement('p', { className: 'text-muted-fg text-lg' }, x));
                    ol.appendChild(li);
                });
                prepDiv.appendChild(ol);
                section.appendChild(prepDiv);
            }

            content.appendChild(section);
        }

        // Templates
        if (templates.length) {
            const section = createElement('section', { className: 'fade-up-hidden' });
            section.appendChild(createElement('h2', {
                className: 'text-2xl sm:text-3xl font-semibold text-fg mb-4'
            }, 'Templates'));

            const linksDiv = createElement('div', { className: 'flex flex-wrap gap-3 mb-4' });
            const otherTemplates = [];

            const FIGMA_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#F24E1E" d="M12 12V6.5a5.5 5.5 0 1 0-5.5 5.5H12Z"/><path fill="#A259FF" d="M12 12v5.5a5.5 5.5 0 1 0-5.5-5.5H12Z"/><path fill="#1ABCFE" d="M12 17.5V12h5.5a5.5 5.5 0 1 1-5.5 5.5Z"/><path fill="#0ACF83" d="M12 17.5a5.5 5.5 0 1 0-5.5 5.5 5.5 5.5 0 0 0 5.5-5.5Z"/><path fill="#FF7262" d="M12 6.5A5.5 5.5 0 1 1 17.5 12H12V6.5Z"/></svg>`;
            const MIRO_ICON  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 11.2371L4.85567 22H7.28866L5.30928 1.83505L2 11.2371ZM10.0206 22H12.6392L14.7835 1.83505L9.60825 8.12371L10.0206 22ZM17.1546 12.3505L22 1.83505L16.2062 1.83505L14.9691 22H17.7732L17.1546 12.3505Z" fill="#050038"/><path d="M7.28866 22H10.0206L9.60825 8.12371L7.28866 22ZM12.6392 22H14.9691L16.2062 1.83505L14.7835 1.83505L12.6392 22Z" fill="#FFD02F"/></svg>`;

            templates.forEach(t => {
                try {
                    const u = new URL(t.trim());
                    const icon = u.hostname.includes('miro.com') ? MIRO_ICON
                               : u.hostname.includes('figma.com') ? FIGMA_ICON
                               : null;
                    if (icon) {
                        const a = createElement('a', {
                            href: t,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-fg hover:bg-surface-hover transition'
                        });
                        a.innerHTML = icon;
                        a.appendChild(document.createTextNode(
                            u.hostname.includes('miro.com') ? ' Miro Template' : ' Figma Template'
                        ));
                        linksDiv.appendChild(a);
                    } else {
                        otherTemplates.push(t);
                    }
                } catch {
                    otherTemplates.push(t);
                }
            });

            section.appendChild(linksDiv);

            if (otherTemplates.length) {
                const ul = createElement('ul', { className: 'list-disc pl-6 space-y-2 text-muted-fg' });
                otherTemplates.forEach(t => {
                    const li = createElement('li');
                    li.appendChild(createElement('a', {
                        href: t,
                        target: '_blank',
                        className: 'hover:underline'
                    }, t));
                    ul.appendChild(li);
                });
                section.appendChild(ul);
            }

            content.appendChild(section);
        }

        // Game link
        if (method.game) {
            const section = createElement('section', { className: 'fade-up-hidden' });
            section.appendChild(createElement('h2', {
                className: 'text-2xl sm:text-3xl font-semibold text-fg mb-4'
            }, 'Game'));

            const linkDiv = createElement('div', { className: 'flex' });
            linkDiv.appendChild(createElement('a', {
                href: method.game.href,
                className: 'inline-flex items-center justify-center rounded-full border border-border bg-bg text-fg px-6 py-2.5 text-sm font-semibold hover:bg-surface-hover transition shadow-sm'
            }, method.game.name));

            section.appendChild(linkDiv);
            content.appendChild(section);
        }

        // Steps
        if (steps.length) {
            const section = createElement('section');
            section.appendChild(createElement('h2', {
                className: 'text-2xl sm:text-3xl font-semibold text-fg mb-8 fade-up-hidden'
            }, 'How to Use This Method'));

            const stepsContainer = createElement('div', {
                className: 'relative border-l border-border pl-8 space-y-12'
            });

            steps.forEach(s => {
                const stepEl = createElement('div', { className: 'relative fade-up-hidden' });
                if (s.title) {
                    stepEl.appendChild(createElement('h3', {
                        className: 'font-semibold text-fg'
                    }, s.title));
                }
                if (s.description) {
                    stepEl.appendChild(createElement('p', {
                        className: 'mt-1 text-muted-fg leading-7'
                    }, s.description));
                }
                stepsContainer.appendChild(stepEl);
            });

            section.appendChild(stepsContainer);
            content.appendChild(section);
        }

        // Tips carousel
        if (tips.length) {
            content.appendChild(TipsCarousel(tips));
        }

        // AI Prompts
        if (prompts.length) {
            const section = createElement('section', { className: 'fade-up-hidden' });
            section.appendChild(createElement('h2', {
                className: 'text-2xl sm:text-3xl font-semibold text-fg mb-6'
            }, 'AI Prompts'));

            const promptsWrapper = createElement('div', { className: 'space-y-4' });

            prompts.forEach((p, i) => {
                const promptBox = createElement('div', {
                    className: 'group relative rounded-xl border border-border bg-surface p-5 hover:border-border-strong transition'
                });

                const headerEl = createElement('div', {
                    className: 'flex items-start justify-between mb-2'
                });
                headerEl.appendChild(createElement('h3', {
                    className: 'text-sm font-semibold text-fg'
                }, `Prompt ${i + 1}`));

                const copyBtn = createElement('button', {
                    className: 'opacity-0 group-hover:opacity-100 transition text-sm text-brand-primary font-medium hover:underline'
                }, 'Copy');

                copyBtn.addEventListener('click', () => {
                    navigator.clipboard.writeText(p);
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                });

                headerEl.appendChild(copyBtn);
                promptBox.appendChild(headerEl);

                // Use textContent for the prompt body to avoid XSS
                promptBox.appendChild(createElement('p', {
                    className: 'text-muted-fg'
                }, p));

                promptsWrapper.appendChild(promptBox);
            });

            section.appendChild(promptsWrapper);
            content.appendChild(section);
        }

        outerWrapper.appendChild(content);

        const page = createElement('main', { className: 'min-h-screen bg-bg' }, outerWrapper);

        setTimeout(initScrollAnimations, 0);
        return page;
    }
}
