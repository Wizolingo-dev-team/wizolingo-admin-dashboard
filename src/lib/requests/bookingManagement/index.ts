import { apiClient } from "@/lib/apiClient";
import type {
	BookingItem,
	BookingsAdminResponse,
	SingleBookingResponse,
	UpdateBookingStatusPayload,
} from "@/types/bookingManagement";

const BASE_URL = "/bookings";

export const bookingService = {
	getAllBookingsAdmin: async (params?: {
		page?: number;
		limit?: number;
		status?: string;
		eventType?: string;
		search?: string;
	}) => {
		return apiClient.get<BookingsAdminResponse>(
			`${BASE_URL}/admin/all`,
			"Failed to fetch bookings",
			params ? { params } : undefined,
		);
	},

	getBookingById: async (id: string) => {
		return apiClient.get<SingleBookingResponse>(
			`${BASE_URL}/admin/${id}`,
			"Failed to fetch booking inquiry",
		);
	},

	updateBookingStatus: async (id: string, payload: UpdateBookingStatusPayload) => {
		return apiClient.put<SingleBookingResponse>(
			`${BASE_URL}/admin/status/${id}`,
			payload,
			"Failed to update booking status",
		);
	},

	deleteBooking: async (id: string) => {
		return apiClient.delete<{ success: boolean; message: string }>(
			`${BASE_URL}/admin/${id}`,
			"Failed to delete booking inquiry",
		);
	},

	createBooking: async (payload: Partial<BookingItem>) => {
		return apiClient.post<SingleBookingResponse>(
			`${BASE_URL}/create`,
			payload,
			"Failed to submit booking inquiry",
		);
	},
};

