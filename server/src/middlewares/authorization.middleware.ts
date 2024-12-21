import { NextFunction, Request, Response } from "express";
import { prisma } from "../client";

export const checkAuthorization =
	(requireAdmin = false, allowSelf = true) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const targetUserId = req.params.userId;
			const currentUserId = req.user?.id;
			const currentUserRole = req.user?.role;

			if (requireAdmin && currentUserRole !== "ADMIN") {
				res.status(403).json({ error: "Forbidden: Admin access only" });
				return;
			}

			if (
				allowSelf &&
				(!targetUserId || targetUserId === currentUserId)
			) {
				return next();
			}

			if (currentUserRole === "ADMIN") {
				return next();
			}

			res.status(403).json({
				error: "Forbidden: Insufficient permissions",
			});
			return;
		} catch (error) {
			console.error("Error in checkAuthorization middleware:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	};

export const checkUserInParamsExists = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			res.status(400).json({
				error: "User ID is required in parameters",
			});
			return;
		}

		const user = await prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		next();
	} catch (error) {
		console.error("Error in checkUserExists middleware:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
