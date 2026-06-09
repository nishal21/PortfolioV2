#!/usr/bin/env bash
# First-time portfolio setup on Ubuntu VPS (run as root or with sudo).
# NMHelper should already live at /opt/nmhelper — this does not touch it.
set -euo pipefail

APP_DIR="/opt/nishal-portfolio"
REPO_URL="${REPO_URL:-https://github.com/nishal21/Portfolio.git}"
BRANCH="${BRANCH:-main}"
PORT=3002

echo "==> Node version"
if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node.js 20.x..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v
npm -v

echo "==> PM2"
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

echo "==> Clone or update app"
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

echo "==> Environment"
if [ ! -f "$APP_DIR/.env.production" ]; then
  cp "$APP_DIR/deploy/.env.production.example" "$APP_DIR/.env.production"
  echo "Created .env.production — review before going live."
fi

echo "==> Install & build"
cd "$APP_DIR"
npm ci
npm run build

echo "==> PM2 start"
pm2 delete nishal-portfolio 2>/dev/null || true
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save

if ! pm2 startup systemd -u root --hp /root 2>/dev/null | grep -q "already"; then
  echo "Run the 'pm2 startup' command PM2 printed above if this is the first PM2 app."
fi

echo "==> Done. App should listen on http://127.0.0.1:${PORT}"
echo "    Next: configure Nginx (deploy/nginx-nishal.dev.conf) and certbot."
