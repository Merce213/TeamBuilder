import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getChampions } from "../../api/champions";
import { useChampionsFilters } from "../../hooks/useChampionsFilters";
import { Champion } from "../../types/Champion";
import keys from "../../utils/keys";

const ChampionsList = () => {
	const { name, tags, lanes, searchParams } = useChampionsFilters();

	const {
		data: champions,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["champions", name, tags, lanes],
		queryFn: () => getChampions(searchParams),
		retry: 1,
	});

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div aria-label="champions-container">
			<h2 className="text-2xl font-bold mb-4">
				Champions ({champions?.length})
			</h2>
			<div className="champions-grid">
				{champions?.length === 0 && <p>No champions found</p>}
				{champions?.map((champion: Champion) => (
					<Link
						to={`/champions/${champion.nameId.toLowerCase()}`}
						key={champion.id}
					>
						<div className="flex items-center justify-center overflow-hidden">
							<img
								src={`${keys.CHAMPION_IMG_SQUARE}/${champion.nameId}.png`}
								alt={champion.name}
								className="w-full transition-all cursor-pointer hover:scale-105"
							/>
						</div>
						<p className="text-sm s-sm:text-md mt-2 truncate">
							{champion.name}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};

export default ChampionsList;
