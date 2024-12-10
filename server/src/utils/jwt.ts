import jwt from "jsonwebtoken";
import { TokenSecrets, TokenType } from "../types/token";

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
): string | jwt.JwtPayload | null => {
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
