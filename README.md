# client-kneresz

Frontend for [kneresz.com](https://kneresz.com) -- a minimalist blog with monospace aesthetics and ASCII art.

Currently deployed as a holding page while the full platform is under development.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Font:** Space Mono (monospace only)

## What's live now

- Holding page with ASCII art logo, animated cat, binary rain and fireworks
- Typing effect introducing the project
- Theme toggle (light / dark / system) with `localStorage` persistence
- Custom 404 and 500 error pages
- Fully responsive, retina-aware canvas animations

## Project structure

```
src/
  app/
    layout.tsx          Root layout (Space Mono, ThemeProvider)
    page.tsx            Holding page entry
    not-found.tsx       Custom 404
    error.tsx           Custom 500
    error-test/         Manual error boundary test page
    globals.css         CSS variables, theme definitions
  components/
    holding-page.tsx    Page composition
    ascii-cat.tsx       Animated ASCII cat (blink, sleep cycle)
    ascii-logo.tsx      Static ASCII name banner
    ascii-rain.tsx      Binary (0/1) rain background (canvas, DPR-aware)
    ascii-fireworks.tsx Particle fireworks around the logo (canvas, DPR-aware)
    typing-text.tsx     Terminal-style typing animation
    theme-provider.tsx  React context for theme state
    theme-toggle.tsx    Light / dark / system selector
```

## Setup

```bash
npm install
npm run dev
```

## Roadmap

- [ ] Blog listing page with posts from server-kneresz API
- [ ] Individual post page with markdown rendering
- [ ] Comment system with GitHub OAuth
- [ ] ASCII avatar display for commenters
- [ ] Media rendering (images, video) within posts
- [ ] Tag-based filtering and search
- [ ] RSS feed
- [ ] SEO metadata and Open Graph tags
- [ ] About page

## Related

- [server-kneresz](https://github.com/KNereSouza/server-kneresz) -- FastAPI backend

## License

[MIT](../server-kneresz/LICENSE)
