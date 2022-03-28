module.exports = {
  apps: [
    {
      name: 'nestjs',
      script: 'nest',
      args: 'start',
      env: {
        NODE_ENV: 'development',
      },
      watch: true,
      //instances: '2',
      exec_mode: 'fork',
      merge_logs: true,
      //max_memory_restart: '300M',
      //wait_ready: true,
      listen_timeout: 5000,
      kill_timeout: 5000,
    },
  ],
};
