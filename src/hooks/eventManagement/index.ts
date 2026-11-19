import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/lib/requests/eventManagement";
import { useToast } from "@/hooks/useToast";
import type { UpdateTicketStatusPayload } from "@/types/eventManagement";

export const useGetAllEventsAdmin = () => {
	return useQuery({
		queryKey: ["adminEvents"],
		queryFn: async () => {
			const response = await eventService.getAllEventsAdmin();
			return response.data || [];
		},
		retry: 1,
	});
};

export const useCreateEvent = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: FormData) => eventService.createEvent(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
			toast.success(data.message || "Event created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create event");
		},
	});
};

export const useUpdateEvent = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
			eventService.updateEvent(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
			toast.success(data.message || "Event updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update event");
		},
	});
};

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => eventService.deleteEvent(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
			toast.success(data.message || "Event deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete event");
		},
	});
};

export const useGetTicketOrdersAdmin = (params?: { eventId?: string; status?: string }) => {
	return useQuery({
		queryKey: ["adminTicketOrders", params?.eventId || "all", params?.status || "all"],
		queryFn: async () => {
			const response = await eventService.getTicketOrdersAdmin(params);
			return {
				orders: response.data || [],
				summary: response.summary || {
					totalOrders: 0,
					totalTicketsSold: 0,
					totalRevenue: 0,
				},
			};
		},
		retry: 1,
	});
};

export const useUpdateTicketOrderStatus = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({
			orderId,
			payload,
		}: {
			orderId: string;
			payload: UpdateTicketStatusPayload;
		}) => eventService.updateTicketOrderStatus(orderId, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminTicketOrders"] });
			queryClient.invalidateQueries({ queryKey: ["adminEvents"] });
			toast.success(data.message || "Ticket order status updated");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update ticket order status");
		},
	});
};

