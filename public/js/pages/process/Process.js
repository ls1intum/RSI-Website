import {createElement} from '../../core/utils.js';
import {MotionSection, PageLayout} from '../../components/layout/PageLayout.js';
import {PageHero} from '../../components/ui/Header.js';
import {SessionCarousel} from '../../features/sessions/SessionCarousel.js';

export class ProcessPage {
    render() {
        const hero = PageHero({
            id: 'process-hero',
            eyebrow: 'Process',
            title: 'From Big Challenges to Real Solutions',
            subtitle: 'Conscious design builds on the Double Diamond model but adapts it for modern realities. Explore problems deeply, define them clearly, develop creative ideas, and deliver working solutions — all while keeping social and environmental impacts in view.',
            size: 'xl'
        });

        const figure = createElement('figure', { className: 'mx-auto w-full max-w-5xl' });
        figure.appendChild(createElement('img', { src: '/assets/svg/process.svg', className: 'w-full h-auto' }));

        const illustrationSection = MotionSection({
            id: 'process-illustration',
            delay: 200,
            children: [figure]
        });

        const sessionsHeader = createElement('div', { className: 'text-center mb-10' });
        sessionsHeader.appendChild(createElement('h2', {
            className: 'text-3xl font-semibold text-fg'
        }, 'Sessions'));
        sessionsHeader.appendChild(createElement('p', {
            className: 'mt-3 text-muted-fg max-w-2xl mx-auto text-[15px] leading-relaxed'
        }, 'Each session gives you hands-on skills to connect design thinking with software engineering practice.'));

        const sessionsSection = MotionSection({
            id: 'process-sessions',
            className: 'mt-24',
            children: [sessionsHeader, new SessionCarousel().render()]
        });

        return PageLayout({ children: [hero, illustrationSection, sessionsSection] });
    }
}
