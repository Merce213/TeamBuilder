import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import { createGroup } from "../../api/groups";
import { useAuth } from "../../contexts/AuthContext";
import { GroupBody } from "../../types/Group";
import { ReactSetState } from "../../types/ReactTypes";
import Modal from "../Modal";

interface CreateGroupModalProps {
	openModalCreateGroup: boolean;
	setOpenModalCreateGroup: ReactSetState<boolean>;
}

const CreateGroupModal = ({
	openModalCreateGroup,
	setOpenModalCreateGroup,
}: CreateGroupModalProps) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();

	const [createGroupData, setCreateGroupData] = useState<GroupBody>({
		name: "",
		description: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [errorMessage, setErrorMessage] = useState<string>("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setCreateGroupData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const { mutate } = useMutation({
		mutationFn: async (data: GroupBody) =>
			createGroup(user?.id ?? "", data),
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: ["groups", user?.id] });
			setOpenModalCreateGroup(false);
		},
		onError: (error) => {
			if (error instanceof Error) {
				setErrorMessage(error.message);
				toast.error(error.message, {
					style: {
						padding: "16px",
					},
				});
				return;
			}
			setErrors(error);
			return;
		},
	});

	const handleCreateGroupModal = (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) {
			return;
		}

		const newGroup: GroupBody = {
			name: createGroupData.name,
			description: createGroupData.description,
		};

		mutate(newGroup);

		if (errors || errorMessage) {
			return;
		}

		setCreateGroupData({
			name: "",
			description: "",
		});
		setOpenModalCreateGroup(false);
	};

	return (
		<Modal
			isOpen={openModalCreateGroup}
			onClose={() => setOpenModalCreateGroup(false)}
			closeOnClickOutside={true}
		>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<p className="font-sora">Create Group</p>
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<input
							type="text"
							name="name"
							placeholder="Group Name"
							value={createGroupData.name}
							onChange={handleChange}
							className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
						/>
						{errors.name && (
							<p className="text-danger-light-3">{errors.name}</p>
						)}
					</div>
					<div className="flex flex-col gap-2">
						<textarea
							name="description"
							placeholder="Group Description (Optional)"
							value={createGroupData.description || ""}
							onChange={handleChange}
							className="resize-none h-24 mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
						/>
					</div>
				</div>

				<div className="flex justify-end items-center gap-4">
					<button
						type="button"
						className="btn-danger-outline p-2"
						onClick={() => setOpenModalCreateGroup(false)}
					>
						Cancel
					</button>
					<button
						type="button"
						className="btn-primary p-2"
						onClick={handleCreateGroupModal}
					>
						Create Group
					</button>
				</div>
			</div>
		</Modal>
	);
};
export default CreateGroupModal;
