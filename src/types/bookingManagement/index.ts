import type { ApiResponse, MongoEntity } from "@/types/common";

export type BookingStatus =
	| "pending"
	| "reviewed"
	| "contacted"
	| "confirmed"
	| "rejected"
	| "completed";

export type BookingEventType =
	| "concert"
	| "festival"
	| "private"
	| "corporate"
	| "tv-radio"
	| "Work-with-me"
	| "other"
	| string;

export type BookingItem = MongoEntity & {
	fullName: string;
	email: string;
	phone?: string;
	eventType: BookingEventType;
	eventDate?: string;
	country?: string;
	budget?: string;
	message: string;
	status: BookingStatus;
	adminNotes?: string;
	ipAddress?: string;
};

export type BookingsAdminResponse = {
	success: boolean;
	data: BookingItem[];
	total: number;
	currentPage: number;
	totalPages: number;
};

export type SingleBookingResponse = ApiResponse<BookingItem>;

export type UpdateBookingStatusPayload = {
	status?: BookingStatus;
	adminNotes?: string;
};

