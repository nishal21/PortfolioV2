# Shared nginx snippet for upstream fault pages (502/503/504).
# Include inside a server { } block after installing the HTML file:
#   sudo mkdir -p /var/www/nishal.dev
#   sudo cp /opt/portfolio-v2/deploy/static/error-offline.html /var/www/nishal.dev/
#   include /opt/portfolio-v2/deploy/nginx-error-pages.inc;
#
# Subdomains (rytu / send / santra / …) do NOT use the Next.js portfolio
# not-found.tsx — wire this include (or their own app 404) on each vhost.

error_page 502 503 504 /error-offline.html;
location = /error-offline.html {
    root /var/www/nishal.dev;
    internal;
    add_header Cache-Control "no-store" always;
}
