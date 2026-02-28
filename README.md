# client-kneresz

Frontend for [kneresz.com](https://kneresz.com) -- a minimalist blog with monospace aesthetics and ASCII art.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Font:** Space Mono (monospace only)
- **Markdown:** react-markdown, remark-gfm, rehype-highlight

## Features

- Landing page with ASCII art logo, animated cat, binary rain and fireworks
- Blog post listing with tag filtering and pagination
- Individual post pages with server-side markdown rendering
- Comment system with GitHub OAuth and ASCII emoticon avatars
- About page with personal info sections
- Admin panel (post editor, media browser, deleted post management)
- Post editor with zen writing mode (Alt+Z), side-by-side preview (Alt+P), and synchronized scroll
- Media embed shortcuts (`!image` / `!video` + Enter) with upload modal
- BFF pattern: all API calls proxied through Next.js route handlers
- Auth: GitHub OAuth with httpOnly cookies (access + refresh tokens)
- Theme toggle (light / dark / system) with `localStorage` persistence
- Custom 404 and 500 error pages
- Fully responsive

## Architecture

The client never calls the FastAPI backend directly. All requests go through Next.js API routes (`/api/*`) that proxy to the backend, keeping the backend URL and tokens hidden from the browser.

```
Browser  -->  Next.js API routes (/api/*)  -->  FastAPI backend
                 |
                 +-- httpOnly cookies (access_token, refresh_token)
                 +-- automatic token refresh on expiry
```

## Project structure

```
src/
  app/
    page.tsx                   Landing page (holding page)
    layout.tsx                 Root layout (Space Mono, ThemeProvider, AuthProvider)
    not-found.tsx              Custom 404
    error.tsx                  Custom 500
    globals.css                CSS variables, theme definitions, prose styles
    (blog)/
      layout.tsx               Blog layout (header, footer)
      posts/page.tsx           Post listing with ASCII header
      posts/[slug]/page.tsx    Post detail with comments (SSR)
      about/page.tsx           About page
    admin/
      layout.tsx               Admin layout with auth guard
      page.tsx                 Post management (filter, publish, delete, restore, purge)
      new/page.tsx             New post editor
      edit/[slug]/page.tsx     Edit post editor
      media/page.tsx           Media browser and upload
    api/
      auth/                    OAuth login, callback, logout, me, refresh
      posts/                   CRUD proxy + restore, purge, comments
      comments/                Delete, restore, purge proxy
      media/                   Upload, list, delete, GC proxy
  components/
    holding-page.tsx           Landing page composition
    ascii-*.tsx                ASCII art animations (cat, logo, rain, fireworks)
    typing-text.tsx            Terminal-style typing animation
    site-header.tsx            Navigation header
    site-footer.tsx            Footer
    post-list.tsx              Post listing component
    post-editor.tsx            Markdown editor with zen mode
    markdown.tsx               Markdown renderer (react-markdown)
    comment-*.tsx              Comment section, list, item, form
    ascii-avatar.tsx           Emoticon avatar in square box
    admin-*.tsx                Admin navigation and post list
    media-*.tsx                Media browser, upload, embed modal
    confirm-modal.tsx          Purge confirmation modal
    pagination.tsx             Offset/limit pagination
    tag-filter.tsx             Tag filter buttons
    auth-provider.tsx          Auth context (user, isAdmin)
    theme-*.tsx                Theme provider and toggle
    loading.tsx                ASCII blinking cursor
  lib/
    api.ts                     Server-side backend fetch helpers
    client-api.ts              Client-side BFF fetch helper
    auth.ts                    Token management (cookies, refresh)
    types.ts                   TypeScript interfaces
    avatars.ts                 128 ASCII emoticons
    time.ts                    Relative time formatting
  middleware.ts                Auth guard for /admin/* routes
```

## Setup

### Prerequisites

- Node.js 18+
- [server-kneresz](https://github.com/KNereSouza/server-kneresz) running
- GitHub OAuth app (callback URL: `http://localhost:3000/api/auth/callback`)

### Environment

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `BACKEND_URL` | FastAPI backend URL (e.g. `http://localhost:8000`) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g. `http://localhost:3000`) |
| `ADMIN_GITHUB_ID` | GitHub user ID for the admin account |
| `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |

### Development

```bash
npm install
npm run dev
```

### Keyboard shortcuts (post editor)

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save post |
| `Alt+Z` | Toggle zen writing mode |
| `Alt+P` | Toggle side-by-side preview (zen mode) |
| `!image` + Enter | Open image embed modal |
| `!video` + Enter | Open video embed modal |

## Related

- [server-kneresz](https://github.com/KNereSouza/server-kneresz) -- FastAPI backend

## License

[MIT](../server-kneresz/LICENSE)
