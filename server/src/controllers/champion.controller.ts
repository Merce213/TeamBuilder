import { Request, Response } from "express";
import { Lane } from "@prisma/client";
import { prisma } from "../client";

interface ChampionFilters {
	name?: { contains: string; mode: "insensitive" };
	lanes?: { some: { lane: { in: Lane[] } } };
	tags?: { some: { tagId: { in: number[] } } };
}

const laneConsts = {
	top: Lane.TOP,
	jungle: Lane.JUNGLE,
	mid: Lane.MID,
	adc: Lane.ADC,
	support: Lane.SUPPORT,
} as const;

export const getChampions = async (req: Request, res: Response) => {
	try {
		const filters: ChampionFilters = {};

		// Filtrage par nom
		if (req.query.name && typeof req.query.name === "string") {
			filters.name = {
				contains: req.query.name,
				mode: "insensitive",
			};
		}

		// Filtrage par lane
		if (req.query.lane) {
			let lanes: Lane[] = [];

			if (Array.isArray(req.query.lane)) {
				lanes = req.query.lane
					.map((l) => (typeof l === "string" ? l.toLowerCase() : ""))
					.filter(
						(l): l is keyof typeof laneConsts => l in laneConsts
					)
					.map((l) => laneConsts[l]);
			} else if (typeof req.query.lane === "string") {
				const lane =
					req.query.lane.toLowerCase() as keyof typeof laneConsts;
				if (lane in laneConsts) {
					lanes = [laneConsts[lane]];
				}
			}

			if (lanes.length > 0) {
				filters.lanes = {
					some: {
						lane: { in: lanes },
					},
				};
			}
		}

		// Filtrage par tag
		if (req.query.tag) {
			let tagNames: string[] = [];
			if (Array.isArray(req.query.tag)) {
				tagNames = req.query.tag.map(
					(tag) =>
						(tag as string).charAt(0).toUpperCase() +
						(tag as string).slice(1)
				);
			} else if (typeof req.query.tag === "string") {
				tagNames = [
					req.query.tag.charAt(0).toUpperCase() +
						req.query.tag.slice(1),
				];
			}

			const existingTags = await prisma.tag.findMany({
				where: { name: { in: tagNames } },
			});

			const missingTags = tagNames.filter(
				(tagName) => !existingTags.some((tag) => tag.name === tagName)
			);
			if (missingTags.length > 0) {
				res.status(404).json({
					error: `Tag${
						missingTags.length > 1 ? "s" : ""
					} not found: ${missingTags.join(", ")}`,
				});
				return;
			}

			const tagIds = existingTags.map((tag) => tag.id);
			filters.tags = {
				some: {
					tagId: { in: tagIds },
				},
			};
		}

		const champions = await prisma.champion.findMany({
			where: filters,
			include: {
				lanes: true,
				tags: {
					include: {
						tag: true,
					},
				},
				info: true,
				stats: true,
				skins: true,
				image: true,
			},
		});

		const formattedChampions = champions.map((champion) => ({
			...champion,
			tags: champion.tags.map((tagEntry) => tagEntry.tag.name),
			lanes: champion.lanes.map((lane) => lane.lane),
		}));

		if (!formattedChampions.length) {
			res.status(404).json({ error: "No champions found" });
			return;
		}

		res.status(200).json(formattedChampions);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getChampion = async (req: Request, res: Response) => {
	const { nameId } = req.params;

	if (!nameId) {
		res.status(400).json({ error: "Missing champion nameId params" });
		return;
	}

	if (typeof nameId !== "string") {
		res.status(400).json({ error: "Invalid type for champion nameId" });
		return;
	}

	try {
		const champion = await prisma.champion.findFirst({
			where: {
				nameId: {
					equals: nameId,
					mode: "insensitive",
				},
			},
			include: {
				lanes: true,
				tags: {
					include: {
						tag: true,
					},
				},
				info: true,
				stats: true,
				skins: true,
				image: true,
			},
		});

		if (!champion) {
			res.status(404).json({ error: "Champion not found" });
			return;
		}

		const formattedChampion = {
			...champion,
			tags: champion.tags.map((tagEntry) => tagEntry.tag.name),
			lanes: champion.lanes.map((lane) => lane.lane),
		};

		res.status(200).json(formattedChampion);
	} catch (error) {
		res.status(500).json({ error: "Internal Server Error" });
	}
};
