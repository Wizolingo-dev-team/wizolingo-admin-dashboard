import * as yup from "yup";

export const eventArtistSchema = yup.object({
	name: yup.string().trim().required("Artist name is required"),
	stage: yup.string().trim().optional().default("Main stage"),
	performanceTime: yup.string().trim().optional().default(""),
	imageUrl: yup.string().trim().optional().default(""),
});

export const ticketTierSchema = yup.object({
	name: yup.string().trim().required("Ticket tier name is required"),
	description: yup.string().trim().optional().default(""),
	price: yup
		.number()
		.typeError("Price must be a number")
		.required("Ticket price is required")
		.min(0, "Price cannot be negative"),
	currency: yup.string().trim().optional().default("USD"),
	totalQuantity: yup
		.number()
		.typeError("Total quantity must be a number")
		.required("Total quantity is required")
		.min(0, "Total quantity cannot be negative"),
	isActive: yup.boolean().optional().default(true),
});

export const createEventSchema = yup.object({
	title: yup
		.string()
		.trim()
		.required("Event title is required")
		.min(3, "Event title must be at least 3 characters"),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters")
		.max(5000, "Description cannot exceed 5000 characters"),
	startDate: yup.string().required("Start date is required"),
	endDate: yup.string().optional(),
	dateLabel: yup.string().optional(),
	time: yup.string().optional(),
	timezone: yup.string().optional(),
	venue: yup.string().trim().required("Venue name is required"),
	location: yup.string().trim().required("City / Country location is required"),
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

export const updateEventSchema = createEventSchema;

export const updateTicketOrderStatusSchema = yup.object({
	status: yup
		.string()
		.oneOf(["Processing", "Confirmed", "Checked In", "Cancelled"])
		.optional(),
	paymentStatus: yup
		.string()
		.oneOf(["pending", "completed", "failed", "refunded"])
		.optional(),
});
