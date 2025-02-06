import { GroupRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../client";
import {
	RedisDurationInSeconds,
	TokenExpirations,
	TokenExpirationsInMs,
	TokenType,
} from "../types/token";
import {
	sendPasswordChangedEmail,
	sendPasswordResetEmail,
} from "../utils/emails";
import {
	generateToken,
	generateTokensAndSaveToDb,
	getOldRefreshTokenFromDb,
	revokeRefreshTokenFromDb,
	verifyToken,
} from "../utils/jwt";
import keys from "../utils/keys";
import { removeFromRedis } from "../utils/redis";
import { parseUA } from "../utils/ua-parser";
import { saveToRedisExpire } from "./../utils/redis";

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

		const group = await prisma.group.create({
			data: {
				name: `${user.username}'s group`,
				createdById: user.id,
				members: {
					create: [
						{
							userId: user.id,
							role: GroupRole.OWNER,
						},
					],
				},
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
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
		});
		res.cookie(TokenType.RefreshToken, refreshToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
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
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
		});
		res.cookie(TokenType.RefreshToken, refreshToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
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
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
		});
		res.clearCookie(TokenType.RefreshToken, {
			httpOnly: true,
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
		});
		res.status(200).json({ message: "Successfully logged out" });
		return;
	} catch (error) {
		console.error("Error during sign-out:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const resetPasswordLink = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		const user = await prisma.user.findUnique({
			where: { email },
			select: { id: true, email: true },
		});
		if (!user) {
			res.status(404).json({
				error: "If the email exists, a reset link will be sent.",
			});
			return;
		}

		const existingToken = await prisma.token.findFirst({
			where: {
				userId: user.id,
				type: "PASSWORD_RESET",
				expiresAt: { gt: new Date() },
			},
		});

		if (existingToken) {
			res.status(429).json({
				error: "A password reset link has already been sent. Please try again later.",
			});
			return;
		}

		const token = generateToken(
			{ id: user.id, email: user.email },
			TokenType.PasswordResetToken,
			{ expiresIn: TokenExpirations[TokenType.PasswordResetToken] }
		);

		await prisma.token.create({
			data: {
				userId: user.id,
				type: "PASSWORD_RESET",
				token,
				expiresAt: new Date(
					Date.now() +
						TokenExpirationsInMs[TokenType.PasswordResetToken]
				),
			},
		});

		const resetLink =
			keys.target === "development"
				? `http://localhost:5173/change-forgot-password?token=${token}`
				: `${keys.frontendUrl}/change-forgot-password?token=${token}`;
		await sendPasswordResetEmail(user.email, resetLink);

		res.status(200).json({
			message: "If the email exists, a reset link will be sent.",
		});
	} catch (error) {
		console.error("Error in resetPassword route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const changeResetPassword = async (req: Request, res: Response) => {
	try {
		const { token, newPassword } = req.body;

		const decodedToken = verifyToken(token, TokenType.PasswordResetToken);
		if (
			!decodedToken ||
			typeof decodedToken === "string" ||
			!decodedToken.exp
		) {
			res.status(401).json({ error: "Invalid or expired token" });
			return;
		}

		const [storedToken, user] = await Promise.all([
			prisma.token.findFirst({
				where: {
					token,
					type: "PASSWORD_RESET",
					userId: decodedToken.id,
				},
			}),
			prisma.user.findUnique({
				where: { id: decodedToken.id },
			}),
		]);

		if (!storedToken || new Date() > storedToken.expiresAt) {
			res.status(401).json({ error: "Invalid or expired token" });
			return;
		}

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await Promise.all([
			prisma.user.update({
				where: { id: decodedToken.id },
				data: { password: hashedPassword },
			}),
			prisma.token.deleteMany({
				where: { userId: decodedToken.id, type: "PASSWORD_RESET" },
			}),
			sendPasswordChangedEmail(user.email),
		]);

		res.status(200).json({ message: "Password changed successfully" });
	} catch (error) {
		console.error("Error in changePassword route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const me = async (req: Request, res: Response) => {
	res.json(req.user);
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
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
		});
		res.cookie(TokenType.RefreshToken, newRefreshToken, {
			httpOnly: true,
			expires: new Date(
				Date.now() + TokenExpirationsInMs[TokenType.RefreshToken]
			),
			sameSite: keys.target === "production" ? "none" : "lax",
			secure: keys.target === "production",
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
