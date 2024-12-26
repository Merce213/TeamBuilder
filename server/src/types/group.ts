export enum GroupRole {
	Member = "MEMBER",
	Admin = "ADMIN",
	Owner = "OWNER",
}

export interface UpdateGroupData {
	name?: string;
	description?: string;
	members?: {
		connect?: { userId: string }[];
		disconnect?: { userId: string }[];
	};
}
