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

export const addFavoriteLanes = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;

		const lanes = ((req.body.lanes as string[]) || [])
			.map((lane) => lane.toLowerCase())
			.filter(
				(lane): lane is keyof typeof laneConsts => lane in laneConsts
			)
			.map((lane) => laneConsts[lane]);

		if (!Array.isArray(lanes) || lanes.length === 0 || lanes.length > 2) {
			res.status(400).json({
				error: "You must choose between 1 and 2 valid lanes",
			});
			return;
		}

		const existingLanes = await prisma.userFavoriteLane.findMany({
			where: { userId },
			select: { lane: true },
		});
		const existingLaneNames = new Set(existingLanes.map((l) => l.lane));
		const newLanes = lanes.filter((lane) => !existingLaneNames.has(lane));
		const alreadyExistingLanes = lanes.filter((lane) =>
			existingLaneNames.has(lane)
		);

		if (newLanes.length + existingLanes.length > 2) {
			res.status(400).json({
				error: "Cannot have more than 2 favorite lanes",
			});
			return;
		}
		if (newLanes.length === 0 && alreadyExistingLanes.length > 0) {
			res.status(400).json({
				error: {
					message: "Lanes already added to favorites",
					lanes: alreadyExistingLanes,
				},
			});
			return;
		}
		if (newLanes.length === 0) {
			res.status(400).json({
				error: "None of the lanes are valid",
			});
			return;
		}

		await prisma.userFavoriteLane.createMany({
			data: newLanes.map((lane) => ({ userId, lane })),
		});

		res.status(201).json({
			message: `Lane${newLanes.length > 1 ? "s" : ""} added successfully`,
			added: newLanes,
			alreadyExisting: alreadyExistingLanes,
		});
	} catch (error) {
		console.error("Error in addFavoriteLanes route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const removeFavoriteLanes = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const lanes = (req.body.lanes as string[])
			.map((l) => l.toLowerCase())
			.filter((l): l is keyof typeof laneConsts => l in laneConsts)
			.map((l) => laneConsts[l]);

		if (!Array.isArray(lanes) || lanes.length === 0) {
			res.status(400).json({
				error: "You must choose at least one lane to remove",
			});
			return;
		}

		const existingLanes = await prisma.userFavoriteLane.findMany({
			where: { userId },
			select: { lane: true },
		});
		const existingLaneNames = new Set(existingLanes.map((l) => l.lane));

		const lanesToRemove = lanes.filter((lane) =>
			existingLaneNames.has(lane)
		);
		const invalidLanes = lanes.filter(
			(lane) => !existingLaneNames.has(lane)
		);

		if (lanesToRemove.length === 0) {
			res.status(400).json({
				error: "None of the specified lanes are in your favorites",
				invalidLanes,
			});
			return;
		}

		await prisma.userFavoriteLane.deleteMany({
			where: { userId, lane: { in: lanesToRemove } },
		});

		res.status(200).json({
			message: `Lane${lanes.length > 1 ? "s" : ""} removed successfully`,
			removed: lanesToRemove,
			invalidLanes,
		});
	} catch (error) {
		console.error("Error in removeFavoriteLane route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const addFavoriteChampions = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const { champions } = req.body;

		if (
			!Array.isArray(champions) ||
			champions.length === 0 ||
			champions.length > 5
		) {
			res.status(400).json({
				error: "You must choose between 1 and 5 champions",
			});
			return;
		}

		const existingChampions = await prisma.userFavoriteChampion.findMany({
			where: { userId },
			include: { champion: { select: { name: true } } },
		});
		const existingChampionNames = new Set(
			existingChampions.map((c) => c.champion.name)
		);
		const newChampions = champions.filter(
			(name: string) => !existingChampionNames.has(name)
		);
		const alreadyExistingChampions = champions.filter((name: string) =>
			existingChampionNames.has(name)
		);

		if (newChampions.length + existingChampions.length > 5) {
			res.status(400).json({
				error: "Cannot have more than 5 favorite champions",
			});
			return;
		}

		const validChampions = await prisma.champion.findMany({
			where: { name: { in: newChampions } },
			select: { id: true, name: true },
		});

		if (
			validChampions.length === 0 &&
			alreadyExistingChampions.length > 0
		) {
			res.status(400).json({
				error: {
					message: "Champions already added to favorites",
					champions: alreadyExistingChampions,
				},
			});
			return;
		}
		if (validChampions.length === 0) {
			res.status(400).json({
				error: "None of the provided champions exist",
			});
			return;
		}

		await prisma.userFavoriteChampion.createMany({
			data: validChampions.map((champion) => ({
				userId,
				championId: champion.id,
			})),
		});

		res.status(201).json({
			message: `Champion${
				validChampions.length > 1 ? "s" : ""
			} added successfully`,
			added: validChampions.map((champion) => champion.name),
			alreadyExisting: alreadyExistingChampions,
		});
	} catch (error) {
		console.error("Error in addFavoriteChampions route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const removeFavoriteChampions = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const champions: string[] = req.body.champions || [];
		if (champions.length === 0) {
			res.status(400).json({
				error: "You must choose at least one champion to remove",
			});
			return;
		}

		const existingChampions = await prisma.userFavoriteChampion.findMany({
			where: { userId },
			select: { champion: { select: { name: true } } },
		});
		const existingChampionNames = new Set(
			existingChampions.map((c) => c.champion.name)
		);
		const championsToRemove = champions.filter((name: string) =>
			existingChampionNames.has(name)
		);
		const invalidChampions = champions.filter(
			(name: string) => !existingChampionNames.has(name)
		);

		if (championsToRemove.length === 0) {
			res.status(400).json({
				error: {
					message:
						"None of the provided champions are in your favorites",
					invalidChampions,
				},
			});
			return;
		}

		await prisma.userFavoriteChampion.deleteMany({
			where: { userId, champion: { name: { in: championsToRemove } } },
		});

		res.status(200).json({
			message: `Champion${
				championsToRemove.length > 1 ? "s" : ""
			} removed successfully`,
			removed: championsToRemove,
			invalidChampions,
		});
	} catch (error) {
		console.error("Error in removeFavoriteChampions route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
