import { createElement, initScrollAnimations } from '../../core/utils.js';
import { fetchMethods, fetchReflections } from '../../core/api.js';
import { Breadcrumb } from '../../components/ui/Breadcrumb.js';
import { CardDisplay } from '../../features/game/GameComponents.js';
import { validateCards, drawRandomCardsByType } from '../../features/game/cardData.js';

export class MethodGamePage {
    constructor(id) {
        this.id = id;
        this.showSvgs = false;
        this.drawnCards = [];
        this.method = null;
        this.cardsData = [];
        this.displayContainer = null;
    }

    async render() {
        const main = createElement('main', {
            className: 'relative flex flex-col min-h-screen bg-bg'
        });

        await this._loadData();
        const toolTitle = this.method?.title || 'Method';

        main.appendChild(Breadcrumb({
            items: [
                { label: 'Home', href: '/' },
                { label: 'Methods', href: '/methods' },
                { label: toolTitle, href: `/methods/${this.id}` },
                { label: 'Critical Reflection Cards' },
            ],
            containerClassName: 'max-w-7xl mx-auto px-4 pt-6'
        }));

        // Hero
        const hero = createElement('div', {
            className: 'relative z-10 flex flex-col items-center text-center px-4 py-16 gap-6 max-w-3xl mx-auto fade-up-hidden'
        });

        hero.appendChild(createElement('div', {
            className: 'flex gap-3 flex-wrap justify-center'
        }, createElement('span', {
            className: 'inline-flex px-4 py-1 rounded-full border border-border text-sm font-semibold uppercase'
        }, 'Game')));

        hero.appendChild(createElement('h1', {
            className: 'text-4xl sm:text-5xl font-bold text-fg leading-snug tracking-tight'
        }, 'Critical Reflection Cards'));

        hero.appendChild(createElement('p', {
            className: 'text-base sm:text-xl text-muted-fg leading-relaxed'
        }, 'Method to use the Critical Reflection Cards. It will draw one card per type, displayed column-wise.'));

        main.appendChild(hero);

        // Card display area
        const content = createElement('div', {
            className: 'relative z-10 max-w-5xl mx-auto px-4 pb-24 w-full'
        });

        this.displayContainer = createElement('div', {
            className: 'block w-full',
            style: 'overflow: visible;'
        });

        this._updateCardUI();
        content.appendChild(this.displayContainer);

        // Draw button
        const btnWrapper = createElement('div', { className: 'flex justify-center mt-8 pb-12' });
        btnWrapper.appendChild(createElement('button', {
            className: 'inline-flex items-center justify-center rounded-full bg-black text-white px-10 py-3.5 text-base font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95',
            onClick: () => this._handleDrawCards()
        }, 'Draw Cards'));

        content.appendChild(btnWrapper);
        main.appendChild(content);

        setTimeout(initScrollAnimations, 150);
        return main;
    }

    async _loadData() {
        try {
            const [methods, rawReflections] = await Promise.all([
                fetchMethods(),
                fetchReflections()
            ]);
            this.method = methods.find(m => String(m.id) === String(this.id));
            this.cardsData = validateCards(rawReflections);
        } catch (error) {
            console.error('Error loading game data:', error);
        }
    }

    _handleDrawCards() {
        this.drawnCards = drawRandomCardsByType(this.cardsData, 1);
        this.showSvgs = true;
        this._updateCardUI();
    }

    _updateCardUI() {
        if (!this.displayContainer) return;
        this.displayContainer.innerHTML = '';
        this.displayContainer.appendChild(
            CardDisplay({ showSvgs: this.showSvgs, cards: this.drawnCards })
        );
        setTimeout(initScrollAnimations, 100);
    }
}
