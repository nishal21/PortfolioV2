# Nishal K Portfolio

Personal site for [Nishal K](https://github.com/nishal21): AMV editor, music producer, and full-stack developer from Kerala. Live at **[nishal.dev](https://nishal.dev)**.

Built with Next.js 15 and React 19. One long scrolling homepage (hero sequence, about, skills, projects, videos, contact), plus standalone routes for projects, resume, and SEO pages.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT%20%2B%20Attribution-green?style=flat-square)](LICENSE)

[Live site](https://nishal.dev) · [Report an issue](https://github.com/nishal21/Portfolio/issues)

## What's in here

- **Scroll-driven hero** — frame sequence with canvas playback, glass title, and reduced-motion fallbacks
- **Liquid glass nav** — iOS-style pill bar with drag, slide animation, and scroll-spy
- **Studio sections** — about, skills, project showcase, YouTube picks, contact form
- **Project pages** — `/projects` index and `/projects/[slug]` detail pages (14 projects)
- **Resume** — printable resume at `/resume` and `/resume/view`
- **SEO** — sitemap, robots, JSON-LD, Open Graph, `llms.txt`, IndexNow ping script
- **Contact** — FormSubmit.co form (no backend required)

## Tech stack

| Area | Tools |
|------|--------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack dev) |
| UI | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/) |
| Motion | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Forms | [FormSubmit](https://formsubmit.co/) |
| Language | TypeScript |

Custom pieces worth noting: SVG liquid-glass filters (`src/lib/liquidGlass.ts`), scroll nav locking (`src/lib/scrollNav.ts`), hero frame loader (`ScrollSequenceContext`).

## Getting started

**Requirements:** Node.js 18+ and npm (yarn/pnpm also work).

```bash
git clone https://github.com/nishal21/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Dev uses Turbopack (`next dev --turbopack`).

### Environment variables (optional)

Create `.env.local` if you deploy or run IndexNow:

```env
# Canonical URL for metadata, sitemap, JSON-LD
NEXT_PUBLIC_SITE_URL=https://nishal.dev

# IndexNow (optional; default key ships in public/)
INDEXNOW_KEY=your-key-here
INDEXNOW_SECRET=your-secret-for-post-api
```

Contact form email is set in `src/data/contact.ts` (`formSubmit.url`), not via env vars.

## Scripts

| Command | What it does |
|---------|----------------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint (Next.js config) |
| `npm run indexnow` | Ping search engines after deploy (`scripts/indexnow-ping.mjs`) |

## Project structure

```
portfolio-main/
├── public/
│   ├── scroll/              # Hero frame manifest + images
│   ├── projects/            # Project card art
│   ├── og-image.jpg
│   ├── llms.txt, humans.txt
│   └── {indexnow-key}.txt
├── scripts/
│   └── indexnow-ping.mjs
├── src/
│   ├── app/                 # Routes, layout, sitemap, robots, manifest
│   ├── components/
│   │   ├── scroll/          # Hero sequence, glass title
│   │   ├── sections/        # About, skills, projects, videos, contact
│   │   ├── layout/          # Nav, footer, studio shell
│   │   ├── seo/             # JSON-LD, answer blocks
│   │   └── resume/
│   ├── data/                # personal, projects, skills, contact, videos
│   ├── hooks/               # useLiquidGlassNav
│   └── lib/                 # seo, scrollNav, liquidGlass, indexnow
├── next.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Customization

| What to change | Where |
|----------------|--------|
| Name, bio, nav, stats | `src/data/personal.ts` |
| Projects | `src/data/projects.ts` + art in `public/projects/` |
| Skills | `src/data/skills.ts` |
| Videos | `src/data/videos.ts` |
| Contact + socials | `src/data/contact.ts` |
| Site URL, keywords, OG | `src/lib/seo.ts` |
| Hero frames | `public/scroll/manifest.json` + frames |
| Global / studio styles | `src/app/globals.css`, `src/app/studio.css` |
| Nav glass tuning | `src/lib/liquidGlassConfig.ts` |

## Routes

| Path | Purpose |
|------|---------|
| `/` | Main portfolio (scroll sections) |
| `/about` | About page with awards/stats |
| `/profile` | SEO answer blocks + project index table |
| `/projects` | All projects |
| `/projects/[slug]` | Single project |
| `/resume` | Resume landing |
| `/resume/view` | Print-friendly resume |
| `/privacy` | Privacy policy |
| `/.well-known/security.txt` | Security contact (RFC 9116; `/security.txt` redirects here) |

## Deployment

Works on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) with default Next.js settings.

1. Push to GitHub and connect the repo.
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Run `npm run build` locally first if you want to catch errors early.
4. After deploy, submit the sitemap in Google Search Console / Bing Webmaster Tools.
5. Optional: `npm run indexnow` to notify IndexNow endpoints.

## Contributing

Issues and PRs are welcome. Fork the repo, branch from `main`, and open a pull request with a short description of what changed.

## License

[MIT with required attribution](LICENSE). You may use and fork this repo, but you must credit the original author (name, [nishal.dev](https://nishal.dev), and link to this repo). See [CREDITS.md](CREDITS.md) for a copy-paste credit line.

## Contact

- **Site:** [nishal.dev](https://nishal.dev)
- **GitHub:** [@nishal21](https://github.com/nishal21)
- **Email:** nishal@nishal.dev
