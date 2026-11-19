export type Timestamps = {
	createdAt: string;
	updatedAt: string;
};

export type MongoEntity = Timestamps & {
	_id: string;
};

export type CloudinaryAsset = {
	public_id: string;
	url: string;
};

export type ApiResponse<T = unknown> = {
	success: boolean;
	message: string;
	data?: T;
	count?: number;
};

export type ApiDataResponse<T> = {
	success: boolean;
	message?: string;
	data: T;
	count?: number;
};

