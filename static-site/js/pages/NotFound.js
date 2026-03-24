import { createElement } from '../lib/utils.js';

export function NotFoundPage() {
    const div = createElement('div', {
        className: 'min-h-screen flex items-center justify-center'
    });

    div.innerHTML = `
        <div class="text-center">
            <h1 class="text-4xl font-bold mb-4">404 – Page Not Found</h1>
            <p class="text-text-muted mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" class="text-brand-accent hover:underline">Go back home</a>
        </div>
    `;

    return div;
}
