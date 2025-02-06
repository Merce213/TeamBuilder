import { useQuery } from "@tanstack/react-query";
import { getChampions } from "../../../api/champions";
import { Champion } from "../../../types/Champion";
import { ReactSetState } from "../../../types/ReactTypes";
import keys from "../../../utils/keys";

const SummonerFavoriteChampions = ({
	favoriteChampions,
	setFavoriteChampions,
}: {
	favoriteChampions: string[];
	setFavoriteChampions: ReactSetState<string[]>;
}) => {
	const { data: championsData } = useQuery({
		queryKey: ["champions"],
		queryFn: async () => getChampions(),
		staleTime: 1000 * 60 * 5,
		retry: false,
	});

	const handleChangeFavoriteChampions = (championName: string) => {
		setFavoriteChampions((prevChampions) => {
			if (prevChampions.includes(championName)) {
				return prevChampions.filter((c) => c !== championName);
			} else if (prevChampions.length < 3) {
				return [...prevChampions, championName];
			}
			return prevChampions;
		});
	};

	return (
		<div aria-label="favorite-champions" className="flex flex-col gap-2">
			<div className="flex gap-2 items-center">
				<h2>Favorite Champions</h2>
				<span className="text-sm">(3 max)</span>
			</div>

			<div className="grid grid-cols-3 gap-2 overflow-y-scroll overflow-x-hidden h-48 pr-2">
				{championsData
					?.slice()
					?.sort((a: Champion, b: Champion) => {
						const aIndex = favoriteChampions.indexOf(a.name);
						const bIndex = favoriteChampions.indexOf(b.name);

						if (aIndex !== -1 && bIndex === -1) return -1;
						if (aIndex === -1 && bIndex !== -1) return 1;

						return (
							championsData.indexOf(a) - championsData.indexOf(b)
						);
					})
					?.map((champion: Champion) => (
						<div
							key={champion.id}
							className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
								favoriteChampions.includes(champion.name)
									? "bg-accent-light-1"
									: favoriteChampions.length === 3
									? "bg-secondary-dark-6 opacity-50"
									: "bg-secondary-dark-6"
							}`}
							onClick={() =>
								handleChangeFavoriteChampions(champion.name)
							}
						>
							<img
								src={`${keys.CHAMPION_IMG_SQUARE}/${champion.image.full}`}
								alt={champion.name}
								className="w-8 h-8"
							/>

							<p>{champion.name}</p>
						</div>
					))}
			</div>
		</div>
	);
};

export default SummonerFavoriteChampions;
