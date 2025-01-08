import React, { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../api/auth";
import { getGroups } from "../api/groups";
import logo from "../assets/Teambuilder.png";
import { Group } from "../types/Group";
import { ReactSetState } from "../types/ReactTypes";
import { UserStorage } from "../types/User";

type AuthContextType = {
	user: UserStorage | null;
	setUser: ReactSetState<UserStorage | null>;
	loading: boolean;
	setLoading: ReactSetState<boolean>;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserStorage | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchUser = async (): Promise<void> => {
		try {
			const response = await checkAuth();

			if (!response.ok) {
				const errorData = await response.json();
				setUser(null);
				setLoading(false);
				return;
			}

			const data = await response.json();
			setUser(data);
			fetchGroups(data.id);
		} catch (error) {
			console.error("Error fetching user:", error);
			setUser(null);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	const fetchGroups = async (userId: string): Promise<void> => {
		const selectedGroupId = window.localStorage.getItem("selectedGroup");

		if (selectedGroupId) {
			return;
		}

		try {
			const data = await getGroups(userId);
			const groups = data.groups;

			if (groups.length === 0) {
				return;
			}

			const groupId = groups[0].id;
			if (!groupId) {
				throw new Error("Group ID not found");
			}

			if (
				!selectedGroupId ||
				!groups.some((group: Group) => group.id === selectedGroupId)
			) {
				window.localStorage.setItem("selectedGroup", groupId);
			}
		} catch (error) {
			console.error("Error fetching groups:", error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	if (loading) {
		return (
			<div className="h-screen flex items-center justify-center">
				<img src={logo} className="w-16 h-16" alt="TeamBuilder Logo" />
			</div>
		);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				setLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};
