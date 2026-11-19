import { apiClient } from "@/lib/apiClient";
import type {
	Category,
	CategoryListResponse,
	CategoryResponse,
	CategoryType,
	CreateCategoryPayload,
	CreateCategoryResponse,
	UpdateCategoryPayload,
} from "@/types/categoryManagement";

const BASE_URL = "/categories";

export const categoryService = {
	createCategory: async (payload: CreateCategoryPayload) => {
		return apiClient.post<CreateCategoryResponse>(
			`${BASE_URL}/create`,
			payload,
			"Failed to create category",
		);
	},

	getAllCategories: async (categoryType?: CategoryType) => {
		return apiClient.get<CategoryListResponse>(
			`${BASE_URL}/get-all-categories`,
			"Failed to fetch categories",
			categoryType ? { params: { categoryType } } : undefined,
		);
	},

	updateCategory: async (id: string, payload: UpdateCategoryPayload) => {
		return apiClient.put<CategoryResponse<Category>>(
			`${BASE_URL}/update/${id}`,
			payload,
			"Failed to update category",
		);
	},

	deleteCategory: async (id: string) => {
		return apiClient.delete<CategoryResponse>(
			`${BASE_URL}/delete/${id}`,
			"Failed to delete category",
		);
	},
};

