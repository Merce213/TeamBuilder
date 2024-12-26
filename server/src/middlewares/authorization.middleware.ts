import { NextFunction, Request, Response } from "express";
import { prisma } from "../client";
import { GroupRole, UserRole } from "@prisma/client";

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

			if (currentUserRole === UserRole.ADMIN) {
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

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				role: true,
			},
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

export const checkGroupAccess =
	(requireGroupInfo: boolean = true) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId, groupId } = req.params;
			const currentUserId = req.user?.id;
			const currentUserRole = req.user?.role;

			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					role: true,
				},
			});
			if (!user) {
				res.status(404).json({ error: "User not found" });
				return;
			}

			const group = await prisma.group.findFirst({
				where: {
					id: groupId,
				},
				select: {
					id: true,
					createdById: true,
					name: true,
					description: true,
					members: {
						select: { userId: true, role: true },
					},
				},
			});
			if (!group) {
				res.status(404).json({
					error: "Group not found.",
				});
				return;
			}

			const isAdmin = currentUserRole === UserRole.ADMIN;
			const isOwner =
				group.createdById === currentUserId && currentUserId === userId;
			const isGroupAdmin = group.members.some(
				(member) =>
					member.userId === currentUserId &&
					member.role === GroupRole.ADMIN
			);
			const isGroupMember = group.members.some(
				(member) => member.userId === userId && userId === currentUserId
			);

			if (!isAdmin && !isOwner && !isGroupAdmin && !isGroupMember) {
				res.status(403).json({
					error: "Forbidden: Insufficient permissions to access this group.",
				});
				return;
			}

			if (requireGroupInfo) {
				res.locals.group = group;
			}

			next();
		} catch (error) {
			console.error("Error in checkGroupAccess middleware:", error);
			res.status(500).json({ error: "Internal server error" });
			return;
		}
	};

export const checkGroupUpdatePermissions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId, groupId } = req.params;
		const currentUserId = req.user?.id;
		const currentUserRole = req.user?.role;

		const group = await prisma.group.findFirst({
			where: {
				id: groupId,
			},
			select: {
				id: true,
				createdById: true,
				name: true,
				description: true,
				members: {
					select: { userId: true, role: true },
				},
			},
		});
		if (!group) {
			res.status(404).json({
				error: "Group not found.",
			});
			return;
		}

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner =
			group.createdById === currentUserId && currentUserId === userId;
		const isGroupAdmin = group.members.some(
			(member) =>
				member.userId === currentUserId &&
				member.role === GroupRole.ADMIN
		);

		if (!isAdmin && !isOwner && !isGroupAdmin) {
			res.status(403).json({
				error: "Forbidden: Insufficient permissions to access this group.",
			});
			return;
		}

		res.locals.group = group;
		next();
	} catch (error) {
		console.error(
			"Error in checkGroupUpdatePermissions middleware:",
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const checkTeamCreationPermissions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { groupId } = req.params;
		const currentUserId = req.user?.id;
		const currentUserRole = req.user?.role;

		const group = await prisma.group.findFirst({
			where: { id: groupId },
			select: {
				createdById: true,
				members: {
					where: { userId: currentUserId },
					select: { role: true },
				},
			},
		});

		if (!group) {
			return res.status(404).json({
				error: "Group not found or you do not have access.",
			});
		}

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === currentUserId;
		const isGroupAdmin = group.members.some(
			(member) => member.role === GroupRole.ADMIN
		);

		if (!isOwner && !isGroupAdmin && !isAdmin) {
			return res.status(403).json({
				error: "Forbidden: You do not have permission to create a team in this group.",
			});
		}

		res.locals.group = group;
		next();
	} catch (error) {
		console.error(
			"Error in checkTeamCreationPermissions middleware:",
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
};
