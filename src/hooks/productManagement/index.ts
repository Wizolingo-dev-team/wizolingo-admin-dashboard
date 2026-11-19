import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/lib/requests/productManagement";
import { useToast } from "@/hooks/useToast";
import type { GetAllProductsParams } from "@/types/productManagement";

export const useCreateProduct = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: FormData) => productService.createProduct(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success(data.message || "Product created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create product");
		},
	});
};

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
			productService.updateProduct(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			if (data.data?._id) {
				queryClient.invalidateQueries({ queryKey: ["product", data.data._id] });
			}
			toast.success(data.message || "Product updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update product");
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => productService.deleteProduct(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			toast.success(data.message || "Product deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete product");
		},
	});
};

export const useGetAllProducts = (params?: GetAllProductsParams) => {
	return useQuery({
		queryKey: ["products", params?.productType || "all"],
		queryFn: async () => {
			const response = await productService.getAllProducts(params);
			return response.data || [];
		},
		retry: 1,
	});
};

export const useGetProduct = (id: string) => {
	return useQuery({
		queryKey: ["product", id],
		queryFn: async () => {
			const response = await productService.getProductById(id);
			return response.data;
		},
		enabled: !!id,
		retry: 1,
	});
};

