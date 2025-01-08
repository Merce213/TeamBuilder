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
	members: GroupMembership[];
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
	role: string;
	joinedAt: Date;
	updatedAt: Date;
}
