import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { getGroups } from "../../../api/groups";
import { useAuth } from "../../../contexts/AuthContext";
import { Group } from "../../../types/Group";

const GroupList = () => {
	const { user } = useAuth();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["groups", user?.id],
		queryFn: async () => await getGroups(user?.id ?? ""),
		staleTime: 1000 * 60 * 5,
		retry: false,
		enabled: !!user,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{[1, 2].map((_, i) => (
					<div
						key={i}
						className="bg-white shadow-md rounded-lg p-4 border animate-pulse"
					>
						<h3 className="text-lg font-semibold mb-2">
							Group {i + 1}
						</h3>
						<div className="flex flex-wrap gap-2">
							{[1, 2, 3].map((_, j) => (
								<div key={j} className="relative">
									<User className="text-gray-light-6 text-2xl" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		);
	}
	if (isError) {
		return <div>An error occurred: {error.message}</div>;
	}

	return (
		<div id="groups" className="flex flex-col gap-4">
			<h2 className="text-base s-md:text-lg font-semibold font-sora">
				Groups
			</h2>

			<div className="grid grid-cols-1 gap-4">
				{data?.groups?.slice(0, 3)?.map((group: Group) => (
					<div
						key={group.id}
						className="bg-white shadow-md rounded-lg p-3 border"
					>
						<h3 className="text-lg font-semibold mb-2">
							{group.name}
						</h3>
						<div className="flex flex-wrap gap-2">
							{group.members.map((member) => (
								<div key={member.id} className="relative">
									<User className="text-gray-light-6 text-2xl" />
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default GroupList;
