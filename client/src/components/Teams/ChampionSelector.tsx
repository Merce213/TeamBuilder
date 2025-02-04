import { Champion } from "../../types/Champion";
import { ReactSetState } from "../../types/ReactTypes";
import { TeamBody } from "../../types/Team";
import keys from "../../utils/keys";

interface ChampionSelectorProps {
	teamData: TeamBody;
	setTeamData: ReactSetState<TeamBody>;
	champions: Champion[];
}

const ChampionSelector = ({
	teamData,
	setTeamData,
	champions,
}: ChampionSelectorProps) => {
	const handleChampionSelect = (champion: Champion) => {
		const championIndex = teamData.members.findIndex(
			(member) => member?.championId === champion.id
		);
		if (championIndex !== -1) {
			setTeamData((prev) => ({
				...prev,
				members: prev.members.map((member, index) =>
					index === championIndex ? undefined : member
				),
			}));
		} else {
			const emptySlotIndex = teamData.members.findIndex(
				(member) => member === undefined
			);
			if (emptySlotIndex !== -1) {
				setTeamData((prev) => ({
					...prev,
					members: prev.members.map((member, index) =>
						index === emptySlotIndex
							? { championId: champion.id, lane: "" }
							: member
					),
				}));
			}
		}
	};

	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Select Champions</h3>
			<div className="grid grid-cols-3 gap-2 overflow-y-scroll overflow-x-hidden h-48 pr-2">
				{champions
					?.slice()
					?.sort((a, b) => {
						const aIndex = teamData.members
							.map((member) => member?.championId)
							.indexOf(a.id);
						const bIndex = teamData.members
							.map((member) => member?.championId)
							.indexOf(b.id);

						if (aIndex !== -1 && bIndex === -1) return -1;
						if (aIndex === -1 && bIndex !== -1) return 1;

						return champions.indexOf(a) - champions.indexOf(b);
					})
					.map((champion) => (
						<button
							key={champion.id}
							onClick={() => handleChampionSelect(champion)}
							className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
								teamData.members
									.map((member) => member?.championId)
									.includes(champion.id)
									? "bg-accent-light-1"
									: teamData.members.filter(Boolean)
											.length === 5
									? "bg-secondary-dark-6 opacity-50"
									: "bg-secondary-dark-6"
							}`}
							disabled={
								teamData.members.filter(Boolean).length >= 5
							}
						>
							<img
								src={`${keys.CHAMPION_IMG_SQUARE}/${champion.image.full}`}
								alt={champion.name}
								className="w-12 h-12"
							/>
							<span className="mt-1 text-sm text-text">
								{champion.name}
							</span>
						</button>
					))}
			</div>
		</div>
	);
};

export default ChampionSelector;
