import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
	linkSummonerToUser,
	unlinkSummonerFromUser,
} from "../../../api/summoner";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";

const SummonerInfo = ({ summonerName }: { summonerName?: string }) => {
	const { user } = useAuth();
	const [summonerInput, setSummonerInput] = useState(summonerName ?? "");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const queryClient = useQueryClient();

	const handleChangeSummonerName = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		if (!summonerName) {
			setSummonerInput(e.target.value);
			if (errors.summonerName) {
				delete errors.summonerName;
				setErrors(errors);
			}
		} else {
			setSummonerInput(summonerName);
		}
	};

	const linkSummonerToUserMutation = useMutation({
		mutationFn: async () =>
			linkSummonerToUser(user?.id ?? "", summonerInput),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["summoner", user?.id] });
			toast.success("Summoner linked successfully", {
				style: {
					padding: "16px",
				},
			});
			setErrors({});
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(`Failed to link summoner: ${error.message}`, {
					style: {
						padding: "16px",
					},
				});
				setSummonerInput("");
				return;
			}
			setErrors(error);
			return;
		},
	});

	const unlinkSummonerFromUserMutation = useMutation({
		mutationFn: async () => unlinkSummonerFromUser(user?.id ?? ""),
		onSuccess: () => {
			queryClient.setQueryData(["summoner", user?.id], null);
			queryClient.invalidateQueries({ queryKey: ["summoner", user?.id] });
			setSummonerInput("");
		},
		onError: (error) => {
			console.log(error);
		},
	});

	return (
		<div className="flex flex-col gap-2">
			<h2>Summoner Name</h2>
			<div className="flex gap-2 items-center">
				<input
					type="text"
					name="summonerName"
					value={summonerInput}
					placeholder="GameName#TagLine"
					onChange={handleChangeSummonerName}
					className="p-1 border border-accent rounded w-full s-md:text-base s-md:px-2 s-md:py-1"
					disabled={!!summonerName}
				/>
				{summonerName && summonerInput !== "" && (
					<button
						type="button"
						className="p-1 border border-accent rounded cursor-pointer hover:bg-accent hover:text-primary-light-6 transition-all"
						onClick={() => unlinkSummonerFromUserMutation.mutate()}
					>
						{unlinkSummonerFromUserMutation.isPending
							? "Deleting..."
							: "Unlink"}
					</button>
				)}
				{!summonerName && summonerInput !== "" && (
					<button
						type="button"
						className="p-1 border border-accent rounded cursor-pointer hover:bg-accent hover:text-primary-light-6 transition-all"
						onClick={() => linkSummonerToUserMutation.mutate()}
					>
						{linkSummonerToUserMutation.isPending
							? "Saving..."
							: "Save"}
					</button>
				)}
			</div>
			{errors.summonerName && (
				<p className="text-danger-light-4 text-sm">
					{errors.summonerName}
				</p>
			)}
		</div>
	);
};

export default SummonerInfo;
