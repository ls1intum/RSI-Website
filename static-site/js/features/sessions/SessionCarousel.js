// features/sessions/SessionCarousel.js
import { createElement } from '../../lib/utils.js';
import { fetchSessions } from '../../lib/api.js';
import { InfiniteCarousel } from '../../components/ui/InfiniteCarousel.js';
import { SessionCard } from './SessionCard.js';

export class SessionCarousel {
    constructor() {
        this.container = createElement('div', {
            className: 'w-full min-h-[400px] flex flex-col items-center justify-center relative'
        });
    }

    async _fetchAndRender() {
        try {
            const sessions = await fetchSessions();

            this.container.innerHTML = '';

            const carousel = new InfiniteCarousel({
                items: sessions,
                ariaLabel: 'Framework sessions carousel',
                slideWidth: 'clamp(320px, 92vw, 520px)',
                renderItem: (session) => SessionCard({
                    title: session.label,
                    color: session.color,
                    description: session.description,
                })
            });

            this.container.appendChild(carousel.render());
        } catch (error) {
            console.error('Failed to load sessions data:', error);
            this.container.innerHTML = `
                <div class="text-center p-8 border border-red-200 bg-red-50 rounded-xl max-w-lg mx-auto">
                    <p class="text-red-600 font-medium">Unable to load sessions right now.</p>
                    <p class="text-red-500 text-sm mt-2">Please check your connection or verify the JSON path.</p>
                </div>
            `;
        }
    }

    render() {
        // Show a pulse skeleton while data loads
        this.container.innerHTML = `
            <div class="animate-pulse w-full max-w-5xl mx-auto h-[400px] bg-surface-border rounded-2xl"></div>
        `;

        this._fetchAndRender();
        return this.container;
    }
}
