import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { TokenType } from "../types/token";

export const authenticate = (tokenType: TokenType) => {
	return (
		req: Request & { user?: any },
		res: Response,
		next: NextFunction
	) => {
		const token =
			req.cookies.jwt || req.headers.authorization?.split(" ")[1];

		if (!token) {
			res.status(401).json({ error: "Token is required" });
			return;
		}

		const decoded = verifyToken(token, tokenType);

		if (!decoded) {
			res.status(401).json({ error: "Invalid or expired token" });
			return;
		}

		req.user = decoded;

		next();
	};
};
