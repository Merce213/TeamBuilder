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

export const checkTeamAccess =
	(requireGroupInfo: boolean = true, requireTeamInfo: boolean = true) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { userId, groupId, teamId } = req.params;
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

			const team = await prisma.team.findUnique({
				where: {
					id: teamId,
				},
				select: {
					id: true,
					name: true,
					description: true,
					createdById: true,
					groupId: true,
				},
			});
			if (!team) {
				res.status(404).json({
					error: "Team not found.",
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
			if (requireTeamInfo) {
				res.locals.team = team;
			}

			next();
		} catch (error) {
			console.error("Error in checkTeamAccess middleware:", error);
			res.status(500).json({ error: "Internal server error" });
			return;
		}
	};
