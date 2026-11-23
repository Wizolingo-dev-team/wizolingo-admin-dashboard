import { apiClient } from "@/lib/apiClient";
import type {
	BlogCategoryItem,
	BlogItem,
	BlogsAdminResponse,
	SingleBlogResponse,
	UploadInlineImageResponse,
} from "@/types/blogManagement";

const BASE_URL = "/blogs";

export const blogService = {
	getAllBlogsAdmin: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		category?: string;
		status?: string;
	}) => {
		return apiClient.get<BlogsAdminResponse>(
			`${BASE_URL}/admin/all`,
			"Failed to fetch blog posts",
			params ? { params } : undefined,
		);
	},

	getBlogByIdOrSlug: async (slugOrId: string) => {
		return apiClient.get<SingleBlogResponse>(
			`${BASE_URL}/${slugOrId}`,
			"Failed to fetch blog details",
		);
	},

	createBlog: async (payload: FormData) => {
		return apiClient.post<SingleBlogResponse>(
			`${BASE_URL}/create`,
			payload,
			"Failed to create blog post",
		);
	},

	updateBlog: async (id: string, payload: FormData) => {
		return apiClient.put<SingleBlogResponse>(
			`${BASE_URL}/update/${id}`,
			payload,
			"Failed to update blog post",
		);
	},

	deleteBlog: async (id: string) => {
		return apiClient.delete<{ success: boolean; message: string }>(
			`${BASE_URL}/delete/${id}`,
			"Failed to delete blog post",
		);
	},

	uploadInlineImage: async (formData: FormData) => {
		return apiClient.post<UploadInlineImageResponse>(
			`${BASE_URL}/upload-inline-image`,
			formData,
			"Failed to upload inline image",
		);
	},

	getCategories: async () => {
		return apiClient.get<{ success: boolean; data: BlogCategoryItem[] }>(
			`${BASE_URL}/categories`,
			"Failed to fetch categories",
		);
	},

	getTags: async () => {
		return apiClient.get<{ success: boolean; data: string[] }>(
			`${BASE_URL}/tags`,
			"Failed to fetch tags",
		);
	},
};

