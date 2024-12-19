import { z } from "zod";

export const UserSignUpSchema = z.object({
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
	email: z.string().email("Invalid email format").trim(),
	password: z
		.string()
		.min(5, "Password must contain at least 5 characters")
		.trim(),
	role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export const UserSignInSchema = z.object({
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
		.string()
		.min(5, "Password must contain at least 5 characters")
		.trim(),
});

export const UserUpdateSchema = z.object({
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
});

export const ResetPasswordRequestSchema = z.object({
	email: z.string().email("Invalid email format").trim(),
});

export const ChangeForgottenPasswordSchema = z.object({
	token: z.string(),
	newPassword: z
		.string()
		.min(5, "Password must contain at least 5 characters")
		.trim(),
});
