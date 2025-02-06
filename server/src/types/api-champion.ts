export interface Main {
	type: TypeApi;
	format: string;
	version: Version;
	data: { [key: string]: ChampionApi };
}

export interface ChampionApi {
	version: Version;
	id: string;
	key: string;
	name: string;
	title: string;
	blurb: string;
	info: InfoApi;
	image: ImageApi;
	tags: Tag[];
	partype: string;
	skins?: SkinApi[];
	stats: { [key: string]: number };
}

export interface ImageApi {
	full: string;
	sprite: SpriteApi;
	group: TypeApi;
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface SkinApi {
	id: string;
	name: string;
	num: number;
	chromas: boolean;
}

export enum TypeApi {
	Champion = "champion",
}

export enum SpriteApi {
	Champion0PNG = "champion0.png",
	Champion1PNG = "champion1.png",
	Champion2PNG = "champion2.png",
	Champion3PNG = "champion3.png",
	Champion4PNG = "champion4.png",
	Champion5PNG = "champion5.png",
}

export interface InfoApi {
	attack: number;
	defense: number;
	magic: number;
	difficulty: number;
}

export enum Tag {
	Assassin = "Assassin",
	Fighter = "Fighter",
	Mage = "Mage",
	Marksman = "Marksman",
	Support = "Support",
	Tank = "Tank",
}

export enum Version {
	V14231 = "14.23.1",
}
