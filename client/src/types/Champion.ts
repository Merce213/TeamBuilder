export enum Tag {
	Assassin = "assassin",
	Fighter = "fighter",
	Mage = "mage",
	Marksman = "marksman",
	Support = "support",
	Tank = "tank",
}

export const tagOptions = Object.values(Tag);
export const tagLabels = {
	[Tag.Assassin]: "Assassin",
	[Tag.Fighter]: "Fighter",
	[Tag.Mage]: "Mage",
	[Tag.Marksman]: "Marksman",
	[Tag.Support]: "Support",
	[Tag.Tank]: "Tank",
};

export enum Lane {
	TOP = "top",
	JUNGLE = "jungle",
	MID = "mid",
	ADC = "adc",
	SUPPORT = "support",
}

export const laneOptions = Object.values(Lane);
export const laneLabels = {
	[Lane.TOP]: "Top",
	[Lane.JUNGLE]: "Jungle",
	[Lane.MID]: "Mid",
	[Lane.ADC]: "Adc",
	[Lane.SUPPORT]: "Support",
};

export interface ChampionsFilters {
	name?: string;
	tag?: Tag[];
	lane?: Lane[];
}

export interface Champion {
	id: number;
	nameId: string;
	name: string;
	title: string;
	blurb: string;
	lore: string;
	lanes: Lane[];
	tags: Tag[];
	info: Info;
	stats: Stats;
	skins: Skin[];
	image: Image;
}

export interface Info {
	id: number;
	championId: number;
	attack: number;
	defense: number;
	magic: number;
	difficulty: number;
}

export interface Stats {
	id: number;
	championId: number;
	hp: number;
	hpPerLevel: number;
	mp: number;
	mpPerLevel: number;
	moveSpeed: number;
	armor: number;
	armorPerLevel: number;
	spellBlock: number;
	spellBlockPerLevel: number;
	attackRange: number;
	hpRegen: number;
	hpRegenPerLevel: number;
	mpRegen: number;
	mpRegenPerLevel: number;
	crit: number;
	critPerLevel: number;
	attackDamage: number;
	attackDamagePerLevel: number;
	attackSpeedPerLevel: number;
	attackSpeed: number;
}

export interface Skin {
	id: number;
	championId: number;
	skinId: string;
	num: number;
	name: string;
}

export interface Image {
	id: number;
	championId: number;
	full: string;
	sprite: string;
}
