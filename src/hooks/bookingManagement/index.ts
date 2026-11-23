import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/lib/requests/bookingManagement";
import { useToast } from "@/hooks/useToast";
import type { BookingItem, UpdateBookingStatusPayload } from "@/types/bookingManagement";

export const useGetAllBookingsAdmin = (params?: {
	page?: number;
	limit?: number;
	status?: string;
	eventType?: string;
	search?: string;
}) => {
	return useQuery({
		queryKey: [
			"adminBookings",
			params?.page || 1,
			params?.limit || 20,
			params?.status || "all",
			params?.eventType || "all",
			params?.search || "",
		],
		queryFn: async () => {
			const response = await bookingService.getAllBookingsAdmin(params);
			return response;
		},
		retry: 1,
	});
};

export const useGetBookingDetails = (id: string) => {
	return useQuery({
		queryKey: ["bookingDetails", id],
		queryFn: async () => {
			if (!id) return null;
			const response = await bookingService.getBookingById(id);
			return response.data || null;
		},
		enabled: Boolean(id),
	});
};

export const useUpdateBookingStatus = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingStatusPayload }) =>
			bookingService.updateBookingStatus(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
			toast.success(data.message || "Booking updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update booking");
		},
	});
};

export const useDeleteBooking = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => bookingService.deleteBooking(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
			toast.success(data.message || "Booking deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete booking");
		},
	});
};

export const useCreateBooking = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: Partial<BookingItem>) => bookingService.createBooking(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
			toast.success(data.message || "Booking inquiry submitted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to submit booking inquiry");
		},
	});
};

