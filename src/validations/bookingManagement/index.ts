import * as yup from "yup";

export const updateBookingStatusSchema = yup.object({
	status: yup
		.string()
		.oneOf(["pending", "reviewed", "contacted", "confirmed", "rejected", "completed"])
		.optional(),
	adminNotes: yup.string().trim().optional(),
});

