import { describe, expect, it } from "vitest";
import { updateBookingStatusSchema } from "./index";

describe("bookingManagement Yup validation schemas", () => {
	it("validates valid booking status values", async () => {
		const statuses = ["pending", "reviewed", "contacted", "confirmed", "rejected", "completed"];
		for (const status of statuses) {
			const valid = await updateBookingStatusSchema.isValid({
				status,
				adminNotes: "Client contacted via email.",
			});
			expect(valid).toBe(true);
		}
	});

	it("rejects unknown status values", async () => {
		const valid = await updateBookingStatusSchema.isValid({
			status: "unknown_status",
		});
		expect(valid).toBe(false);
	});
});

