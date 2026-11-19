import { apiClient } from "@/lib/apiClient";
import type {
	Order,
	OrderResponse,
	OrderStatus,
	PaymentStatus,
} from "@/types/orderManagement";

const BASE_URL = "/order";

export const orderService = {
	getAllOrders: async () => {
		return apiClient.get<OrderResponse<Order[]>>(
			`${BASE_URL}/admin/all-orders`,
			"Failed to fetch all orders",
		);
	},

	updateOrderStatus: async (
		id: string,
		status: OrderStatus,
		paymentStatus?: PaymentStatus,
	) => {
		return apiClient.put<OrderResponse<Order>>(
			`${BASE_URL}/admin/update-order-status/${id}`,
			{ status, ...(paymentStatus ? { paymentStatus } : {}) },
			"Failed to update order status",
		);
	},

	getOrderStatuses: async () => {
		return apiClient.get<OrderResponse<OrderStatus[]>>(
			`${BASE_URL}/status`,
			"Failed to fetch order statuses",
		);
	},
};

