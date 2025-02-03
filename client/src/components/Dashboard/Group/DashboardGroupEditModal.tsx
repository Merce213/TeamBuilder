import { ReactSetState } from "../../../types/ReactTypes";
import Modal from "../../Modal";

const DashboardGroupEditModal = ({
	openModalEditGroup,
	setOpenModalEditGroup,
}: {
	openModalEditGroup: boolean;
	setOpenModalEditGroup: ReactSetState<boolean>;
}) => {
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
						className="p-1 border border-accent rounded w-full s-md:text-base s-md:px-2 s-md:py-1"
						placeholder="Group name"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<p className="text-sm font-semibold">Group description</p>
					<textarea
						className="p-1 border border-accent rounded w-full s-md:text-base s-md:px-2 s-md:py-1 h-24 resize-none"
						placeholder="Group description"
					/>
				</div>

				<div className="flex flex-col gap-4">
					<button className="btn-primary-outline flex-1 p-2">
						Save
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default DashboardGroupEditModal;
