import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../api/auth";
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

	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async (): Promise<void> => {
			try {
				const response = await checkAuth();

				if (!response.ok) {
					const errorData = await response.json();
					setUser(null);
					setLoading(false);
					navigate("/signin");
					return;
				}

				const data = await response.json();
				setUser(data);
			} catch (error) {
				console.error("Error fetching user:", error);
				setUser(null);
				setLoading(false);
				navigate("/signin");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, [navigate]);

	if (loading) {
		return <div>Loading...</div>;
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
