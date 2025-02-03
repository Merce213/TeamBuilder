import { NextFunction, Request, Response } from "express";
import { prisma } from "../client";
import { TokenType } from "../types/token";
import {
	getUserIdFromRedisOrDb,
	revokeRefreshTokenFromDb,
	verifyToken,
} from "../utils/jwt";
import { removeFromRedis } from "../utils/redis";

export const checkNotAuthenticated = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies[TokenType.RefreshToken];
		if (!refreshToken) {
			return next();
		}

		const user = verifyToken(refreshToken, TokenType.RefreshToken);
		if (user) {
			res.status(403).json({ message: "Vous êtes déjà connecté." });
			return;
		}
	} catch (error) {
		console.error("Error in checkNotAuthenticated middleware: ", error);
		return next();
	}
};

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const accessToken = req.cookies[TokenType.AccessToken];
		if (!accessToken) {
			res.status(401).json({ error: "Access token is required" });
			return;
		}

		const decodedAccessToken = verifyToken(
			accessToken,
			TokenType.AccessToken
		);
		const currentTime = Math.floor(Date.now() / 1000);
		const isTokenExpired =
			!decodedAccessToken ||
			typeof decodedAccessToken === "string" ||
			!decodedAccessToken.exp ||
			decodedAccessToken.exp < currentTime;

		if (isTokenExpired) {
			res.clearCookie(TokenType.AccessToken, {
				httpOnly: true,
			});
			res.status(401).json({ error: "Invalid or expired access token" });
			return;
		}

		const user = await prisma.user.findUnique({
			where: { id: decodedAccessToken.id },
			select: {
				id: true,
				email: true,
				username: true,
				role: true,
			},
		});
		if (!user) {
			res.clearCookie(TokenType.AccessToken, { httpOnly: true });
			res.status(401).json({ error: "User not found" });
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Error in authenticate middleware: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const refreshAuthenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const refreshToken = req.cookies[TokenType.RefreshToken];
		if (!refreshToken) {
			res.status(401).json({ error: "Unauthorized" });
			return;
		}

		const decoded = verifyToken(refreshToken, TokenType.RefreshToken);
		const currentTime = Math.floor(Date.now() / 1000);
		const isTokenExpired =
			!decoded ||
			typeof decoded === "string" ||
			!decoded.exp ||
			decoded.exp < currentTime;

		if (isTokenExpired) {
			if (decoded && typeof decoded !== "string") {
				await revokeRefreshTokenFromDb(refreshToken, decoded.id);
			}

			await removeFromRedis(`refresh_token:${refreshToken}`);

			res.clearCookie(TokenType.RefreshToken, {
				httpOnly: true,
			});
			res.clearCookie(TokenType.AccessToken, {
				httpOnly: true,
			});
			res.status(401).json({ error: "Invalid or expired refresh token" });
			return;
		}

		const user = await getUserIdFromRedisOrDb(refreshToken);
		if (!user) {
			res.clearCookie(TokenType.RefreshToken, {
				httpOnly: true,
			});
			res.status(401).json({
				error: "Refresh token not found or expired",
			});
			return;
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Error in refreshAuthenticate middleware: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
