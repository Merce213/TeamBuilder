import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getGroups } from "../api/groups";
import { Group } from "../types/Group";
import { ReactSetState } from "../types/ReactTypes";
import { useAuth } from "./AuthContext";

const GroupContext = createContext<{
	groupData: Group | null;
	setGroupData: ReactSetState<Group | null>;
	groups: Group[];
	isLoadingGroups: boolean;
	groupsError: Error | null;
	selectedGroupId: string | null;
	handleSelectGroup: (group: Group) => void;
} | null>(null);

export const GroupProvider = ({ children }: { children: React.ReactNode }) => {
	const [groupData, setGroupData] = useState<Group | null>(null);
	const { user } = useAuth();
	const selectedGroupId = localStorage.getItem("selectedGroup");

	const {
		data,
		isLoading: isLoadingGroups,
		error: groupsError,
	} = useQuery({
		queryKey: ["groups", user?.id],
		queryFn: () => getGroups(user?.id ?? ""),
		enabled: !!user,
	});

	const groups = data?.groups ?? [];

	useEffect(() => {
		if (user && user.id && selectedGroupId) {
			const selectedGroup = groups.find(
				(group: Group) => group.id === selectedGroupId
			);
			if (selectedGroup) {
				setGroupData(selectedGroup);
			}
		}
	}, [user, groups]);

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
