import { Trash } from "lucide-react";
import { Champion, Lane, laneOptions } from "../../types/Champion";
import { TeamMembershipBody } from "../../types/Team";
import keys from "../../utils/keys";

interface ChampionInstanceProps {
	member: TeamMembershipBody | undefined;
	onUpdate: (updatedMember: TeamMembershipBody) => void;
	onRemove: () => void;
	champions?: Champion[];
}

const lanes = laneOptions.map((lane) => lane.toUpperCase());

const ChampionInstance = ({
	member,
	onUpdate,
	onRemove,
	champions,
}: ChampionInstanceProps) => {
	if (!member) {
		return (
			<div className="p-2 border rounded text-gray-light-3">
				Empty slot
			</div>
		);
	}

	const champion = champions?.find((c) => c.id === member.championId);

	return (
		<div className="flex items-center gap-2 p-2 border rounded">
			<div className="flex items-center w-full gap-2">
				<div className="flex items-center gap-4">
					<img
						src={`${keys.CHAMPION_IMG_SQUARE}/${champion?.image.full}`}
						alt={champion?.name}
						className="w-8 h-8 object-cover s-sm:w-16 s-sm:h-16"
					/>
					<span>{champion?.name}</span>
				</div>

				<div className="flex items-center gap-2">
					<select
						value={member.lane}
						onChange={(e) =>
							onUpdate({
								...member,
								lane: e.target.value as Lane,
							})
						}
						className="p-1 border rounded cursor-pointer"
					>
						<option value="">Choose lane</option>
						{lanes.map((lane) => (
							<option key={lane} value={lane}>
								{lane}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="flex items-center justify-end gap-2">
				<button
					onClick={onRemove}
					className="px-2 py-1 bg-danger-dark-2 text-text rounded hover:bg-danger cursor-pointer transition-all"
					type="button"
					aria-label="Remove"
					title="Remove"
				>
					<Trash />
				</button>
			</div>
		</div>
	);
};

export default ChampionInstance;
