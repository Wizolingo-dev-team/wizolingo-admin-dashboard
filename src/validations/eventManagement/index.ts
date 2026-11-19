import * as yup from "yup";

export const createEventSchema = yup.object({
	title: yup
		.string()
		.required("Event title is required")
		.min(3, "Event title must be at least 3 characters"),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters"),
	startDate: yup.string().required("Start date is required"),
	endDate: yup.string().optional(),
	dateLabel: yup.string().optional(),
	time: yup.string().optional(),
	venue: yup.string().required("Venue name is required"),
	location: yup.string().required("City / Country location is required"),
	mapEmbedUrl: yup.string().optional(),
	eventType: yup.string().default("CONCERT"),
	status: yup
		.string()
		.oneOf(["UPCOMING", "ON SALE", "SOLD OUT", "PAST SHOW", "CANCELLED", "DRAFT"])
		.default("UPCOMING"),
	websiteUrl: yup.string().optional(),
	organizedBy: yup.string().default("Wizolingo Music"),
	flyerUrl: yup.string().optional(),
	isFeatured: yup.boolean().default(false),
	isActive: yup.boolean().default(true),
});

