import Redis from "ioredis";

// Creates a Redis Connection
const redisClientSingleton = () => {
	return new Redis(process.env.REDIS_URL || "redis://localhost:6379");
};

// This part prevents multiple connections during development
// To be removed in Production
const globalForRedis = globalThis as unknown as {
	redis: Redis | undefined;
};

const redis = globalForRedis.redis ?? redisClientSingleton();

export default redis;

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
