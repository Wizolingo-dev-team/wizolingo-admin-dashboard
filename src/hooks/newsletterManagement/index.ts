import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { newsletterService } from "@/lib/requests/newsletterManagement";
import { useToast } from "@/hooks/useToast";
import type {
	CreateSubscriberPayload,
	CreateTemplatePayload,
	SendNewsletterPayload,
	UpdateSubscriberPayload,
	UpdateTemplatePayload,
} from "@/types/newsletterManagement";

// --- Subscribers ---

export const useGetSubscribers = (params?: { status?: string; search?: string }) => {
	return useQuery({
		queryKey: ["newsletterSubscribers", params?.status || "all", params?.search || ""],
		queryFn: async () => {
			const response = await newsletterService.getSubscribers(params);
			return response.data || [];
		},
		retry: 1,
	});
};

export const useAddSubscriber = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: CreateSubscriberPayload) => newsletterService.addSubscriber(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterSubscribers"] });
			toast.success(data.message || "Subscriber added successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to add subscriber");
		},
	});
};

export const useUpdateSubscriber = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateSubscriberPayload }) =>
			newsletterService.updateSubscriber(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterSubscribers"] });
			toast.success(data.message || "Subscriber updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update subscriber");
		},
	});
};

export const useDeleteSubscriber = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => newsletterService.deleteSubscriber(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterSubscribers"] });
			toast.success(data.message || "Subscriber deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete subscriber");
		},
	});
};

// --- Templates & Campaigns ---

export const useGetNewsletterTemplates = () => {
	return useQuery({
		queryKey: ["newsletterTemplates"],
		queryFn: async () => {
			const response = await newsletterService.getTemplates();
			return response.data || [];
		},
		retry: 1,
	});
};

export const useCreateNewsletterTemplate = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: CreateTemplatePayload) => newsletterService.createTemplate(payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterTemplates"] });
			toast.success(data.message || "Newsletter template created");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create template");
		},
	});
};

export const useUpdateNewsletterTemplate = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateTemplatePayload }) =>
			newsletterService.updateTemplate(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterTemplates"] });
			toast.success(data.message || "Newsletter template updated");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update template");
		},
	});
};

export const useDeleteNewsletterTemplate = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (id: string) => newsletterService.deleteTemplate(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterTemplates"] });
			toast.success(data.message || "Newsletter template deleted");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete template");
		},
	});
};

export const useSendNewsletterCampaign = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload?: SendNewsletterPayload }) =>
			newsletterService.sendCampaign(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["newsletterTemplates"] });
			queryClient.invalidateQueries({ queryKey: ["activities"] });
			toast.success(data.message || "Newsletter sent successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send newsletter campaign");
		},
	});
};

