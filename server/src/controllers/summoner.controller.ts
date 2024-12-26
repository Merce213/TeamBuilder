import { Request, Response } from "express";
import { prisma } from "../client";
import keys from "../utils/keys";

export const linkSummonerToUser = async (req: Request, res: Response) => {
	const { gameName, tagLine } = req.body;
	const userId = req.user?.id;

	const response = await fetch(
		`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${keys.riotApiKey}`
	);

	if (!response.ok) {
		res.status(404).json({ error: "Summoner not found" });
		return;
	}

	const summonerPUUID = await response.json();

	const existingSummoner = await prisma.summonerInfo.findUnique({
		where: {
			puuid: summonerPUUID.puuid,
		},
	});

	if (existingSummoner) {
		res.status(409).json({ error: "Summoner already associated" });
		return;
	}

	// Fetch summoner information from the Riot API
	const summonerResponse = await fetch(
		`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${summonerPUUID.puuid}?api_key=${keys.riotApiKey}`
	);

	if (!summonerResponse.ok) {
		res.status(404).json({
			error: "Summoner not found in Riot API, please check the puuid",
		});
		return;
	}

	const summonerData = await summonerResponse.json();

	const leagueResponse = await fetch(
		`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${keys.riotApiKey}`
	);

	if (!leagueResponse.ok) {
		res.status(404).json({
			error: "Summoner not found in Riot API, please check the puuid",
		});
		return;
	}

	const leagueData = await leagueResponse.json();

	if (!userId) {
		res.status(400).json({ error: "User ID is required" });
		return;
	}

	await prisma.summonerInfo.create({
		data: {
			userId,
			puuid: summonerPUUID.puuid,
			gameName: summonerPUUID.gameName,
			tagLine: summonerPUUID.tagLine,
		},
	});

	res.status(200).json({
		message: "Summoner associated successfully",
		summonerPUUID,
		summonerData,
		leagueData,
	});
};
