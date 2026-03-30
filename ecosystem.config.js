module.exports = {
  apps: [
    {
      name: 'boostertea-api',
      script: './start-api.sh',
      cwd: '/opt/wsm-ecosystem/apps/boostertea-web',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        REDIS_PASSWORD: process.env.REDIS_PASSWORD
      }
    },
    {
      name: 'boostertea-web',
      script: '../../node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -H 0.0.0.0 -p 3010',
      cwd: './apps/boostertea-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'funnydrops-web',
      script: '../../node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -H 0.0.0.0 -p 3005',
      cwd: './apps/funnydrops-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'dinoslush-web',
      script: '../../node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -H 0.0.0.0 -p 3004',
      cwd: './apps/dinoslush-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'tlab-web',
      script: '../../node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -H 0.0.0.0 -p 3006',
      cwd: './apps/tlab-web',
      env: {
        NODE_ENV: 'production',
      }
    },
    {
      name: 'wsm-dashboard',
      script: '../../node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -H 0.0.0.0 -p 3000',
      cwd: './apps/wsm-dashboard',
      env: {
        NODE_ENV: 'production',
      }
    }
  ]
};
