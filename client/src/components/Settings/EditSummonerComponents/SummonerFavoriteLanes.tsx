import { laneOptions } from "../../../types/Champion";
import { ReactSetState } from "../../../types/ReactTypes";

const SummonerFavoriteLanes = ({
	favoriteLanes,
	setFavoriteLanes,
}: {
	favoriteLanes: string[];
	setFavoriteLanes: ReactSetState<string[]>;
}) => {
	const handleChangeFavoriteLanes = (lane: string) => {
		setFavoriteLanes((prevLanes) => {
			if (prevLanes.includes(lane)) {
				return prevLanes.filter((l) => l !== lane);
			} else if (prevLanes.length < 2) {
				return [...prevLanes, lane];
			}
			return prevLanes;
		});
	};

	return (
		<div aria-label="favorite-lanes" className="flex flex-col gap-2">
			<div className="flex gap-2 items-center">
				<h2>Favorite Lanes</h2>
				<span className="text-sm">(2 max)</span>
			</div>

			<div className="flex gap-2">
				{laneOptions
					.slice()
					.sort((a, b) => {
						const aIndex = favoriteLanes.indexOf(a);
						const bIndex = favoriteLanes.indexOf(b);

						if (aIndex !== -1 && bIndex === -1) return -1;
						if (aIndex === -1 && bIndex !== -1) return 1;

						return laneOptions.indexOf(a) - laneOptions.indexOf(b);
					})
					.map((lane) => (
						<div
							key={lane}
							className={`flex items-center gap-2 p-2 rounded-md cursor-pointer uppercase ${
								favoriteLanes.includes(lane)
									? "bg-accent-light-1"
									: favoriteLanes.length === 2
									? "bg-secondary-dark-6 opacity-50"
									: "bg-secondary-dark-6"
							}`}
							onClick={() => handleChangeFavoriteLanes(lane)}
						>
							<p>{lane}</p>
						</div>
					))}
			</div>
		</div>
	);
};

export default SummonerFavoriteLanes;
