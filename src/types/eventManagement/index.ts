import type { ApiResponse, MongoEntity } from "@/types/common";
import type { PaymentMethod, PaymentStatus } from "@/types/orderManagement";

export type EventStatus =
	| "UPCOMING"
	| "ON SALE"
	| "SOLD OUT"
	| "PAST SHOW"
	| "CANCELLED"
	| "DRAFT";

export type EventArtist = {
	_id?: string;
	name: string;
	stage: string;
	performanceTime: string;
	imageUrl: string;
};

export type TicketTier = {
	_id?: string;
	name: string;
	description: string;
	price: number;
	currency: string;
	totalQuantity: number;
	soldQuantity: number;
	isActive: boolean;
};

export type EventItem = MongoEntity & {
	title: string;
	slug: string;
	description: string;
	startDate: string;
	endDate?: string;
	dateLabel: string;
	time: string;
	venue: string;
	location: string;
	mapEmbedUrl: string;
	latitude?: number;
	longitude?: number;
	eventType: string;
	status: EventStatus;
	websiteUrl: string;
	organizedBy: string;
	flyerUrl: string;
	artists: EventArtist[];
	ticketTiers: TicketTier[];
	isFeatured: boolean;
	isActive: boolean;
	shareUrl?: string;
};

export type TicketOrderStatus = "Processing" | "Confirmed" | "Checked In" | "Cancelled";

export type PurchasedTicketItem = {
	tierId: string;
	tierName: string;
	unitPrice: number;
	quantity: number;
	subtotal: number;
};

export type TicketOrder = MongoEntity & {
	event:
		| string
		| Pick<
				EventItem,
				"_id" | "title" | "slug" | "venue" | "location" | "startDate"
		  >;
	user:
		| string
		| {
				_id: string;
				firstName: string;
				lastName: string;
				email: string;
		  };
	attendeeName: string;
	email: string;
	phone: string;
	tickets: PurchasedTicketItem[];
	totalAmount: number;
	currency: string;
	ticketCode: string;
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	paypalOrderId: string;
	transactionRef?: string;
	transaction_id?: string | number | Record<string, unknown>;
	status: TicketOrderStatus;
};

export type TicketSalesSummary = {
	totalOrders: number;
	totalTicketsSold: number;
	totalRevenue: number;
};

export type TicketOrdersAdminResponse = {
	success: boolean;
	summary: TicketSalesSummary;
	data: TicketOrder[];
};

export type UpdateTicketStatusPayload = {
	status?: TicketOrderStatus;
	paymentStatus?: PaymentStatus;
};

export type EventResponse<T = unknown> = ApiResponse<T>;

