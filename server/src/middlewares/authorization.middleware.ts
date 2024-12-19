import { NextFunction, Request, Response } from "express";

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
