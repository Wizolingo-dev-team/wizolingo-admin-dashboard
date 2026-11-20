import * as yup from "yup";

export const createSubscriberSchema = yup.object({
	email: yup
		.string()
		.trim()
		.lowercase()
		.email("Please enter a valid email address")
		.required("Email address is required"),
	name: yup.string().trim().optional().default(""),
	status: yup
		.string()
		.oneOf(["subscribed", "unsubscribed"])
		.default("subscribed"),
});

export const updateSubscriberSchema = createSubscriberSchema;

export const createNewsletterTemplateSchema = yup.object({
	name: yup
		.string()
		.trim()
		.required("Template name is required")
		.min(3, "Name must be at least 3 characters"),
	subject: yup
		.string()
		.trim()
		.required("Email subject line is required")
		.min(3, "Subject must be at least 3 characters"),
	previewText: yup.string().optional().default(""),
	category: yup
		.string()
		.oneOf(["release", "tour", "merch", "general"])
		.default("general"),
	htmlContent: yup
		.string()
		.required("HTML email body content is required")
		.min(10, "Content must be at least 10 characters"),
});

export const updateNewsletterTemplateSchema = createNewsletterTemplateSchema;

export const sendNewsletterCampaignSchema = yup.object({
	testEmail: yup
		.string()
		.trim()
		.lowercase()
		.email("Please provide a valid test email")
		.optional(),
});
