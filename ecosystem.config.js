module.exports = {
  apps: [
    {
      name: 'speedtest-web',
      script: 'yarn',
      interpreter: 'bash',
      args: 'start',
      instances: 1,
    },
  ],
};
