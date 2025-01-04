import React from "react";
import { AuthProvider } from "./AuthContext";
import { LayoutProvider } from "./LayoutContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const Providers = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<LayoutProvider>{children}</LayoutProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default Providers;
