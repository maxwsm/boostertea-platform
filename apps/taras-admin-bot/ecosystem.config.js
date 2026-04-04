module.exports = {
  apps: [
    {
      name: "boostertea-core",
      script: "index.js",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      time: true,
      max_memory_restart: "500M",
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm Z"
    }
  ]
};
