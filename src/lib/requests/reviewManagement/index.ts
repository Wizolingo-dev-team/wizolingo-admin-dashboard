import { apiClient } from "@/lib/apiClient";
import type { ReviewAdmin, ReviewAdminResponse } from "@/types/reviewManagement";

const BASE_URL = "/users";

export const reviewAdminService = {
	getAllReviews: async () => {
		return apiClient.get<ReviewAdminResponse<ReviewAdmin[]>>(
			`${BASE_URL}/admin/get-all-reviews`,
			"Failed to fetch all reviews",
		);
	},
};

