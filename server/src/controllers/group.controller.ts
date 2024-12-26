import { Request, Response } from "express";
import { prisma } from "../client";
import { GroupRole, Prisma, UserRole } from "@prisma/client";

export const createGroup = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { name, description, members } = req.body;

		const existingGroup = await prisma.group.findFirst({
			where: { name, createdById: userId },
		});
		if (existingGroup) {
			res.status(409).json({
				error: "Group with this name already exists",
			});
			return;
		}

		const groupMembers = [
			{ userId, role: GroupRole.OWNER },
			...(members || []).map((memberId: string) => ({
				userId: memberId,
				role: GroupRole.MEMBER,
			})),
		];

		const group = await prisma.group.create({
			data: {
				name,
				createdById: userId,
				description: description ?? undefined,
				members: {
					create: groupMembers,
				},
			},
			include: {
				members: true,
			},
		});

		res.status(201).json({
			message: "Group created successfully",
			group,
		});
	} catch (error) {
		console.error("Error creating group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getGroupById = async (req: Request, res: Response) => {
	try {
		const { userId, groupId } = req.params;

		const group = await prisma.group.findFirst({
			where: {
				id: groupId,
				members: {
					some: {
						userId,
					},
				},
			},
			include: {
				members: true,
			},
		});

		if (!group) {
			res.status(404).json({
				error: "Group not found",
			});
			return;
		}

		res.status(200).json({
			message: "Group retrieved successfully",
			group,
		});
	} catch (error) {
		console.error("Error retrieving group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserGroups = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		const groups = await prisma.group.findMany({
			where: {
				members: {
					some: {
						userId,
					},
				},
			},
			include: {
				members: true,
			},
		});

		if (groups.length === 0) {
			res.status(200).json({
				message: "No groups found for the user",
			});
			return;
		}

		res.status(200).json({
			message: "User groups retrieved successfully",
			groups,
		});
	} catch (error) {
		console.error("Error retrieving user groups:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateGroup = async (req: Request, res: Response) => {
	try {
		const { name, description, members } = req.body;
		const currentUserId = req.user?.id;
		const currentUserRole = req.user?.role;
		const group = res.locals.group;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === currentUserId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: string }) =>
				member.userId === currentUserId &&
				member.role === GroupRole.ADMIN
		);

		if (!isOwner && !isAdmin && isGroupAdmin && (name || description)) {
			res.status(403).json({
				error: "Forbidden: Group admins can only manage members.",
			});
			return;
		}

		const updateData: Prisma.GroupUpdateInput = {};
		if (name && name !== group.name) {
			updateData.name = name;
		}
		if (description && description !== group.description) {
			updateData.description = description;
		}

		const currentMembers = group.members.map(
			(m: { userId: string }) => m.userId
		);
		const membersToAdd = members.filter(
			(id: string) => !currentMembers.includes(id)
		);
		const membersToRemove = currentMembers.filter(
			(id: string) => !members.includes(id)
		);

		if (members && members.length > 0) {
			if (membersToRemove.includes(group.createdById)) {
				res.status(400).json({
					error: "Cannot remove the owner of the group.",
				});
				return;
			}

			if (membersToAdd.length > 0) {
				await prisma.groupMembership.createMany({
					data: membersToAdd.map((id: string) => ({
						groupId: group.id,
						userId: id,
					})),
					skipDuplicates: true,
				});
			}

			if (membersToRemove.length > 0) {
				await prisma.groupMembership.deleteMany({
					where: {
						groupId: group.id,
						userId: { in: membersToRemove },
					},
				});
			}
		}

		if (
			Object.keys(updateData).length === 0 &&
			(!members ||
				members.length === 0 ||
				JSON.stringify(members) === JSON.stringify(currentMembers))
		) {
			res.status(400).json({ error: "No updates provided" });
			return;
		}

		const updatedGroup = await prisma.group.update({
			where: { id: group.id },
			data: updateData,
			select: {
				id: true,
				name: true,
				description: true,
				members: {
					select: {
						userId: true,
						role: true,
					},
				},
			},
		});

		res.status(200).json({
			message: "Group updated successfully",
			group: updatedGroup,
			usersRemoved: membersToRemove,
			usersAdded: membersToAdd,
		});
	} catch (error) {
		console.error("Error updating group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteGroup = async (req: Request, res: Response) => {
	try {
		const group = res.locals.group;
		const currentUserId = req.user?.id;
		const currentUserRole = req.user?.role;
		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === currentUserId;

		if (!isOwner && !isAdmin) {
			res.status(403).json({
				error: "Forbidden: Only the owner or an admin can delete the group.",
			});
			return;
		}

		await prisma.group.delete({ where: { id: group.id } });

		res.status(200).json({
			message: "Group deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
