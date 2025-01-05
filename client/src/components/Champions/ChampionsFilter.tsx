import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChampionsFilters } from "../../hooks/useChampionsFilters";
import { useDebounce } from "../../hooks/useDebounce";
import {
	ChampionsFilters,
	Lane,
	laneLabels,
	laneOptions,
	Tag,
	tagLabels,
	tagOptions,
} from "../../types/Champion";

const ChampionsFilter = () => {
	const { name, tags, lanes, setFilters } = useChampionsFilters();

	const [searchQuery, setSearchQuery] = useState<ChampionsFilters["name"]>(
		name ?? ""
	);
	const debouncedSearchQuery = useDebounce(searchQuery);

	useEffect(() => {
		setFilters({ name: debouncedSearchQuery });
	}, [debouncedSearchQuery]);

	const handleTagToggle = (newTag: string) => {
		const updatedTags = tags.includes(newTag as Tag)
			? tags.filter((t) => t !== newTag)
			: [...tags, newTag];

		setFilters({ tag: updatedTags as ChampionsFilters["tag"] });
	};

	const handleLaneToggle = (newLane: string) => {
		const updatedLanes = lanes.includes(newLane as Lane)
			? lanes.filter((l) => l !== newLane)
			: [...lanes, newLane];

		setFilters({ lane: updatedLanes as ChampionsFilters["lane"] });
	};

	const handleClearSearch = () => {
		setSearchQuery("");
	};

	return (
		<div
			aria-label="champions-filters"
			className="filters p-4 rounded-lg shadow-lg"
		>
			<h2 className="mb-4 text-lg font-bold">Filters</h2>

			<div className="flex flex-col flex-wrap gap-4">
				<div className="flex flex-col gap-2 relative">
					<input
						type="text"
						id="search"
						placeholder="Search for a champion..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="p-2 border border-accent rounded w-full s-md:text-base s-md:px-4 s-md:py-2"
						aria-label="search-input"
					/>
					{searchQuery && (
						<button
							onClick={handleClearSearch}
							className="absolute animate-fade-in right-2 top-1/2 transform -translate-y-1/2 p-1 cursor-pointer bg-accent text-text rounded-full"
							aria-label="clear-search"
						>
							<X size={16} />
						</button>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm">Roles</label>
					<div className="flex flex-wrap gap-2">
						{tagOptions.map((tag) => (
							<button
								key={tag}
								className={`${
									tags.includes(tag)
										? "bg-accent-dark-2 shadow-lg"
										: "bg-secondary-dark-2 hover:bg-accent-dark-2 shadow-sm hover:shadow-lg"
								} cursor-pointer px-2 py-1 text-sm text-text rounded-full mr-2 mb-2 transition-all duration-300 inline-flex flex-wrap border-solid border s-md:text-base s-md:px-4 s-md:py-2`}
								onClick={() => handleTagToggle(tag)}
							>
								{tagLabels[tag]}
							</button>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm">Lanes</label>
					<div className="flex flex-wrap gap-2">
						{laneOptions.map((lane) => (
							<button
								key={lane}
								className={`${
									lanes.includes(lane)
										? "bg-accent-dark-2 shadow-lg"
										: "bg-secondary-dark-2 hover:bg-accent-dark-2 shadow-sm hover:shadow-lg"
								} cursor-pointer px-2 py-1 text-sm text-text rounded-full mr-2 mb-2 transition-all duration-300 inline-flex flex-wrap border-solid border s-md:text-base s-md:px-4 s-md:py-2`}
								onClick={() => handleLaneToggle(lane)}
							>
								{laneLabels[lane]}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChampionsFilter;
