import { apiClient } from "@/lib/apiClient";
import type {
	ChangePasswordPayload,
	ChangePasswordResponse,
	UpdateProfileResponse,
} from "@/types/profileManagement";
import type { AdminUser } from "@/types/authManagement";
import type { ApiResponse } from "@/types/common";

const BASE_URL = "/profile";

export const profileService = {
	getProfile: async () => {
		return apiClient.get<ApiResponse<AdminUser>>(
			`${BASE_URL}`,
			"Failed to fetch profile information",
		);
	},

	updateProfile: async (payload: FormData) => {
		return apiClient.put<UpdateProfileResponse>(
			`${BASE_URL}/update`,
			payload,
			"Failed to update profile information",
		);
	},

	changePassword: async (payload: ChangePasswordPayload) => {
		return apiClient.put<ChangePasswordResponse>(
			`${BASE_URL}/change-password`,
			payload,
			"Failed to change account password",
		);
	},
};

