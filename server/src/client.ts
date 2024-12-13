import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const prisma = new PrismaClient();
export const redis = new Redis(REDIS_URL).on("error", (err) => {
	console.error("Redis error:", err);
});
