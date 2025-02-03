import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptInvitationGroup } from "../api/invitation";
import CoreContainer from "../components/CoreContainer";

const JoinGroup = () => {
	const [searchParams] = useSearchParams();
	const { groupId } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (token: string) => acceptInvitationGroup(token),
		onSuccess: () => {
			localStorage.setItem("selectedGroup", groupId ?? "");
			queryClient.invalidateQueries({ queryKey: ["groups"] });
			setTimeout(() => navigate("/dashboard/group"), 2000);
		},
	});

	const token = searchParams.get("token");

	if (!token || !groupId) {
		mutation.error = new Error("Invalid invitation link");
	} else if (
		!mutation.isSuccess &&
		!mutation.isError &&
		!mutation.isPending
	) {
		mutation.mutate(token);
	}

	return (
		<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
				<h1 className="text-2xl font-bold text-center mb-6">
					Join Group
				</h1>

				{mutation.isPending && (
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"></div>
						<p className="mt-4 text-gray-light-6">
							Processing your invitation...
						</p>
					</div>
				)}

				{mutation.isSuccess && (
					<div className="text-center">
						<div className="text-6xl mb-4">✓</div>
						<h2 className="text-xl font-semibold text-primary mb-2">
							Successfully Joined!
						</h2>
						<p className="text-gray-light-6">
							You will be redirected to the group page shortly...
						</p>
					</div>
				)}

				{mutation.isError && (
					<div className="text-center">
						<div className="text-danger text-6xl mb-4">✕</div>
						<h2 className="text-xl font-semibold mb-2">Error</h2>
						<p className="text-gray-light-6">
							{mutation.error instanceof Error
								? mutation.error.message
								: "Failed to join group"}
						</p>
						<button
							onClick={() => navigate("/dashboard/group")}
							className="mt-4 px-4 py-2 text-white rounded cursor-pointer"
						>
							Go to Groups
						</button>
					</div>
				)}
			</div>
		</CoreContainer>
	);
};

export default JoinGroup;
