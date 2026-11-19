import { apiClient } from "@/lib/apiClient";
import type {
	GetAllProductsParams,
	Product,
	ProductResponse,
} from "@/types/productManagement";

const BASE_URL = "/products";

export const productService = {
	createProduct: async (payload: FormData) => {
		return apiClient.post<ProductResponse<Product>>(
			`${BASE_URL}/create/product`,
			payload,
			"Failed to create product",
		);
	},

	updateProduct: async (id: string, payload: FormData) => {
		return apiClient.put<ProductResponse<Product>>(
			`${BASE_URL}/update/product/${id}`,
			payload,
			"Failed to update product",
		);
	},

	getAllProducts: async (params?: GetAllProductsParams) => {
		return apiClient.get<ProductResponse<Product[]>>(
			`${BASE_URL}/admin/all-products`,
			"Failed to fetch products",
			params ? { params } : undefined,
		);
	},

	getProductById: async (id: string) => {
		return apiClient.get<ProductResponse<Product>>(
			`${BASE_URL}/get-product/${id}`,
			"Failed to fetch product details",
		);
	},

	deleteProduct: async (id: string) => {
		return apiClient.delete<ProductResponse>(
			`${BASE_URL}/delete/product/${id}`,
			"Failed to delete product",
		);
	},
};

