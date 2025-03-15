import IORedis from 'ioredis'

export const redis = new IORedis(
  process.env.REDIS_URI || 'redis://localhost:6379',
  {
    maxRetriesPerRequest: null,
  },
)
