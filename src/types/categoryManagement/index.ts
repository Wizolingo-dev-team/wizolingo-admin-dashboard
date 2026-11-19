import type { ApiDataResponse, ApiResponse, MongoEntity } from "@/types/common";

export type CategoryType = "merch" | "digital_music" | "general";

export type SubCategory = {
	_id: string;
	subcategoryName: string;
	createdAt?: string;
	updatedAt?: string;
};

export type Category = MongoEntity & {
	categoryName: string;
	categoryType: CategoryType;
	subcategories: SubCategory[];
};

export type CreateCategoryPayload = {
	categoryName: string;
	categoryType?: CategoryType;
	subcategories?: Array<{ subcategoryName: string }>;
};

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type CategoryResponse<T = unknown> = ApiResponse<T>;
export type CategoryListResponse = ApiDataResponse<Category[]>;
export type CreateCategoryResponse = ApiDataResponse<Category>;

