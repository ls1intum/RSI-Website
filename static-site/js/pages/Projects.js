import { createElement, initScrollAnimations } from '../lib/utils.js';
import { fetchProjects } from '../lib/api.js';
import { PageLayout } from '../components/layout/PageLayout.js';
import { PageHero } from '../components/ui/Header.js';
import { GridCard } from '../components/ui/Grid.js';

export class ProjectsPage {
    async render() {
        let projects = [];
        try {
            projects = await fetchProjects();
        } catch (error) {
            console.error('Error loading projects:', error);
        }

        // Group by year, most recent first
        const byYear = new Map();
        projects.forEach(project => {
            if (!project.date) return;
            const year = new Date(project.date).getFullYear();
            if (!byYear.has(year)) byYear.set(year, []);
            byYear.get(year).push(project);
        });

        const sortedYears = Array.from(byYear.keys()).sort((a, b) => b - a);

        const hero = PageHero({
            id: 'projects-hero',
            eyebrow: 'Projects',
            title: 'Student Designs',
            subtitle: 'Designs created by students during this course using the methodology of Responsible, Sustainable, and Inclusive Digital Product Creation.',
            size: 'xl'
        });

        const gridSections = sortedYears.map(year =>
            this._createYearSection(year, byYear.get(year))
        );

        const layout = PageLayout({ children: [hero, ...gridSections] });

        setTimeout(initScrollAnimations, 0);
        return layout;
    }

    _createYearSection(year, articles) {
        const section = createElement('section', {
            className: 'mx-auto max-w-6xl px-4 py-16 mt-5 animate-fade-up opacity-0 [animation-fill-mode:forwards]',
            id: `projects-${year}`
        });

        section.appendChild(createElement('h2', {
            className: 'mb-6 text-2xl font-bold tracking-tight text-surface-fg'
        }, String(year)));

        if (articles && articles.length > 0) {
            const ul = createElement('ul', {
                className: 'grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            });

            articles.forEach(article => {
                const li = createElement('li', { className: 'list-none' });
                li.appendChild(GridCard({ article, basePath: 'projects' }));
                ul.appendChild(li);
            });

            section.appendChild(ul);
        } else {
            section.appendChild(createElement('div', {
                className: 'flex h-24 items-center justify-center text-sm text-text-muted border border-surface-border border-dashed rounded-lg'
            }, 'No articles yet. Check back soon.'));
        }

        return section;
    }
}
