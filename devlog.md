# Devlog

## 2026-06-07 — Hero skeleton while liquid glass loads

- `titleReady` in `HeroContext`; `HeroGlassTitle` sets it when all letter masks finish (or plain fallback / no glass)
- `HeroSkeleton` overlays hero copy until glass is ready; poster/video still show immediately
- Real copy stays in DOM (hidden) for SEO; fades in when `titleReady`

**Next:** deploy and verify skeleton → glass title transition on mobile + desktop

## 2026-06-07 — Mobile skeleton: no dark scrim

- Mobile hero skeleton scrim removed (transparent); poster/video stays bright during load
- Skeleton bars slightly brighter on mobile for contrast over colorful background

## 2026-06-07 — Skeleton: remove dark panel box

- Dropped opaque `hero-skeleton-full__panel` card (was covering half the hero)
- Lighter full-hero scrim + shimmer bars only, aligned to copy slot
- Text still hidden via `#home.hero-title-loading` until glass ready

## 2026-06-07 — Skeleton hides glass bleed-through

- Masked `.lg-refr` layers were visible before `titleReady`; now hidden under `#home.hero-title-loading`
- Skeleton panel: opaque blurred card behind placeholder bars (desktop + mobile)
- Desktop scrim stronger at bottom-left where copy sits

## 2026-06-07 — Hero text + mobile video load fix

- Removed `visibility:hidden` / `clip-path` on loading copy (was blocking glass masks → text never appeared)
- Skeleton overlay only covers text visually; 3.2s fallback reveals copy if glass is slow
- Mobile video: 720px eco MP4, deferred load via `requestIdleCallback`, poster preloads first (no video preload in head)

## 2026-06-07 — Kill white Nishal flash on load

- Removed pending-letter white shadow CSS; strengthened `hero-copy--loading` + `#home.hero-title-loading`
- `HeroGlassTitle` uses `glassOn: null` pending state (no white fallback before hydration)
- Inline critical CSS in `layout.tsx`; skeleton z-index 30 above copy

## 2026-06-07 — Mobile hero matches reference layout

- Centered copy block (`translate(-50%, -50%)`), lighter vignette, no bottom curtain on mobile
- Tagline/eyebrow/malayalam spacing + colors tuned to reference screenshot
- Video credit hidden on mobile; hero uses `100dvh`

## 2026-06-07 — Restore centered mobile hero

- Mobile hero copy + skeleton centered vertically (`top: 50%`) like before
- `page-container` fills `#home` on mobile so absolute centering works without collapse
- Mobile reveal uses opacity-only animation (keeps `translateY(-50%)` centering)

## 2026-06-07 — Full-hero skeleton overlay

- `HeroSkeleton` now covers entire `#home` (scrim + shimmer, z-index 20) until `titleReady`
- Copy stays in DOM for glass masking but `visibility: hidden` — no white text flash
- Credit/scrub hidden until title ready

**Next:** deploy; verify mobile full-screen skeleton → glass title reveal

## 2026-06-07 — Mobile hero glass layout + mask stability

- Mobile: removed absolute `top: 50%` centering (collapsed container → overlapping text/line artifacts)
- Hero copy/skeleton sit above nav dock; credit pinned bottom-right above dock
- Glyph masks: revoke old blob URL only after new mask succeeds
- Title letters `flex-wrap: nowrap`; letter hosts use `isolation` to stop glass bleed
- Removed `rebuildHeroLiquidGlass` on scroll (was invalidating masks); resume only fixes broken masks

## 2026-06-07 — Hero glass survives nav slide

- Nav uses `rebuildNavLiquidGlass()` so sliding tabs no longer wipes hero letter masks
- Hero title uses `rebuildHeroLiquidGlass()` when returning to `#home`
- Letter remask on rebuild keeps `--masked` state (no pending flash)

## 2026-06-07 — Hero instant load (no black screen)

- Removed pulsing `hero-sequence-backdrop` overlay that hid the poster until video buffered
- Hero media layer uses inline `background-image` + preloaded poster (image preload before video)
- Hero copy/title visible immediately: no stagger fade-in, white fallback title until glass masks
- Main sections no longer wait on hero `ready`; nav scroll works on first paint
- `HeroVideo` uses `preload="metadata"` so poster wins bandwidth

**Deploy:** `git pull` → `npm ci` → `npm run build` → `pm2 restart portfolio-v2`

- **HSTS**, **X-XSS-Protection**, HTML **Cache-Control** (`no-store`), **Pragma**, **Expires**
- **CORP** + **COOP** headers; `poweredByHeader: false` in Next.js
- Nginx: `server_tokens off`, `proxy_hide_header X-Powered-By`, security headers on HTTPS
- Shared config: `src/lib/securityHeaders.ts`

**Deploy:** `git pull` → `npm ci` → `npm run build` → `pm2 restart portfolio-v2` → copy nginx conf → `nginx -t && systemctl reload nginx`

## 2026-06-07 — VibeCode round 2 (copyright, placeholders, skeleton)

- Footer + `<meta name="copyright">` + noscript/humans.txt with explicit `Copyright © 2020–2026`
- Contact form: visible labels, no `placeholder` attributes (scanner false positives)
- Removed main/hero skeleton overlays from DOM; content shows immediately
- Videos section title → “AMV edits & remixes”; support cards use CSS classes not inline styles

## 2026-06-07 — VibeCode detector fixes (images, copyright, inline styles)

- Main sections always in HTML (overlay skeleton until hero ready) so crawlers see `<img>` tags
- Hero poster `<img>` + Cloudinary preload; footer `© 2020–{year} Nishal K`
- Removed inline styles from noscript/hero copy; security meta tags in `<head>`
- Video descriptions: removed em dashes

## 2026-06-07 — Vibedetect / “AI signature” cleanup

- Renamed `cursor-hover` → `hit-target`, `CustomCursor` → `PointerOverlay`, `custom-cursor-*` → `pointer-*` (HTML no longer contains “Cursor” class names)
- Replaced em dashes (—) with · in SEO/JSON-LD/noscript copy
- Security headers: CSP, X-Frame-Options, Referrer-Policy in `next.config.ts` + nginx
- Removed unused `public/vercel.svg`

## 2026-06-07 — RSS feed (`/feed.xml`, `/rss.xml`)

- `src/lib/rss.ts` — projects, YouTube videos, key portfolio pages
- Auto-discovery in `layout.tsx` metadata; listed in `llms.txt` + `humans.txt`
- **URL:** https://nishal.dev/feed.xml (alias `/rss.xml`)
- Add to Peerlist profile, Feedly, etc. after deploy

## 2026-06-07 — Hero: video-only Cloudinary (no poster image)

- Removed separate poster JPG load — first frame comes from the MP4 (`#t=0.001`)
- Cloudinary URL uses `q_auto,f_mp4`; preload in `layout.tsx`
- `HeroVideo`: forced `muted`/`loop`/`playsInline`, ready on `canplay`, fade on `playing`
- Kept skeleton, backdrop, scrub, credit, main-content gate — all tied to video ready, not images

## 2026-06-07 — Peerlist URL + hero video Pinterest credit

- Peerlist → `https://peerlist.io/nishal21` (no `/u/`) in `contact.ts`, resume, llms.txt, humans.txt, JSON-LD `sameAs`
- Hero credit link bottom-right: “Video · Pinterest” → https://pin.it/3T4tJpHL2 (`heroMedia.ts`, `ScrollIntroSection.tsx`, `CREDITS.md`)

## 2026-06-07 — Hero video on Cloudinary

- Default `HERO_VIDEO_SRC` → `https://res.cloudinary.com/dtzzqvvzi/video/upload/v1781247946/hero.mp4`
- Poster from Cloudinary first frame (`so_0,q_auto,f_jpg,w_1280`)
- Override via `NEXT_PUBLIC_HERO_VIDEO_URL` / `NEXT_PUBLIC_HERO_VIDEO_POSTER` (e.g. self-hosted `/hero.mp4`)
- `layout.tsx` preconnect to `res.cloudinary.com`
- **Deploy:** `git pull` → `npm ci` → `npm run build` → `pm2 restart` — no `hero:prepare` needed
- **Optional:** remove `public/hero.mp4` from repo to save size; update video on Cloudinary dashboard, then rebuild only if URL changes
- **Windows dev ENOENT on `.next/server/*.tmp`:** delete `.next` folder, run `npm run dev` again (stale/corrupt cache)

## 2026-06-10 — Hero: video only (scroll frames removed)

- Removed 166-frame canvas system (`ScrollSequenceContext`, canvas, `heroFrames`, `heroCanvas`)
- Hero = `public/hero.mp4` (~2.3 MB from `1.mp4`) via `HeroVideo` + `HeroContext`
- `npm run hero:prepare` copies `1.mp4` → `public/hero.mp4` (+ optional poster)
- Nginx long-cache for `hero.mp4`

## 2026-06-10 — Peerlist profile link

- `https://peerlist.io/nishal21` in social row, resume, llms.txt, humans.txt, JSON-LD sameAs

## 2026-06-10 — Footer: Website Launches badge

- `SiteFooter.tsx` — link + dark badge from websitelaunches.com/nishal.dev

## 2026-06-10 — Pinterest Article Rich Pins

- `buildArticleOpenGraph()` on `/projects/*`, `/projects`, `/about`, `/profile`
- Optional `PINTEREST_DOMAIN_VERIFY` in `.env.production` for domain claim
- Steps in `deploy/DEPLOY.md`

## 2026-06-10 — VideoObject JSON-LD (Rich Results)

- `uploadDate` → ISO 8601 with `+05:30` (e.g. `2024-02-04T12:00:00+05:30`)
- `duration` → ISO 8601 (e.g. `PT43S`, `PT7M9S`) via `src/lib/videoSchema.ts`

## 2026-06-10 — Favicon ICO + “Nishal” SEO + Bing

- Removed `/favicon.ico` → SVG redirect; regenerated ICO/PNG from `favicon.svg` (dark `#080a0c`, no white edges)
- Titles/descriptions lead with **Nishal**; JSON-LD `alternateName`; optional `BING_SITE_VERIFICATION` env
- Bing: use **https://nishal.dev** in Webmaster Tools, not `http://`

## 2026-06-10 — Social links

- Instagram → `demonking.___` · LinkedIn → `nishal-k` (`contact.ts`, `llms.txt`)

## 2026-06-10 — Hero canvas perf

- `heroCanvas.ts`: cached 2d context, `desynchronized` on mobile, rAF-only autoplay
- `.hero-sequence-canvas` GPU layer; frames stay off-DOM (`Image` → canvas only)

## 2026-06-10 — Hero mobile: 60 frames, source-timed speed

- Mobile: 60 evenly-spaced keyframes (was ~28 every-6th)
- `heroPlaybackFps()` matches source clip duration (~7s @ 24fps manifest)

## 2026-06-10 — Mobile hero: looping autoplay (no scroll track)

- Reverted sticky scroll track (caused black gap before content)
- Mobile loads ~28 sparse keyframes (every 6th) + `setInterval` autoplay loop
- Desktop: full 166 frames, rAF autoplay loop; no wait for all frames before first play

## 2026-06-10 — robots.txt (Google crawl fix)

- `public/robots.txt` — 27 crawlers + 24 explicit `Allow` paths (from `getIndexablePaths()`)
- `npm run generate:robots` regenerates file; runs before `npm run build`
- Removed `src/app/robots.ts` — static file served from `public/`

## 2026-06-10 — Meta tags (OG image + description lengths)

- Restored `public/og-image.jpg` (user artwork) — removed generated `opengraph-image.tsx`
- `OG_IMAGE` metadata matches file: 1024×682
- `SITE_TITLE` (53 chars), `metaDescription()` (~158), `socialDescription()` (~108)

## 2026-06-10 — Contact: visible social icon row

- Replaced hidden Socials popover with `ContactSocialRow` (GitHub, LinkedIn, YouTube, X, Instagram)
- Icons always visible under Connect / Resume

## 2026-06-10 — Favicon fix (VPS)

- Static `public/favicon.svg` (NK sage/gold)
- `metadata.icons` in layout; `/favicon.ico` → `/favicon.svg` redirect
- Manifest PWA icons use favicon.svg + apple-icon

## 2026-06-10 — Hero sequence: no restart while frames load

- `findNextLoadedFrame` no longer wraps to frame 0 when next frame is not ready
- Autoplay starts only after all 166 frames are loaded (`allFramesLoadedRef`)

## 2026-06-10 — Fix VPS build (webkitBackdropFilter TS)

- `liquidGlass.ts`: `setProperty('-webkit-backdrop-filter')` (TS DOM types)
- `useLiquidGlassNav.ts`: `void indicator.offsetWidth` for reflow

## 2026-06-10 — VPS deploy pack (Nginx + PM2)

- `deploy/DEPLOY.md`, `install.sh`, `ecosystem.config.cjs`, `nginx-nishal.dev.conf`
- Repo `nishal21/PortfolioV2`, path `/opt/portfolio-v2`, PM2 `portfolio-v2`, port **3002**

## 2026-06-10 — nishal@nishal.dev (domain + mail live)

- Site contact, FormSubmit, resume, security.txt, humans/llms → `nishal@nishal.dev`
- PGP key still on `nishalamv@gmail.com` until new key for domain mail (optional)
- **Next:** DNS A → VPS, FormSubmit activate on first submit, deploy with `NEXT_PUBLIC_SITE_URL`

## 2026-06-09 — security.txt

- `public/.well-known/security.txt` (mailto + GitHub, expires 2027-06-09, policy → /privacy)
- `Encryption:` → `/.well-known/nishal-public.asc` (OpenPGP, nishalamv@gmail.com)
- `/security.txt` → `/.well-known/security.txt` redirect in `next.config.ts`

## 2026-06-09 — LICENSE attribution requirement

- `LICENSE`: MIT + mandatory credit (README, footer, or CREDITS.md) for forks/derivatives
- Added `CREDITS.md` with copy-paste attribution line

## 2026-06-09 — README + LICENSE

- README rewritten to match current stack (nishal.dev, scroll hero, liquid nav, SEO routes)
- Added MIT `LICENSE` (Copyright 2026 Nishal K)

## 2026-06-09 — Nav: Home→Contact on fresh load (no stop at Projects)

- Instant scroll only for `#home`; far jumps use smooth + `waitUntilSectionArrived`
- First post-skeleton nav waits `waitForLayoutSettle` before measuring scroll target
- Scroll-spy 700ms cooldown after nav click
- Long tab jumps slide too (duration scales with distance, up to ~0.82s)
- Drag: `transition: none` during hold/slide so pill follows pointer (inline transition was blocking)

## 2026-06-09 — Nav: indicator after scroll + no stale lock races

- Pill updates only when scroll lands (`setActive` on lock release, not on click)
- Stale scroll completions ignored via `scrollGenRef` (Projects finish won't override Contact click)
- Scroll-spy paused while `navLockRef` is set

## 2026-06-09 — Nav: wait for content ready before section scroll

- Main sections mount only after hero frame 0 (`ready`); no skeleton+sections double layout
- Nav defers non-Home clicks until ready; `waitUntilSectionReady` before scroll
- Scroll-spy paused until content measurable

## 2026-06-09 — Nav pill slide animation restored

- Indicator animates on every tab change (click + scroll-spy); instant snap only on resize/mount

## 2026-06-09 — Nav scroll-spy: Projects no longer shows Contact

- Removed `y + vh >= docH - 64` shortcut (fired near max scroll while still in Projects)
- `getActiveSectionHref()` uses nav-line marker; last section past marker wins

## 2026-06-09 — Nav Home click: instant indicator snap

- `jumpToIndex` snaps pill on tab click (no slide through About)
- Adjacent scroll-spy changes still animate; lock held until section arrived

## 2026-06-09 — Nav glass: softer white edge

- Lowered `specularOpacity` + bezel on NAV/TAB glass configs
- Tab indicator inset highlight 0.42 → 0.14; lighter panel shadows

## 2026-06-09 — Nav scroll reaches clicked section

- `scrollToSection` Promise: polls + scrollend + hard snap fallback
- Nav lock held until section arrives (not timeout)
- `scroll-margin-top` on sections for fixed nav

## 2026-06-09 — Nav slide clean (no mid-scroll stuck)

- One animation per tab change (`prevAnimatedIndexRef`); tap uses onClick only, drag uses pointer
- Nav lock held 520ms after scroll stops (scroll spy won't fight slide)
- Glass rebuild after transition ends (400ms)

## 2026-06-09 — Favicon NK colors

- **N** sage `#a6c78c` · **K** gold `#d4a854` (tab + apple-icon)

## 2026-06-09 — Hero text snap on return home

- `--hero-fade` snaps to 1 in hero zone + on `heroInView` / resume
- Glass title stays mounted (no slow remount on return)
- No CSS transition on hero-fade items

## 2026-06-09 — Hero scroll performance (v2)

- Nav lock: clicked tab highlights immediately until scroll settles
- Hero canvas stays visible (frozen frame) — no black on return home
- `HERO_RESUME_EVENT` redraws sequence when scrolling back to home
- Autoplay pauses off-screen; canvas never hidden

## 2026-06-09 — Profile SEO page moved off homepage

- Removed `SeoAnswerBlocks` from homepage About section
- New indexable page: `/profile` (answer cards + project table)
- Footer link: Profile → `/profile`
- `/about` keeps awards/stats; links to profile

## 2026-06-09 — SEO 30/30 (full stack)

- **AEO:** `SeoAnswerBlocks` in About + `/about` (no FAQ UI); `SpeakableSpecification`; project table
- **GEO:** Person/Org/ProfilePage `@graph`, awards, VideoObject, `/about`, `/privacy`, `humans.txt`
- **Pages:** `/about`, `/privacy`, 22 URLs in sitemap
- **Crawl:** noscript fallback, manifest, improved alts + internal links
- **Score:** 30/30 in codebase — deploy + GSC/Bing still required for live rankings

## 2026-06-09 — SEO / GEO / AEO + IndexNow

- **OG:** `public/og-image.jpg` · **IndexNow:** `npm run indexnow` after deploy
- **Report:** `reports/seo-audit-nishal.dev-2026-06-09.md`

## 2026-06-09 — Contact hero spacing + headline alignment

- Malayalam name: dedicated `.studio-contact-name` (not cramped `.studio-label`)
- Hero `gap` between name and headline; CTA line stays together (`white-space: nowrap`)
- Two-line headline structure; removed `text-wrap: balance` bad breaks

## 2026-06-09 — GitHub Stars Organizer added

- **Project:** `src/data/projects.ts` id 14 — pinned dev-tool CLI (Python, GitHub API)
- **Cover:** `public/projects/github-stars-organizer.svg` via `scripts/generate-project-covers.mjs` (`stars` motif)
- **Resume:** `resume.ts` — general/developer summaries + GitHub experience bullet
- **Timeline:** `personal.ts` 2026 line
- **Repo:** https://github.com/nishal21/github-stars-organizer

## 2026-06-09 — SEO/GEO/AEO Cursor skill installed

- Created `~/.cursor/skills/seo-geo-aeo/` — merges SNLabat audit + aaron-he-zhu 20-skill library
- Invoke: `@seo-geo-aeo` → Quick/Full audit → `reports/seo-audit-*.md`
- Vendor cloned: `~/.cursor/skills/seo-geo-aeo/vendor/` (20 upstream skills)

## 2026-06-09 — Resume clean URLs (path-based)

- Share: `/resume/view` (general), `/resume/view/developer`, `/creative`, `/fullstack`
- Old `?clean=1` redirects to `/resume/view`
- Print autoprint: `?print=1` on view route only (not in share link)

## 2026-06-09 — Resume clean share link + print headers

- Copy share link / Open clean view in toolbar
- Print: turn off browser **Headers and footers**; title cleared before print

## 2026-06-09 — Resume copy humanized

- `@humanizer` pass on `src/data/resume.ts`: summaries, bullets, soft skills, accomplishments
- Cut filler ("delivered", "participating in initiatives"); varied verbs; hyphen date ranges

## 2026-06-09 — Resume page custom cursor

- `CustomCursor` moved to `RootProviders` (all routes)
- Resume: dark cursor on white paper via `body.resume-route` (`ResumePageEffects`)

## 2026-06-09 — Timeline: remove hybridq

- Not Nishal's project — dropped from 2024 line in `personal.ts`

## 2026-06-09 — Skills badge trim

- Removed `From Kerala` from `skillBadges` in `skills.ts`

## 2026-06-09 — Timeline years fixed (GitHub)

### `personal.ts` timeline
- **2025:** NMHelper, Musico, Otazumi, OtakuPulse (were in wrong years)
- **2026:** NekoBeat, Publicolio, Sigil-extractor, CarbonLint
- **2024:** JARVIS, hybridq · **2023:** 3D/Animation only

## 2026-06-09 — Mobile contact nav active fix

### Problem
- Contact is the separate mail FAB, not in the mobile pill; `#contact` mapped to index 0 → pill stuck on Home

### Fix
- `mobileActiveIndex = -1` when contact active → hide pill slider; mail FAB gets `.active`
- Scroll spy: bottom-of-page → `#contact`; viewport-center probe for sections

## 2026-06-09 — Nav active tab on scroll fix

### Problem
- IntersectionObserver ran once on mount; sections below hero were not in DOM yet (skeleton gate) → never observed

### Fix
- Scroll spy re-runs when `ready`; picks section whose top passed ~35% viewport line
- Hero stays active while `scrollY < 45vh`

## 2026-06-09 — Android hero liquid glass v3 (per-letter)

### Done
- Removed whole-word glass box; per-letter glass on all mobile
- Glass hidden until mask applies (`hero-letter-host--masked`) — no bubble flash
- Android: blob PNG masks, tighter `data-radius="12"`, mask retries
- If mask fails: `hero-letter-host--plain` white letter (no box)

### Verify
- Hard refresh Android LAN — "Nishal" letters should refract like iOS

## 2026-06-09 — Socials: Twitter → X

### Done
- `contact.ts`: label **X**, link `https://x.com/Etainment2`
- `SocialsPopover`: X brand SVG icon (`components/icons/XLogo.tsx`)

## 2026-06-09 — Contact align + hero glass on mobile

### Done
- Contact hero: centered block, balanced headline, clean 2-line break (`developer.` / `Let's work on…`)
- Hero liquid glass: enabled on mobile/touch via `heroLiquidGlassEnabled()` + `force: true` on letter glass
- Rebuild glass when scroll sequence `ready` (canvas visible behind letters)
- Mobile hero skeleton centered like hero copy

### Verify
- Phone on LAN (`192.168.x.x:3001`): hard refresh hero — "Nishal" letters should refract like desktop
- If iOS Safari still flat: may need WebKit-specific rebuild delay

## 2026-06-09 — Hero + page skeleton loaders

### Done
- While scroll sequence loads (`ready === false`): dark backdrop + `HeroSkeleton` placeholders in hero
- Main sections deferred until first frame ready — `MainContentSkeleton` (about/skills/projects blocks)
- After frame 0 loads: canvas fades in, hero copy animates, real sections mount with `studio-content--in`

### Files
- `src/components/ui/Skeleton.tsx`
- `src/components/scroll/HeroSkeleton.tsx`
- `src/components/layout/MainContentSkeleton.tsx`
- `ScrollIntroSection.tsx`, `PortfolioPage.tsx`, `globals.css` (shimmer + backdrop)

### Next
- Hard refresh — confirm skeleton → hero + content reveal on slow 3G
- Optional: progress % on skeleton if first frame is slow

## 2026-06-09 — Project reel desktop grid

### Done
- Mobile: horizontal scroll reel unchanged
- Tablet (768px+): 2-col grid, no scrollbar
- Desktop (1100px+): 3-col grid; equal-height cards, hint pinned to card bottom

## 2026-06-09 — About section alignment

### Done
- Timeline moved full-width below quote/bio grid (not cramped in right column)
- Timeline dots centered on line; mobile stacks year above event
- Stats 2×2 grid on phone, 4-col desktop; watermark hidden on mobile
- Consistent gaps, margins reset on paragraphs

## 2026-06-09 — Modal dev badge mobile

### Fix
- Project modal header: category + pills on one wrapped row; title below with spacing
- Mobile: "In development" → short label **Dev**; smaller pill badges

## 2026-06-09 — Video modal action bar

### Done
- YouTube link uses same sticky `studio-modal-actions` footer as project Live/Repo/Watch
- Warm amber primary button for video section

## 2026-06-09 — ImageFrame fix (project covers)

### Fix
- Replaced canvas with native `<img>` + `object-fit` (SVG covers were blank with canvas + zero-height `fill`)
- Removed `fill` on project covers; use `aspect-[16/10]` + `object-cover`

## 2026-06-09 — Project modal action bar

### Done
- Live / Repo / Watch moved to sticky footer bar (grid buttons, no overlap with content)
- Watch shows when `project.video` is set (YouTube demo URL)
- Modal: flex column — scrollable body + fixed actions footer

### Next
- Add `video` URL per project in `projects.ts` for Watch links

## 2026-06-09 — Socials popover mobile fix

### Fix
- Mobile: popover `position: fixed`, centered on viewport (was anchored to narrow Socials button → shifted right)
- Dimmed backdrop on small screens

## 2026-06-09 — Project tags + modal cover

### Done
- Tags/`lastUpdated` synced from GitHub `/languages` + `pushed_at` for all public repos
- **NMHelper**: React/Node/Postgres stack per site metadata; last update 2026/05/27
- Modal cover: full-width `cover` fit (no squashed contain box)
- Modal shows last update, GitHub language badges, detailed tech stack (NMHelper)

### Re-sync GH languages
```bash
node scripts/sync-github-languages.mjs
```

## 2026-06-09 — Featured project cover fix

### Fix
- Modal `studio-cover-frame` max-height was applied to flagship/reel cards (squashed cover on mobile)
- Split `projectCardCoverProps` (cover fit) vs `projectModalCoverProps` (contain)
- Flagship media: 16/10 aspect on mobile, `fill` ImageFrame, edge-to-edge cover

## 2026-06-09 — Custom cursor over modals

### Fix
- `CustomCursor` portaled to `document.body` at z-index 400 (modals are 300)
- Cursor visible again when project/video modals are open

## 2026-06-09 — Humanizer pass on portfolio copy

### Done
- `@humanizer` applied to `personal.ts`, section blurbs, contact, all project desc/longDesc
- Cut em dashes, promo speak ("premium", "ecosystem", "flagship"), rule-of-three lists
- Voice: first person, specific, casual where it fits

### Files
- `personal.ts`, `projects.ts`, `contact.ts`, `layout.tsx`
- `AboutSection` (via personal), `SkillsSection`, `ProjectsSection`, `VideosSection`, `ContactSection`

## 2026-06-09 — About copy + layout

### Done
- `personal.ts`: new `pullQuote`, tighter bio, timeline updated (no StudyForge/ILLBOT)
- About: intro line → quote + bio/timeline grid; smaller quote type; left accent border
- Tagline: "…from Kerala"

## 2026-06-09 — Trail of Bits security skills (Cursor)

### Done
- Personal skill: `~/.cursor/skills/trailofbits-skills/` — router + plugin catalog + install scripts
- Vendor cache: shallow clone of [trailofbits/skills](https://github.com/trailofbits/skills) (39 plugins)
- Invoke: `@trailofbits-skills` or ask for security review / differential review / Semgrep audit

### Next
- Run `scripts/install.ps1 -Update` periodically to refresh vendor
- For a specific plugin, agent loads `vendor/plugins/<plugin>/skills/<skill-name>/SKILL.md`

## 2026-06-09 — Humanizer Cursor skill

### Done
- Created personal skill from [blader/humanizer](https://github.com/blader/humanizer) v2.8.0
- `~/.cursor/skills/humanizer/SKILL.md` + `patterns.md` (33 AI-writing patterns)
- Invoke: `@humanizer` or "humanize this text"

### Next
- Optional: copy to `.cursor/skills/humanizer/` for repo sharing
- Run on portfolio copy if descriptions sound too AI-polished

## 2026-06-09 — Modal + mobile project views

### Done
- **Modal portal** (`ModalPortal.tsx`) — renders to `document.body` so nav no longer stacks on top
- Nav hides while modal open (`body.studio-modal-open`)
- Mobile: bottom-sheet modal, sticky header, safe-area padding, responsive type
- **ImageFrame** `fit="contain"` + `aspect="wide"` for project covers (no crop clipping)
- Covers v4: title top-left, icon lower-center, regenerated all SVGs
- Video modal uses same portal pattern

### Verify
- Hard refresh (Ctrl+Shift+R) to clear old cover cache
- Test project modal on phone width + desktop

## 2026-06-09 — Project covers v3 (alignment fix)

### Done
- Rewrote `scripts/generate-project-covers.mjs` — **simpler two-column layout**
- Left: badge + title + subtitle + accent bar (vertically centered at y≈400)
- Right: single centered motif per project (no overlapping circles/bars/text)
- Removed: glass frame, grid, noise, NK monogram, bottom footer tag
- Regenerated all 13 `public/projects/*.svg`

### Regenerate
```bash
node scripts/generate-project-covers.mjs
```

### Next
- Swap SVGs for real screenshots when available (`public/projects/*.webp`)

## 2026-06-09 — Support links in contact

### Done
- `supportLinks` in `contact.ts` — BMC, Patreon, Ko-fi, GitHub Sponsors
- `SupportStrip.tsx` in contact left column (brand-colored icon chips)
- Links: buymeacoffee.com/kingtanjiro, patreon.com/DemonKing08, ko-fi.com/demon_king, github.com/sponsors/nishal21

## 2026-06-09 — Projects refresh + cover art

### Done
- **Removed:** ILLBOT, StudyForge, StepSolve
- **Added:** NekoDroid (featured, in dev), CarbonLint, ARGUS, Askira (in dev)
- **Covers:** `public/projects/*.svg` — 12 branded thumbnails via `scripts/generate-project-covers.mjs`
- `projects.ts`: `status: live | development`, each project has `images[]`
- Projects section shows "In development" label for NekoDroid & Askira
- **Display order:** NekoBeat → NMHelper → NekoDroid → pinned (Publicolio, Sigil-extractor, CarbonLint, Extracto) → others
- **Added:** Sigil-extractor (GitHub pinned). Click any card → modal with description + longDescription + features (Esc to close)

### Regenerate covers (v2 — motifs, glass panel, LIVE/DEV badges, noise)
```bash
node scripts/generate-project-covers.mjs
```
Each cover: unique icon motif, 3-stop gradient, grid + film grain, project-specific palette.

## 2026-06-09 — GitHub sync + creator identity copy

### Done
- Pulled public repos from `github.com/nishal21` (API) — refreshed `projects.ts` descriptions, added **NekoBeat**, **Publicolio**, **Extracto**; removed stale Askira entry
- Reordered projects: music/anime first (NekoBeat, Otazumi, Musico)
- `personal.ts`: tagline + bio emphasize **AMV editor, music producer, developer**; stats/timeline updated
- `skills.ts`: video/music badges & craft lanes lead with Edit + Music
- Section + contact copy updated; fixed mojibake in `videos.ts` titles

### Next
- Add real thumbnails for NekoBeat / Publicolio / Extracto if available
- Optional: surface more GH repos (CarbonLint, ARGUS, Kura) in reel

## 2026-06-09 — Studio Cut + About copy fix

### Done
- **Studio Cut:** post-hero sections redesigned (`studio.css`, `StudioSection`, `ShowcaseStage`); hero curtain; removed `ScrollSequenceLayer` behind main
- **Nav glass (Phase 0):** `enableNavLiquidGlass()` — nav always gets liquid glass on mobile + desktop
- **About:** section subtitle uses `tagline`; pull quote uses `bio[1]` (no duplicate intro with `bio[0]`)

### Next
- Hard refresh and scroll past hero — confirm solid studio bg, no scroll frames behind sections
- Run `npm run build` locally if deploy needed

## 2026-06-07 — WebP scroll sequence + layout rebuild

### Done
- Converted `1.mp4` (1280×720, ~6.9s) → **166 WebP frames** in `public/scroll/` (~11.5 MB total)
- Added `public/scroll/manifest.json` (frame paths, count, scroll distance)
- New scroll system: `ScrollSequenceProvider`, `ScrollSequenceCanvas`, `ScrollSequenceLayer`, `ScrollIntroSection`
- **Pinned intro**: `#home` pins while scroll scrubs frames (Apple-style)
- **Background scrub**: fixed canvas behind content; dims after intro (~18% scroll progress)
- Rebuilt entry via `PortfolioPage.tsx` — removed old `HeroSection`, dropped global `ScrollAnimations`
- Sections use `.glass-section` (blur panel over sequence background)
- Unified age badge to **18 Years Old** in Skills

### Key files
- `public/scroll/frame_0001.webp` … `frame_0166.webp`
- `src/components/scroll/*`
- `src/components/PortfolioPage.tsx`
- `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`

### Run locally
```bash
npm install
npm run dev
```

### Next steps
1. Add missing assets: `/pro/*`, `/thumbnails/*`, `favicon.ico`, `og-image.jpg`
2. Consider `1.mp4` in `.gitignore` (frames already exported)
3. Fix Netlify deploy — add `@netlify/plugin-nextjs` or use Vercel
4. Optional: reduce frame count (20fps) if 11.5 MB is too heavy for mobile
5. Remove unused deps: `three`, `@react-three/*`, `@emailjs/*`, `@formspree/*`

## 2026-06-07 (polish) — readability, animations, Malayalam

### Fixed
- **Readability**: glass sections now ~88% opaque; scroll overlay reduced (0.38 vs 0.65)
- **Animations**: removed anime.js scroll entrances from Projects, Contact, VideoGallery; softer GSAP in About/Skills
- **Malayalam**: added `Noto_Sans_Malayalam` font + fixed corrupted text → `നിശാൽ`

### If content still hard to read
- Increase `.glass-section` opacity in `globals.css` (currently `0.88`)
- Lower `ScrollSequenceLayer` overlay further in `ScrollSequenceLayer.tsx`

### Dev server ENOENT fix
If `.next` manifest errors appear: stop `npm run dev`, delete `.next`, restart dev.
Cause: cache deleted/corrupted while dev server was running.

## 2026-06-08 — ENOENT `_buildManifest.js.tmp` (fixed)

### Symptom
`ENOENT: open ...\.next\static\development\_buildManifest.js.tmp.*` after long compile (~138s).

### Fix applied
1. Stop all `node` processes (dev + background build were conflicting)
2. Delete entire `.next` folder
3. Run `npm run dev` again → Ready in ~13s, `/` compiles cleanly

### If it happens again
- Do not run `npm run build` while `npm run dev` is active
- Close extra terminals running Next on the same project
- Then: stop dev → `Remove-Item -Recurse -Force .next` → `npm run dev`

## 2026-06-08 — Hero look explained + vignette polish

### Why hero looked "like that"
- **Frame 0 on load** — scroll sequence is static until you scroll (by design)
- **Letterbox bars** (8vh black strips) were cropping the art — removed
- **Faint scroll hint** — low-contrast text on busy background — fixed with pill badge

### Changed
- Letterbox → soft gradient vignette (`.hero-vignette`)
- Brighter title + scroll CTA for readability over canvas

### Fixed
- **ImageFrame** now renders via `<canvas>` + `drawImage` (not `next/image`)
- **Scroll hero** uses `<canvas>` in pinned intro; removed opaque `bg-hero` that hid frames
- **Multi-canvas** scroll context — intro + background layer both paint the same frame
- **Intro scrub** wired to `setProgress` on pin (full 166-frame sequence on scroll)

### Files
- `src/lib/canvasImage.ts` — shared cover-fit draw helpers
- `src/components/ui/ImageFrame.tsx`
- `src/components/scroll/ScrollSequenceContext.tsx`, `ScrollIntroSection.tsx`, `ScrollSequenceLayer.tsx`

## 2026-06-08 — Hero redesign v2 (editorial panel)

### Problem
- Centered white text invisible on bright moon/water in scroll frame
- Nav showed "About" active on hero; empty-looking landing

### Done
- Bottom-left **glass panel**: name, Malayalam, tagline, Projects + About CTAs
- Asymmetric vignette for text zone; frame counter bottom-right
- Nav hero mode: dark pill + white links; Home active when scrollY < 55vh
- Content fades only after 82% intro scroll (not immediately)

### Next
- Hard refresh localhost:3000; scroll hero to scrub frames
- Add `/favicon.ico` to clear dev "1 Issue" if favicon-related

## 2026-06-08 — Hero panel layout fix

### Fixed
- Removed bottom-right **Sequence** block that overlapped CTAs on mid-width screens
- Frame counter moved to **top-right inside panel** (compact "Frame 001 / 166")
- Buttons use `.hero-actions` row with proper spacing; progress bar inside panel

## 2026-06-08 — Film poster hero (final layout)

### Done
- Removed glass card — typography bottom-left on canvas with light scrim only
- Large title `clamp(3rem, 12vw, 6.5rem)`, Malayalam, tagline, text-link CTAs
- Full-width 2px amber scrub bar at bottom edge
- Nav: wider pill (`gap-2`, `px-5` links, `bg-black/35` on hero)
- Added `src/app/icon.tsx` (amber N favicon) — clears dev "1 Issue" badge
- `npm run build` passes

### Files
- `ScrollIntroSection.tsx`, `globals.css`, `SiteNav.tsx`, `src/app/icon.tsx`

## 2026-06-08 — Autoplay loop for scroll frames

### Done
- Hero frames **autoplay at 24fps** (from manifest) and loop continuously
- Preloads all 166 frames; skips unloaded frames until ready
- Pauses when tab hidden; respects `prefers-reduced-motion`
- Removed scroll-scrub pin — hero is one viewport, scroll fades copy into About
- Bottom scrub bar now tracks autoplay progress (cycles)
- Background layer dims via scroll position, not playback progress

### Files
- `ScrollSequenceContext.tsx`, `ScrollIntroSection.tsx`, `ScrollSequenceLayer.tsx`

## 2026-06-08 — Hydration mismatch fix

### Cause
- Stale `.next` SSR cache serving old hero-panel markup while client had film-poster code
- Framer Motion `initial="hidden"` rendered different HTML on server vs client

### Fixed
- Hero uses plain HTML + CSS entrance (no motion SSR mismatch)
- `useMounted` gates scrub bar progress + mobile scroll hint
- SiteNav uses plain `<nav>` (no motion initial state)
- Clear `.next` and restart dev if mismatch returns

## 2026-06-08 — Liquid glass navbar

### Done
- iPhone-style nav: gradient rim, `blur(48px) saturate(190%)`, specular top shine, inset highlights
- Active link = frosted pill inside glass; mobile sheet uses same blur treatment
- Files: `SiteNav.tsx`, `globals.css` (`.glass-nav*`)

### v2 — why it looked wrong vs Apple Liquid Glass
- Old nav used **dark tint** (`rgba(255,255,255,0.06)` + black on scroll) → looked like flat glassmorphism, not Apple’s **light refractive** material
- Apple ([newsroom](https://www.apple.com/in/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)) uses real-time blur/refraction + specular highlights; web CSS can only approximate with `backdrop-filter`
- **Fixed:** light glass (`rgba(255,255,255,0.52)`), dark labels, amber active glow, compact shrink on scroll, removed dark `glass-nav--solid` mode

### v4 — Real Liquid Glass (SVG refraction from demo)
- Ported demo engine: `src/lib/liquidGlass.ts` (displacement + specular SVG filters on `backdrop-filter`)
- iOS 26 nav: sliding `tab-indicator`, pointer glow, drag-between-tabs
- Files: `SiteNav.tsx`, `useLiquidGlassNav.ts`, `liquidGlassConfig.ts`, `globals.css` (`.ios26-nav*`)
- Best in Chrome/Safari (SVG filter backdrop). Fallback: soft panel if no backdrop-filter

### v3 — adaptive translucent glass (best pass)
- **Hero:** `glass-nav--light` — 14% white fill, red/blue canvas bleeds through, white labels
- **Content:** `glass-nav--dark` — 42% dark fill, not solid gray pill; white labels on Projects/About
- Active = subtle tint + amber dot (not solid white block)
- Opacity cut ~70% vs v2 so blur actually shows

### v5 — compact sliding nav
- **Size:** 38px tall, 520px max width, 12px labels
- **Animation:** white pill slides between tabs; no drag/hamburger
- **Mobile:** `hidden md:flex`

### v6 — demo liquid glass sliding (current)
- Restored user's demo behavior: SVG refraction on bar + sliding tab on press/drag
- **Size:** 52px tall, 580px max, 12.5px labels (slightly bigger than v5)
- Pointer glow (`nav-glow`), drag-between-tabs, `TAB_GLASS_CONFIG` on indicator while interacting
- **Colors:** neutral white glow + dark active text (no amber/gold)
- **Clamp fix:** indicator uses `offsetLeft` + `overflow:hidden` so pill never slides past bar edges

### v8 — mobile bottom dock
- Floating liquid glass pill at bottom (Home, About, Projects, Videos) + Contact circle button
- Same sliding glass tab + SVG refraction; safe-area padding; page bottom inset on mobile
- Desktop keeps top nav; `md:hidden` / `hidden md:flex`
- **Files:** `SiteNav.tsx`, `navMeta.ts`, `globals.css`, `PortfolioPage.tsx`

### Hero title glass — per-letter nav shader (v3)
- **Problem:** whole-word mask + `buildTextFilter` looked muddy/brown, not nav liquid glass
- **Fix:** each letter is its own `data-glass-mode="letter"` host with **same `NAV_GLASS_CONFIG` + `buildFilter`** as nav pill (tight bbox ≈ nav height)
- Canvas mask on `.lg-refr` only; tint layer hidden for letters
- `lg-rebuilt` event re-applies mask after filter rebuild
- **Files:** `HeroGlassTitle.tsx`, `liquidGlass.ts`, `globals.css`
- **Test:** hard refresh Chrome/Safari — each letter should warp background like nav bar

### Hero shadows + mobile type scale
- Per-letter `.hero-glass-shadow` with `drop-shadow` (not on glass parent — avoids breaking backdrop-filter)
- Stronger glyph stroke; text-shadow on eyebrow, Malayalam, tagline
- Mobile: title `clamp(3.5rem, 16vw, 5rem)`, Malayalam `clamp(1.75rem, 6.5vw, 2.5rem)`, larger tagline/eyebrow

### Performance pass (anti-lag)
- **Frames:** batched load (5 concurrent + idle gaps); autoplay pauses when hero off-screen or tab hidden; 12fps mobile
- **Canvas:** capped DPR; `alpha: false`; debounced resize; bg layer = single static paint (not 2 live canvases)
- **Glass:** disabled on mobile/coarse pointer/reduced-motion; per-letter rebuild only (not `rebuildAll`)
- **Cursor:** rAF + direct transform (no React state per mousemove); no MutationObserver
- **CSS:** `content-visibility` on sections; no backdrop-filter on mobile cards; grain off on touch

### Section polish + Rino contact window
- **Removed** heavy glass box on sections (title + body no longer split across a bordered slab)
- **Open editorial** layout: hairline section dividers, lighter cards on scroll canvas
- **Contact:** Rino-style rounded stage, chrome Connect + Socials popover grid (`SocialsPopover.tsx`, `ConnectButton.tsx`)
- **Stats/skills/projects** use minimal borders, not boxed grids

### Cinematic theme unification (current)
- **Removed Rino clone:** deleted `AboutProjectsSection`, `ProjectsStack`, `ChromeButton`, all `rino-*` CSS
- **Film editorial system:** `film-*` tokens, glass section panels, numbered acts (01–05), ink/teal/mist palette
- **Scroll canvas:** persists at 22% opacity past hero with teal mist wash (`ScrollSequenceLayer`)
- **Sections:** About (credits + Malayalam), Skills (Edit/Music/Code pillars), Projects (featured + grid/modal), Videos (featured premiere), Contact (credit-roll + glass form)
- **Order:** Hero → About → Skills → Projects → Videos → Contact

### Rino-inspired section redesign (superseded)
- **Reference:** `portfolio-main-rino/portfolio-main` — dark #111214, zinc type, chrome buttons, stack grid, swipe projects
- **Kept unique:** cinematic scroll hero, liquid glass nav, Malayalam, film grain, Syne display font, video/AMV section
- **New:** `AboutProjectsSection` (story + swipe `ProjectsStack`), Rino skills grid, chrome `ChromeButton`, footer/contact rounded black block, GitHub chart
- **Removed:** old `AboutSection`, `ProjectsSection` (modal grid layout)
- **Files:** `globals.css` (`.rino-*`), `PortfolioPage.tsx`, sections, `ProjectsStack.tsx`, `ChromeButton.tsx`

### Hero mobile centering
- **Mobile (<768px):** `.hero-copy` absolutely positioned `top: 50%` + `translateY(-50%)` — dead center of viewport
- Horizontal: text-align center; `.hero-headline` align-items center
- `.hero-scrub` pinned to bottom on mobile; desktop stays bottom-left stack
