import React, { createContext, useContext, useEffect, useState } from "react";
import clientFetch from "../config/axios";
import { ReactSetState } from "../types/ReactTypes";
import { UserStorage } from "../types/User";

type AuthContextType = {
	user: UserStorage | null;
	setUser: ReactSetState<UserStorage | null>;
	signIn: (username: string, password: string) => Promise<void>;
	signOut: () => void;
	loading: boolean;
	setLoading: ReactSetState<boolean>;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserStorage | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		clientFetch
			.get<UserStorage>("/auth/me")
			.then((response) => {
				setUser(response.data);
			})
			.catch(() => {
				setLoading(false);
			})
			.finally(() => setLoading(false));
	}, []);

	const signIn = async (username: string, password: string) => {
		try {
			setLoading(true);
			const response = await clientFetch.post<UserStorage>(
				"/auth/signin",
				{
					username,
					password,
				}
			);
			setUser(response.data);
		} catch (error) {
			console.error("Sign-in error:", error);
		} finally {
			setLoading(false);
		}
	};

	const signOut = () => {
		clientFetch.post("/auth/signout");
		setUser(null);
		setLoading(false);
	};

	return (
		<AuthContext.Provider
			value={{ user, setUser, signIn, signOut, loading, setLoading }}
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
