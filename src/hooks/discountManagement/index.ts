import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { discountService } from "@/lib/requests/discountManagement";
import { useToast } from "@/hooks/useToast";
import type { CreateDiscountPayload, UpdateDiscountPayload } from "@/types/discountManagement";

export const useCreateDiscount = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: CreateDiscountPayload) => discountService.createDiscount(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["discounts"] });
			toast.success(data.message || "Discount created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create discount");
		},
	});
};

export const useUpdateDiscount = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateDiscountPayload }) =>
			discountService.updateDiscount(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["discounts"] });
			toast.success(data.message || "Discount updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update discount");
		},
	});
};

export const useDeleteDiscount = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => discountService.deleteDiscount(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["discounts"] });
			toast.success(data.message || "Discount deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete discount");
		},
	});
};

export const useGetAllDiscounts = () => {
	return useQuery({
		queryKey: ["discounts"],
		queryFn: async () => {
			const response = await discountService.getAllDiscounts();
			return response.data || [];
		},
		retry: 1,
	});
};

