// features/methods/MethodCard.js
import { createElement } from '../../lib/utils.js';
import { Card, CardBody, truncate } from '../../components/ui/Card.js';

export function MethodCard({ method, catLabel, catColor }) {
    return Card({
        className: 'rounded-2xl border border-border bg-white h-full flex flex-col transition hover:shadow-lg',
        children: [
            CardBody({
                className: 'p-6 sm:p-8 flex flex-col flex-1',
                children: [
                    // Category indicator
                    createElement('div', { className: 'flex items-center gap-3 mb-4' },
                        createElement('div', {
                            className: 'w-3 h-3 rounded-full shrink-0',
                            style: `background-color: ${catColor ?? 'hsl(var(--muted-fg))'}`
                        }),
                        method._category !== 'uncategorized' ? createElement('span', {
                            className: 'text-xs font-semibold uppercase tracking-wide text-muted-fg'
                        }, catLabel ?? method._category) : createElement('span')
                    ),

                    // Title
                    createElement('h3', {
                        className: 'text-lg font-semibold text-fg leading-snug line-clamp-2'
                    }, method.title),

                    // Blurb
                    createElement('p', {
                        className: 'mt-3 text-sm text-muted-fg leading-relaxed line-clamp-3 flex-1'
                    }, truncate(method._blurb, 100)),

                    // Link
                    createElement('div', { className: 'flex justify-end pt-4' },
                        createElement('a', {
                            href: `/methods/${encodeURIComponent(String(method.id))}`,
                            className: 'text-sm font-medium text-brand-primary hover:underline'
                        }, 'Explore method →')
                    )
                ]
            })
        ]
    });
}
