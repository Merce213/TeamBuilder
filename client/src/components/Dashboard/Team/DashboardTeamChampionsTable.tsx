import { Lane } from "../../../types/Champion";
import { Team, TeamMembership } from "../../../types/Team";
import keys from "../../../utils/keys";
import DataTable, { Column } from "../../DataTable";
import { convertToLaneIcons } from "../../Summoners/ProfileCard";

interface TeamChampionsTableProps {
	teamData: Team;
}

const TeamChampionsTable = ({ teamData }: TeamChampionsTableProps) => {
	const columns: Column<TeamMembership>[] = [
		{ key: "champion", header: "Champion" },
		{ key: "lane", header: "Lane" },
	] as Column<TeamMembership>[];

	const renderCell = (
		key: keyof TeamMembership | "actions",
		member: TeamMembership
	) => {
		switch (key) {
			case "champion":
				return (
					<div className="flex items-center gap-4">
						<img
							src={`${keys.CHAMPION_IMG_SQUARE}/${member.champion?.image.full}`}
							alt={member.champion?.name}
							className="w-10 h-10 s-sm:w-16 s-sm:h-16 object-cover"
						/>
						<span className="text-sm s-sm:text-base">
							{member.champion?.name}
						</span>
					</div>
				);
			case "lane":
				return convertToLaneIcons(member.lane.toLowerCase() as Lane);
			default:
				return "N/A";
		}
	};

	return (
		<DataTable
			columns={columns}
			data={teamData?.members || []}
			renderCell={renderCell}
		/>
	);
};

export default TeamChampionsTable;
