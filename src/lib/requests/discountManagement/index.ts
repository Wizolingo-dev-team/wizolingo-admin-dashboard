import { apiClient } from "@/lib/apiClient";
import type {
	CreateDiscountPayload,
	Discount,
	DiscountResponse,
	UpdateDiscountPayload,
} from "@/types/discountManagement";

const BASE_URL = "/discounts";

export const discountService = {
	createDiscount: async (payload: CreateDiscountPayload) => {
		return apiClient.post<DiscountResponse<Discount>>(
			`${BASE_URL}/create`,
			payload,
			"Failed to create discount",
		);
	},

	getAllDiscounts: async () => {
		return apiClient.get<DiscountResponse<Discount[]>>(
			`${BASE_URL}/admin/all`,
			"Failed to fetch discounts",
		);
	},

	updateDiscount: async (id: string, payload: UpdateDiscountPayload) => {
		return apiClient.put<DiscountResponse<Discount>>(
			`${BASE_URL}/update/${id}`,
			payload,
			"Failed to update discount",
		);
	},

	deleteDiscount: async (id: string) => {
		return apiClient.delete<DiscountResponse>(
			`${BASE_URL}/delete/${id}`,
			"Failed to delete discount",
		);
	},
};

