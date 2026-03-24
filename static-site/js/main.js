import { router } from './router.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { HomePage } from './pages/Home.js';
import { ProjectsPage } from './pages/Projects.js';
import { ProjectDetailPage } from './pages/ProjectDetail.js';
import { ProcessPage } from './pages/Process.js';
import { MethodsPage } from './pages/Methods.js';
import { MethodDetailPage } from './pages/MethodDetail.js';
import { MethodGamePage } from './pages/MethodGame.js';
import { NotFoundPage } from './pages/NotFound.js';
import { initScrollAnimations } from './lib/utils.js';

// Mount persistent layout components
const navbar = new Navbar();
const footer = new Footer();
const appRoot = document.getElementById('app-root');

document.body.insertBefore(navbar.render(), appRoot);
document.getElementById('footer-root').appendChild(footer.render());

function renderPage(element) {
    appRoot.innerHTML = '';
    appRoot.appendChild(element);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    navbar.updateActiveLinks();
    setTimeout(initScrollAnimations, 50);
}

// Route registrations
router.register('/', () => {
    renderPage(new HomePage().render());
});

router.register('/projects', async () => {
    renderPage(await new ProjectsPage().render());
});

router.register('/projects/:slug', async ({ slug }) => {
    renderPage(await new ProjectDetailPage(slug).render());
});

router.register('/process', () => {
    renderPage(new ProcessPage().render());
});

router.register('/methods/:id/game', async ({ id }) => {
    renderPage(await new MethodGamePage(id).render());
});

router.register('/methods', async () => {
    renderPage(await new MethodsPage().render());
});

router.register('/methods/:id', async ({ id }) => {
    renderPage(await new MethodDetailPage(id).render());
});

router.register('/404', () => {
    renderPage(NotFoundPage());
});
