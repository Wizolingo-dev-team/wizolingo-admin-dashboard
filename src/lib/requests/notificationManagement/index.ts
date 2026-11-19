import { apiClient } from "@/lib/apiClient";
import type {
	BroadcastNotificationPayload,
	Notification,
	NotificationResponse,
} from "@/types/notificationManagement";

const BASE_URL = "/notifications";

export const notificationService = {
	getAllNotifications: async () => {
		return apiClient.get<NotificationResponse<Notification[]>>(
			`${BASE_URL}/get-all-notifications`,
			"Failed to fetch notifications",
		);
	},

	markAsRead: async () => {
		return apiClient.post<NotificationResponse<Notification[]>>(
			`${BASE_URL}/mark-as-read`,
			{},
			"Failed to mark notifications as read",
		);
	},

	markOneAsRead: async (id: string) => {
		return apiClient.post<NotificationResponse<Notification>>(
			`${BASE_URL}/mark-as-read/${id}`,
			{},
			"Failed to mark notification as read",
		);
	},

	deleteNotification: async (id: string) => {
		return apiClient.delete<NotificationResponse>(
			`${BASE_URL}/delete-notification/${id}`,
			"Failed to delete notification",
		);
	},

	deleteAllNotifications: async () => {
		return apiClient.delete<NotificationResponse>(
			`${BASE_URL}/delete-all-notifications`,
			"Failed to clear notifications",
		);
	},

	getAdminAllNotifications: async () => {
		return apiClient.get<NotificationResponse<Notification[]>>(
			`${BASE_URL}/admin/all-notifications`,
			"Failed to fetch platform notifications",
		);
	},

	broadcastNotification: async (payload: BroadcastNotificationPayload) => {
		return apiClient.post<NotificationResponse<Notification[]>>(
			`${BASE_URL}/admin/broadcast`,
			payload,
			"Failed to broadcast notification",
		);
	},
};

