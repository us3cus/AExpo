module.exports = {
  apps: [
    {
      name: 'temten-app',
      script: './.output/server/index.mjs',
      instances: 1, // Начните с 1 инстанса для отладки
      exec_mode: 'fork', // Используйте fork вместо cluster для начала
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0', // Слушать на всех интерфейсах
        NITRO_PORT: 3000,
        NITRO_HOST: '0.0.0.0'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 5000,
      listen_timeout: 10000,
      // Логирование для отладки
      combine_logs: true,
      time: true
    }
  ]
};
