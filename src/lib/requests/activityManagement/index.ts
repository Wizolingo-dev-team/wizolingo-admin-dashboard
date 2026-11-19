import { apiClient } from "@/lib/apiClient";
import type { ActivityLog, ActivityResponse } from "@/types/activityManagement";

const BASE_URL = "/activity";

export const activityService = {
	getAllActivities: async () => {
		return apiClient.get<ActivityResponse<ActivityLog[]>>(
			`${BASE_URL}/admin/all`,
			"Failed to fetch platform activity logs",
		);
	},

	getMyActivities: async () => {
		return apiClient.get<ActivityResponse<ActivityLog[]>>(
			`${BASE_URL}/my-activities`,
			"Failed to fetch your activity logs",
		);
	},
};

