import { apiClient } from "@/lib/apiClient";
import type {
	EventItem,
	EventResponse,
	TicketOrder,
	TicketOrdersAdminResponse,
	UpdateTicketStatusPayload,
} from "@/types/eventManagement";

const BASE_URL = "/events";

export const eventService = {
	getAllEventsAdmin: async () => {
		return apiClient.get<EventResponse<EventItem[]>>(
			`${BASE_URL}/admin/all-events`,
			"Failed to fetch events",
		);
	},

	createEvent: async (payload: FormData) => {
		return apiClient.post<EventResponse<EventItem>>(
			`${BASE_URL}/admin/create`,
			payload,
			"Failed to create event",
		);
	},

	updateEvent: async (id: string, payload: FormData) => {
		return apiClient.put<EventResponse<EventItem>>(
			`${BASE_URL}/admin/update/${id}`,
			payload,
			"Failed to update event",
		);
	},

	deleteEvent: async (id: string) => {
		return apiClient.delete<EventResponse>(
			`${BASE_URL}/admin/delete/${id}`,
			"Failed to delete event",
		);
	},

	getTicketOrdersAdmin: async (params?: { eventId?: string; status?: string }) => {
		return apiClient.get<TicketOrdersAdminResponse>(
			`${BASE_URL}/admin/ticket-orders`,
			"Failed to fetch ticket orders",
			params ? { params } : undefined,
		);
	},

	updateTicketOrderStatus: async (orderId: string, payload: UpdateTicketStatusPayload) => {
		return apiClient.put<EventResponse<TicketOrder>>(
			`${BASE_URL}/admin/update-ticket-status/${orderId}`,
			payload,
			"Failed to update ticket order status",
		);
	},
};

