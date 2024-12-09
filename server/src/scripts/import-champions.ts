import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { ChampionApi } from "../types/api-champion";

const prisma = new PrismaClient();
const BASE_URL =
	"https://ddragon.leagueoflegends.com/cdn/14.23.1/data/en_US/champion";

const debugMode = true;

async function importChampions() {
	try {
		// Récupérer la liste des champions depuis l'API
		const championsResponse = await axios.get(`${BASE_URL}.json`);
		const champions: ChampionApi[] = Object.values(
			championsResponse.data.data
		);

		// Pour chaque champion, effectuer les inserts dans la base de données
		for (const champion of champions) {
			if (debugMode) {
				console.log(`Traitement du champion : ${champion.id}`);
			}

			const championDetailsResponse = await axios.get(
				`${BASE_URL}/${champion.id}.json`
			);

			if (!championDetailsResponse?.data?.data) {
				throw new Error(
					`Les détails du champion ${champion.id} sont manquants.`
				);
			}

			const championDetails =
				championDetailsResponse.data.data[champion.id];

			const newChampion = await prisma.champion.create({
				data: {
					name: championDetails.name,
					title: championDetails.title,
					blurb: championDetails.blurb,
					lore: championDetails.lore,
				},
			});

			if (debugMode)
				console.log(
					`Champion ajouté : ${newChampion.name} (ID: ${newChampion.id})`
				);

			const infoPromise = prisma.info.create({
				data: {
					attack: championDetails.info.attack,
					defense: championDetails.info.defense,
					magic: championDetails.info.magic,
					difficulty: championDetails.info.difficulty,
					championId: newChampion.id,
				},
			});

			const statsPromise = prisma.stats.create({
				data: {
					hp: championDetails.stats.hp,
					hpPerLevel: championDetails.stats.hpperlevel,
					mp: championDetails.stats.mp,
					mpPerLevel: championDetails.stats.mpperlevel,
					moveSpeed: championDetails.stats.movespeed,
					armor: championDetails.stats.armor,
					armorPerLevel: championDetails.stats.armorperlevel,
					spellBlock: championDetails.stats.spellblock,
					spellBlockPerLevel:
						championDetails.stats.spellblockperlevel,
					attackRange: championDetails.stats.attackrange,
					hpRegen: championDetails.stats.hpregen,
					hpRegenPerLevel: championDetails.stats.hpregenperlevel,
					mpRegen: championDetails.stats.mpregen,
					mpRegenPerLevel: championDetails.stats.mpregenperlevel,
					crit: championDetails.stats.crit,
					critPerLevel: championDetails.stats.critperlevel,
					attackDamage: championDetails.stats.attackdamage,
					attackDamagePerLevel:
						championDetails.stats.attackdamageperlevel,
					attackSpeed: championDetails.stats.attackspeed,
					attackSpeedPerLevel:
						championDetails.stats.attackspeedperlevel,
					championId: newChampion.id,
				},
			});

			const imagePromise = prisma.image.create({
				data: {
					full: championDetails.image.full,
					sprite: championDetails.image.sprite,
					championId: newChampion.id,
				},
			});

			const [info, stats, image] = await Promise.all([
				infoPromise,
				statsPromise,
				imagePromise,
			]);

			if (debugMode) {
				console.log(
					`Info ajoutée pour ${newChampion.name} (ID: ${info.id})`
				);
				console.log(
					`Stats ajoutées pour ${newChampion.name} (ID: ${stats.id})`
				);
				console.log(
					`Image ajoutée pour ${newChampion.name} (ID: ${image.id})`
				);
			}

			const skinMessages: string[] = [];

			for (const skin of championDetails.skins) {
				await prisma.skin.create({
					data: {
						skinId: skin.id,
						num: skin.num,
						name: skin.name,
						championId: newChampion.id,
					},
				});
				skinMessages.push(
					`Skin ${skin.name} ajouté pour ${newChampion.name}`
				);
			}

			// Log une seule fois pour tous les skins après la boucle
			if (skinMessages.length > 0) {
				console.log(
					`Skins pour ${newChampion.name} ajoutés avec succès !`
				);

				if (debugMode) {
					console.log(skinMessages.join("\n"));
				}
			}

			// Gérer les tags (relation many-to-many)
			const tagPromises = championDetails.tags.map(
				async (tagName: string) => {
					let tag = await prisma.tag.findUnique({
						where: { name: tagName },
					});
					if (!tag) {
						tag = await prisma.tag.create({
							data: { name: tagName },
						});
						if (debugMode)
							console.log(
								`Nouveau tag créé : ${tag.name} (ID: ${tag.id})`
							);
					}

					await prisma.championTag.create({
						data: {
							championId: newChampion.id,
							tagId: tag.id,
						},
					});
					if (debugMode)
						console.log(
							`Relation Champion-Tag ajoutée : Champion (${newChampion.name}) - Tag (${tag.name})`
						);
				}
			);

			// Attendre la fin de l'insertion des tags
			await Promise.all(tagPromises);

			if (debugMode) {
				console.log(`Champion ${newChampion.name} traité avec succès.`);
				console.log("----------------------------------------");
			}
		}

		if (debugMode) {
			console.log(`Champions importés: ${champions.length}`);
		}
		console.log("Importation des champions réussie !");
	} catch (error) {
		console.error("Erreur lors de l'importation :", error);
	} finally {
		await prisma.$disconnect();
	}
}

importChampions();
