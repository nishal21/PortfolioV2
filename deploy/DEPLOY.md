# Deploy nishal.dev on VPS (Nginx + PM2)

NMHelper stays at `/opt/nmhelper`. Portfolio goes to `/opt/nishal-portfolio` on port **3002**.

## Before you start

1. **DNS** (Hostinger → nishal.dev → DNS):
  - `A` `@` → your VPS public IP
  - `A` `www` → same IP (or CNAME `www` → `nishal.dev`)
2. **Push this repo to GitHub** if not already (`nishal21/Portfolio`).
3. **SSH** as root

---

## Step 1 — Check NMHelper (don’t break it)

```bash
ls /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/*
pm2 list
```

On this VPS (srv1702958):


| App           | PM2 name           | Port     |
| ------------- | ------------------ | -------- |
| NMHelper API  | `nmhelper-api`     | **3001** |
| NMHelper site | `nmhelper-next`    | **3005** |
| Portfolio     | `nishal-portfolio` | **3002** |


---

## Step 2 — Install portfolio

```bash
apt update && apt install -y git curl nginx certbot python3-certbot-nginx

chmod +x /opt/nishal-portfolio/deploy/install.sh   # after clone, or:
bash -c "$(curl -fsSL https://raw.githubusercontent.com/nishal21/Portfolio/main/deploy/install.sh)"
```

**Or manually:**

```bash
git clone https://github.com/nishal21/Portfolio.git /opt/nishal-portfolio
cd /opt/nishal-portfolio
cp deploy/.env.production.example .env.production
npm ci
npm run build
npm install -g pm2
pm2 start deploy/ecosystem.config.cjs
pm2 save
pm2 startup
```

Verify locally on the VPS:

```bash
curl -I http://127.0.0.1:3002
```

You should see `HTTP/1.1 200` or `307`.

---

## Step 3 — Nginx for nishal.dev

**First time (no SSL cert yet):**

```bash
cp /opt/nishal-portfolio/deploy/nginx-nishal.dev-http-only.conf /etc/nginx/sites-available/nishal.dev
ln -sf /etc/nginx/sites-available/nishal.dev /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
curl -I http://127.0.0.1:3002
curl -I -H 'Host: nishal.dev' http://127.0.0.1/
```

**HTTPS (same pattern as NMHelper):**

```bash
certbot --nginx -d nishal.dev -d www.nishal.dev
```

Then install the full SSL config (matches nmhelper.in style, `www` → apex redirect):

```bash
cp /opt/nishal-portfolio/deploy/nginx-nishal.dev.conf /etc/nginx/sites-available/nishal.dev
nginx -t && systemctl reload nginx
```

Renewal is automatic (`certbot renew` timer).

---

## Step 5 — Firewall (if UFW is enabled)

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

Do **not** open port 3002 publicly; only Nginx talks to it on localhost.

---

## Step 6 — After deploy

1. Submit contact form once → activate FormSubmit for `nishal@nishal.dev`
2. Google Search Console + Bing Webmaster → add property `https://nishal.dev`
3. From your laptop (with repo): `NEXT_PUBLIC_SITE_URL=https://nishal.dev npm run indexnow`

---

## Updates (redeploy)

```bash
cd /opt/nishal-portfolio
git pull
npm ci
npm run build
pm2 restart nishal-portfolio
```

Or run `deploy/install.sh` again.

---

## Troubleshooting


| Problem              | Check                                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| 502 Bad Gateway      | `pm2 logs nishal-portfolio` — is app running on 3002?                               |
| NMHelper broke       | `nginx -t` — separate server_name per site; don’t edit nmhelper block               |
| Wrong canonical URLs | `.env.production` must have `NEXT_PUBLIC_SITE_URL=https://nishal.dev`, then rebuild |
| OOM on build         | `free -h` — 8GB should be fine; close other builds                                  |
| SSL fails            | DNS must point to this VPS before certbot                                           |


---

## Layout on VPS

```
/opt/nmhelper          → NMHelper (existing)
/opt/nishal-portfolio  → Portfolio (PM2 → :3002)

Nginx :
  api.nmhelper.in     → 127.0.0.1:3001
  nmhelper.in         → 127.0.0.1:3005
  app.nmhelper.in     → static /opt/nmhelper/web
  nishal.dev          → 127.0.0.1:3002  (new)
```

