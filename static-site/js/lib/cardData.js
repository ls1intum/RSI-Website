// lib/cardData.js

/**
 * Filter and validate the raw JSON data
 * Equivalent to the Type Guard in the React version
 */
export function validateCards(rawData) {
    if (!Array.isArray(rawData)) return [];

    return rawData.filter(candidate => {
        return (
            candidate &&
            typeof candidate.id === 'number' &&
            typeof candidate.scenario === 'string' &&
            ['Individual Impact', 'Social Impact', 'Environmental Impact'].includes(candidate.description)
        );
    });
}

/**
 * Utility: draw random cards by type
 * Exact logic from your React version, converted to vanilla JS
 */
export function drawRandomCardsByType(cards, perType = 1) {
    const types = [
        'Individual Impact',
        'Social Impact',
        'Environmental Impact',
    ];

    const cardsByType = {
        'Individual Impact': [],
        'Social Impact': [],
        'Environmental Impact': [],
    };

    // Shuffle and pick `perType` cards for each type
    types.forEach(type => {
        const typeCards = cards.filter(c => c.description === type);
        if (!typeCards.length) return;

        // Shuffle logic
        const shuffled = [...typeCards].sort(() => Math.random() - 0.5);
        cardsByType[type] = shuffled.slice(0, perType);
    });

    // Column-wise ordering (ensures Individual, Social, Environmental sequence)
    const numRows = Math.max(...Object.values(cardsByType).map(arr => arr.length));
    const result = [];

    for (let row = 0; row < numRows; row++) {
        for (const type of types) {
            const card = cardsByType[type][row];
            if (card) result.push(card);
        }
    }

    return result;
}