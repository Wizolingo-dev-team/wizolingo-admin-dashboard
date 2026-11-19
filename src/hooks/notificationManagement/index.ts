import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/lib/requests/notificationManagement";
import { useToast } from "@/hooks/useToast";
import type { BroadcastNotificationPayload } from "@/types/notificationManagement";

export const useGetNotifications = () => {
	return useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const response = await notificationService.getAllNotifications();
			return response.data || [];
		},
	});
};

export const useGetAdminAllNotifications = () => {
	return useQuery({
		queryKey: ["adminAllNotifications"],
		queryFn: async () => {
			const response = await notificationService.getAdminAllNotifications();
			return response.data || [];
		},
	});
};

export const useMarkAllNotificationsRead = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: notificationService.markAsRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["adminAllNotifications"] });
			toast.success("All notifications marked as read");
		},
	});
};

export const useMarkOneNotificationRead = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => notificationService.markOneAsRead(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["adminAllNotifications"] });
		},
	});
};

export const useDeleteNotification = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (id: string) => notificationService.deleteNotification(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["adminAllNotifications"] });
			toast.success("Notification deleted");
		},
	});
};

export const useBroadcastNotification = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: (payload: BroadcastNotificationPayload) =>
			notificationService.broadcastNotification(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminAllNotifications"] });
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			toast.success(data.message || "Notification broadcasted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to broadcast notification");
		},
	});
};

