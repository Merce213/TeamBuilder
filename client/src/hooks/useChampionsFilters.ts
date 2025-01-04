import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { ChampionsFilters, Lane, Tag } from "../types/Champion";

function isValidTag(value: string): value is Tag {
	return Object.values(Tag).includes(value as Tag);
}

function isValidLane(value: string): value is Lane {
	return Object.values(Lane).includes(value as Lane);
}

export function useChampionsFilters() {
	const [searchParams, setSearchParams] = useSearchParams();

	const name = (searchParams.get("name") as ChampionsFilters["name"]) || "";
	const tags = searchParams.getAll("tag").filter(isValidTag);
	const lanes = searchParams.getAll("lane").filter(isValidLane);

	const setFilters = useCallback(
		(filters: ChampionsFilters) => {
			const newParams = new URLSearchParams(searchParams);

			Object.keys(filters).forEach((key) => {
				const value = filters[key as keyof ChampionsFilters];

				if (Array.isArray(value)) {
					newParams.delete(key);
					value.forEach((v) => newParams.append(key, v));
				} else if (value) {
					newParams.set(key, value);
				} else {
					newParams.delete(key);
				}
			});

			setSearchParams(newParams);
		},
		[setSearchParams]
	);

	return {
		searchParams,
		name,
		tags,
		lanes,
		setFilters,
	};
}
