import { createClient } from 'redis'

declare global {
  var _redisClient: ReturnType<typeof createClient> | undefined
}

export async function getRedis() {
  if (global._redisClient) return global._redisClient

  const client = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  })

  client.on('error', (err) => console.error('[Redis]', err))
  await client.connect()

  global._redisClient = client
  return client
}