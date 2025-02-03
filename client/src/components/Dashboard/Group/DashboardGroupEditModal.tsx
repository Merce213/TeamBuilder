import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { updateGroup } from "../../../api/groups";
import { useAuth } from "../../../contexts/AuthContext";
import { useGroup } from "../../../contexts/GroupContext";
import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";

const DashboardGroupEditModal = ({
	openModalEditGroup,
	setOpenModalEditGroup,
}: {
	openModalEditGroup: boolean;
	setOpenModalEditGroup: ReactSetState<boolean>;
}) => {
	const { user } = useAuth();
	const { groupData } = useGroup();
	const queryClient = useQueryClient();

	const [groupInput, setGroupInput] = useState({
		name: groupData?.name ?? "",
		description: groupData?.description ?? "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const updateGroupMutation = useMutation({
		mutationFn: (updatedGroupData: Partial<typeof groupInput>) =>
			updateGroup(user?.id ?? "", groupData?.id ?? "", updatedGroupData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
			queryClient.invalidateQueries({
				queryKey: ["group", user?.id, groupData?.id],
			});
			toast.success("Group updated successfully", {
				style: {
					padding: "16px",
				},
			});
			setOpenModalEditGroup(false);
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(
					`Failed to update user information: ${error.message}`,
					{
						style: {
							padding: "16px",
						},
					}
				);
				return;
			}
			setErrors(error);
			return;
		},
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setGroupInput((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSave = () => {
		const updatedFields = Object.entries(groupInput).reduce(
			(acc, [key, value]) => {
				if (
					value !== "" &&
					value !== groupData?.[key as keyof typeof groupData]
				) {
					acc[key as keyof typeof groupInput] = value;
				}
				return acc;
			},
			{} as Partial<typeof groupInput>
		);

		if (Object.keys(updatedFields).length > 0) {
			updateGroupMutation.mutate(updatedFields);
		}
	};

	const hasChanges = Object.entries(groupInput).some(
		([key, value]) =>
			value !== "" && value !== groupData?.[key as keyof typeof groupData]
	);

	return (
		<Modal
			isOpen={openModalEditGroup}
			onClose={() => setOpenModalEditGroup(false)}
			closeOnClickOutside={true}
		>
			<div id="modal-content" className="flex flex-col gap-5">
				<div className="flex flex-col gap-4">
					<p className="text-base font-semibold font-sora s-sm:text-lg">
						Edit group
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<p className="text-sm font-semibold">Group name</p>
					<input
						type="text"
						name="name"
						value={groupInput.name}
						onChange={handleInputChange}
						className="p-1 border border-accent rounded w-full s-md:text-base s-md:px-2 s-md:py-1"
						placeholder="Group name"
					/>
					{errors.name && (
						<p className="text-danger-light-3 text-sm">
							{errors.name}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<p className="text-sm font-semibold">Group description</p>
					<textarea
						name="description"
						value={groupInput.description}
						onChange={handleInputChange}
						className="p-1 border border-accent rounded w-full s-md:text-base s-md:px-2 s-md:py-1 h-24 resize-none"
						placeholder="Group description"
					/>
					{errors.description && (
						<p className="text-danger-light-3 text-sm">
							{errors.description}
						</p>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<button
						className="btn-primary flex-1 p-2"
						onClick={handleSave}
						disabled={!hasChanges || updateGroupMutation.isPending}
					>
						{updateGroupMutation.isPending ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupEditModal;
