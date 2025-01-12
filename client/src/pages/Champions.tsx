import ChampionsFilter from "../components/Champions/ChampionsFilter";
import ChampionsList from "../components/Champions/ChampionsList";

const Champions = () => {
	return (
		<div className="py-4 px-5 container mt-16 min-h-navbar">
			<div
				aria-label="champions-home"
				className="flex flex-col justify-center p-4 gap-8 bg-secondary-dark-6"
			>
				<ChampionsFilter />
				<ChampionsList />
			</div>
		</div>
	);
};

export default Champions;
