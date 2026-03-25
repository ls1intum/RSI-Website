    # Responsible, Sustainable & Inclusive Digital Product Creation

Course website for the interdisciplinary module at TU Munich, hosted at [conscious-design.aet.cit.tum.de](https://conscious-design.aet.cit.tum.de).

The site is a **vanilla JS single-page application** — no build step, no framework. It serves static files directly from Caddy, which also handles HTTPS in production.

---

## Contents

1. [Project structure](#project-structure)
2. [Running locally](#running-locally)
3. [Deployment](#deployment)
4. [How the app works](#how-the-app-works)
5. [Data files](#data-files)
6. [Adding a student project](#adding-a-student-project)
7. [CSS & styling](#css--styling)

---

## Project structure

```
static-site/
├── Caddyfile               # Caddy reverse-proxy config (production HTTPS)
├── Dockerfile              # caddy:2-alpine image
├── docker-compose.yml      # Single-container Compose config
│
└── public/                 # Everything served to the browser
    ├── index.html          # Single HTML shell — mounts #app-root
    ├── favicon.ico
    │
    ├── css/
    │   ├── input.css       # Tailwind v4 source (design tokens + component styles)
    │   ├── style.css       # Compiled output — the file browsers actually load
    │   └── carousel.css    # Infinite scroll carousel utility
    │
    ├── data/               # JSON — the site's content layer
    │   ├── projects.json   # Project index (slug, title, hero, description)
    │   ├── methods.json    # Design methods library
    │   ├── sessions.json   # Course session summaries
    │   ├── phases.json     # Course phase metadata
    │   └── reflections.json
    │
    ├── js/
    │   ├── main.js         # Entry point — mounts layout, registers routes
    │   ├── core/
    │   │   ├── router.js   # Hash-free SPA router (History API)
    │   │   ├── api.js      # fetch() wrappers for all JSON data files
    │   │   └── utils.js    # createElement helper, scroll animations
    │   ├── components/
    │   │   ├── layout/     # Navbar, Footer, PageLayout
    │   │   └── ui/         # Button, Card, Grid, Header, Breadcrumb, InfiniteCarousel
    │   ├── features/
    │   │   ├── projects/   # ProjectArticle (renders student HTML content)
    │   │   ├── methods/    # MethodCard, MethodLibrary, Tabs, TipsCarousel
    │   │   ├── sessions/   # SessionCard, SessionCarousel
    │   │   └── game/       # Card-matching game for methods
    │   └── pages/
    │       ├── home/       # Landing page
    │       ├── projects/   # Project list + detail
    │       ├── methods/    # Method library + detail + game
    │       └── process/    # Course process overview
    │
    ├── assets/
    │   ├── png/            # Project hero images and screenshots
    │   ├── svg/            # Icons and illustrations
    │   ├── images/         # General images
    │   ├── videos/         # Project demo videos
    │   └── files/          # PDFs (slides, documentation)
    │
    └── projects/           # Student submission HTML files
        ├── hers.html
        ├── trapalert.html
        ├── truegram.html
        ├── tumApply.html
        └── tumCourseNavigator.html
```

---

## Running locally

No build step is required. Any static file server that supports SPA routing (serving `index.html` for unknown paths) will work.

**Python (quickest):**

```bash
cd static-site/public
python3 -m http.server 8000
```

> Python's built-in server doesn't handle SPA routing — direct deep links (e.g. `/projects/hers`) will 404. Use Docker or a proper dev server if you need that.

**Docker (recommended, mirrors production):**

```bash
cd static-site
docker compose up --build
```

The site is then available at `http://localhost:80`.

> Caddy will attempt to fetch a TLS certificate on startup. Locally it will fail and fall back to HTTP — that's fine. If you want to avoid the noise, swap the domain in `Caddyfile` for `:8080` while developing locally.
 
---

## Deployment

Production runs a single Docker container — Caddy serves the static files and handles HTTPS directly:

| Container | Image | Role |
|---|---|---|
| `rsi-website` | `caddy:2-alpine` (local build) | Serves static files, terminates TLS |

Caddy automatically provisions and renews the Let's Encrypt certificate for `conscious-design.aet.cit.tum.de`. Certificates are stored in the `caddy_data` Docker volume and survive container restarts.

**Deploy or update:**

```bash
cd RSI-Website
docker compose up -d --build
```

**Caddy behaviour:**
- All unmatched paths fall back to `index.html` (SPA routing via `try_files`).
- Static assets (JS, CSS, images) are cached for 1 year with `immutable`.
- HTML and JSON files are never cached (`no-store`).
- Gzip is enabled via `encode gzip`.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`) are set on all responses.

---

## How the app works

`public/index.html` is a minimal shell with an empty `#app-root` div and a single `<script type="module">` tag loading `js/main.js`.

`main.js` mounts the persistent `Navbar` and `Footer`, then registers URL patterns with the `Router`. When a route matches, it instantiates the corresponding page class and calls `.render()`, which returns a DOM node that replaces the contents of `#app-root`.

```
Browser URL change
  → Router.loadRoute()
    → PageClass.render() → DOM node
      → appRoot.innerHTML replaced
        → initScrollAnimations() on the new content
```

The router uses the History API (`pushState`) — there are no hash URLs. All internal `<a href="/">` clicks are intercepted and handled client-side; links with `data-external` are left alone.

Page data is loaded on demand via the `api.js` fetch wrappers, which all read from `public/data/*.json`.

---

## Data files

All content is driven by JSON files in `public/data/`. Edit these to add or update content without touching any JS.

### `projects.json`

Array of project objects. Each entry registers a project in the listing and detail pages.

```jsonc
{
  "slug": "hers",                          // URL slug → /projects/hers
  "title": "hers*",                        // Display title
  "description": "Short description…",    // Used on the listing card
  "lead": "Longer intro paragraph…",      // Used at the top of the detail page
  "date": "2021-07-19",                    // ISO date
  "heroSrc": "public/assets/png/hers/hers_h.png"  // Path to hero image
}
```

The project detail page fetches HTML content from `public/projects/{slug}.html` automatically. The optional `contentSrc` field overrides this path if needed.

### `methods.json`

Design methods used in the course. Each method can include `id`, `title`, `category`, `phase`, `overview`, `purpose`, and `description`. The `_category` and `_blurb` fields are computed at runtime by `api.js` — do not add them manually.

### `sessions.json`

Course session summaries shown in the carousel on the home page.

### `phases.json`

Course phase metadata used in the Process page.

### `reflections.json`

Reflection entries shown on the Process page.

---

## Adding a student project

1. **Create the HTML file** at `public/projects/your-slug.html`. See `Submission Readme.md` for the full authoring guide — the file uses plain HTML and a set of CSS component classes applied automatically by the `.mdx-content` wrapper.

2. **Add an entry to `public/data/projects.json`:**

```json
{
  "slug": "your-slug",
  "title": "Your Project Title",
  "description": "One sentence shown on the project card.",
  "lead": "Opening paragraph shown on the detail page.",
  "date": "2026-03-01",
  "heroSrc": "public/assets/png/your-slug/hero.png"
}
```

3. **Add assets** to the appropriate subfolder under `public/assets/`:

```
public/assets/png/your-slug/     ← images
public/assets/videos/your-slug/  ← videos
public/assets/files/your-slug/   ← PDFs
```

The project will then appear in the listing and have a working detail page at `/projects/your-slug`.

---

## CSS & styling

The stylesheet is compiled from `public/css/input.css` using **Tailwind CSS v4**.

`style.css` is the compiled output and is the file browsers load. If you modify `input.css` (e.g. to add a new component class), recompile:

```bash
npx @tailwindcss/cli -i public/css/input.css -o public/css/style.css
```

Or watch for changes during development:

```bash
npx @tailwindcss/cli -i public/css/input.css -o public/css/style.css --watch
```

### Design tokens

All colours and the font stack are defined as CSS custom properties in the `@theme` block at the top of `input.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `hsl(0 0% 100%)` | Page background |
| `--color-surface` | `hsl(0 0% 98%)` | Card / panel background |
| `--color-surface-border` | `hsl(220 13% 91%)` | Borders |
| `--color-surface-fg` | `hsl(222 47% 11%)` | Headings |
| `--color-text` | `hsl(222 47% 11%)` | Body text |
| `--color-text-muted` | `hsl(215 16% 47%)` | Secondary text |
| `--color-brand-primary` | `hsl(259 84% 56%)` | Purple — primary brand |
| `--color-brand-green` | `hsl(152 45% 44%)` | Green accents |

### Submission component classes

Student HTML files are rendered inside a `.mdx-content` wrapper. The following classes are available for use in submission files:

| Class | Description |
|---|---|
| `cards` + `card` | Two-column feature card grid |
| `icon-list` | Vertical list with green dot markers |
| `list` | Borderless list with left accent line (credits, references) |
| `profile-list` | Key/value list (persona details, specs) |
| `table-wrap` | Scrollable table container |
| `callout success/warning/danger/tip` | Coloured callout box |
| `figure.hero` | Full-bleed 16:9 hero image at page top |
| `iframe.pdf` | Embedded PDF viewer |
| `iframe.figma` | Embedded Figma prototype |