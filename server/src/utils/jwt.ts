import jwt from "jsonwebtoken";
import {
	RedisDurationInSeconds,
	TokenExpirations,
	TokenExpirationsInMs,
	TokenSecrets,
	TokenType,
} from "../types/token";
import { prisma } from "../client";
import { UserJwtPayload } from "../types/user";
import { getFromRedis, removeFromRedis, saveToRedisExpire } from "./redis";
import { getDeviceType } from "./ua-parser";

export const generateToken = (
	payload: object,
	tokenType: TokenType,
	options: jwt.SignOptions = {}
): string => {
	const secret = TokenSecrets[tokenType];
	if (!secret) {
		throw new Error(`Secret for ${tokenType} is not configured`);
	}

	return jwt.sign(payload, secret, { ...options });
};

export const verifyToken = (
	token: string,
	tokenType: TokenType
): jwt.JwtPayload | string | null => {
	const secret = TokenSecrets[tokenType];
	if (!secret) {
		throw new Error(`Secret for ${tokenType} is not configured`);
	}

	try {
		return jwt.verify(token, secret);
	} catch (error) {
		console.error("Invalid or expired token:", error);
		return null;
	}
};

export const revokeRefreshTokenFromDb = async (
	token: string,
	userId: string
) => {
	try {
		await prisma.session.deleteMany({
			where: {
				refreshToken: token,
				userId,
			},
		});
	} catch (error) {
		console.error("Error deleting refresh token:", error);
	}
};

export const getOldRefreshTokenFromDb = async (userId: string) => {
	const session = await prisma.session.findFirst({
		where: {
			userId: userId,
		},
	});
	return session ? session.refreshToken : null;
};

export const generateTokensAndSaveToDb = async (
	user: UserJwtPayload,
	userAgent: string
) => {
	const accessToken = generateToken(
		{ id: user.id, role: user.role },
		TokenType.AccessToken,
		{
			expiresIn: TokenExpirations[TokenType.AccessToken],
		}
	);

	const refreshToken = generateToken(
		{ id: user.id, role: user.role },
		TokenType.RefreshToken,
		{
			expiresIn: TokenExpirations[TokenType.RefreshToken],
		}
	);

	await prisma.session.create({
		data: {
			refreshToken,
			userId: user.id,
			expiresAt: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
			device: getDeviceType(userAgent) || "unknown",
		},
	});

	return {
		accessToken,
		refreshToken,
	};
};

export const getUserIdFromRedisOrDb = async (refreshToken: string) => {
	const cachedSession = await getFromRedis(`refresh_token:${refreshToken}`);
	if (cachedSession) {
		return JSON.parse(cachedSession);
	}

	const userFromSession = await prisma.session.findFirst({
		where: { refreshToken },
	});

	if (!userFromSession || userFromSession.expiresAt.getTime() < Date.now()) {
		if (userFromSession) {
			await revokeRefreshTokenFromDb(
				refreshToken,
				userFromSession.userId
			);
		}

		await removeFromRedis(`refresh_token:${refreshToken}`);

		return null;
	}

	await saveToRedisExpire(
		`refresh_token:${refreshToken}`,
		JSON.stringify({ id: userFromSession.userId, issuedAt: new Date() }),
		Math.ceil((userFromSession.expiresAt.getTime() - Date.now()) / 1000)
	);

	return { id: userFromSession.userId };
};
