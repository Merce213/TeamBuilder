import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

export const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export const redis = new Redis(REDIS_URL).on("error", (err) => {
	console.error("Redis error:", err);
});
