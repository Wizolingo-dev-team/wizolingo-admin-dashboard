"use client";

import React, { useState } from "react";
import {
	useGetAdminAllNotifications,
	useBroadcastNotification,
	useDeleteNotification,
} from "@/hooks/notificationManagement";
import { useGetAllUsers } from "@/hooks/userManagement";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import ActionModal from "@/components/_modals/ActionModal";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import type { NotificationType } from "@/types/notificationManagement";

export default function NotificationList() {
	const { data: notifications = [], isLoading } = useGetAdminAllNotifications();
	const { data: users = [] } = useGetAllUsers();
	const broadcastMutation = useBroadcastNotification();
	const deleteMutation = useDeleteNotification();

	const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<NotificationType>("system");
	const [userId, setUserId] = useState("all");
	const [onClick, setOnClick] = useState("/songs");

	const filteredNotifications = notifications.filter((n) => {
		const matchesSearch =
			n.title.toLowerCase().includes(search.toLowerCase()) ||
			n.description.toLowerCase().includes(search.toLowerCase());
		const matchesType = typeFilter === "all" || n.type === typeFilter;
		return matchesSearch && matchesType;
	});

	const handleBroadcast = (e: React.FormEvent) => {
		e.preventDefault();
		broadcastMutation.mutate(
			{
				userId: userId === "all" ? undefined : userId,
				title,
				description,
				type,
				onClick,
			},
			{
				onSuccess: () => {
					setIsBroadcastOpen(false);
					setTitle("");
					setDescription("");
				},
			},
		);
	};

	const columns = getColumns([
		{
			key: "title",
			header: "Notification",
			render: (row: any) => (
				<div>
					<div className="font-bold text-foreground">{row.title}</div>
					<div className="text-xs text-muted-foreground max-w-md truncate">
						{row.description}
					</div>
				</div>
			),
		},
		{
			key: "user",
			header: "Recipient",
			render: (row: any) => (
				<span className="text-xs font-semibold text-foreground">
					{typeof row.user === "object" && row.user
						? `${row.user.firstName} ${row.user.lastName} (${row.user.email})`
						: "User"}
				</span>
			),
		},
		{
			key: "type",
			header: "Type",
			render: (row: any) => (
				<Badge variant="secondary" className="uppercase text-[10px] font-bold">
					{row.type}
				</Badge>
			),
		},
		{
			key: "read",
			header: "Status",
			render: (row: any) => (
				<Badge
					variant="outline"
					className={
						row.read
							? "border-muted-foreground/40 text-muted-foreground text-[10px]"
							: "border-primary/40 text-primary text-[10px]"
					}
				>
					{row.read ? "Read" : "Unread"}
				</Badge>
			),
		},
		{
			key: "createdAt",
			header: "Sent At",
			render: (row: any) => (
				<span className="text-xs text-muted-foreground">
					{new Date(row.createdAt).toLocaleString()}
				</span>
			),
		},
		{
			key: "actions",
			header: "Action",
			render: (row: any) => (
				<Button
					variant="ghost"
					size="icon"
					onClick={() => deleteMutation.mutate(row._id)}
					className="size-8 text-muted-foreground hover:text-destructive"
				>
					<Icon icon="ph:trash-bold" className="size-4" />
				</Button>
			),
		},
	]);

	return (
		<>
			<TableLayoutWrapper
				title="In-App Notifications & Real-Time Broadcasts"
				columns={columns}
				data={filteredNotifications}
				isLoading={isLoading}
				skeleton={<ProductListSkeleton />}
				addLabel="Broadcast Notification"
				onAddClick={() => setIsBroadcastOpen(true)}
				searchQuery={search}
				onSearchChange={setSearch}
				filters={[
					{
						label: "Notification Type",
						value: typeFilter,
						options: [
							{ label: "Order", value: "order" },
							{ label: "Download", value: "download" },
							{ label: "Event", value: "event" },
							{ label: "Newsletter", value: "newsletter" },
							{ label: "System", value: "system" },
						],
					},
				]}
				onFilterChange={(_, val) => setTypeFilter(val)}
			/>

			<ActionModal
				open={isBroadcastOpen}
				onOpenChange={setIsBroadcastOpen}
				title="Broadcast In-App Notification"
				description="Delivers real-time Socket.io notifications to users"
				formId="broadcast-form"
				isLoading={broadcastMutation.isPending}
				submitLabel="Send Notification"
			>
				<form id="broadcast-form" onSubmit={handleBroadcast} className="space-y-6">
					<div className="space-y-2">
						<Label className="text-sm font-bold">Target Audience</Label>
						<Select value={userId} onValueChange={setUserId}>
							<SelectTrigger className="h-11 bg-background/60 border-border">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									All Registered Fans &amp; Customers
								</SelectItem>
								{users.map((u) => (
									<SelectItem key={u._id} value={u._id}>
										{u.firstName} {u.lastName} ({u.email})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold">Notification Title</Label>
						<Input
							required
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g. New Album Out Now!"
							className="h-11 bg-background/60 border-border"
						/>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold">Message Description</Label>
						<Textarea
							required
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Write your notification message..."
							className="min-h-[100px] bg-background/60 border-border"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-bold">Category</Label>
							<Select
								value={type}
								onValueChange={(val) => setType(val as NotificationType)}
							>
								<SelectTrigger className="h-11 bg-background/60 border-border">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="system">System</SelectItem>
									<SelectItem value="download">Music Download</SelectItem>
									<SelectItem value="event">Tour &amp; Event</SelectItem>
									<SelectItem value="order">Store Order</SelectItem>
									<SelectItem value="newsletter">Newsletter</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-bold">Click Target Link</Label>
							<Input
								value={onClick}
								onChange={(e) => setOnClick(e.target.value)}
								placeholder="/songs or /events"
								className="h-11 bg-background/60 border-border"
							/>
						</div>
					</div>
				</form>
			</ActionModal>
		</>
	);
}

