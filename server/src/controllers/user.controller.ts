import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../client";

export const getUser = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, username: true, email: true, role: true },
		});
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUser route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			select: { id: true, username: true, email: true, role: true },
		});
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getAllUsers route:", error);
		res.status(500).json({ error: "Internal Server Error" });
		return;
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { username, email, oldPassword, newPassword, role } = req.body;

		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { username: true, email: true, password: true, role: true },
		});

		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}

		const updateData: Partial<User> = {};

		if (username && username !== user.username) {
			updateData.username = username;
		}

		if (email && email !== user.email) {
			updateData.email = email;
		}

		if (oldPassword && newPassword) {
			const isPasswordValid = await bcrypt.compare(
				oldPassword,
				user.password
			);
			if (!isPasswordValid) {
				res.status(401).json({
					error: "Invalid old password",
					field: "oldPassword",
				});
				return;
			}
			updateData.password = await bcrypt.hash(newPassword, 10);
		}

		if (role && role !== user.role) {
			updateData.role = role;
		}

		if (Object.keys(updateData).length === 0) {
			res.status(400).json({ error: "No updates provided" });
			return;
		}

		await prisma.user.update({
			where: { id: userId },
			data: updateData,
		});

		res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		console.error("Error in updateUser route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) {
			res.status(404).json({ error: "User not found" });
			return;
		}
		await prisma.user.delete({ where: { id: userId } });
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error in deleteUser route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const searchUsers = async (req: Request, res: Response) => {
	try {
		const query = req.query.query as string | undefined;
		if (!query) {
			const users = await prisma.user.findMany({
				select: { id: true, username: true, email: true, role: true },
			});
			res.status(200).json(users);
			return;
		}

		const searchQuery = {
			OR: [
				{ username: { contains: query, mode: "insensitive" as const } },
				{ email: { contains: query, mode: "insensitive" as const } },
			],
		};

		const users = await prisma.user.findMany({
			where: searchQuery,
			select: { id: true, username: true, email: true, role: true },
		});
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in searchUsers route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
