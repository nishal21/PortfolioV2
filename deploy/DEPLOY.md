# Deploy nishal.dev on VPS (Nginx + PM2)

NMHelper stays at `/opt/nmhelper`. Portfolio goes to `/opt/portfolio-v2` on port **3002**.

Repo: **[https://github.com/nishal21/PortfolioV2](https://github.com/nishal21/PortfolioV2)**

## Before you start

1. **DNS** (Hostinger → nishal.dev → DNS):
  - `A` `@` → your VPS public IP
  - `A` `www` → same IP (or CNAME `www` → `nishal.dev`)
2. **Push this repo to GitHub** (`nishal21/PortfolioV2`).
3. **SSH** as root on your VPS.

---

---

## Step 2 — Install portfolio

```bash
apt update && apt install -y git curl nginx certbot python3-certbot-nginx

git clone https://github.com/nishal21/PortfolioV2.git /opt/portfolio-v2
cd /opt/portfolio-v2
cp deploy/.env.production.example .env.production
npm ci
npm run build
npm install -g pm2
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

Or after clone: `bash deploy/install.sh`

Verify:

```bash
curl -I http://127.0.0.1:3002
pm2 status
```

---

## Step 3 — Nginx for nishal.dev

**First time (no SSL cert yet):**

```bash
cp /opt/portfolio-v2/deploy/nginx-nishal.dev-http-only.conf /etc/nginx/sites-available/nishal.dev
ln -sf /etc/nginx/sites-available/nishal.dev /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

**HTTPS:**

```bash
certbot certonly --nginx -d nishal.dev -d www.nishal.dev
cp /opt/portfolio-v2/deploy/nginx-nishal.dev.conf /etc/nginx/sites-available/nishal.dev
nginx -t && systemctl reload nginx
```

---

## Step 4 — Firewall (if UFW is enabled)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Do **not** open port 3002 publicly.

---

## Updates (redeploy)

```bash
cd /opt/portfolio-v2
git pull
npm ci
npm run build
pm2 restart portfolio-v2
```

Hero video is served from **Cloudinary** by default (`src/lib/heroMedia.ts`). No `hero.mp4` on the VPS unless you set `NEXT_PUBLIC_HERO_VIDEO_URL=/hero.mp4` and run `npm run hero:prepare`.

---

## Troubleshooting


| Problem         | Check                                                                  |
| --------------- | ---------------------------------------------------------------------- |
| 502 Bad Gateway | `pm2 logs portfolio-v2`                                                |
| NMHelper broke  | `nginx -t` — only add `nishal.dev` site block                          |
| Wrong URLs      | `.env.production` → `NEXT_PUBLIC_SITE_URL=https://nishal.dev`, rebuild |
| Google blocked  | `curl https://nishal.dev/robots.txt` — must show `Allow: /`            |


---

## Google Search Console

1. Property URL: **`https://nishal.dev`** (not `http://` or `www`)
2. After deploy, verify:
   ```bash
   curl https://nishal.dev/robots.txt
   curl https://nishal.dev/sitemap.xml
   curl -I https://nishal.dev/favicon.ico
   ```
3. Submit sitemap: `https://nishal.dev/sitemap.xml`
4. URL Inspection → **Test live URL** → Request indexing

## Bing Webmaster Tools

1. Add **`https://nishal.dev`** (HTTPS only — not `http://nishal.dev/`)
2. Copy the `msvalidate.01` code → add to `.env.production`:
   ```bash
   BING_SITE_VERIFICATION=your-code-here
   ```
   Rebuild and restart PM2.
3. Submit sitemap: `https://nishal.dev/sitemap.xml`
4. After deploy: `npm run indexnow`
5. URL Inspection → **Request indexing** on `https://nishal.dev/`

Favicon must be **`/favicon.ico`** (not SVG). Run `npm run generate:favicon` before deploy if you change the logo.

## Pinterest Rich Pins (Article)

Rich Pins activate automatically when Pinterest finds Article Open Graph tags ([Pinterest docs](https://developers.pinterest.com/docs/web-features/article-rich-pins/)).

**Already on site:** project, about, and profile pages use `og:type=article` with `article:published_time`, author, section, and tags (`src/lib/pinterest.ts`).

1. Switch to a [Pinterest Business account](https://help.pinterest.com/en/business/article/get-a-business-account)
2. **Settings → Claimed accounts → Claim website** → copy verification code
3. Add to `.env.production`:
   ```bash
   PINTEREST_DOMAIN_VERIFY=your-code-here
   ```
   Rebuild + restart PM2.
4. Validate a URL: [Pinterest URL debugger](https://developers.pinterest.com/tools/url-debugger/) — try `https://nishal.dev/projects/nekobeat`
5. Create a Pin using that **full project URL** (not the homepage). Rich metadata (title, author, date) should appear on the Pin.

**Best Pin images:** use project pages (they have square/svg thumbnails). Vertical 2:3 images (e.g. 1000×1500) perform best on Pinterest.

---

## Layout on VPS

```
/opt/nmhelper       → NMHelper
/opt/portfolio-v2   → nishal.dev (PM2 portfolio-v2 → :3002)
```

