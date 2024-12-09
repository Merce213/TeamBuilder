import { Lane, PrismaClient } from "@prisma/client";
import { championsByLane } from "../data/championsByLane";

const prisma = new PrismaClient();
const debugMode = true;

async function importChampionLanes() {
	try {
		for (const [laneName, championNames] of championsByLane.entries()) {
			const lane = Object.values(Lane).find(
				(lane) =>
					lane.toLocaleLowerCase() === laneName.toLowerCase()
			);

			if (!lane) {
				throw new Error(`Lane non trouvée : ${laneName}`);
			}

			if (debugMode) {
				console.log(`Traitement de la lane : ${laneName}`);
			}

			for (const championName of championNames) {
				const champion = await prisma.champion.findUnique({
					where: { name: championName },
				});

				if (!champion) {
					throw new Error(
						`Champion non trouvé : ${championName}`
					);
				}

				await prisma.championLane.create({
					data: {
						championId: champion.id,
						lane,
					},
				});

				if (debugMode) {
					console.log(
						`Relation ajoutée : Champion (${champion.name}) - Lane (${laneName})`
					);
				}
			}
		}

		console.log("Importation des ChampionLane réussie !");
	} catch (error) {
		console.error("Erreur lors de l'importation :", error);
	} finally {
		await prisma.$disconnect();
	}
}

importChampionLanes();
