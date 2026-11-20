"use client";
import React, { useMemo } from "react";
import RouteWrapper from "@/layouts/RouteWrapper";
import { RevenueWidget } from "@/components/_widgets/Revenue";
import { OrdersWidget } from "@/components/_widgets/Orders";
import { ProductsWidget } from "@/components/_widgets/Products";
import { PendingOrdersWidget } from "@/components/_widgets/PendingOrders";
import { TotalCustomersWidget } from "@/components/_widgets/TotalCustomers";
import { DeliveredOrdersWidget } from "@/components/_widgets/DeliveredOrders";
import { CanceledCustomersWidget } from "@/components/_widgets/CanceledCustomers";
import { ReviewsWidget } from "@/components/_widgets/Reviews";
import { StatWidget } from "@/components/_widgets/shared/StatWidget";
import WishlistList from "@/components/List/Wishlist";

import { useGetAllOrders } from "@/hooks/orderManagement";
import { useGetAllProducts } from "@/hooks/productManagement";
import { useGetAllUsers } from "@/hooks/userManagement";
import { useGetAllAdminReviews } from "@/hooks/reviewManagement";
import { useGetAllEventsAdmin, useGetTicketOrdersAdmin } from "@/hooks/eventManagement";
import { useGetSubscribers } from "@/hooks/newsletterManagement";
import OrderListSkeleton from "@/components/Skeletons/Skeletons/OrderListSkeleton";

export default function DashboardClient() {
	const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();
	const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
	const { data: users = [], isLoading: usersLoading } = useGetAllUsers();
	const { data: reviewData, isLoading: reviewsLoading } = useGetAllAdminReviews();
	const { data: events = [] } = useGetAllEventsAdmin();
	const { data: ticketData } = useGetTicketOrdersAdmin();
	const { data: subscribers = [] } = useGetSubscribers();

	const reviews = useMemo(() => reviewData?.reviews || [], [reviewData?.reviews]);
	const ticketSummary = useMemo(
		() =>
			ticketData?.summary || {
				totalOrders: 0,
				totalTicketsSold: 0,
				totalRevenue: 0,
			},
		[ticketData?.summary],
	);

	const stats = useMemo(() => {
		const storeRevenue = orders
			.filter((o) => o.status !== "Cancelled")
			.reduce((acc, curr) => acc + (curr.amount || 0), 0);
		const totalRevenue = storeRevenue + (ticketSummary.totalRevenue || 0);
		const pendingCount = orders.filter(
			(o) => o.status === "Processing" || o.status === "Payment Confirmed",
		).length;
		const deliveredOrders = orders.filter(
			(o) => o.status === "Delivered" || o.downloadUnlocked,
		);
		const canceledCount = orders.filter((o) => o.status === "Cancelled").length;
		const digitalDownloadsCount = products.reduce(
			(acc, curr) => acc + (curr.downloadCount || 0),
			0,
		);
		const activeSubscribers = subscribers.filter((s) => s.status === "subscribed").length;

		return {
			revenue: totalRevenue,
			orderCount: orders.length + (ticketSummary.totalOrders || 0),
			catalogCount: products.length,
			pending: pendingCount,
			customers: users.length,
			delivered: deliveredOrders.length,
			deliveredRevenue: deliveredOrders.reduce((acc, curr) => acc + (curr.amount || 0), 0),
			canceled: canceledCount,
			reviewsCount: reviews.length,
			eventsCount: events.length,
			ticketsSold: ticketSummary.totalTicketsSold || 0,
			digitalDownloads: digitalDownloadsCount,
			subscribersCount: activeSubscribers,
		};
	}, [orders, products, users, reviews, events, ticketSummary, subscribers]);

	if (ordersLoading || productsLoading || usersLoading || reviewsLoading) {
		return <OrderListSkeleton />;
	}

	return (
		<RouteWrapper
			middleSlot={
				<div className="space-y-6 p-2">
					{/* Top Row: 4 Primary KPI Cards */}
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
						<RevenueWidget value={stats.revenue} />
						<OrdersWidget value={stats.orderCount} />
						<ProductsWidget value={stats.catalogCount} />
						<PendingOrdersWidget value={stats.pending} />
					</div>

					{/* Second Row: Wizolingo Music, Events & Inner Circle KPIs */}
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
						<StatWidget
							title="Digital Music Downloads"
							value={stats.digitalDownloads.toLocaleString()}
							icon="ph:music-notes-simple-bold"
							trend="Unlocked"
						/>
						<StatWidget
							title="Event Tickets Sold"
							value={stats.ticketsSold.toLocaleString()}
							icon="ph:ticket-bold"
							trend={`${stats.eventsCount} Shows`}
						/>
						<StatWidget
							title="Newsletter Inner Circle"
							value={stats.subscribersCount.toLocaleString()}
							icon="ph:envelope-open-bold"
							trend="Subscribers"
						/>
					</div>

					{/* Third Row: 2 Large Chart Cards */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<TotalCustomersWidget count={stats.customers} />
						<DeliveredOrdersWidget
							count={stats.delivered}
							revenue={stats.deliveredRevenue}
						/>
					</div>

					{/* Fourth Row: 2 Large Chart Cards */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<CanceledCustomersWidget count={stats.canceled} />
						<ReviewsWidget count={stats.reviewsCount} />
					</div>

					<div className="pt-4">
						<WishlistList />
					</div>
				</div>
			}
		/>
	);
}

