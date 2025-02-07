import { useQuery } from "@tanstack/react-query";
import { getTeamsByGroupId } from "../../../api/team";
import { useGroup } from "../../../contexts/GroupContext";
import { useAuth } from "../../../contexts/AuthContext";
import { Team } from "../../../types/Team";
import keys from "../../../utils/keys";

const TeamList = () => {
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["teams", user?.id, selectedGroupId],
		queryFn: async () =>
			await getTeamsByGroupId(user?.id ?? "", selectedGroupId ?? ""),
		staleTime: 1000 * 60 * 5,
		retry: false,
		enabled: !!user && !!selectedGroupId,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4">
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="bg-white shadow-md rounded-lg p-3 border animate-pulse"
					>
						<div className="h-6 w-1/2 bg-gray-300 rounded-full"></div>
						<div className="flex flex-wrap gap-2 mt-2">
							{[...Array(5)].map((_, j) => (
								<div
									key={j}
									className="w-8 h-8 s-sm:w-10 s-sm:h-10 bg-gray-300 rounded-full"
								></div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	}
	if (isError) {
		return <div>An error occurred: {error.message}</div>;
	}

	return (
		<div id="teams" className="flex flex-col gap-4">
			<h2 className="text-base s-md:text-lg font-semibold font-sora">
				Teams
			</h2>
			<div className="grid grid-cols-1 gap-4">
				{data?.teams?.slice(0, 3)?.map((team: Team) => (
					<div
						key={team.id}
						className="bg-white shadow-md rounded-lg p-3 border"
					>
						<h3 className="text-lg font-semibold mb-2">
							{team.name}
						</h3>
						<div className="flex flex-wrap gap-2">
							{team.members.map((member) => (
								<img
									key={member.championId}
									src={`${keys.CHAMPION_IMG_SQUARE}/${member.champion?.image.full}`}
									alt={`Champion ${member.championId}`}
									className="w-8 h-8 s-sm:w-10 s-sm:h-10 rounded-full"
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TeamList;
