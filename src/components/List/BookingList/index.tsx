"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { bookingColumnsSchema } from "@/components/Tables/columns/definitions";
import DeleteModal from "@/components/_modals/DeleteModal";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import {
	useGetAllBookingsAdmin,
	useUpdateBookingStatus,
	useDeleteBooking,
} from "@/hooks/bookingManagement";
import type { BookingItem, BookingStatus } from "@/types/bookingManagement";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatWidget } from "@/components/_widgets/shared/StatWidget";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const EVENT_TYPE_OPTIONS = [
	{ label: "All Event Types", value: "all" },
	{ label: "Concert", value: "concert" },
	{ label: "Festival", value: "festival" },
	{ label: "Private Event", value: "private" },
	{ label: "Corporate Event", value: "corporate" },
	{ label: "TV / Radio", value: "tv-radio" },
	{ label: "Work With Me", value: "Work-with-me" },
	{ label: "Other", value: "other" },
];

export default function BookingList() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [eventTypeFilter, setEventTypeFilter] = useState("all");
	const [statusTab, setStatusTab] = useState("all");

	const { data: bookingsData, isLoading } = useGetAllBookingsAdmin({
		page,
		limit: pageSize,
		search,
		eventType: eventTypeFilter !== "all" ? eventTypeFilter : undefined,
		status: statusTab !== "all" ? statusTab : undefined,
	});

	const updateStatusMutation = useUpdateBookingStatus();
	const deleteMutation = useDeleteBooking();

	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);

	// Status and notes form state inside View Details
	const [editStatus, setEditStatus] = useState<BookingStatus>("pending");
	const [editNotes, setEditNotes] = useState("");

	const bookings = useMemo(() => bookingsData?.data || [], [bookingsData?.data]);
	const totalEntries = bookingsData?.total || 0;
	const totalPages = bookingsData?.totalPages || 1;

	// Summary stats
	const stats = useMemo(() => {
		const pendingCount = bookings.filter((b) => b.status === "pending").length;
		const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
		const completedCount = bookings.filter((b) => b.status === "completed").length;
		return {
			total: totalEntries,
			pending: pendingCount,
			confirmed: confirmedCount,
			completed: completedCount,
		};
	}, [bookings, totalEntries]);

	const handleView = React.useCallback((booking: BookingItem) => {
		setSelectedBooking(booking);
		setEditStatus(booking.status || "pending");
		setEditNotes(booking.adminNotes || "");
		setIsViewOpen(true);
	}, []);

	const handleDelete = React.useCallback((booking: BookingItem) => {
		setSelectedBooking(booking);
		setIsDeleteOpen(true);
	}, []);

	const handleQuickStatusUpdate = React.useCallback((id: string, newStatus: BookingStatus) => {
		updateStatusMutation.mutate({
			id,
			payload: { status: newStatus },
		});
	}, [updateStatusMutation]);

	const handleSaveDetails = () => {
		if (!selectedBooking) return;
		updateStatusMutation.mutate(
			{
				id: selectedBooking._id,
				payload: {
					status: editStatus,
					adminNotes: editNotes.trim(),
				},
			},
			{
				onSuccess: () => {
					setIsViewOpen(false);
				},
			},
		);
	};

	const confirmDelete = () => {
		if (!selectedBooking) return;
		deleteMutation.mutate(selectedBooking._id, {
			onSuccess: () => setIsDeleteOpen(false),
		});
	};

	const columns = useMemo(
		() => getColumns(bookingColumnsSchema(handleView, handleDelete, handleQuickStatusUpdate)),
		[handleView, handleDelete, handleQuickStatusUpdate],
	);

	return (
		<div className="space-y-6">
			{/* Top Summary Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatWidget
					title="Total Booking Inquiries"
					value={stats.total}
					icon="ph:calendar-check-bold"
					trend="All Requests"
				/>
				<StatWidget
					title="Pending Inquiries"
					value={stats.pending}
					icon="ph:clock-countdown-bold"
					trend="Needs Review"
				/>
				<StatWidget
					title="Confirmed Shows"
					value={stats.confirmed}
					icon="ph:check-circle-bold"
					trend="Ready for Event"
				/>
				<StatWidget
					title="Completed Bookings"
					value={stats.completed}
					icon="ph:seal-check-bold"
					trend="Successfully Delivered"
				/>
			</div>

			{/* Status Tabs */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<Tabs
					value={statusTab}
					onValueChange={(val) => {
						setStatusTab(val);
						setPage(1);
					}}
					className="w-auto"
				>
					<TabsList className="bg-card border border-border p-1 rounded-xl">
						<TabsTrigger
							value="all"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							All Inquiries
						</TabsTrigger>
						<TabsTrigger
							value="pending"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Pending
						</TabsTrigger>
						<TabsTrigger
							value="reviewed"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Reviewed
						</TabsTrigger>
						<TabsTrigger
							value="contacted"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Contacted
						</TabsTrigger>
						<TabsTrigger
							value="confirmed"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Confirmed
						</TabsTrigger>
						<TabsTrigger
							value="completed"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Completed
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Data Table */}
			<TableLayoutWrapper
				title="Client Booking Inquiries"
				columns={columns}
				data={bookings}
				isLoading={isLoading}
				skeleton={<ProductListSkeleton />}
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				filters={[
					{
						label: "Event Type",
						value: eventTypeFilter,
						options: EVENT_TYPE_OPTIONS,
					},
				]}
				onFilterChange={(_, val) => {
					setEventTypeFilter(val);
					setPage(1);
				}}
				paginationProps={{
					currentPage: page,
					totalPages,
					pageSize,
					totalEntries,
					onPageChange: setPage,
					onPageSizeChange: (s) => {
						setPageSize(Number(s));
						setPage(1);
					},
				}}
			/>

			{/* View Inquiry & Update Status Details Modal */}
			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Booking Inquiry Details"
				description="Client details, event requirements, message and internal management notes"
				maxWidthClass="sm:max-w-2xl"
			>
				{selectedBooking && (
					<div className="space-y-6 p-6">
						{/* Client Header Info */}
						<div className="flex items-start justify-between gap-4 border-b border-border pb-4">
							<div className="flex items-center gap-3">
								<div className="size-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg uppercase">
									{selectedBooking.fullName?.[0] || "B"}
								</div>
								<div>
									<h3 className="font-display text-lg font-bold text-foreground">
										{selectedBooking.fullName}
									</h3>
									<div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
										<a
											href={`mailto:${selectedBooking.email}`}
											className="hover:text-primary transition-colors flex items-center gap-1"
										>
											<Icon icon="ph:envelope-simple-bold" className="size-3.5" />
											{selectedBooking.email}
										</a>
										{selectedBooking.phone && (
											<a
												href={`tel:${selectedBooking.phone}`}
												className="hover:text-primary transition-colors flex items-center gap-1"
											>
												<Icon icon="ph:phone-bold" className="size-3.5" />
												{selectedBooking.phone}
											</a>
										)}
									</div>
								</div>
							</div>

							<Badge
								className={cn(
									"px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
									selectedBooking.status === "confirmed"
										? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
										: selectedBooking.status === "pending"
											? "bg-amber-500/15 text-amber-400 border-amber-500/30"
											: "bg-muted text-muted-foreground border-border",
								)}
							>
								{selectedBooking.status}
							</Badge>
						</div>

						{/* Inquiry Event Parameters */}
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-xl border border-border bg-card/60 p-4 text-xs">
							<div>
								<span className="text-muted-foreground block text-[11px] uppercase font-bold tracking-wider">
									Event Type
								</span>
								<span className="font-semibold text-foreground text-sm uppercase">
									{selectedBooking.eventType}
								</span>
							</div>

							<div>
								<span className="text-muted-foreground block text-[11px] uppercase font-bold tracking-wider">
									Event Date
								</span>
								<span className="font-semibold text-foreground text-sm">
									{selectedBooking.eventDate || "Flexible"}
								</span>
							</div>

							<div>
								<span className="text-muted-foreground block text-[11px] uppercase font-bold tracking-wider">
									Location / Country
								</span>
								<span className="font-semibold text-foreground text-sm">
									{selectedBooking.country || "Not specified"}
								</span>
							</div>

							<div>
								<span className="text-muted-foreground block text-[11px] uppercase font-bold tracking-wider">
									Budget
								</span>
								<span className="font-semibold text-primary text-sm">
									{selectedBooking.budget ? `${selectedBooking.budget}` : "Not stated"}
								</span>
							</div>

							<div>
								<span className="text-muted-foreground block text-[11px] uppercase font-bold tracking-wider">
									Received On
								</span>
								<span className="font-semibold text-foreground text-sm">
									{selectedBooking.createdAt
										? new Date(selectedBooking.createdAt).toLocaleString()
										: "—"}
								</span>
							</div>

							{selectedBooking.ipAddress && (
								<div>
									<span className="text-muted-foreground block text-[11px] uppercase font-bold tracking-wider">
										Client IP
									</span>
									<span className="font-mono text-muted-foreground text-xs">
										{selectedBooking.ipAddress}
									</span>
								</div>
							)}
						</div>

						{/* Client Message */}
						<div className="space-y-2">
							<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Client Message / Requirements
							</Label>
							<div className="rounded-xl border border-border bg-muted/20 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
								{selectedBooking.message}
							</div>
						</div>

						{/* Status & Management Notes Editor */}
						<div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
							<h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
								<Icon icon="ph:pencil-simple-bold" className="size-4" />
								Update Inquiry Status &amp; Admin Notes
							</h4>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex flex-col gap-1.5">
									<Label className="text-xs font-semibold text-muted-foreground">
										Inquiry Status
									</Label>
									<Select
										value={editStatus}
										onValueChange={(val) => setEditStatus(val as BookingStatus)}
									>
										<SelectTrigger className="h-10 bg-card border-border text-sm">
											<SelectValue placeholder="Select Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="pending">Pending (Unreviewed)</SelectItem>
											<SelectItem value="reviewed">Reviewed</SelectItem>
											<SelectItem value="contacted">Client Contacted</SelectItem>
											<SelectItem value="confirmed">Confirmed &amp; Booked</SelectItem>
											<SelectItem value="rejected">Rejected / Declined</SelectItem>
											<SelectItem value="completed">Show Completed</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="flex items-end">
									<Button
										type="button"
										onClick={handleSaveDetails}
										disabled={updateStatusMutation.isPending}
										className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold gap-2 text-xs"
									>
										{updateStatusMutation.isPending ? (
											<Icon icon="ph:spinner-bold" className="size-4 animate-spin" />
										) : (
											<Icon icon="ph:floppy-disk-bold" className="size-4" />
										)}
										{updateStatusMutation.isPending ? "Saving..." : "Save Status & Notes"}
									</Button>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<Label className="text-xs font-semibold text-muted-foreground">
									Internal Admin Notes (e.g. agreed rate, logistics, stage requirements)
								</Label>
								<Textarea
									value={editNotes}
									onChange={(e) => setEditNotes(e.target.value)}
									placeholder="Add private admin notes regarding this booking..."
									rows={3}
									className="bg-card border-border text-xs resize-none"
								/>
							</div>
						</div>
					</div>
				)}
			</ViewDetailsModal>

			{/* Delete Confirmation Modal */}
			<DeleteModal
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				title="Delete Booking Inquiry?"
				description={`Are you sure you want to delete the booking inquiry from "${selectedBooking?.fullName}"? This action cannot be undone.`}
				isLoading={deleteMutation.isPending}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}
