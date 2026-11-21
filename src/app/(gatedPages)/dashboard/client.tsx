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

		const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		const toDayIndex = (dateStr?: string) => {
			if (!dateStr) return 6;
			const d = new Date(dateStr);
			if (Number.isNaN(d.getTime())) return 6;
			return (d.getDay() + 6) % 7;
		};

		const customerDailyData = dayLabels.map((day) => ({ day, count: 0 }));
		users.forEach((u) => {
			const idx = toDayIndex(u.createdAt);
			const bucket = customerDailyData[idx];
			if (bucket) bucket.count += 1;
		});

		const canceledDailyData = dayLabels.map((day) => ({ day, count: 0 }));
		orders
			.filter((o) => o.status === "Cancelled")
			.forEach((o) => {
				const idx = toDayIndex(o.createdAt);
				const bucket = canceledDailyData[idx];
				if (bucket) bucket.count += 1;
			});

		const ratingData = [1, 2, 3, 4, 5].map((star) => ({
			rating: `${star}★`,
			count: reviews.filter((r) => Math.round(r.rating || 0) === star).length,
		}));
		const totalStars = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
		const averageRating = reviews.length > 0 ? totalStars / reviews.length : 0;

		const orderBreakdown = [
			{ name: "Delivered", value: deliveredOrders.length, color: "#D70E1D" },
			{ name: "Pending", value: pendingCount, color: "#f59e0b" },
			{ name: "Cancelled", value: canceledCount, color: "#52525b" },
		];

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
			customerDailyData,
			canceledDailyData,
			ratingData,
			averageRating,
			orderBreakdown,
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
							description="Total completed digital track and album downloads unlocked across the Wizolingo store."
						/>
						<StatWidget
							title="Event Tickets Sold"
							value={stats.ticketsSold.toLocaleString()}
							icon="ph:ticket-bold"
							trend={`${stats.eventsCount} Shows`}
							description="Total event tickets issued across all active and past Wiz Ofuasia live shows and tours."
						/>
						<StatWidget
							title="Newsletter Inner Circle"
							value={stats.subscribersCount.toLocaleString()}
							icon="ph:envelope-open-bold"
							trend="Subscribers"
							description="Active email subscribers opted into the Wiz Ofuasia Inner Circle newsletter from the website popup and footer."
						/>
					</div>

					{/* Third Row: 2 Large Chart Cards */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<TotalCustomersWidget
							count={stats.customers}
							dailyData={stats.customerDailyData}
						/>
						<DeliveredOrdersWidget
							count={stats.delivered}
							revenue={stats.deliveredRevenue}
							breakdown={stats.orderBreakdown}
						/>
					</div>

					{/* Fourth Row: 2 Large Chart Cards */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						<CanceledCustomersWidget
							count={stats.canceled}
							dailyData={stats.canceledDailyData}
						/>
						<ReviewsWidget
							count={stats.reviewsCount}
							averageRating={stats.averageRating}
							ratingData={stats.ratingData}
						/>
					</div>

					<div className="pt-4">
						<WishlistList />
					</div>
				</div>
			}
		/>
	);
}

