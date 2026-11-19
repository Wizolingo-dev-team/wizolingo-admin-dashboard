import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/lib/requests/orderManagement";
import { useToast } from "@/hooks/useToast";
import type { OrderStatus, PaymentStatus } from "@/types/orderManagement";

export const useGetAllOrders = () => {
	return useQuery({
		queryKey: ["allOrders"],
		queryFn: async () => {
			const response = await orderService.getAllOrders();
			return response.data || [];
		},
	});
};

export const useUpdateOrderStatus = () => {
	const queryClient = useQueryClient();
	const toast = useToast();
	return useMutation({
		mutationFn: ({
			id,
			status,
			paymentStatus,
		}: {
			id: string;
			status: OrderStatus;
			paymentStatus?: PaymentStatus;
		}) => orderService.updateOrderStatus(id, status, paymentStatus),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["allOrders"] });
			toast.success(data.message || "Order status updated.");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update order status.");
		},
	});
};

