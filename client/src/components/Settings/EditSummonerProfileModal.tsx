import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateFavoriteChampions, updateFavoriteLanes } from "../../api/user";
import { useAuth } from "../../contexts/AuthContext";
import { ReactSetState } from "../../types/ReactTypes";
import Modal from "../Modal";
import SummonerFavoriteChampions from "./EditSummonerComponents/SummonerFavoriteChampions";
import SummonerFavoriteLanes from "./EditSummonerComponents/SummonerFavoriteLanes";
import SummonerInfo from "./EditSummonerComponents/SummonerInfo";

const areArraysEqual = (arr1: string[] | undefined, arr2: string[]) => {
	if (arr1?.length !== arr2.length) return false;
	const set = new Set(arr1);
	return arr2.every((item) => set.has(item));
};

const EditSummonerProfileModal = ({
	openModalEditSummonerProfile,
	setOpenModalEditSummonerProfile,
	summonerName,
	lanesInFavorite,
	championsInFavorite,
}: {
	openModalEditSummonerProfile: boolean;
	setOpenModalEditSummonerProfile: ReactSetState<boolean>;
	summonerName?: string;
	lanesInFavorite?: string[];
	championsInFavorite?: string[];
}) => {
	const { user } = useAuth();

	const [favoriteLanes, setFavoriteLanes] = useState<string[]>(
		lanesInFavorite ?? []
	);
	const [favoriteChampions, setFavoriteChampions] = useState<string[]>(
		championsInFavorite ?? []
	);

	const lanesChanged = !areArraysEqual(lanesInFavorite, favoriteLanes);
	const championsChanged = !areArraysEqual(
		championsInFavorite,
		favoriteChampions
	);

	const queryClient = useQueryClient();

	const updateFavoriteLanesMutation = useMutation({
		mutationFn: async () => {
			return updateFavoriteLanes(user?.id ?? "", {
				lanes: favoriteLanes,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["favoriteLanes", user?.id],
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const updateFavoriteChampionsMutation = useMutation({
		mutationFn: async () => {
			return updateFavoriteChampions(user?.id ?? "", {
				champions: favoriteChampions,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["favoriteChampions", user?.id],
			});
		},
		onError: (error) => {
			console.log(error);
		},
	});

	const handleUpdateFavorites = async () => {
		if (lanesChanged) {
			await updateFavoriteLanesMutation.mutateAsync();
		}

		if (championsChanged) {
			await updateFavoriteChampionsMutation.mutateAsync();
		}

		if (lanesChanged || championsChanged) {
			setOpenModalEditSummonerProfile(false);
		}
	};

	return (
		<Modal
			isOpen={openModalEditSummonerProfile}
			onClose={() => setOpenModalEditSummonerProfile(false)}
			closeOnClickOutside={true}
		>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<h1>Edit your summoner profile</h1>
				</div>

				<SummonerInfo summonerName={summonerName} />

				<SummonerFavoriteLanes
					favoriteLanes={favoriteLanes}
					setFavoriteLanes={setFavoriteLanes}
				/>

				<SummonerFavoriteChampions
					favoriteChampions={favoriteChampions}
					setFavoriteChampions={setFavoriteChampions}
				/>

				<div className="flex flex-col gap-2">
					<button
						type="submit"
						className="p-1 btn-accent"
						onClick={handleUpdateFavorites}
						disabled={!lanesChanged && !championsChanged}
					>
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
};
export default EditSummonerProfileModal;
