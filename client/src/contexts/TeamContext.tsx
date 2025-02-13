import { useQuery } from "@tanstack/react-query";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { getTeamsByGroupId } from "../api/team";
import { ReactSetState } from "../types/ReactTypes";
import { Team } from "../types/Team";
import { useAuth } from "./AuthContext";
import { useGroup } from "./GroupContext";

const TeamContext = createContext<{
	teamData: Team | null | undefined;
	setTeamData: ReactSetState<Team | null | undefined>;
	teams: Team[];
	isLoadingTeams: boolean;
	teamsError: Error | null;
	selectedTeamId: string | null;
	handleSelectTeam: (team: Team) => void;
} | null>(null);

export const TeamProvider = ({ children }: { children: React.ReactNode }) => {
	const [teamData, setTeamData] = useState<Team | null | undefined>(
		undefined
	);
	const { user } = useAuth();
	const { selectedGroupId } = useGroup();

	const selectedTeamId = localStorage.getItem("selectedTeam") ?? null;

	const {
		data,
		isLoading: isLoadingTeams,
		error: teamsError,
	} = useQuery({
		queryKey: ["teams", user?.id, selectedGroupId],
		queryFn: () => getTeamsByGroupId(user?.id ?? "", selectedGroupId ?? ""),
		enabled: !!user && !!selectedGroupId,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	const teams = useMemo(() => data?.teams ?? [], [data]);

	useEffect(() => {
		if (!isLoadingTeams && user && teams.length > 0) {
			const selectedTeam = selectedTeamId
				? teams.find((team: Team) => team.id === selectedTeamId)
				: teams[0];

			if (selectedTeam) {
				localStorage.setItem("selectedTeam", selectedTeam.id);
				setTeamData(selectedTeam);
			} else {
				localStorage.removeItem("selectedTeam");
				setTeamData(null);
			}
		} else if (!isLoadingTeams && user && teams.length === 0) {
			localStorage.removeItem("selectedTeam");
			setTeamData(null);
		}
	}, [isLoadingTeams, user, teams, selectedTeamId]);

	const handleSelectTeam = (team: Team) => {
		setTeamData(team);
		localStorage.setItem("selectedTeam", team.id);
	};

	return (
		<TeamContext.Provider
			value={{
				teamData,
				setTeamData,
				teams,
				isLoadingTeams,
				teamsError,
				selectedTeamId,
				handleSelectTeam,
			}}
		>
			{children}
		</TeamContext.Provider>
	);
};

export const useTeam = () => {
	const context = useContext(TeamContext);
	if (!context) {
		throw new Error("useTeam must be used within a TeamProvider");
	}
	return context;
};
