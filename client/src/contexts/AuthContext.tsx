import React, { createContext, useContext, useEffect, useState } from "react";
import { checkAuth } from "../api/auth";
import logo from "../assets/Teambuilder.png";
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
				setUser(null);
				setLoading(false);
				return;
			}

			const data = await response.json();
			setUser(data);
		} catch (error) {
			console.error("Error fetching user:", error);
			setUser(null);
			setLoading(false);
		} finally {
			setLoading(false);
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
