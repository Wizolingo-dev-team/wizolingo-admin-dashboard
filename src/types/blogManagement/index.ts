import type { ApiResponse, MongoEntity } from "@/types/common";

export type BlogStatus = "Draft" | "Published";

export type InlineImageItem = {
	_id?: string;
	url: string;
	public_id?: string;
	uploadedAt?: string;
};

export type BlogItem = MongoEntity & {
	title: string;
	slug: string;
	excerpt?: string;
	content: string;
	category: string;
	author: string;
	readTime: string;
	coverImage?: string;
	coverImagePublicId?: string;
	inlineImages?: InlineImageItem[];
	tags?: string[];
	status: BlogStatus;
	isPublished: boolean;
	views: number;
	date: string;
	isoDate?: string;
	createdBy?: string | { _id: string; firstName?: string; lastName?: string; email?: string };
};

export type BlogCategoryItem = {
	name: string;
	count: number;
};

export type BlogsAdminResponse = {
	success: boolean;
	data: BlogItem[];
	total: number;
	currentPage: number;
	totalPages: number;
};

export type SingleBlogResponse = ApiResponse<BlogItem>;

export type UploadInlineImageResponse = {
	success: boolean;
	url: string;
	public_id: string;
	message?: string;
};

