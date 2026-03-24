// lib/api.js
// Centralized data fetching layer — all JSON endpoints in one place.

const BASE = '/public/data';

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.json();
}

export async function fetchProjects() {
    return fetchJson(`${BASE}/projects.json`);
}

/**
 * Fetches methods and normalises each entry with computed helper fields:
 *  _category — lower-cased phase/category, defaults to 'uncategorized'
 *  _blurb    — first available description-like field
 */
export async function fetchMethods() {
    const data = await fetchJson(`${BASE}/methods.json`);
    return data.map(m => ({
        ...m,
        _category: (m.category || m.phase || '').trim().toLowerCase() || 'uncategorized',
        _blurb: m.overview || m.purpose || m.description || ''
    }));
}

export async function fetchSessions() {
    return fetchJson(`${BASE}/sessions.json`);
}

export async function fetchReflections() {
    return fetchJson(`${BASE}/reflections.json`);
}
