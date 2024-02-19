// redisClient.js
import { createClient } from 'redis';

let client;

export const getRedisClient = async () => {
  if (!client) {
    client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
  }
  return client;
};