export enum QueueType {
	RANKED_SOLO_5x5 = "RANKED_SOLO_5x5",
	RANKED_FLEX_SR = "RANKED_FLEX_SR",
}

/* 
ResponseSummonerProfile from getSummonerProfile api
*/
export interface ResponseSummonerProfile {
	message: string;
	summonerDetails: SummonerDetails;
}

export interface ResponseFavoriteLanes {
	favoriteLanes: FavoriteLane[];
}

export interface ResponseFavoriteChampions {
	favoriteChampions: FavoriteChampion[];
}

export interface SummonerDetails {
	summonerInfo: SummonerInfo;
	summonerData: SummonerData;
	leagueData: RankInfo[];
}

export interface SummonerInfo {
	puuid: string;
	gameName: string;
	tagLine: string;
	summonerName: string;
}

export interface SummonerData {
	id: string;
	accountId: string;
	puuid: string;
	profileIconId: number;
	revisionDate: number;
	summonerLevel: number;
}

export interface RankInfo {
	leagueId: string;
	queueType: string;
	tier: string;
	rank: string;
	summonerId: string;
	leaguePoints: number;
	wins: number;
	losses: number;
	veteran: boolean;
	inactive: boolean;
	freshBlood: boolean;
	hotStreak: boolean;
}

export interface FavoriteChampion {
	championId: number;
	championName: string;
	championNameId: string;
}

export interface FavoriteLane {
	laneId: string;
	laneName: string;
}
