import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RevenueWidget } from "./Revenue";
import { OrdersWidget } from "./Orders";
import { ProductsWidget } from "./Products";
import { PendingOrdersWidget } from "./PendingOrders";
import { TotalCustomersWidget } from "./TotalCustomers";
import { DeliveredOrdersWidget } from "./DeliveredOrders";
import { CanceledCustomersWidget } from "./CanceledCustomers";
import { ReviewsWidget } from "./Reviews";

describe("Dashboard Analytics Widgets", () => {
	it("renders all KPI stat widgets with info popovers", async () => {
		const user = userEvent.setup();
		const { getByText, getByRole, findByText } = render(
			<div>
				<RevenueWidget value={5000} />
				<OrdersWidget value={42} />
				<ProductsWidget value={18} />
				<PendingOrdersWidget value={3} />
			</div>,
		);

		expect(getByText("$5,000.00")).toBeInTheDocument();
		expect(getByText("42")).toBeInTheDocument();
		expect(getByText("18")).toBeInTheDocument();
		expect(getByText("3")).toBeInTheDocument();

		await user.click(getByRole("button", { name: "About Total Revenue" }));
		expect(await findByText(/Combined gross revenue/i)).toBeInTheDocument();
	});

	it("renders all 4 chart widgets and opens their info popovers", async () => {
		const user = userEvent.setup();
		const { getByText, getByRole, findByText } = render(
			<div>
				<TotalCustomersWidget count={120} />
				<DeliveredOrdersWidget
					count={85}
					revenue={4200}
					breakdown={[
						{ name: "Delivered", value: 85, color: "#D70E1D" },
						{ name: "Pending", value: 10, color: "#f59e0b" },
						{ name: "Cancelled", value: 5, color: "#52525b" },
					]}
				/>
				<CanceledCustomersWidget count={5} />
				<ReviewsWidget count={29} averageRating={4.7} />
			</div>,
		);

		expect(getByText("Fan & Customer Growth")).toBeInTheDocument();
		expect(getByText("Completed Orders & Downloads")).toBeInTheDocument();
		expect(getByText("Canceled Orders")).toBeInTheDocument();
		expect(getByText("Music & Merch Reviews")).toBeInTheDocument();
		expect(getByText("Average Rating: 4.7 / 5.0")).toBeInTheDocument();

		await user.click(getByRole("button", { name: "About Music & Merch Reviews" }));
		expect(await findByText(/star-rating distribution/i)).toBeInTheDocument();
	});
});

