module.exports = {
  apps: [
    {
      name: 'boostertea-api',
      script: 'bun',
      args: '/opt/wsm-ecosystem/apps/boostertea-web/src/api/index.ts',
      cwd: '/opt/wsm-ecosystem/apps/boostertea-web',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'boostertea-web',
      script: 'node_modules/.bin/next',
      args: 'start -H 0.0.0.0 -p 3010',
      cwd: '/opt/wsm-ecosystem/apps/boostertea-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'funnydrops-web',
      script: 'node_modules/.bin/next',
      args: 'start -H 0.0.0.0 -p 3011',
      cwd: '/opt/wsm-ecosystem/apps/funnydrops-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'dinoslush-web',
      script: 'node_modules/.bin/next',
      args: 'start -H 0.0.0.0 -p 3012',
      cwd: '/opt/wsm-ecosystem/apps/dinoslush-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'tlab-web',
      script: 'node_modules/.bin/next',
      args: 'start -H 0.0.0.0 -p 3013',
      cwd: '/opt/wsm-ecosystem/apps/tlab-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'wsm-dashboard',
      script: 'node_modules/.bin/next',
      args: 'start -H 0.0.0.0 -p 3014',
      cwd: '/opt/wsm-ecosystem/apps/wsm-dashboard',
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
