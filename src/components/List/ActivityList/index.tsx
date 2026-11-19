"use client";

import React, { useState, useMemo } from "react";
import { useGetAllActivities } from "@/hooks/activityManagement";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import { Badge } from "@/components/ui/badge";

export default function ActivityList() {
	const { data: activities = [], isLoading } = useGetAllActivities();
	const [search, setSearch] = useState("");
	const [actionFilter, setActionFilter] = useState("all");

	const filteredActivities = useMemo(() => {
		return activities.filter((a) => {
			const matchesSearch =
				a.details.toLowerCase().includes(search.toLowerCase()) ||
				a.action.toLowerCase().includes(search.toLowerCase()) ||
				(typeof a.user === "object" &&
					a.user &&
					a.user.email.toLowerCase().includes(search.toLowerCase()));
			const matchesAction = actionFilter === "all" || a.action === actionFilter;
			return matchesSearch && matchesAction;
		});
	}, [activities, search, actionFilter]);

	const columns = getColumns([
		{
			key: "action",
			header: "Action Event",
			render: (row: any) => (
				<Badge className="bg-primary/20 text-primary border border-primary/30 uppercase text-[10px] font-bold">
					{row.action}
				</Badge>
			),
		},
		{
			key: "user",
			header: "Actor",
			render: (row: any) => (
				<div>
					<div className="font-bold text-foreground">
						{typeof row.user === "object" && row.user
							? `${row.user.firstName} ${row.user.lastName}`
							: "System User"}
					</div>
					{typeof row.user === "object" && row.user && (
						<div className="text-xs text-muted-foreground">{row.user.email}</div>
					)}
				</div>
			),
		},
		{
			key: "details",
			header: "Details",
			render: (row: any) => (
				<span className="text-sm text-foreground">{row.details}</span>
			),
		},
		{
			key: "ipAddress",
			header: "IP Address",
			render: (row: any) => (
				<code className="text-xs text-muted-foreground">{row.ipAddress || "—"}</code>
			),
		},
		{
			key: "createdAt",
			header: "Timestamp",
			render: (row: any) => (
				<span className="text-xs text-muted-foreground">
					{new Date(row.createdAt).toLocaleString()}
				</span>
			),
		},
	]);

	return (
		<TableLayoutWrapper
			title="System Audit & Activity Logs"
			columns={columns}
			data={filteredActivities}
			isLoading={isLoading}
			skeleton={<ProductListSkeleton />}
			searchQuery={search}
			onSearchChange={setSearch}
			filters={[
				{
					label: "Action Type",
					value: actionFilter,
					options: [
						{ label: "Admin Login", value: "ADMIN_LOGIN" },
						{ label: "User Login", value: "LOGIN" },
						{ label: "Order Created", value: "ORDER_CREATED" },
						{ label: "Payment Completed", value: "PAYMENT_COMPLETED" },
						{ label: "Ticket Purchased", value: "TICKET_PURCHASED" },
						{ label: "Digital Downloaded", value: "DIGITAL_DOWNLOADED" },
						{ label: "Newsletter Sent", value: "NEWSLETTER_SENT" },
						{ label: "Profile Updated", value: "PROFILE_UPDATED" },
					],
				},
			]}
			onFilterChange={(_, val) => setActionFilter(val)}
		/>
	);
}

