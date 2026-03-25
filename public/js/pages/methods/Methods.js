import { initScrollAnimations } from '../../core/utils.js';
import { fetchMethods, fetchSessions } from '../../core/api.js';
import { PageLayout } from '../../components/layout/PageLayout.js';
import { PageHero } from '../../components/ui/Header.js';
import { MethodLibrary } from '../../features/methods/MethodLibrary.js';

export class MethodsPage {
    async render() {
        const [methods, categories] = await Promise.all([
            fetchMethods().catch(e => { console.error(e); return []; }),
            fetchSessions().catch(e => { console.error(e); return []; })
        ]);

        const hero = PageHero({
            id: 'method-hero',
            eyebrow: 'Methods',
            title: 'Sustainable Methods',
            subtitle: 'Practical methods and templates to embed sustainability into every phase of your design process. Copy, customize, and integrate these tools into your workflow.',
            size: 'xl'
        });

        const library = new MethodLibrary(methods, categories);

        const layout = PageLayout({ children: [hero, library.render()] });

        setTimeout(initScrollAnimations, 0);
        return layout;
    }
}
