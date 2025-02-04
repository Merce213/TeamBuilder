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
							userId?: string;
							championId: number;
							lane: Lane;
						}) => ({
							userId: member.userId ?? undefined,
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
