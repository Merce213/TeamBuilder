import React from "react";
import { TeamBody } from "../../types/Team";
import { ReactSetState } from "../../types/ReactTypes";

interface TeamFormProps {
	teamData: TeamBody;
	setTeamData: ReactSetState<TeamBody>;
	errors: Record<string, string>;
	setErrors: ReactSetState<Record<string, string>>;
}

const TeamForm = ({
	teamData,
	setTeamData,
	errors,
	setErrors,
}: TeamFormProps) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setTeamData((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prevErrors) => {
				const newErrors = { ...prevErrors };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					Team Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Team Name"
					value={teamData.name}
					onChange={handleChange}
					className="mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
				/>
				{errors?.name && (
					<p className="text-danger-light-3 mt-2 text-sm">
						{errors.name}
					</p>
				)}
			</div>
			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-gray-700"
				>
					Description
				</label>
				<textarea
					id="description"
					name="description"
					placeholder="Team Description"
					value={teamData.description}
					onChange={handleChange}
					className="resize-none h-24 mt-1 block w-full px-3 py-2 border-2 rounded-md shadow-sm"
				/>
				{errors?.description && (
					<p className="text-danger-light-3 mt-2 text-sm">
						{errors.description}
					</p>
				)}
			</div>
		</div>
	);
};

export default TeamForm;
