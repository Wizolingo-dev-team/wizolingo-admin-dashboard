import * as yup from "yup";

export const broadcastNotificationSchema = yup.object({
	userId: yup.string().optional().default(""),
	title: yup
		.string()
		.required("Notification title is required")
		.min(3, "Title must be at least 3 characters"),
	description: yup
		.string()
		.required("Notification message is required")
		.min(5, "Description must be at least 5 characters"),
	type: yup
		.string()
		.oneOf(["order", "download", "event", "newsletter", "auth", "system"])
		.default("system"),
	onClick: yup.string().optional().default("/"),
});

