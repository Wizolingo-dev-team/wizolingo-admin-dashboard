import * as yup from "yup";

export const subCategorySchema = yup.object({
	subcategoryName: yup
		.string()
		.required("Subcategory name is required")
		.min(2, "Subcategory name must be at least 2 characters"),
});

export const createCategorySchema = yup.object({
	categoryName: yup
		.string()
		.required("Category name is required")
		.min(2, "Category name must be at least 2 characters"),
	categoryType: yup
		.string()
		.oneOf(["merch", "digital_music", "general"])
		.default("general"),
	subcategories: yup.array().of(subCategorySchema).optional().default([]),
});

export const updateCategorySchema = createCategorySchema;

