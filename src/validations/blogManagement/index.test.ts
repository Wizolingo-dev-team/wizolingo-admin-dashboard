import { describe, expect, it } from "vitest";
import { createBlogSchema, updateBlogSchema } from "./index";

describe("blogManagement Yup validation schemas", () => {
	it("validates a valid blog payload", async () => {
		const valid = await createBlogSchema.isValid({
			title: "Wiz Ofuasia Announces 2027 Tour",
			content: "This is a detailed blog post about the upcoming Europe and America tour with full stage dates.",
			category: "Tour & Shows",
			author: "Wiz Ofuasia Editorial",
			status: "Published",
			tags: "Music, Tour, 2027",
		});
		expect(valid).toBe(true);
	});

	it("rejects blog post when title is missing or too short", async () => {
		await expect(
			createBlogSchema.validate({
				title: "No",
				content: "Long enough article content...",
			}),
		).rejects.toThrow();
	});

	it("rejects blog post when content is missing or too short", async () => {
		await expect(
			createBlogSchema.validate({
				title: "A valid title for article",
				content: "Short",
			}),
		).rejects.toThrow();
	});

	it("validates updateBlogSchema with optional custom slug", async () => {
		const valid = await updateBlogSchema.isValid({
			title: "European Tour Details",
			content: "Comprehensive article content for European tour details with cities and tickets.",
			slug: "european-tour-details-2027",
			status: "Draft",
		});
		expect(valid).toBe(true);
	});
});

