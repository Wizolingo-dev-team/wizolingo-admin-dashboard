import { describe, expect, it } from "vitest";
import {
	createEventSchema,
	eventArtistSchema,
	ticketTierSchema,
} from "./index";

describe("eventManagement Yup validation schemas", () => {
	it("validates a valid event payload", async () => {
		const valid = await createEventSchema.isValid({
			title: "Wiz Ofuasia Live in Berlin",
			description: "Live Afrobeats and Highlife concert experience.",
			startDate: "2026-11-20",
			venue: "O2 Arena",
			location: "Berlin, Germany",
			status: "UPCOMING",
		});
		expect(valid).toBe(true);
	});

	it("rejects missing required event fields", async () => {
		await expect(
			createEventSchema.validate({
				title: "Hi",
				description: "Short",
				startDate: "",
				venue: "",
				location: "",
			}),
		).rejects.toThrow();
	});

	it("validates ticketTierSchema and eventArtistSchema", async () => {
		await expect(
			ticketTierSchema.isValid({
				name: "VIP",
				price: 120,
				totalQuantity: 50,
				isActive: true,
			}),
		).resolves.toBe(true);

		await expect(
			eventArtistSchema.isValid({
				name: "Wizboyy",
				stage: "Main Stage",
				performanceTime: "10:00 PM",
			}),
		).resolves.toBe(true);
	});
});

