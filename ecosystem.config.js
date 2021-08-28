module.exports = {
  apps: [
    {
      name: 'server',
      script: './src/app.js',
      instances: 4,
      exec_mode: 'cluster',
      env: { NODE_ENV: 'development' },
      env_production: { NODE_ENV: 'production' },
    },
  ],
};
