import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/lib/requests/blogManagement";
import { useToast } from "@/hooks/useToast";

export const useGetAllBlogsAdmin = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
	status?: string;
}) => {
	return useQuery({
		queryKey: [
			"adminBlogs",
			params?.page || 1,
			params?.limit || 20,
			params?.search || "",
			params?.category || "all",
			params?.status || "all",
		],
		queryFn: async () => {
			const response = await blogService.getAllBlogsAdmin(params);
			return response;
		},
		retry: 1,
	});
};

export const useGetBlogDetails = (slugOrId: string) => {
	return useQuery({
		queryKey: ["blogDetails", slugOrId],
		queryFn: async () => {
			if (!slugOrId) return null;
			const response = await blogService.getBlogByIdOrSlug(slugOrId);
			return response.data || null;
		},
		enabled: Boolean(slugOrId),
	});
};

export const useCreateBlog = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: FormData) => blogService.createBlog(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
			queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
			toast.success(data.message || "Blog post created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create blog post");
		},
	});
};

export const useUpdateBlog = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
			blogService.updateBlog(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
			queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
			toast.success(data.message || "Blog post updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update blog post");
		},
	});
};

export const useDeleteBlog = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => blogService.deleteBlog(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["adminBlogs"] });
			toast.success(data.message || "Blog post deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete blog post");
		},
	});
};

export const useUploadBlogInlineImage = () => {
	const toast = useToast();

	return useMutation({
		mutationFn: (formData: FormData) => blogService.uploadInlineImage(formData),
		onSuccess: () => {
			toast.success("Inline image uploaded successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to upload inline image");
		},
	});
};

export const useGetBlogCategories = () => {
	return useQuery({
		queryKey: ["blogCategories"],
		queryFn: async () => {
			const response = await blogService.getCategories();
			return response.data || [];
		},
		retry: 1,
	});
};

export const useGetBlogTags = () => {
	return useQuery({
		queryKey: ["blogTags"],
		queryFn: async () => {
			const response = await blogService.getTags();
			return response.data || [];
		},
		retry: 1,
	});
};

