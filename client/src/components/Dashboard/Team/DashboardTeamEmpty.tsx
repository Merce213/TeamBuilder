import { useState } from "react";
import CoreContainer from "../../CoreContainer";
import CreateTeamModal from "../../Teams/CreateTeamModal";

const DashboardTeamEmpty = () => {
	const [openModalCreateTeam, setOpenModalCreateTeam] =
		useState<boolean>(false);

	return (
		<>
			<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
				<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex flex-col p-4 gap-4 s-md:gap-6 rounded-lg shadow-md">
					<div className="flex flex-col items-center justify-center gap-4">
						<h2 className="text-2xl font-bold">
							No teams created yet or no one is selected
						</h2>
						<p className="text-center text-lg">
							If you haven't created any teams yet. Click the
							"Create a team" button to get started. Or if you
							have a team already created, select it from the
							dropdown menu.
						</p>
						<button
							className="btn btn-primary rounded-lg px-6 py-2"
							onClick={() => setOpenModalCreateTeam(true)}
						>
							Create a team
						</button>
					</div>
				</div>
			</CoreContainer>

			{openModalCreateTeam && (
				<CreateTeamModal
					openModalCreateTeam={openModalCreateTeam}
					setOpenModalCreateTeam={setOpenModalCreateTeam}
				/>
			)}
		</>
	);
};

export default DashboardTeamEmpty;
