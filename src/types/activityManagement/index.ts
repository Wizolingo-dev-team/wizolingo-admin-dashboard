import type { ApiResponse, MongoEntity } from "@/types/common";

export type ActivityAction =
	| "LOGIN"
	| "ADMIN_LOGIN"
	| "ORDER_CREATED"
	| "PAYMENT_COMPLETED"
	| "TICKET_PURCHASED"
	| "DIGITAL_DOWNLOADED"
	| "WISHLIST_UPDATED"
	| "LOGOUT"
	| "PROFILE_UPDATED"
	| "PASSWORD_CHANGED"
	| "NEWSLETTER_SENT";

export type ActivityLog = MongoEntity & {
	user:
		| string
		| {
				_id: string;
				firstName: string;
				lastName: string;
				email: string;
				role: string;
		  };
	action: ActivityAction;
	details: string;
	ipAddress?: string;
};

export type ActivityResponse<T = unknown> = ApiResponse<T>;

