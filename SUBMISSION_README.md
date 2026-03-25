# How to Write Your Submission

A guide for formatting your project page. No Tailwind, no React — just semantic HTML that the platform styles automatically.

---

## Contents

1. [Overview](#overview)
2. [Page structure](#page-structure)
3. [Available components](#available-components)
4. [Images, video & embeds](#images-video--embeds)
5. [Callouts](#callouts)
6. [Tables](#tables)
7. [Tips & common mistakes](#tips--common-mistakes)
8. [Final checklist](#final-checklist)

---

## Overview

Your submission is a single HTML file. You write standard HTML elements — headings, paragraphs, images, lists — and the platform applies all styling automatically. **You do not need to add any CSS classes yourself**, except for a small set of layout components described below.

Your file is wrapped in a `.sumbission-content` container. All styling targets that wrapper, so every standard HTML tag gets the right look without any extra work from you.

The sample submission — the *hers\** project — is a good reference. It uses headings, paragraphs, figures, feature cards, an icon list, a table, and a callout. All of those are available to you.

---

## Page structure

Start with a hero image, then use `<h2>` headings to divide your page into sections. A typical submission looks like this:

```html
<!-- 1. Hero image (shows at the very top, full-bleed) -->
<figure class="hero">
  <img src="/assets/png/my-project/hero.png" alt="Project hero image" />
</figure>

<!-- 2. Short intro paragraph -->
<p>One or two sentences describing what your project is.</p>

<!-- 3. Sections, each starting with an h2 -->
<h2>The Problem</h2>
<p>…</p>

<h2>The Goal</h2>
<p>…</p>

<h2>Solution Overview</h2>
<!-- cards, lists, figures go here -->

<h2>Team</h2>
<p>…</p>

<h2>Authors</h2>
<p>Your name</p>
```

> **Required sections:** Every submission must include at minimum: a hero figure, an introduction paragraph, sections for The Problem and The Goal, a Solution Overview, and an Authors section with your name.

---

## Available components

Beyond basic headings and paragraphs, you have four layout components. Use them by adding the right CSS class to a list element.

### `cards` — Feature list

A two-column grid of cards. Use it to present the key features of your project. Each card has a bold title and a short description.

```html
<ul class="cards">
  <li class="card">
    <strong>Safe Routes</strong>
    <p>Guides you along the safest path based on community data.</p>
  </li>
  <li class="card">
    <strong>Safety Map</strong>
    <p>See and mark safe and unsafe spots in your area.</p>
  </li>
</ul>
```

### `icon-list` — Design details / principles

A vertical list with a green dot marker. Use it for experience descriptions, design principles, or any list where each item has a title and a longer explanation.

```html
<ul class="icon-list">
  <li>
    <strong>Visual Identity</strong>
    <p>Modern, calm, and confident. A gender-neutral color palette.</p>
  </li>
  <li>
    <strong>Inclusive Interaction</strong>
    <p>Accessibility was part of the core design, not an afterthought.</p>
  </li>
</ul>
```

### `list` — Credits / references

A borderless list for credits, references, or short labelled items. Each `<li>` gets a left accent line.

```html
<ul class="list">
  <li><strong>Vitali Knutas</strong> — Concept &amp; UX Research</li>
  <li><strong>Frydia von Hinüber</strong> — Visual Design</li>
</ul>
```

### `profile-list` — Key/value pairs

For labelled key/value lines — persona details, project metadata, specs. No bullets, clean inline layout.

```html
<ul class="profile-list">
  <li><strong>Target group:</strong> FLINTA* urban commuters</li>
  <li><strong>Platform:</strong> iOS &amp; Android</li>
</ul>
```

---

## Images, video & embeds

All media goes inside a `<figure>` element. Always include an `alt` attribute on images and a `<figcaption>` to describe what the viewer is seeing.

### Standard image

```html
<figure>
  <img src="/assets/png/my-project/overview.jpg"
       alt="Overview of the main app screens" />
  <figcaption>
    Overview of the main app screens: onboarding, map, and alarm.
  </figcaption>
</figure>
```

### Hero image

Add the class `hero` to the `<figure>`. This should be the **very first element** in your file. The image will be cropped to a 16:9 ratio.

```html
<figure class="hero">
  <img src="/assets/png/my-project/hero.png" alt="Project hero" />
</figure>
```

### Video

```html
<figure>
  <video controls>
    <source src="/assets/videos/my-project/demo.mp4" type="video/mp4" />
  </video>
  <figcaption>App walkthrough demonstrating the alarm feature.</figcaption>
</figure>
```

### PDF (e.g. presentation slides)

Use an `<iframe>` with the class `pdf`. Set a sensible height (`600` is the default).

```html
<figure>
  <iframe class="pdf"
          src="/assets/files/my-project/slides.pdf"
          height="600"
          title="Presentation slides"></iframe>
  <figcaption>GDD Conference slides.</figcaption>
</figure>
```

### Figma embed

```html
<figure>
  <iframe class="figma"
          src="https://www.figma.com/embed?embed_host=share&url=..."
          height="600"
          title="Figma prototype"></iframe>
  <figcaption>Interactive prototype — use the fullscreen button to explore.</figcaption>
</figure>
```

> **Asset paths:** Place your files in `/assets/png/your-project/`, `/assets/videos/your-project/`, or `/assets/files/your-project/`. Use your project's slug as the folder name so files don't collide with other teams.

---

## Callouts

Callouts draw attention to key messages. Use them sparingly — one or two per submission is plenty.

| Class | Use it for… |
|---|---|
| `callout success` | Impact statements, positive outcomes, key takeaways |
| `callout warning` | Reminders, things to double-check, pending items |
| `callout danger` | Critical errors, missing requirements |
| `callout tip` | Helpful context, optional information, insights |

```html
<div class="callout success">
  <strong>The Impact</strong>
  <p>No one should feel afraid walking home. hers* helps people
  move freely, connect locally, and make their city safer.</p>
</div>

<div class="callout warning">
  <strong>Don't forget!</strong>
  <p>Upload your methods documentation PDF before the deadline.</p>
</div>
```

---

## Tables

Use a table for structured data with multiple rows and columns — the Systemic Journey Map is a good example. Wrap every table in a `<div class="table-wrap">` to allow horizontal scrolling on small screens.

```html
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Phase 1</th>
        <th>Phase 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>User Actions</td>
        <td>Discovers the app…</td>
        <td>Downloads and signs up…</td>
      </tr>
      <tr>
        <td>Pain Points</td>
        <td>Doesn't know what to trust</td>
        <td>Worried about data privacy</td>
      </tr>
    </tbody>
  </table>
</div>
```

> **Journey map tip:** For the Systemic Journey Map, leave the first column header empty (`<th></th>`) and use it as a row-label column, as in the *hers\** example.

---

## Tips & common mistakes

### Do this ✓

- Use `<h2>` for section titles, `<h3>` for sub-sections within a section
- Always add `alt` text to every image
- Wrap tables in `<div class="table-wrap">`
- Keep `<figcaption>` short — one sentence
- Use `&amp;` for `&` inside HTML attributes and body text
- Close every tag you open (`<img />`, `<br />`)

### Avoid this ✗

- Don't add Tailwind classes or inline `style=""` attributes — they'll be overridden anyway
- Don't use `<h1>` — the page title is already an `<h1>`
- Don't leave images without `alt` text
- Don't put a `<table>` directly in the page without a `.table-wrap` div
- Don't write bare `&` characters in HTML — use `&amp;`
- Don't nest `.card` elements inside an `.icon-list`

### Special characters

A few characters need to be escaped in HTML:

| Character | Write as | Example |
|---|---|---|
| `&` | `&amp;` | `Alarm &amp; Help` |
| `<` | `&lt;` | Rarely needed in body text |
| `>` | `&gt;` | Rarely needed in body text |

### The FLINTA* asterisk

Write the asterisk directly in your text — no escaping needed. Example: `FLINTA*`, `hers*`.

---