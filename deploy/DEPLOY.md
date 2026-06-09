# Deploy nishal.dev on VPS (Nginx + PM2)

NMHelper stays at `/opt/nmhelper`. Portfolio goes to `/opt/portfolio-v2` on port **3002**.

Repo: **https://github.com/nishal21/PortfolioV2**

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

---

## Troubleshooting

| Problem | Check |
|---------|--------|
| 502 Bad Gateway | `pm2 logs portfolio-v2` |
| NMHelper broke | `nginx -t` — only add `nishal.dev` site block |
| Wrong URLs | `.env.production` → `NEXT_PUBLIC_SITE_URL=https://nishal.dev`, rebuild |

---

## Layout on VPS

```
/opt/nmhelper       → NMHelper
/opt/portfolio-v2   → nishal.dev (PM2 portfolio-v2 → :3002)
```
