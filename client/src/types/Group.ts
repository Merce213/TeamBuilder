export enum GroupRole {
	OWNER = "OWNER",
	ADMIN = "ADMIN",
	MEMBER = "MEMBER",
}

export interface Group {
	id: string;
	createdById: string;
	name: string;
	description: string | null;
	createdAt: Date;
	updatedAt: Date;
	members: GroupMembershipExtraInfo[];
}

export interface GroupCreate {
	name: string;
	description: string | null;
	members?: { userId: string }[];
}

export interface GroupMembership {
	id: string;
	groupId: string;
	userId: string;
	role: GroupRole;
	joinedAt: Date;
	updatedAt: Date;
}

export interface GroupMembershipExtraInfo extends GroupMembership {
	avatar?: string;
	username?: string;
	email?: string;
	summonerName?: string;
}

export interface ResponseGroup {
	message: string;
	group: Group;
}
