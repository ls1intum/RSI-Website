// features/game/GameComponents.js
import { createElement } from '../../core/utils.js';

const CARD_STYLE_MAP = {
    'Individual Impact':   { background: '/assets/svg/CRC_Individual_Text.svg',   textColor: '#d8e7e1' },
    'Social Impact':       { background: '/assets/svg/CRC_Social_Text.svg',        textColor: '#3c3a34' },
    'Environmental Impact':{ background: '/assets/svg/CRC_Environmental_Text.svg', textColor: '#352c1a' },
};

export function CardItem({ scenario, description }) {
    const { background, textColor } = CARD_STYLE_MAP[description] || CARD_STYLE_MAP['Individual Impact'];

    const wrapper = createElement('div', {
        className: 'relative rounded-4xl shadow-lg border border-gray-300 overflow-hidden flex items-center justify-center text-center',
        style: 'width: 18rem; aspect-ratio: 1.6;'
    });

    // Dynamically correct the aspect ratio once the background image loads
    const imgLoader = new window.Image();
    imgLoader.src = background;
    imgLoader.onload = () => {
        wrapper.style.aspectRatio = `${imgLoader.width / imgLoader.height}`;
    };

    wrapper.innerHTML = `
        <img src="${background}" class="object-cover absolute inset-0 w-full h-full" alt="Card Background" />
        <div class="relative w-full h-full">
            <span style="
                position: absolute;
                top: 35%;
                left: 50%;
                transform: translateX(-50%);
                font-family: 'Arial Rounded MT Bold', 'Arial Rounded', Arial, sans-serif;
                font-weight: 700;
                white-space: pre-line;
                word-wrap: break-word;
                font-size: 15pt;
                line-height: 16pt;
                color: ${textColor};
                padding: 2px;
                width: 85%;
                text-align: center;
            ">
                ${scenario}
            </span>
        </div>
    `;

    return wrapper;
}

const FAN_CARDS = [
    { src: '/assets/svg/CRC_Individual_Design.svg',    rotate: -30, z: 10, marginStyle: 'margin-right: -48px;' },
    { src: '/assets/svg/CRC_Social_Design.svg',         rotate:   0, z: 20, marginStyle: '' },
    { src: '/assets/svg/CRC_Environmental_Design.svg',  rotate:  30, z: 10, marginStyle: 'margin-left: -48px;' },
];

export function CardDisplay({ showSvgs, cards }) {
    const container = createElement('div', { className: 'w-full flex flex-col items-center' });

    if (!showSvgs) {
        // Fan view — start screen
        const inner = createElement('div', {
            className: 'flex justify-center items-center my-16 relative gap-0 w-full'
        });

        FAN_CARDS.forEach((img, idx) => {
            const wrapper = createElement('div', {
                className: 'relative',
                style: `z-index: ${img.z}; ${img.marginStyle}`
            });

            const cardImg = createElement('img', {
                src: img.src,
                alt: `Critical Reflection Card ${idx + 1}`,
                className: 'block rounded-4xl border border-gray-300 shadow-lg w-64'
            });
            cardImg.style.transform = `rotate(${img.rotate}deg)`;

            wrapper.appendChild(cardImg);
            inner.appendChild(wrapper);
        });

        container.appendChild(inner);
    } else {
        // Grid view — game screen
        const grid = createElement('div', {
            className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center my-16 w-full'
        });

        cards.forEach((card, idx) => {
            const item = CardItem({ scenario: card.scenario, description: card.description });
            item.classList.add('fade-up-hidden');
            item.style.transitionDelay = `${idx * 100}ms`;
            grid.appendChild(item);
        });

        container.appendChild(grid);
    }

    return container;
}
