import { NextFunction, Request, Response } from "express";
import { prisma } from "../client";

export const resolveUserSlug = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { username } = req.params;
	try {
		const user = await prisma.user.findUnique({
			where: { username },
			select: { id: true },
		});
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		req.params.userId = user.id;
		next();
	} catch (error) {
		console.error("Error in resolveUserSlug middleware:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
