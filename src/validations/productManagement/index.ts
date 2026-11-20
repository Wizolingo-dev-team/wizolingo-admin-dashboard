import * as yup from "yup";

export const createProductSchema = yup.object({
	productName: yup
		.string()
		.trim()
		.required("Product or release title is required")
		.min(2, "Title must be at least 2 characters"),
	productType: yup
		.string()
		.oneOf(["merch", "digital_music"])
		.required("Product type is required"),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters")
		.max(5000, "Description cannot exceed 5000 characters"),
	price: yup
		.number()
		.typeError("Price must be a number")
		.required("Price is required")
		.min(0, "Price cannot be negative"),
	categories: yup.string().optional(),
	subcategoryId: yup.string().optional(),
	quantity: yup
		.number()
		.typeError("Quantity must be a number")
		.min(0, "Quantity cannot be negative")
		.optional(),
	colors: yup.string().optional(),
	sizes: yup.string().optional(),
	shipping: yup.boolean().optional(),
	digitalReleaseType: yup
		.string()
		.oneOf(["single", "album", "ep", "instrumental", "stem_pack", ""])
		.optional(),
	artist: yup.string().optional(),
	releaseDate: yup.string().optional(),
	duration: yup.string().optional(),
	previewUrl: yup.string().optional(),
	isFeatured: yup.boolean().optional(),
	isActive: yup.boolean().optional(),
});

export const updateProductSchema = createProductSchema;
