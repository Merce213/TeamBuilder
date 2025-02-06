import { Request, Response } from "express";
import { prisma } from "../client";
import { GroupRole, Lane, UserRole } from "@prisma/client";

export const createTeam = async (req: Request, res: Response) => {
	try {
		const { userId, groupId } = req.params;
		const { name, description, members } = req.body;
		const currentUserRole = req.user?.role;

		const group = res.locals.group;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === userId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.ADMIN
		);

		if (!isAdmin && !isOwner && !isGroupAdmin) {
			res.status(403).json({
				error: "Forbidden: Insufficient permissions to create a team.",
			});
			return;
		}

		const existingTeam = await prisma.team.findFirst({
			where: {
				name: {
					equals: name,
					mode: "insensitive",
				},
				groupId,
			},
		});
		if (existingTeam) {
			res.status(409).json({
				error: "Team name already exists within this group",
			});
			return;
		}

		await prisma.team.create({
			data: {
				groupId,
				name,
				description: description ?? undefined,
				createdById: userId,
				members: {
					create: members?.map(
						(member: {
							userId?: string | null;
							championId: number;
							lane: Lane;
						}) => ({
							userId: member.userId ?? null,
							championId: member.championId,
							lane: member.lane,
						})
					),
				},
			},
		});

		res.status(201).json({
			message: "Team created successfully",
		});
	} catch (error) {
		console.error("Error creating team:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllTeamsByGroupId = async (req: Request, res: Response) => {
	try {
		const { userId, groupId } = req.params;
		const currentUserRole = req.user?.role;

		const group = res.locals.group;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === userId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.ADMIN
		);
		const isGroupMember = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.MEMBER
		);

		if (!isAdmin && !isOwner && !isGroupAdmin && !isGroupMember) {
			res.status(403).json({
				error: "Forbidden: Insufficient permissions to access teams.",
			});
			return;
		}

		const teams = await prisma.team.findMany({
			where: {
				groupId,
			},
		});

		res.status(200).json({
			message: "Teams retrieved successfully",
			teams,
		});
	} catch (error) {
		console.error("Error retrieving teams:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getTeamById = async (req: Request, res: Response) => {
	try {
		const { userId, groupId, teamId } = req.params;
		const currentUserRole = req.user?.role;

		const group = res.locals.group;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === userId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.ADMIN
		);
		const isGroupMember = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.MEMBER
		);

		if (!isAdmin && !isOwner && !isGroupAdmin && !isGroupMember) {
			res.status(403).json({
				error: "Forbidden: Insufficient permissions to access this team.",
			});
			return;
		}

		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
			include: {
				members: {
					select: {
						userId: true,
						championId: true,
						lane: true,
						champion: {
							select: {
								name: true,
								image: {
									select: {
										full: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!team) {
			res.status(404).json({ error: "Team not found" });
			return;
		}

		res.status(200).json({
			message: "Team retrieved successfully",
			team,
		});
	} catch (error) {
		console.error("Error retrieving team:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateTeam = async (req: Request, res: Response) => {
	try {
		const { userId, groupId, teamId } = req.params;
		const { name, description, members } = req.body;
		const currentUserRole = req.user?.role;
		const { group, team } = res.locals;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === userId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.ADMIN
		);

		if (!isAdmin && !isOwner && !isGroupAdmin) {
			res.status(403).json({
				error: "Forbidden: Insufficient permissions to update the team.",
			});
			return;
		}

		if (name) {
			const existingTeam = await prisma.team.findFirst({
				where: {
					name: { equals: name, mode: "insensitive" },
					groupId,
					NOT: { id: teamId },
				},
			});
			if (existingTeam) {
				res.status(409).json({
					error: "Team name already exists within this group",
				});
				return;
			}
		}

		const updateData: { name?: string; description?: string | null } = {};
		let membersChanged = false;

		if (name && name !== team.name) updateData.name = name;
		if (description !== undefined && description !== team.description)
			updateData.description = description;

		const existingMembers = await prisma.teamMembership.findMany({
			where: { teamId },
		});
		membersChanged =
			members.length !== existingMembers.length ||
			!members.every(
				(newMember: {
					championId: number;
					lane: Lane;
					userId?: string | null;
				}) =>
					existingMembers.some(
						(existingMember) =>
							existingMember.championId ===
								newMember.championId &&
							existingMember.lane === newMember.lane &&
							existingMember.userId === newMember.userId
					)
			);

		if (Object.keys(updateData).length === 0 && !membersChanged) {
			res.status(400).json({
				error: "No changes detected. Team remains unchanged.",
			});
			return;
		}

		await prisma.team.update({
			where: { id: teamId },
			data: {
				...updateData,
				members: {
					deleteMany: {},
					create: members.map(
						(member: {
							userId?: string | null;
							championId: number;
							lane: Lane;
						}) => ({
							userId: member.userId,
							championId: member.championId,
							lane: member.lane,
						})
					),
				},
			},
		});

		res.status(200).json({
			message: "Team updated successfully",
		});
	} catch (error) {
		console.error("Error updating team:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteTeam = async (req: Request, res: Response) => {
	try {
		const { userId, groupId, teamId } = req.params;
		const currentUserRole = req.user?.role;

		const group = res.locals.group;
		const team = res.locals.team;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === userId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === userId && member.role === GroupRole.ADMIN
		);

		if (!isAdmin && !isOwner && !isGroupAdmin) {
			res.status(403).json({
				error: "Forbidden: Insufficient permissions to delete the team.",
			});
			return;
		}

		if (!team) {
			res.status(404).json({ error: "Team not found" });
			return;
		}

		await prisma.team.delete({
			where: { id: teamId },
		});

		res.status(200).json({
			message: "Team deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting team:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
