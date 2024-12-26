import { z } from "zod";

export const CreateGroupSchema = z.object({
	params: z.object({ userId: z.string().uuid("Invalid user ID format") }),
	body: z.object({
		name: z
			.string({
				required_error: "Group name is required",
			})
			.min(3, "Group name must be at least 3 characters long")
			.trim(),
		description: z.string().trim().nullable().optional(),
		members: z.array(z.string().uuid("Invalid user ID format")).optional(),
	}),
});

export const GetGroupSchema = z.object({
	params: z.object({
		userId: z.string().uuid("Invalid user ID format"),
		groupId: z.string().uuid("Invalid group ID format"),
	}),
});

export const GetUserGroupsSchema = z.object({
	params: z.object({ userId: z.string().uuid("Invalid user ID format") }),
});

export const UpdateGroupSchema = z.object({
	params: z.object({
		userId: z.string().uuid("Invalid user ID format"),
		groupId: z.string().uuid("Invalid group ID format"),
	}),
	body: z.object({
		name: z
			.string()
			.min(3, "Group name must be at least 3 characters long")
			.trim()
			.optional(),
		description: z.string().trim().nullable().optional(),
		members: z.array(z.string().uuid("Invalid user ID format")).optional(),
	}),
});

export const DeleteGroupeSchema = z.object({
	params: z.object({
		userId: z.string().uuid("Invalid user ID format"),
		groupId: z.string().uuid("Invalid group ID format"),
	}),
});
