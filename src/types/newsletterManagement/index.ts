import type { ApiResponse, MongoEntity } from "@/types/common";

export type NewsletterSource = "popup" | "footer" | "checkout" | "admin" | "other";
export type NewsletterStatus = "subscribed" | "unsubscribed";

export type NewsletterSubscriber = MongoEntity & {
	email: string;
	name: string;
	source: NewsletterSource;
	status: NewsletterStatus;
	unsubscribeToken: string;
	subscribedAt: string;
	unsubscribedAt?: string;
};

export type CreateSubscriberPayload = {
	email: string;
	name?: string;
	status?: NewsletterStatus;
};

export type UpdateSubscriberPayload = Partial<CreateSubscriberPayload>;

export type NewsletterTemplateCategory = "release" | "tour" | "merch" | "general";
export type NewsletterTemplateStatus = "draft" | "sent";

export type NewsletterTemplate = MongoEntity & {
	name: string;
	subject: string;
	previewText: string;
	category: NewsletterTemplateCategory;
	htmlContent: string;
	designJson?: Record<string, unknown> | null;
	status: NewsletterTemplateStatus;
	sentCount: number;
	lastSentAt?: string;
	createdBy?: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
	};
};

export type CreateTemplatePayload = {
	name: string;
	subject: string;
	previewText?: string;
	category?: NewsletterTemplateCategory;
	htmlContent: string;
	designJson?: Record<string, unknown> | null;
};

export type UpdateTemplatePayload = Partial<CreateTemplatePayload>;

export type SendNewsletterPayload = {
	testEmail?: string;
};

export type NewsletterResponse<T = unknown> = ApiResponse<T>;

