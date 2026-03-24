import { createElement, initScrollAnimations } from '../lib/utils.js';
import { fetchProjects } from '../lib/api.js';
import { PageLayout } from '../components/layout/PageLayout.js';
import { ProjectArticle } from '../features/projects/ProjectArticle.js';

export class ProjectDetailPage {
    constructor(slug) {
        this.slug = slug;
    }

    async render() {
        let project = null;
        try {
            const projects = await fetchProjects();
            project = projects.find(p => p.slug === this.slug);
            if (!project) throw new Error('Project not found in index');
        } catch (error) {
            console.error('Error loading project metadata:', error);
            return this._notFound();
        }

        let contentHTML = '<p>No content available.</p>';
        try {
            const contentPath = project.contentSrc ?? `/public/projects/${this.slug}.html`;
            const res = await fetch(contentPath);
            if (!res.ok) throw new Error('Content file not found');
            const raw = await res.text();
            contentHTML = this._extractBody(raw);
        } catch (error) {
            console.error('Error loading project content:', error);
            contentHTML = '<p class="text-text-muted">Content could not be loaded.</p>';
        }

        const breadcrumbs = [
            { href: '/projects', label: 'Projects' },
            { href: `/projects/${this.slug}`, label: project.title },
        ];

        const article = ProjectArticle({
            title: project.title,
            date: project.date,
            breadcrumbs,
            contentHtml: contentHTML,
            className: 'animate-fade-up opacity-0 [animation-fill-mode:forwards]'
        });

        const layout = PageLayout({ children: [article] });

        setTimeout(initScrollAnimations, 0);
        return layout;
    }

    /** Extract the content inside <body>…</body>, falling back to the whole string. */
    _extractBody(html) {
        const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        return match ? match[1].trim() : html.trim();
    }

    _notFound() {
        const fallback = createElement('div', { className: 'py-20 px-6 text-center' });
        fallback.appendChild(createElement('h1', { className: 'text-2xl text-surface-fg' }, 'Project not found'));
        return PageLayout({ children: [fallback] });
    }
}