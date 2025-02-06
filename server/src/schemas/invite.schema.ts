import { z } from "zod";

export const CreateInvitationGroupSchema = z.object({
	params: z.object({
		groupId: z.string().uuid("Invalid group ID format"),
	}),
	body: z.object({
		emails: z.array(
			z.string().email("One or more emails are invalid format").trim()
		),
	}),
});

export const AcceptInvitationGroupSchema = z.object({
	query: z.object({
		token: z.string(),
	}),
});
