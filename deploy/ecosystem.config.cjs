/** PM2 process file — run from /opt/nishal-portfolio after build */
module.exports = {
  apps: [
    {
      name: 'nishal-portfolio',
      cwd: '/opt/nishal-portfolio',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3002',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '900M',
      env: {
        NODE_ENV: 'production',
        PORT: '3002',
        NEXT_PUBLIC_SITE_URL: 'https://nishal.dev',
      },
    },
  ],
};
