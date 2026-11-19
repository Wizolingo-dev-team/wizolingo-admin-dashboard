import type { ApiResponse, MongoEntity } from "@/types/common";
import type { ProductType } from "@/types/productManagement";

export type OrderType = "merch" | "digital" | "mixed";
export type PaymentMethod = "paypal" | "manual";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type OrderStatus =
	| "Processing"
	| "Payment Confirmed"
	| "On the way"
	| "Delivered"
	| "Cancelled";

export type OrderProductItem = {
	_id: string;
	productName: string;
	productType: ProductType;
	price: number;
	quantity: number;
	size?: string;
	color?: string;
	attachments?: string[];
};

export type OrderUserSummary = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
};

export type Order = MongoEntity & {
	products: OrderProductItem[];
	orderType: OrderType;
	transaction_id?: string | number | Record<string, unknown>;
	transactionRef?: string;
	paypalOrderId: string;
	paymentMethod: PaymentMethod;
	paymentStatus: PaymentStatus;
	currency: string;
	subtotal: number;
	deliveryFee: number;
	discountCode: string;
	discountAmount: number;
	amount: number;
	paidAmount: number;
	email: string;
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	country?: string;
	postalCode?: string;
	additionalInfo?: string;
	status: OrderStatus;
	downloadUnlocked: boolean;
	updated?: string;
	user: string | OrderUserSummary;
};

export type UpdateOrderStatusPayload = {
	status?: OrderStatus;
	paymentStatus?: PaymentStatus;
};

export type OrderResponse<T = unknown> = ApiResponse<T>;

