import { apiClient } from "@/lib/apiClient";
import type {
	CreateSubscriberPayload,
	CreateTemplatePayload,
	NewsletterResponse,
	NewsletterSubscriber,
	NewsletterTemplate,
	SendNewsletterPayload,
	UpdateSubscriberPayload,
	UpdateTemplatePayload,
} from "@/types/newsletterManagement";

const BASE_URL = "/newsletter";

export const newsletterService = {
	// Subscribers
	getSubscribers: async (params?: { status?: string; search?: string }) => {
		return apiClient.get<NewsletterResponse<NewsletterSubscriber[]>>(
			`${BASE_URL}/admin/subscribers`,
			"Failed to fetch newsletter subscribers",
			params ? { params } : undefined,
		);
	},

	addSubscriber: async (payload: CreateSubscriberPayload) => {
		return apiClient.post<NewsletterResponse<NewsletterSubscriber>>(
			`${BASE_URL}/admin/subscribers`,
			payload,
			"Failed to add subscriber",
		);
	},

	updateSubscriber: async (id: string, payload: UpdateSubscriberPayload) => {
		return apiClient.put<NewsletterResponse<NewsletterSubscriber>>(
			`${BASE_URL}/admin/subscribers/${id}`,
			payload,
			"Failed to update subscriber",
		);
	},

	deleteSubscriber: async (id: string) => {
		return apiClient.delete<NewsletterResponse>(
			`${BASE_URL}/admin/subscribers/${id}`,
			"Failed to delete subscriber",
		);
	},

	// Templates & Campaigns
	getTemplates: async () => {
		return apiClient.get<NewsletterResponse<NewsletterTemplate[]>>(
			`${BASE_URL}/admin/templates`,
			"Failed to fetch newsletter templates",
		);
	},

	getTemplateById: async (id: string) => {
		return apiClient.get<NewsletterResponse<NewsletterTemplate>>(
			`${BASE_URL}/admin/templates/${id}`,
			"Failed to fetch newsletter template",
		);
	},

	createTemplate: async (payload: CreateTemplatePayload) => {
		return apiClient.post<NewsletterResponse<NewsletterTemplate>>(
			`${BASE_URL}/admin/templates`,
			payload,
			"Failed to create newsletter template",
		);
	},

	updateTemplate: async (id: string, payload: UpdateTemplatePayload) => {
		return apiClient.put<NewsletterResponse<NewsletterTemplate>>(
			`${BASE_URL}/admin/templates/${id}`,
			payload,
			"Failed to update newsletter template",
		);
	},

	deleteTemplate: async (id: string) => {
		return apiClient.delete<NewsletterResponse>(
			`${BASE_URL}/admin/templates/${id}`,
			"Failed to delete newsletter template",
		);
	},

	sendCampaign: async (id: string, payload?: SendNewsletterPayload) => {
		return apiClient.post<NewsletterResponse<NewsletterTemplate>>(
			`${BASE_URL}/admin/templates/${id}/send`,
			payload || {},
			"Failed to send newsletter campaign",
		);
	},
};

