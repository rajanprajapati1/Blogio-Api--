import { createClient } from "redis";

const RedisCache = createClient({
  password: process.env.REDIS_PASSWORD_DEV,
  socket: {
    host: process.env.REDIS_HOST_DEV,
    port: process.env.REDIS_PORT_DEV,
  },
});

RedisCache.connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));


export default RedisCache;
