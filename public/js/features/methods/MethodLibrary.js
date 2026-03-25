// features/methods/MethodLibrary.js
import { createElement } from '../../core/utils.js';
import { MotionSection } from '../../components/layout/PageLayout.js';
import { Tabs } from './Tabs.js';
import { MethodCard } from './MethodCard.js';

export class MethodLibrary {
    constructor(methods, categories) {
        this.methods = methods;
        this.categories = categories;
        this.activeCategory = 'all';

        // Pre-build look-up maps for category label/color
        this.categoryCounts = {};
        this.categoryLabel = new Map();
        this.categoryColor = new Map();

        this.methods.forEach(m => {
            this.categoryCounts[m._category] = (this.categoryCounts[m._category] || 0) + 1;
        });

        this.categories.forEach(c => {
            const val = c.value.toLowerCase();
            this.categoryLabel.set(val, c.label);
            this.categoryColor.set(val, c.color);
        });

        this.tabsContainer = createElement('div', { className: 'w-full' });
        this.gridContainer = createElement('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mt-8'
        });
    }

    _handleTabChange = (newCategory) => {
        this.activeCategory = newCategory;
        this._renderTabs();
        this._renderGrid();
    }

    _renderTabs() {
        this.tabsContainer.innerHTML = '';

        const visibleTabs = this.categories
            .filter(c => (this.categoryCounts[c.value.toLowerCase()] || 0) > 0)
            .map(c => ({
                value: c.value.toLowerCase(),
                label: c.label,
                color: c.color
            }));

        this.tabsContainer.appendChild(Tabs({
            items: visibleTabs,
            active: this.activeCategory,
            onChange: this._handleTabChange,
            showAll: true
        }));
    }

    _renderGrid() {
        this.gridContainer.innerHTML = '';

        const filtered = this.methods.filter(m =>
            this.activeCategory === 'all' || m._category === this.activeCategory
        );

        if (filtered.length === 0) {
            this.gridContainer.appendChild(createElement('p', {
                className: 'mt-10 text-center text-muted-fg col-span-full animate-fade-in'
            }, 'No methods found in this category.'));
            return;
        }

        filtered.forEach((method, i) => {
            const card = MethodCard({
                method,
                catLabel: this.categoryLabel.get(method._category),
                catColor: this.categoryColor.get(method._category)
            });

            card.classList.add('opacity-0', 'animate-fade-up');
            card.style.animationDelay = `${i * 50}ms`;

            this.gridContainer.appendChild(card);
        });
    }

    render() {
        this._renderTabs();
        this._renderGrid();

        const header = createElement('div', {
            className: 'flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4'
        }, createElement('h2', { className: 'text-2xl sm:text-3xl font-semibold text-fg' }, 'Method Overview'));

        return MotionSection({
            id: 'method-library',
            children: [header, this.tabsContainer, this.gridContainer]
        });
    }
}
