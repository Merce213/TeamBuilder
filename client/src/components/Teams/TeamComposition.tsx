import { Champion } from "../../types/Champion";
import { ReactSetState } from "../../types/ReactTypes";
import { TeamBody } from "../../types/Team";
import ChampionInstance from "./ChampionInstance";

interface TeamCompositionProps {
	teamData: TeamBody;
	setTeamData: ReactSetState<TeamBody>;
	champions: Champion[];
	errors: Record<string, string>;
	setErrors: ReactSetState<Record<string, string>>;
}

const TeamComposition = ({
	teamData,
	setTeamData,
	champions,
	errors,
	setErrors,
}: TeamCompositionProps) => {
	return (
		<div>
			<h3 className="text-lg font-semibold mb-2">Team Composition</h3>
			{errors.members && (
				<p className="text-danger-light-2 text-sm my-2">
					{errors.members}
				</p>
			)}
			<div className="space-y-2">
				{teamData.members.map((member, index) => (
					<ChampionInstance
						key={index}
						member={member}
						champions={champions}
						onUpdate={(updatedMember) => {
							setTeamData((prev) => ({
								...prev,
								members: prev.members.map((m, i) =>
									i === index ? updatedMember : m
								),
							}));

							setErrors((prev) => ({
								...prev,
								members: "",
							}));
						}}
						onRemove={() => {
							setTeamData((prev) => ({
								...prev,
								members: prev.members.map((m, i) =>
									i === index ? undefined : m
								),
							}));
						}}
					/>
				))}
			</div>
		</div>
	);
};

export default TeamComposition;
