import { Lane } from "@prisma/client";
import { z } from "zod";

export const CreateTeamSchema = z.object({
	params: z.object({
		userId: z.string().uuid("Invalid user ID format"),
		groupId: z.string().uuid("Invalid group ID format"),
	}),
	body: z.object({
		name: z
			.string({
				required_error: "Team name is required",
			})
			.min(3, "Team name must be at least 3 characters long")
			.trim(),
		description: z.string().trim().nullable().optional(),
		members: z
			.array(
				z.object({
					userId: z
						.string()
						.uuid("Invalid user ID format")
						.nullable()
						.optional(),
					championId: z
						.number()
						.int("Champion ID must be an integer"),
					lane: z.nativeEnum(Lane, {
						message: "Invalid lane for champions",
					}),
				})
			)
			.length(5, "Team must have exactly 5 members")
			.refine(
				(members) => {
					const championIds = new Set();
					const lanes = new Set();
					for (const member of members) {
						if (championIds.has(member.championId)) {
							return false; // Duplicate champion
						}
						if (lanes.has(member.lane)) {
							return false; // Duplicate lane
						}
						championIds.add(member.championId);
						lanes.add(member.lane);
					}
					return lanes.size === 5; // All lanes must be present
				},
				{
					message:
						"Each champion and lane must be unique, and all lanes must be filled",
				}
			),
	}),
});
