import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardClient from "./client";

vi.mock("@/layouts/RouteWrapper", () => ({
	default: ({ middleSlot }: { middleSlot: React.ReactNode }) => (
		<div data-testid="route-wrapper">{middleSlot}</div>
	),
}));

vi.mock("@/components/List/Wishlist", () => ({
	default: () => <div data-testid="wishlist-mock">Wishlist</div>,
}));

vi.mock("@/hooks/orderManagement", () => ({
	useGetAllOrders: () => ({
		isLoading: false,
		data: [
			{ _id: "o1", amount: 150, status: "Delivered", createdAt: "2026-11-20T10:00:00Z" },
			{ _id: "o2", amount: 80, status: "Processing", createdAt: "2026-11-20T12:00:00Z" },
			{ _id: "o3", amount: 50, status: "Cancelled", createdAt: "2026-11-19T12:00:00Z" },
		],
	}),
}));

vi.mock("@/hooks/productManagement", () => ({
	useGetAllProducts: () => ({
		isLoading: false,
		data: [
			{ _id: "p1", downloadCount: 25 },
			{ _id: "p2", downloadCount: 15 },
		],
	}),
}));

vi.mock("@/hooks/userManagement", () => ({
	useGetAllUsers: () => ({
		isLoading: false,
		data: [
			{ _id: "u1", createdAt: "2026-11-20T10:00:00Z" },
			{ _id: "u2", createdAt: "2026-11-21T10:00:00Z" },
		],
	}),
}));

vi.mock("@/hooks/reviewManagement", () => ({
	useGetAllAdminReviews: () => ({
		isLoading: false,
		data: {
			reviews: [
				{ _id: "r1", rating: 5 },
				{ _id: "r2", rating: 4 },
			],
		},
	}),
}));

vi.mock("@/hooks/eventManagement", () => ({
	useGetAllEventsAdmin: () => ({ data: [{ _id: "e1" }] }),
	useGetTicketOrdersAdmin: () => ({
		data: {
			summary: {
				totalOrders: 4,
				totalTicketsSold: 12,
				totalRevenue: 600,
			},
		},
	}),
}));

vi.mock("@/hooks/newsletterManagement", () => ({
	useGetSubscribers: () => ({
		data: [
			{ _id: "s1", status: "subscribed" },
			{ _id: "s2", status: "unsubscribed" },
		],
	}),
}));

describe("DashboardClient Integration", () => {
	it("aggregates KPIs, renders Recharts widgets, and opens info popovers", async () => {
		const user = userEvent.setup();
		const { getByText, getByRole, findByText } = render(<DashboardClient />);

		// Revenue = (150 + 80 non-cancelled store) + 600 tickets = $830.00
		expect(getByText("$830.00")).toBeInTheDocument();
		// Orders = 3 store + 4 ticket = 7
		expect(getByText("7")).toBeInTheDocument();
		// Digital Music Downloads = 25 + 15 = 40
		expect(getByText("40")).toBeInTheDocument();
		// Event Tickets Sold = 12
		expect(getByText("12")).toBeInTheDocument();
		// Average Rating = 4.5 / 5.0
		expect(getByText("Average Rating: 4.5 / 5.0")).toBeInTheDocument();

		await user.click(getByRole("button", { name: "About Fan & Customer Growth" }));
		expect(
			await findByText(/total registered Wizolingo accounts/i),
		).toBeInTheDocument();
	});
});

