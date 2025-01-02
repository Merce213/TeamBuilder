import React, { useEffect, useState } from "react";
import { getChampions } from "../api/champions";
import keys from "../utils/keys";
import { Link } from "react-router-dom";

const Champions = () => {
	const [champions, setChampions] = useState([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		const fetchChampions = async () => {
			try {
				const response = await getChampions();
				console.log("response champions", response);
				if (!response.ok) {
					const errorData = await response.json();
					setError(errorData.error);
					return;
				}
				const data = await response.json();
				console.log("data champions", data);
				setChampions(data);
			} catch (error) {
				console.error("Error fetching champions:", error);
				setError(
					"An error occurred while fetching champions. Please try again."
				);
			} finally {
				setLoading(false);
			}
		};
		fetchChampions();
	}, []);

	return (
		<div
			aria-label="champions-home"
			className="flex flex-col justify-center p-4 gap-8 bg-secondary-dark-6"
		>
			<div>
				<input type="text" placeholder="Search for a champion" />
			</div>
			<section aria-label="champions-grid" className="champions-grid">
				{loading && <p>Loading...</p>}
				{error && <p>{error}</p>}
				{champions?.map((champion) => (
					<Link
						to={`/champions/${champion.nameId.toLowerCase()}`}
						key={champion.id}
					>
						<div className="flex items-center justify-center overflow-hidden">
							<img
								src={`${keys.CHAMPION_IMG_SQUARE}/${champion.nameId}.png`}
								alt={champion.name}
								className="w-full transition-all cursor-pointer hover:scale-105"
							/>
						</div>
						<p className="text-sm s-sm:text-md mt-2 truncate">
							{champion.name}
						</p>
					</Link>
				))}
			</section>
		</div>
	);
};

export default Champions;
