import { Lane, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { prisma } from "../client";

const laneConsts = {
	top: Lane.TOP,
	jungle: Lane.JUNGLE,
	mid: Lane.MID,
	adc: Lane.ADC,
	support: Lane.SUPPORT,
} as const;

// User CRUD operations
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
				res.status(400).json({
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

// Favorite's Users Operations
export const getFavoriteLanes = async (req: Request, res: Response) => {
	const userId = req.params.userId;

	const userFavoriteLanes = await prisma.userFavoriteLane.findMany({
		where: { userId },
	});

	if (!userFavoriteLanes) {
		res.status(404).json({
			error: `Favorite lanes for ${userId} not found`,
		});
		return;
	}

	const favoriteLanes = userFavoriteLanes.map((lane) => ({
		laneId: lane.id,
		laneName: lane.lane,
	}));

	res.status(200).json({
		favoriteLanes,
	});
};

export const getFavoriteChampions = async (req: Request, res: Response) => {
	const userId = req.params.userId;

	const userFavoriteChampions = await prisma.userFavoriteChampion.findMany({
		where: { userId },
		select: {
			championId: true,
			champion: {
				select: {
					name: true,
					nameId: true,
				},
			},
		},
	});

	if (!userFavoriteChampions) {
		res.status(404).json({
			error: `Favorite champions for ${userId} not found`,
		});
		return;
	}

	const favoriteChampions = userFavoriteChampions.map((champion) => ({
		championId: champion.championId,
		championName: champion.champion.name,
		championNameId: champion.champion.nameId,
	}));

	res.status(200).json({
		favoriteChampions,
	});
};

export const updateFavoriteLanes = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { lanes } = req.body;

		const validLanes = lanes
			.map((lane: string) => lane.toLowerCase())
			.filter(
				(lane: string): lane is keyof typeof laneConsts =>
					lane in laneConsts
			)
			.map((lane: keyof typeof laneConsts) => laneConsts[lane]);

		const existingLanes = await prisma.userFavoriteLane.findMany({
			where: { userId },
			select: { lane: true },
		});

		const existingLaneSet = new Set(existingLanes.map((l) => l.lane));
		const newLaneSet = new Set(validLanes);

		const lanesToRemove = [...existingLaneSet].filter(
			(lane) => !newLaneSet.has(lane)
		);

		const lanesToAdd = validLanes.filter(
			(lane: Lane) => !existingLaneSet.has(lane)
		);

		if (lanesToRemove.length > 0) {
			await prisma.userFavoriteLane.deleteMany({
				where: {
					userId,
					lane: {
						in: lanesToRemove,
					},
				},
			});
		}

		if (lanesToAdd.length > 0) {
			await prisma.userFavoriteLane.createMany({
				data: lanesToAdd.map((lane: any) => ({ userId, lane })),
			});
		}

		res.status(200).json({
			message: "Favorite lanes updated successfully",
			added: lanesToAdd,
			removed: lanesToRemove,
		});
	} catch (error) {
		console.error("Error in updateFavoriteLanes route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const updateFavoriteChampions = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { champions } = req.body;

		const validChampions = await prisma.champion.findMany({
			where: { name: { in: champions } },
			select: { id: true, name: true },
		});

		const existingFavorites = await prisma.userFavoriteChampion.findMany({
			where: { userId },
			include: { champion: { select: { id: true, name: true } } },
		});

		const existingChampionSet = new Set(
			existingFavorites.map((c) => c.champion.name)
		);
		const newChampionSet = new Set(validChampions.map((c) => c.name));

		const championsToRemove = existingFavorites.filter(
			(c) => !newChampionSet.has(c.champion.name)
		);
		const championsToAdd = validChampions.filter(
			(c) => !existingChampionSet.has(c.name)
		);

		if (championsToRemove.length > 0) {
			await prisma.userFavoriteChampion.deleteMany({
				where: {
					userId,
					championId: {
						in: championsToRemove.map((c) => c.championId),
					},
				},
			});
		}

		if (championsToAdd.length > 0) {
			await prisma.userFavoriteChampion.createMany({
				data: championsToAdd.map((champion) => ({
					userId,
					championId: champion.id,
				})),
			});
		}

		res.status(200).json({
			message: "Favorite champions updated successfully",
			added: championsToAdd.map((c) => c.name),
			removed: championsToRemove.map((c) => c.champion.name),
		});
	} catch (error) {
		console.error("Error in updateFavoriteChampions route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
