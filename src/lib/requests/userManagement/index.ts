import { apiClient } from "@/lib/apiClient";
import type { User, UserResponse, UpdateUserRolePayload } from "@/types/userManagement";

const BASE_URL = "/users/admin";

export const userManagementService = {
	getAllUsers: async () => {
		return apiClient.get<UserResponse<User[]>>(
			`${BASE_URL}/all-users`,
			"Failed to fetch users",
		);
	},

	updateUserRole: async (id: string, payload: UpdateUserRolePayload) => {
		return apiClient.put<UserResponse<User>>(
			`${BASE_URL}/update-user-role/${id}`,
			payload,
			"Failed to update user role",
		);
	},
};

