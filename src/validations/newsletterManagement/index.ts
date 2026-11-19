import * as yup from "yup";

export const createSubscriberSchema = yup.object({
	email: yup
		.string()
		.email("Please enter a valid email address")
		.required("Email address is required"),
	name: yup.string().optional().default(""),
	status: yup
		.string()
		.oneOf(["subscribed", "unsubscribed"])
		.default("subscribed"),
});

export const createNewsletterTemplateSchema = yup.object({
	name: yup
		.string()
		.required("Template name is required")
		.min(3, "Name must be at least 3 characters"),
	subject: yup
		.string()
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

