export type PublicObject = {
	id: string;
	name: string;
	createdAt: Date;
};

export type S3Object = {
	key: string;
	url?: string;
	size?: number;
	lastModified?: Date;
};
