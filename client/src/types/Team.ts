import { Champion, Lane } from "./Champion";

export interface Team {
	id: string;
	groupId: string;
	createdById: string;
	name: string;
	description?: string;
	members: TeamMembership[];
	createdAt: Date;
	updatedAt: Date;
}

export interface TeamMembership {
	id: string;
	teamId: string;
	userId?: string;
	championId: number;
	champion?: Champion;
	lane: Lane;
	joinedAt: Date;
	updatedAt: Date;
}

export interface TeamBody {
	name: string;
	description?: string;
	members: (TeamMembershipBody | undefined)[];
}

export interface TeamMembershipBody {
	championId: number;
	lane: Lane | "";
	userId?: string;
}
