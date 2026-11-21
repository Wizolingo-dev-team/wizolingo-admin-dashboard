import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatWidget } from "./StatWidget";

describe("StatWidget", () => {
	it("renders title, value, and trend badge", () => {
		const { getByText } = render(
			<StatWidget
				title="Total Revenue"
				value="$12,450.00"
				icon="ph:currency-dollar-bold"
				trend="Live"
				description="Combined revenue across store and event tickets."
			/>,
		);

		expect(getByText("Total Revenue")).toBeInTheDocument();
		expect(getByText("$12,450.00")).toBeInTheDocument();
		expect(getByText("Live")).toBeInTheDocument();
	});

	it("opens the info popover summary when the info icon is clicked", async () => {
		const user = userEvent.setup();
		const { getByRole, findByText } = render(
			<StatWidget
				title="Total Revenue"
				value="$12,450.00"
				icon="ph:currency-dollar-bold"
				trend="Live"
				description="Combined revenue across store and event tickets."
			/>,
		);

		const infoBtn = getByRole("button", { name: "About Total Revenue" });
		await user.click(infoBtn);

		expect(
			await findByText("Combined revenue across store and event tickets."),
		).toBeInTheDocument();
	});
});

