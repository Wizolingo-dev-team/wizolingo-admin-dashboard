import * as yup from "yup";

export const createBlogSchema = yup.object({
	title: yup
		.string()
		.trim()
		.required("Blog title is required")
		.min(3, "Title must be at least 3 characters"),
	content: yup
		.string()
		.required("Blog content is required")
		.min(10, "Content must be at least 10 characters"),
	excerpt: yup.string().trim().optional().default(""),
	category: yup.string().trim().required("Category is required").default("Articles"),
	author: yup.string().trim().required("Author name is required").default("Wiz Ofuasia Editorial"),
	readTime: yup.string().trim().optional().default("3 min read"),
	status: yup.string().oneOf(["Draft", "Published"]).default("Published"),
	tags: yup.string().optional().default(""),
	date: yup.string().trim().optional().default(""),
	isoDate: yup.string().trim().optional().default(""),
	coverImage: yup.mixed().optional(),
	coverImageUrl: yup.string().trim().optional().default(""),
});

export const updateBlogSchema = createBlogSchema.shape({
	slug: yup.string().trim().optional(),
});

