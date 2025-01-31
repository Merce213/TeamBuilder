import { updateFavoriteLanes } from "./../controllers/user.controller";
import { z } from "zod";

export const UserSignUpSchema = z.object({
	body: z.object({
		username: z
			.string({
				required_error: "Username is required",
			})
			.min(4, "Username must be at least 4 characters")
			.max(20, "Username must be at most 20 characters")
			.regex(
				/^[A-Za-z0-9_]+$/,
				"Username can only contain letters, numbers, and underscores"
			)
			.trim()
			.refine((val) => val.trim().length > 0, {
				message: "Username cannot be empty",
			}),
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid email format")
			.trim(),
		password: z
			.string({ required_error: "Password is required" })
			.min(5, "Password must contain at least 5 characters")
			.trim(),
		role: z.enum(["USER", "ADMIN"]).default("USER"),
	}),
});

export const UserSignInSchema = z.object({
	body: z.object({
		username: z
			.string({
				required_error: "Username is required",
			})
			.min(4, "Username must be at least 4 characters")
			.max(20, "Username must be at most 20 characters")
			.trim()
			.refine((val) => val.trim().length > 0, {
				message: "Username cannot be empty",
			}),
		password: z
			.string({ required_error: "Password is required" })
			.min(5, "Password must contain at least 5 characters")
			.trim(),
	}),
});

export const UserUpdateSchema = z.object({
	body: z.object({
		username: z
			.string()
			.min(4, "Username must be at least 4 characters")
			.max(20, "Username must be at most 20 characters")
			.trim()
			.optional(),
		email: z.string().email("Invalid email format").trim().optional(),
		oldPassword: z.string().optional(),
		newPassword: z
			.string()
			.min(5, "Password must contain at least 5 characters")
			.trim()
			.optional(),
		role: z.enum(["USER", "ADMIN"]).default("USER").optional(),
	}),
});

export const ResetPasswordRequestSchema = z.object({
	body: z.object({
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid email format")
			.trim(),
	}),
});

export const ChangeForgottenPasswordSchema = z.object({
	body: z.object({
		token: z.string({ required_error: "Token is required" }),
		newPassword: z
			.string({ required_error: "New password is required" })
			.min(5, "Password must contain at least 5 characters")
			.trim(),
	}),
});

// SUMMONERS
export const updateFavoriteLanesSchema = z.object({
	params: z.object({
		userId: z.string().min(1, "User ID is required"),
	}),
	body: z.object({
		lanes: z
			.array(z.string())
			.max(2, "Cannot have more than 2 favorite lanes"),
	}),
});

export const updateFavoriteChampionsSchema = z.object({
	params: z.object({
		userId: z.string().min(1, "User ID is required"),
	}),
	body: z.object({
		champions: z
			.array(z.string())
			.max(3, "Cannot have more than 3 favorite champions"),
	}),
});

export const GetSummonerInfoSchema = z.object({
	params: z.object({
		userId: z.string().min(1, "User ID is required"),
	}),
});

export const LinkSummonerToUserSchema = z.object({
	params: z.object({
		userId: z.string().min(1, "User ID is required"),
	}),
	body: z.object({
		summonerName: z
			.string({ required_error: "Summoner name is required" })
			.regex(
				/^(.+)#(.+)$/,
				"Summoner name must contain at least one character before and after #"
			)
			.trim(),
	}),
});
