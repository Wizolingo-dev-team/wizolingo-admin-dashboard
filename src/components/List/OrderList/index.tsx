"use client";
import React, { useState, useMemo } from "react";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { orderColumnsSchema } from "@/components/Tables/columns/definitions";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/orderManagement";
import ViewOrderDetails from "@/components/_modals/ViewOrderDetails";
import { Order, OrderStatus } from "@/types/orderManagement";
import OrderListSkeleton from "@/components/Skeletons/Skeletons/OrderListSkeleton";
import { toast } from "sonner";

export default function OrderList() {
	const { data: orders = [], isLoading } = useGetAllOrders();
	const { mutate: updateStatus } = useUpdateOrderStatus();

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isViewOpen, setIsViewOpen] = useState(false);

	const handleView = (order: Order) => {
		setSelectedOrder(order);
		setIsViewOpen(true);
	};

	const handleUpdateStatus = (id: string, status: OrderStatus) => {
		updateStatus({ id, status });
	};

	const filteredOrders = useMemo(() => {
		return orders.filter((o) => {
			const matchesSearch =
				o._id.toLowerCase().includes(search.toLowerCase()) ||
				(o.email || "").toLowerCase().includes(search.toLowerCase()) ||
				(o.phone || "").includes(search) ||
				(typeof o.user === "object" &&
					o.user &&
					`${o.user.firstName} ${o.user.lastName}`
						.toLowerCase()
						.includes(search.toLowerCase()));

			const matchesStatus = statusFilter === "all" || o.status === statusFilter;
			const matchesType = typeFilter === "all" || o.orderType === typeFilter;

			return matchesSearch && matchesStatus && matchesType;
		});
	}, [orders, search, statusFilter, typeFilter]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredOrders.slice(start, start + pageSize);
	}, [filteredOrders, page, pageSize]);

	const handleExportCsv = () => {
		if (filteredOrders.length === 0) {
			toast.error("No orders to export");
			return;
		}
		const headers = ["Order ID", "Email", "Type", "Status", "Payment Status", "Total (USD)", "Date"];
		const rows = filteredOrders.map((o) => [
			o._id,
			o.email,
			o.orderType,
			o.status,
			o.paymentStatus,
			o.amount,
			new Date(o.createdAt).toISOString(),
		]);
		const csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `wizolingo-orders-${Date.now()}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Orders CSV exported");
	};

	const columns = getColumns(orderColumnsSchema(handleView, handleUpdateStatus));

	return (
		<>
			<TableLayoutWrapper
				title="Order Management"
				columns={columns}
				data={paginatedData}
				addLabel="Export CSV"
				onAddClick={handleExportCsv}
				filters={[
					{
						label: "Status",
						value: statusFilter,
						options: [
							{ label: "Processing", value: "Processing" },
							{ label: "Payment Confirmed", value: "Payment Confirmed" },
							{ label: "On the way", value: "On the way" },
							{ label: "Delivered", value: "Delivered" },
							{ label: "Cancelled", value: "Cancelled" },
						],
					},
					{
						label: "Order Type",
						value: typeFilter,
						options: [
							{ label: "Digital Music", value: "digital" },
							{ label: "Artist Merch", value: "merch" },
							{ label: "Mixed Order", value: "mixed" },
						],
					},
				]}
				isLoading={isLoading}
				skeleton={<OrderListSkeleton />}
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				onFilterChange={(label, val) => {
					if (label === "Status") setStatusFilter(val);
					if (label === "Order Type") setTypeFilter(val);
					setPage(1);
				}}
				paginationProps={{
					currentPage: page,
					totalPages: Math.ceil(filteredOrders.length / pageSize) || 1,
					pageSize,
					totalEntries: filteredOrders.length,
					onPageChange: setPage,
					onPageSizeChange: (s) => {
						setPageSize(Number(s));
						setPage(1);
					},
				}}
			/>

			<ViewOrderDetails
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				order={selectedOrder}
			/>
		</>
	);
}

