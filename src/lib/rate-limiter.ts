import { redis } from '@/lib/redis'

export const rateLimiter = async (
  ip: string,
): Promise<{
  limit: number
  remaining: number
  success: boolean
}> => {
  const key = `rate_limit:${ip}`
  const currentCount = await redis.get(key)
  const count = parseInt(currentCount as string, 10) || 0
  if (count >= 10) {
    return { limit: 10, remaining: 10 - count, success: false }
  }
  await redis.incr(key)
  await redis.expire(key, 10)
  return { limit: 10, remaining: 10 - (count + 1), success: true }
}
