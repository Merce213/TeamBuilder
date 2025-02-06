import { NextFunction, Request, Response } from "express";
import { prisma } from "../client";
import { GroupRole } from "../types/group";
import {
	TokenExpirations,
	TokenExpirationsInMs,
	TokenType,
} from "../types/token";
import { generateToken, verifyToken } from "../utils/jwt";
import keys from "../utils/keys";
import { sendInvitationGroupEmail } from "../utils/emails";

export const createInvitationGroup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const userId = req.user?.id;
	const { groupId } = req.params;
	const { emails } = req.body;

	try {
		// Vérifier si l'utilisateur est membre du groupe avec les permissions nécessaires
		const membership = await prisma.groupMembership.findFirst({
			where: {
				userId: userId,
				groupId: groupId,
				role: { in: [GroupRole.Owner, GroupRole.Admin] },
			},
			include: {
				group: {
					select: {
						name: true,
					},
				},
				user: {
					select: {
						username: true,
					},
				},
			},
		});

		if (!membership) {
			res.status(403).json({ error: "Issuer not found or not allowed" });
			return;
		}

		// Vérifier si les emails sont déjà membres du groupe
		const existingMembers = await prisma.groupMembership.findMany({
			where: {
				groupId: groupId,
				user: {
					email: {
						in: emails,
					},
				},
			},
			include: {
				user: true,
			},
		});

		const existingMemberEmails = existingMembers.map(
			(member) => member.user.email
		);
		const emailsToInvite = emails.filter(
			(email: string) => !existingMemberEmails.includes(email)
		);

		if (emailsToInvite.length === 0) {
			res.status(422).json({ error: "No valid emails to invite" });
			return;
		}

		const groupName = membership.group.name;
		const inviterUsername = membership.user.username;

		// Créer et envoyer les invitations
		for (const email of emailsToInvite) {
			const invitationToken = generateToken(
				{ groupId, email },
				TokenType.InvitationToken,
				{
					expiresIn: TokenExpirations[TokenType.InvitationToken],
				}
			);

			if (userId) {
				await prisma.token.create({
					data: {
						userId: userId,
						type: "INVITATION",
						token: invitationToken,
						expiresAt: new Date(
							Date.now() +
								TokenExpirationsInMs[TokenType.InvitationToken]
						),
					},
				});
			}

			const invitationUrl = `${keys.frontendUrl}/join-group/${groupId}?token=${invitationToken}`;
			await sendInvitationGroupEmail(
				email,
				inviterUsername,
				groupName,
				invitationUrl
			);
		}

		res.status(201).json({
			message: "Invitations sent",
			emails: emailsToInvite,
		});
	} catch (error) {
		console.error("Error in createInvitationGroup:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const acceptInvitation = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { token } = req.query;

	try {
		if (!userId || !token) {
			res.status(400).json({ error: "Invalid request" });
			return;
		}

		const decodedToken = verifyToken(
			token as string,
			TokenType.InvitationToken
		);
		if (!decodedToken || typeof decodedToken === "string") {
			res.status(400).json({ error: "Invalid token" });
			return;
		}

		const invitation = await prisma.token.findFirst({
			where: {
				type: "INVITATION",
				token: token as string,
			},
		});
		if (!invitation) {
			res.status(404).json({
				error: "Invalid invitation, not found or already accepted",
			});
			return;
		}

		const user = await prisma.user.findUnique({
			where: {
				email: decodedToken.email,
			},
		});
		const group = await prisma.group.findUnique({
			where: {
				id: decodedToken.groupId,
			},
		});
		if (!user || !group) {
			res.status(404).json({ error: "User or group not found" });
			return;
		}

		if (user) {
			const existingMembership = await prisma.groupMembership.findFirst({
				where: {
					userId: user.id,
					groupId: group.id,
				},
			});

			if (existingMembership) {
				res.status(400).json({ error: "User is already a member" });
				return;
			}

			await prisma.groupMembership.create({
				data: {
					userId: user.id,
					groupId: group.id,
					role: GroupRole.Member,
				},
			});

			await prisma.token.delete({
				where: {
					id: invitation.id,
				},
			});

			res.status(200).json({
				message: "Invitation accepted",
				groupId: group.id,
			});
		}
	} catch (error) {
		console.error("Error in acceptInvitation:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
