import * as yup from "yup";

export const updateOrderStatusSchema = yup.object({
	status: yup
		.string()
		.oneOf([
			"Processing",
			"Payment Confirmed",
			"On the way",
			"Delivered",
			"Cancelled",
		])
		.required("Order status is required"),
	downloadUnlocked: yup.boolean().optional(),
});
