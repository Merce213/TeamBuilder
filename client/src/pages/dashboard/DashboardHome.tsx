import CoreContainer from "../../components/CoreContainer";

const DashboardHome = () => {
	return (
		<CoreContainer className="h-screen-navbar flex flex-col items-center justify-center">
			<div className="bg-secondary-dark-6 w-full max-w-screen-lg flex p-4 gap-4 s-md:gap-8 rounded-lg shadow-md">
				<h1>Dashboard</h1>
			</div>
		</CoreContainer>
	);
};

export default DashboardHome;
