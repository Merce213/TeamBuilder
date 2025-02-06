import { GroupRole, UserRole } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../client";
import keys from "../utils/keys";

export const createGroup = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { name, description, members } = req.body;

		const existingGroup = await prisma.group.findFirst({
			where: {
				name: {
					equals: name,
					mode: "insensitive",
				},
				createdById: userId,
			},
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
				members: {
					select: {
						id: true,
						groupId: true,
						userId: true,
						role: true,
						joinedAt: true,
						updatedAt: true,
						user: {
							select: {
								username: true,
								email: true,
							},
						},
					},
				},
			},
		});

		if (!group) {
			res.status(404).json({
				error: "Group not found",
			});
			return;
		}

		const membersWithSummonerInfo = await Promise.all(
			group.members.map(async (member) => {
				const summonerInfo = await prisma.summonerInfo.findUnique({
					where: {
						userId: member.userId,
					},
					select: {
						puuid: true,
						gameName: true,
						tagLine: true,
					},
				});

				if (summonerInfo && summonerInfo.puuid) {
					const summonerResponse = await fetch(
						`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerInfo.puuid}?api_key=${keys.riotApiKey}`
					);
					const summonerData = await summonerResponse.json();

					return {
						...member,
						username: member.user.username,
						email: member.user.email,
						avatar: summonerData.profileIconId
							? `${keys.profileIconApi}/${summonerData.profileIconId}.png`
							: undefined,
						summonerName: `${summonerInfo.gameName}#${summonerInfo.tagLine}`,
						user: undefined,
					};
				} else {
					return {
						...member,
						username: member.user.username,
						email: member.user.email,
						user: undefined,
					};
				}
			})
		);

		const groupData = {
			...group,
			members: membersWithSummonerInfo,
		};

		res.status(200).json({
			message: "Group retrieved successfully",
			group: groupData,
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
		const { name, description } = req.body;
		const groupId = req.params.groupId;
		const currentUserId = req.user?.id;
		const currentUserRole = req.user?.role;

		const group = res.locals.group;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === currentUserId;

		if (!isOwner && !isAdmin) {
			res.status(403).json({
				error: "Forbidden: Only the group owner or an admin can update the group details.",
			});
			return;
		}

		const updateData: { name?: string; description?: string } = {};
		if (name && name !== group.name) updateData.name = name;
		if (description && description !== group.description)
			updateData.description = description;

		if (Object.keys(updateData).length === 0) {
			res.status(400).json({ error: "No updates provided" });
			return;
		}

		const updatedGroup = await prisma.group.update({
			where: { id: groupId },
			data: updateData,
			select: {
				id: true,
				name: true,
				description: true,
				createdById: true,
			},
		});

		// console.log(`Group ${groupId} updated by user ${currentUserId}`);

		res.status(200).json({
			message: "Group updated successfully",
		});
	} catch (error) {
		console.error("Error updating group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteGroup = async (req: Request, res: Response) => {
	try {
		const actorUserId = req.params.userId;
		const authenticatedUserId = req.user?.id;
		const currentUserRole = req.user?.role;

		if (actorUserId !== authenticatedUserId) {
			res.status(403).json({
				error: "Forbidden: You can only perform actions as yourself.",
			});
			return;
		}

		const group = res.locals.group;
		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === authenticatedUserId;

		if (!isOwner && !isAdmin) {
			res.status(403).json({
				error: "Forbidden: Only the owner or an admin can delete the group.",
			});
			return;
		}

		const groups = await prisma.group.findMany({
			where: {
				createdById: actorUserId,
			},
			select: {
				id: true,
			},
		});

		const isLastGroup = groups.length === 1;

		if (isLastGroup) {
			res.status(403).json({
				error: "Forbidden: You cannot delete the last group you created.",
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

export const kickMemberFromGroup = async (req: Request, res: Response) => {
	try {
		const actorUserId = req.params.userId;
		const memberIdToKick = req.params.memberId;
		const groupId = req.params.groupId;
		const authenticatedUserId = req.user?.id;
		const currentUserRole = req.user?.role;

		// Vérification de sécurité
		if (actorUserId !== authenticatedUserId) {
			res.status(403).json({
				error: "Forbidden: You can only perform actions as yourself.",
			});
			return;
		}

		const group = res.locals.group;

		const isAdmin = currentUserRole === UserRole.ADMIN;
		const isOwner = group.createdById === actorUserId;
		const isGroupAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === actorUserId && member.role === GroupRole.ADMIN
		);
		const isMemberToKickAdmin = group.members.some(
			(member: { userId: string; role: GroupRole }) =>
				member.userId === memberIdToKick &&
				member.role === GroupRole.ADMIN
		);

		if (memberIdToKick === group.createdById && !isAdmin) {
			res.status(403).json({
				error: "Forbidden: The owner of the group cannot be kicked.",
			});
			return;
		}
		if (isGroupAdmin && isMemberToKickAdmin && !isOwner && !isAdmin) {
			res.status(403).json({
				error: "Forbidden: An admin cannot kick another admin.",
			});
			return;
		}
		if (!isOwner && !isGroupAdmin && !isAdmin) {
			res.status(403).json({
				error: "Forbidden: Only the owner, group admins, or system admins can kick members.",
			});
			return;
		}

		await prisma.groupMembership.delete({
			where: {
				groupId_userId: {
					groupId: groupId,
					userId: memberIdToKick,
				},
			},
		});

		/* console.log(
			`User ${actorUserId} kicked user ${memberIdToKick} from group ${groupId}`
		); */

		res.status(200).json({ message: "Member kicked successfully" });
	} catch (error) {
		console.error("Error kicking member from group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const leaveGroup = async (req: Request, res: Response) => {
	try {
		const group = res.locals.group;
		const userId = req.user?.id;

		if (!userId) {
			res.status(401).json({
				error: "Unauthorized: User not authenticated.",
			});
			return;
		}

		if (group.createdById === userId) {
			res.status(403).json({
				error: "The owner cannot leave the group. You must delete the group instead.",
			});
			return;
		}

		const membership = await prisma.groupMembership.findUnique({
			where: {
				groupId_userId: {
					groupId: group.id,
					userId: userId,
				},
			},
		});

		if (!membership) {
			res.status(404).json({
				error: "You are not a member of this group.",
			});
			return;
		}

		await prisma.groupMembership.delete({
			where: {
				groupId_userId: {
					groupId: group.id,
					userId: userId,
				},
			},
		});

		res.status(200).json({
			message: `You have successfully left the group ${group.name}.`,
		});
	} catch (error) {
		console.error("Error leaving group:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
