import React, { createContext, useContext, useState } from "react";
import { ReactSetState } from "../types/ReactTypes";

const LayoutContext = createContext<{
	isSidebarOpen: boolean;
	setSidebarOpen: ReactSetState<boolean>;
} | null>(null);

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

	return (
		<LayoutContext.Provider value={{ isSidebarOpen, setSidebarOpen }}>
			{children}
		</LayoutContext.Provider>
	);
};

export const useLayout = () => {
	const context = useContext(LayoutContext);
	if (context === null) {
		throw new Error("useLayout must be used within a LayoutProvider");
	}
	return context;
};
