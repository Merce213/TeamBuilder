import { useQuery } from "@tanstack/react-query";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { getGroups } from "../api/groups";
import { Group } from "../types/Group";
import { ReactSetState } from "../types/ReactTypes";
import { useAuth } from "./AuthContext";

const GroupContext = createContext<{
	groupData: Group | null | undefined;
	setGroupData: ReactSetState<Group | null | undefined>;
	groups: Group[];
	isLoadingGroups: boolean;
	groupsError: Error | null;
	selectedGroupId: string | null;
	handleSelectGroup: (group: Group) => void;
} | null>(null);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
	const [groupData, setGroupData] = useState<Group | null | undefined>(
		undefined
	);
	const { user } = useAuth();
	const selectedGroupId = localStorage.getItem("selectedGroup") ?? null;

	const {
		data,
		isLoading: isLoadingGroups,
		error: groupsError,
	} = useQuery({
		queryKey: ["groups", user?.id],
		queryFn: () => getGroups(user?.id ?? ""),
		enabled: !!user,
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	const groups = useMemo(() => data?.groups ?? [], [data]);

	useEffect(() => {
		if (!isLoadingGroups && user && groups.length > 0) {
			const selectedGroup = selectedGroupId
				? groups.find((group: Group) => group.id === selectedGroupId)
				: groups[0];

			if (selectedGroup) {
				localStorage.setItem("selectedGroup", selectedGroup.id);
				setGroupData(selectedGroup);
			} else {
				localStorage.removeItem("selectedGroup");
				setGroupData(null);
			}
		}
	}, [selectedGroupId, groups, isLoadingGroups, user]);

	const handleSelectGroup = (group: Group) => {
		localStorage.setItem("selectedGroup", group.id);
		setGroupData(group);
	};

	return (
		<GroupContext.Provider
			value={{
				groupData,
				setGroupData,
				groups,
				isLoadingGroups,
				groupsError,
				selectedGroupId,
				handleSelectGroup,
			}}
		>
			{children}
		</GroupContext.Provider>
	);
};

export const useGroup = () => {
	const context = useContext(GroupContext);
	if (context === null) {
		throw new Error("useGroup must be used within a GroupProvider");
	}
	return context;
};
