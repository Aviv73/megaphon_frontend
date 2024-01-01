var config = null;

// if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = process.env.NODE_ENV.trim();

// process.env.NODE_ENV = 'production';

const ENV = process.env.NODE_ENV || 'development';
if (ENV === 'development') config = require('./dev');
else if (ENV === 'staging') config = require('./stage');
else if (ENV === 'production') config = require('./prod');

config = {
  ...config,
  env: ENV,
  isDev: ENV === 'development',
  baseServerUrl: location.origin
}

export default config;