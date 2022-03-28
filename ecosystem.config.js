module.exports = {
  apps: [
    {
      name: 'nestjs',
      script: 'nest',
      args: 'start',
      env: {
        NODE_ENV: 'development',
      },
      instances: 'max',
      exec_mode: 'cluster',
      merge_logs: true,
      max_memory_restart: '300M',
      wait_ready: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
