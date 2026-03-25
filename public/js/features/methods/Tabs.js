// features/methods/Tabs.js
import { createElement, cn } from '../../core/utils.js';

export function Tabs({ items, active, onChange, showAll = true, allLabel = 'All', className }) {
    const filteredItems = items.filter(item => item.value.toLowerCase() !== 'all');

    const container = createElement('div', {
        className: cn('flex gap-4 sm:gap-6 mb-10 overflow-x-auto no-scrollbar', className),
        role: 'tablist'
    });

    const createTabBtn = (value, label, color = null, isDisabled = false) => {
        const isActive = active === value;

        let btnClass = 'px-4 sm:px-6 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center ';
        if (isActive)         btnClass += 'border-fg text-fg';
        else if (isDisabled)  btnClass += 'border-transparent text-muted-fg opacity-50 cursor-not-allowed';
        else                  btnClass += 'border-transparent text-muted-fg hover:text-fg';

        const btn = createElement('button', {
            type: 'button',
            role: 'tab',
            className: btnClass,
            disabled: isDisabled,
            onClick: () => !isDisabled && onChange(value)
        });

        if (color) {
            btn.appendChild(createElement('span', {
                className: 'inline-block w-2 h-2 rounded-full mr-2',
                style: `background-color: ${color}`
            }));
        }

        btn.appendChild(document.createTextNode(label));
        return btn;
    };

    if (showAll) container.appendChild(createTabBtn('all', allLabel));
    filteredItems.forEach(item =>
        container.appendChild(createTabBtn(item.value, item.label, item.color, item.disabled))
    );

    return container;
}
