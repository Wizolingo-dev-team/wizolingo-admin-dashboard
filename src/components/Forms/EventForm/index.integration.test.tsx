import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventForm from "./index";

describe("EventForm Integration", () => {
	it("supports adding multiple Show Times & Time Zones and multiple Artist Set Times", async () => {
		const user = userEvent.setup();
		const handleSubmit = vi.fn();

		const { getByText, getByRole } = render(
			<EventForm formId="test-event-form" onSubmit={handleSubmit} />,
		);

		expect(getByText(/Show Times & Time Zones \(1\)/i)).toBeInTheDocument();
		await user.click(getByRole("button", { name: /add show time/i }));
		expect(getByText(/Show Times & Time Zones \(2\)/i)).toBeInTheDocument();

		expect(getByText(/Set Times & Time Zones \(1\)/i)).toBeInTheDocument();
		await user.click(getByRole("button", { name: /add time/i }));
		expect(getByText(/Set Times & Time Zones \(2\)/i)).toBeInTheDocument();
	});
});

