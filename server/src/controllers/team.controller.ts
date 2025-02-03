import { Request, Response, NextFunction } from "express";
import { prisma } from "../client";
import { Prisma } from "@prisma/client";

export const createTeam = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { userId, groupId } = req.params;
		const { name, description, members } = req.body;

		const existingTeam = await prisma.team.findFirst({
			where: {
				name,
				groupId,
			},
		});
		if (existingTeam) {
			res.status(409).json({
				error: "Team name already exists within this group",
			});
			return;
		}

		const team = await prisma.team.create({
			data: {
				name,
				group: {
					connect: { id: groupId },
				},
				createdBy: {
					connect: { id: userId },
				},
				description: description ?? undefined,
				members: {
					create: members.map((memberId: string) => ({
						user: {
							connect: { id: memberId },
						},
					})),
				},
			},
			include: {
				members: true,
			},
		});

		res.status(201).json({
			message: "Team created successfully",
			team,
		});
	} catch (error) {
		console.error("Error creating team:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
