import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
	getFavoriteChampions,
	getFavoriteLanes,
	getSummonerProfile,
} from "../../api/summoner";
import AdcIcon from "../../assets/icons/positions/position-bottom.svg";
import JungleIcon from "../../assets/icons/positions/position-jungle.svg";
import MidIcon from "../../assets/icons/positions/position-middle.svg";
import SupportIcon from "../../assets/icons/positions/position-support.svg";
import TopIcon from "../../assets/icons/positions/position-top.svg";
import iconProfileUnkwnown from "../../assets/icons/profileIconUnknown.jpg";
import { useAuth } from "../../contexts/AuthContext";
import { Lane } from "../../types/Champion";
import { QueueType } from "../../types/Summoner";
import keys from "../../utils/keys";
import EditSummonerProfileModal from "../Settings/EditSummonerProfileModal";

const convertToLaneIcons = (lane: Lane) => {
	switch (lane) {
		case Lane.TOP:
			return (
				<img
					src={TopIcon}
					alt="top icon"
					className="w-8 h-8 s-sm:w-10 s-sm:h-10 object-cover"
				/>
			);
		case Lane.JUNGLE:
			return (
				<img
					src={JungleIcon}
					alt="jungle icon"
					className="w-8 h-8 s-sm:w-10 s-sm:h-10 object-cover"
				/>
			);

		case Lane.MID:
			return (
				<img
					src={MidIcon}
					alt="middle icon"
					className="w-8 h-8 s-sm:w-10 s-sm:h-10 object-cover"
				/>
			);
		case Lane.ADC:
			return (
				<img
					src={AdcIcon}
					alt="adc icon"
					className="w-8 h-8 s-sm:w-10 s-sm:h-10 object-cover"
				/>
			);
		case Lane.SUPPORT:
			return (
				<img
					src={SupportIcon}
					alt="support icon"
					className="w-8 h-8 s-sm:w-10 s-sm:h-10 object-cover"
				/>
			);
		default:
			return "";
	}
};

const ProfileCard = ({ editBtn = false }: { editBtn?: boolean }) => {
	const { user } = useAuth();
	const [openModalEditSummonerProfile, setOpenModalEditSummonerProfile] =
		useState(false);

	const {
		data: dataSummoner,
		isLoading: isLoadingSummoner,
		isError: isErrorSummoner,
		error: errorSummoner,
	} = useQuery({
		queryKey: ["summoner", user?.id],
		queryFn: async () => getSummonerProfile(user?.id as string),
		staleTime: 1000 * 60 * 5,
		retry: false,
	});

	const {
		data: dataFavoriteLanes,
		isLoading: isLoadingFavoriteLanes,
		isError: isErrorFavoriteLanes,
		error: errorFavoriteLanes,
	} = useQuery({
		queryKey: ["favoriteLanes", user?.id],
		queryFn: async () => getFavoriteLanes(user?.id as string),
		staleTime: 1000 * 60 * 5,
		retry: false,
	});

	const {
		data: dataFavoriteChampions,
		isLoading: isLoadingFavoriteChampions,
		isError: isErrorFavoriteChampions,
		error: errorFavoriteChampions,
	} = useQuery({
		queryKey: ["favoriteChampions", user?.id],
		queryFn: async () => getFavoriteChampions(user?.id as string),
		staleTime: 1000 * 60 * 5,
		retry: false,
	});

	console.log("dataSummoner", dataSummoner);
	console.log("dataFavoriteLanes", dataFavoriteLanes);
	console.log("dataFavoriteChampions", dataFavoriteChampions);

	return (
		<>
			<div className="w-full relative max-w-xl h-full bg-gray rounded-md p-2">
				{editBtn && (
					<div
						className="absolute top-2 right-2 flex gap-2 items-center p-1 s-sm:p-2 cursor-pointer border rounded-md hover:text-accent-light-3 transition-all"
						onClick={() => setOpenModalEditSummonerProfile(true)}
					>
						<Pencil className="w-4 h-4" />
						<p className="text-sm s-sm:text-base">Edit</p>
					</div>
				)}

				<div className="flex flex-col gap-4 items-center">
					<div className="flex flex-col items-center gap-2">
						<div className="relative">
							<img
								src={
									dataSummoner?.summonerDetails?.summonerData
										?.profileIconId
										? `${keys.PROFILE_ICON}/${dataSummoner.summonerDetails.summonerData.profileIconId}.png`
										: iconProfileUnkwnown
								}
								alt="profile icon"
								className="rounded-full w-16 h-16 s-sm:w-24 s-sm:h-24 s-md:w-32 s-md:h-32 border border-accent object-cover"
							/>
							<div className="absolute bottom-0 right-1/2 translate-x-1/2 flex items-center justify-center rounded-full">
								<span className="bg-secondary-dark-6 p-1 rounded-full font-bold text-sm s-sm:text-base">
									{dataSummoner?.summonerDetails?.summonerData
										?.summonerLevel || "?"}
								</span>
							</div>
						</div>

						<div className="flex items-center w-full justify-center">
							<p className="text-base s-md:text-lg font-semibold font-sora">
								{dataSummoner?.summonerDetails?.summonerInfo
									?.summonerName || "gameName#tagLine"}
							</p>
						</div>
					</div>

					<div className="flex flex-col items-center w-full justify-center">
						<p className="font-semibold mb-2 text-gray-light-5">
							Ranks
						</p>

						<div className="flex flex-col justify-center gap-2">
							{dataSummoner?.summonerDetails.leagueData ? (
								dataSummoner?.summonerDetails.leagueData.map(
									(league) => (
										<div
											key={league.leagueId}
											className="flex items-center gap-2"
										>
											<p className="font-semibold">
												{league.queueType ===
												QueueType.RANKED_SOLO_5x5
													? "Solo/Duo"
													: "Flex: "}
											</p>
											<div className="flex items-center gap-2 text-sm">
												{league && (
													<>
														<p>{league.tier}</p>
														<p>{league.rank}</p>
														<p>
															{
																league.leaguePoints
															}{" "}
															LP
														</p>
													</>
												)}
											</div>
										</div>
									)
								)
							) : (
								<p className="text-sm font-semibold">
									Unranked
								</p>
							)}
						</div>
					</div>

					{dataFavoriteLanes?.favoriteLanes && (
						<div className="flex flex-col items-center w-full justify-center gap-2">
							<p className="font-semibold text-gray-light-5">
								Favorite Lanes
							</p>

							<div className="flex items-center gap-2">
								{dataFavoriteLanes?.favoriteLanes.length > 0 ? (
									dataFavoriteLanes?.favoriteLanes.map(
										(lane) => (
											<div
												key={lane.laneId}
												className="flex items-center gap-2"
											>
												{convertToLaneIcons(
													lane.laneName.toLowerCase() as Lane
												)}
											</div>
										)
									)
								) : (
									<p className="text-sm font-semibold">
										No favorite lanes
									</p>
								)}
							</div>
						</div>
					)}

					{dataFavoriteChampions?.favoriteChampions && (
						<div className="flex flex-col items-center w-full justify-center gap-2">
							<p className="font-semibold text-gray-light-5">
								Favorite Champions
							</p>

							<div className="flex items-center gap-2">
								{dataFavoriteChampions?.favoriteChampions
									.length > 0 ? (
									dataFavoriteChampions?.favoriteChampions.map(
										(champion) => (
											<Link
												to={`/champions/${champion.championName}`}
												key={champion.championId}
												className="flex items-center gap-2"
											>
												<img
													src={`${keys.CHAMPION_IMG_SQUARE}/${champion.championNameId}.png`}
													className="w-10 h-10 s-sm:w-12 s-sm:h-12 border border-accent object-cover hover:scale-110 transition-all"
												/>
											</Link>
										)
									)
								) : (
									<p className="text-sm font-semibold">
										No favorite champions
									</p>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			{openModalEditSummonerProfile && (
				<EditSummonerProfileModal
					openModalEditSummonerProfile={openModalEditSummonerProfile}
					setOpenModalEditSummonerProfile={
						setOpenModalEditSummonerProfile
					}
					summonerName={
						dataSummoner?.summonerDetails?.summonerInfo
							?.summonerName
					}
					lanesInFavorite={dataFavoriteLanes?.favoriteLanes.map(
						(lane) => lane.laneName.toLowerCase()
					)}
					championsInFavorite={dataFavoriteChampions?.favoriteChampions.map(
						(champion) => champion.championName
					)}
				/>
			)}
		</>
	);
};
export default ProfileCard;
