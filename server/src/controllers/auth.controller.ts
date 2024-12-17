import { saveToRedisExpire } from "./../utils/redis";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../client";
import {
	generateTokensAndSaveToDb,
	getOldRefreshTokenFromDb,
	revokeRefreshTokenFromDb,
} from "../utils/jwt";
import {
	RedisDurationInSeconds,
	TokenExpirationsInMs,
	TokenType,
} from "../types/token";
import { parseUA } from "../utils/ua-parser";
import { removeFromRedis } from "../utils/redis";

export const signUp = async (req: Request, res: Response) => {
	try {
		const userAgent = req.headers["user-agent"] || "";
		const parsedData = req.body;

		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [
					{
						username: {
							equals: parsedData.username,
							mode: "insensitive",
						},
					},
					{
						email: {
							equals: parsedData.email,
							mode: "insensitive",
						},
					},
				],
			},
		});
		if (existingUser) {
			res.status(409).json({ error: "User already exists" });
			return;
		}

		const hashedPassword = await bcrypt.hash(parsedData.password, 10);
		const user = await prisma.user.create({
			data: {
				username: parsedData.username,
				email: parsedData.email,
				password: hashedPassword,
				role: parsedData.role,
			},
		});

		const { accessToken, refreshToken } = await generateTokensAndSaveToDb(
			user,
			userAgent
		);

		await saveToRedisExpire(
			`refresh_token:${refreshToken}`,
			JSON.stringify({ id: user.id, issuedAt: new Date() }),
			RedisDurationInSeconds.ONE_WEEK
		);

		res.cookie(TokenType.AccessToken, accessToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.AccessToken]
			),
		});
		res.cookie(TokenType.RefreshToken, refreshToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
		});

		const { username, ...userDetails } = user;
		res.json({
			message: "User registered in successfully",
			user: {
				username,
			},
		});
		return;
	} catch (error) {
		console.error("Error in signUp route:", error);
		res.status(500).json({ error: "Internal Server Error" });
		return;
	}
};

export const signIn = async (req: Request, res: Response) => {
	try {
		const userAgent = req.headers["user-agent"] || "";
		const parsedData = req.body;

		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{
						username: parsedData.username,
					},
					{
						email: parsedData.email,
					},
				],
			},
		});
		if (!user) {
			res.status(404).json({ error: "Invalid credentials" });
			return;
		}

		const isPasswordValid = await bcrypt.compare(
			parsedData.password,
			user.password
		);
		if (!isPasswordValid) {
			res.status(404).json({ error: "Invalid credentials" });
			return;
		}

		const { accessToken, refreshToken } = await generateTokensAndSaveToDb(
			user,
			userAgent
		);

		await saveToRedisExpire(
			`refresh_token:${refreshToken}`,
			JSON.stringify({ id: user.id, issuedAt: new Date() }),
			RedisDurationInSeconds.ONE_WEEK
		);

		res.cookie(TokenType.AccessToken, accessToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.AccessToken]
			),
		});
		res.cookie(TokenType.RefreshToken, refreshToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
		});

		const { username, ...userDetails } = user;
		res.json({
			message: "User logged in successfully",
			user: {
				username,
			},
		});
		return;
	} catch (error) {
		console.error("Error during sign-in:", error);
		res.status(500).json({ error: "Internal Server Error" });
		return;
	}
};

export const signOut = async (req: Request, res: Response) => {
	try {
		const refreshToken = req.cookies[TokenType.RefreshToken];
		if (!refreshToken) {
			res.status(401).json({ error: "Refresh token not found" });
			return;
		}

		if (!req.user || typeof req.user === "string") {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const userId = req.user.id;
		await revokeRefreshTokenFromDb(refreshToken, userId);
		await removeFromRedis(`refresh_token:${refreshToken}`);

		res.clearCookie(TokenType.AccessToken, {
			httpOnly: true,
		});
		res.clearCookie(TokenType.RefreshToken, {
			httpOnly: true,
		});
		res.status(200).json({ message: "Successfully logged out" });
		return;
	} catch (error) {
		console.error("Error during sign-out:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const me = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true, username: true, role: true },
		});

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		res.status(200).json({ user });
	} catch (error) {
		console.error("Error in me route:", error);
		res.status(500).json({ error: "Internal Server Error" });
		return;
	}
};

export const refreshToken = async (req: Request, res: Response) => {
	try {
		const userAgent = req.headers["user-agent"] || "";

		if (!req.user || typeof req.user === "string") {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const user = req.user;

		const oldRefreshToken = await getOldRefreshTokenFromDb(user.id);
		if (oldRefreshToken) {
			await revokeRefreshTokenFromDb(oldRefreshToken, user.id);
		}

		await removeFromRedis(`refresh_token:${oldRefreshToken}`);

		const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
			await generateTokensAndSaveToDb(user, userAgent);

		await saveToRedisExpire(
			`refresh_token:${newRefreshToken}`,
			JSON.stringify({ id: user.id, issuedAt: new Date() }),
			RedisDurationInSeconds.ONE_WEEK
		);

		res.cookie(TokenType.AccessToken, newAccessToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.AccessToken]
			),
		});
		res.cookie(TokenType.RefreshToken, newRefreshToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
		});

		res.status(200).json({ message: "Tokens regenerated successfully" });
		return;
	} catch (error) {
		console.error("Error in refresh route:", error);
		res.status(500).json({ error: "Internal server error" });
		return;
	}
};
export const userAgent = async (req: Request, res: Response) => {
	try {
		const userAgent = req.headers["user-agent"];
		const ipAddress = req.ip;

		if (userAgent) {
			const uaResult = parseUA(userAgent);
			res.json({ userAgent, ipAddress, uaResult });
		} else {
			res.status(400).json({ error: "User-Agent header is missing" });
		}
	} catch (error) {
		console.error("Error in userAgent route:", error);
		res.status(500).json({ error: "Internal server error" });
		return;
	}
};
