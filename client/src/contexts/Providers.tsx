import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./AuthContext";
import { GroupProvider } from "./GroupContext";
import { LayoutProvider } from "./LayoutContext";
import { TeamProvider } from "./TeamContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<GroupProvider>
					<TeamProvider>
						<LayoutProvider>
							<Toaster richColors closeButton />
							{children}
						</LayoutProvider>
					</TeamProvider>
				</GroupProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
};

export default Providers;
