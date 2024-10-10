const Redis = require('ioredis');

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  connectTimeout: 10000, // 10 seconds
};

const redis = new Redis(redisOptions);

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
 
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redis.on('ready', () => {
  console.log('Redis client is ready');
});

// Graceful shutdown
process.on('SIGINT', () => {
  redis.disconnect();
  process.exit(0);
});

module.exports = redis;