import { redis } from "../client";

export const saveToRedisExpire = async (
	key: string,
	value: string,
	expire: number
) => {
	try {
		await redis.set(key, value, "EX", expire);
	} catch (error) {
		console.error("Error saving to Redis:", error);
	}
};

export const getFromRedis = async (key: string) => {
	try {
		const value = await redis.get(key);
		return value;
	} catch (error) {
		console.error("Error getting from Redis:", error);
		return null;
	}
};

export const removeFromRedis = async (key: string) => {
	try {
		await redis.del(key);
	} catch (error) {
		console.error("Error removing from Redis:", error);
	}
};

export const clearAllFromRedis = async () => {
	try {
		await redis.flushall();
	} catch (error) {
		console.error("Error clearing Redis:", error);
	}
};
