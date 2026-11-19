import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/lib/requests/categoryManagement";
import { useToast } from "@/hooks/useToast";
import type {
	CategoryType,
	CreateCategoryPayload,
	UpdateCategoryPayload,
} from "@/types/categoryManagement";

export const useGetAllCategories = (categoryType?: CategoryType) => {
	return useQuery({
		queryKey: ["categories", categoryType || "all"],
		queryFn: async () => {
			const response = await categoryService.getAllCategories(categoryType);
			return response.data || [];
		},
		retry: 1,
	});
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: CreateCategoryPayload) => categoryService.createCategory(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success(data.message || "Category created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create category");
		},
	});
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
			categoryService.updateCategory(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success(data.message || "Category updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update category");
		},
	});
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => categoryService.deleteCategory(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["categories"] });
			toast.success(data.message || "Category deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete category");
		},
	});
};

