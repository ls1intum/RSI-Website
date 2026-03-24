// Simple SPA router for vanilla JavaScript
export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.init();
    }

    init() {
        // Handle initial load
        window.addEventListener('DOMContentLoaded', () => {
            this.loadRoute();
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadRoute();
        });

        // Intercept link clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('data-external')) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigate(href);
            }
        });
    }

    register(path, handler) {
        this.routes[path] = handler;
    }

    navigate(path, addToHistory = true) {
        if (addToHistory) {
            window.history.pushState({}, '', path);
        }
        this.loadRoute();
    }

    loadRoute() {
        const path = window.location.pathname;
        this.currentRoute = path;

        // Try exact match first
        if (this.routes[path]) {
            this.routes[path]();
            return;
        }

        // Try pattern matching for dynamic routes
        for (const [pattern, handler] of Object.entries(this.routes)) {
            const regex = this.pathToRegex(pattern);
            const match = path.match(regex);
            if (match) {
                const params = this.extractParams(pattern, match);
                handler(params);
                return;
            }
        }

        // 404
        if (this.routes['/404']) {
            this.routes['/404']();
        } else {
            document.getElementById('app-root').innerHTML = '<h1>404 - Page Not Found</h1>';
        }
    }

    pathToRegex(path) {
        // Convert /projects/:slug to regex
        const pattern = path
            .replace(/\//g, '\\/')
            .replace(/:(\w+)/g, '([^/]+)');
        return new RegExp(`^${pattern}$`);
    }

    extractParams(pattern, match) {
        const paramNames = [];
        const regex = /:(\w+)/g;
        let m;
        while ((m = regex.exec(pattern)) !== null) {
            paramNames.push(m[1]);
        }

        const params = {};
        paramNames.forEach((name, index) => {
            params[name] = match[index + 1];
        });
        return params;
    }
}

export const router = new Router();
