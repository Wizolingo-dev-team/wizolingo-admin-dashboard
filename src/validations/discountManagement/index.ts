import * as yup from "yup";

export const createDiscountSchema = yup.object({
	discountCode: yup
		.string()
		.required("Discount code is required")
		.min(3, "Code must be at least 3 characters")
		.uppercase(),
	discountPercentage: yup
		.number()
		.typeError("Percentage must be a number")
		.required("Discount percentage is required")
		.min(1, "Percentage must be between 1% and 100%")
		.max(100, "Percentage cannot exceed 100%"),
	products: yup.array().of(yup.string()).optional().default([]),
	expiryDate: yup
		.string()
		.required("Expiry date is required")
		.test("is-future", "Expiry date must be in the future", (value) => {
			if (!value) return false;
			return new Date(value) > new Date();
		}),
	isActive: yup.boolean().optional().default(true),
});

export const updateDiscountSchema = createDiscountSchema;

