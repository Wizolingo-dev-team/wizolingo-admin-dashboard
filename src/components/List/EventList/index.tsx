"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	eventColumnsSchema,
	ticketOrderColumnsSchema,
} from "@/components/Tables/columns/definitions";
import ActionModal from "@/components/_modals/ActionModal";
import DeleteModal from "@/components/_modals/DeleteModal";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import EventForm from "@/components/Forms/EventForm";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import {
	useGetAllEventsAdmin,
	useCreateEvent,
	useUpdateEvent,
	useDeleteEvent,
	useGetTicketOrdersAdmin,
	useUpdateTicketOrderStatus,
} from "@/hooks/eventManagement";
import { EventItem, TicketOrder, TicketOrderStatus } from "@/types/eventManagement";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { StatWidget } from "@/components/_widgets/shared/StatWidget";

export default function EventList() {
	const { data: events = [], isLoading: eventsLoading } = useGetAllEventsAdmin();
	const { data: ticketData, isLoading: ticketsLoading } = useGetTicketOrdersAdmin();

	const createMutation = useCreateEvent();
	const updateMutation = useUpdateEvent();
	const deleteMutation = useDeleteEvent();
	const updateTicketStatusMutation = useUpdateTicketOrderStatus();

	const [isActionOpen, setIsActionOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

	const [selectedTicketOrder, setSelectedTicketOrder] = useState<TicketOrder | null>(null);
	const [isTicketViewOpen, setIsTicketViewOpen] = useState(false);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const [ticketSearch, setTicketSearch] = useState("");
	const [ticketStatusFilter, setTicketStatusFilter] = useState("all");

	const ticketOrders = useMemo(() => ticketData?.orders || [], [ticketData?.orders]);
	const ticketSummary = useMemo(
		() =>
			ticketData?.summary || {
				totalOrders: 0,
				totalTicketsSold: 0,
				totalRevenue: 0,
			},
		[ticketData?.summary],
	);

	const filteredEvents = useMemo(() => {
		return events.filter((ev) => {
			const matchesSearch =
				ev.title.toLowerCase().includes(search.toLowerCase()) ||
				ev.venue.toLowerCase().includes(search.toLowerCase()) ||
				ev.location.toLowerCase().includes(search.toLowerCase());
			const matchesStatus = statusFilter === "all" || ev.status === statusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [events, search, statusFilter]);

	const paginatedEvents = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredEvents.slice(start, start + pageSize);
	}, [filteredEvents, page, pageSize]);

	const filteredTicketOrders = useMemo(() => {
		return ticketOrders.filter((t) => {
			const matchesSearch =
				t.ticketCode.toLowerCase().includes(ticketSearch.toLowerCase()) ||
				t.attendeeName.toLowerCase().includes(ticketSearch.toLowerCase()) ||
				t.email.toLowerCase().includes(ticketSearch.toLowerCase());
			const matchesStatus =
				ticketStatusFilter === "all" || t.status === ticketStatusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [ticketOrders, ticketSearch, ticketStatusFilter]);

	const handleEdit = (ev: EventItem) => {
		setSelectedEvent(ev);
		setIsActionOpen(true);
	};
	const handleView = (ev: EventItem) => {
		setSelectedEvent(ev);
		setIsViewOpen(true);
	};
	const handleDelete = (ev: EventItem) => {
		setSelectedEvent(ev);
		setIsDeleteOpen(true);
	};
	const handleAdd = () => {
		setSelectedEvent(null);
		setIsActionOpen(true);
	};

	const onFormSubmit = (formData: FormData) => {
		if (selectedEvent) {
			updateMutation.mutate(
				{ id: selectedEvent._id, payload: formData },
				{ onSuccess: () => setIsActionOpen(false) },
			);
		} else {
			createMutation.mutate(formData, { onSuccess: () => setIsActionOpen(false) });
		}
	};

	const handleUpdateTicketStatus = (orderId: string, status: TicketOrderStatus) => {
		updateTicketStatusMutation.mutate({
			orderId,
			payload: { status },
		});
	};

	const eventColumns = getColumns(eventColumnsSchema(handleView, handleEdit, handleDelete));
	const ticketColumns = getColumns(
		ticketOrderColumnsSchema((row) => {
			setSelectedTicketOrder(row);
			setIsTicketViewOpen(true);
		}, handleUpdateTicketStatus),
	);

	return (
		<div className="space-y-6">
			{/* Top Summary Cards */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
				<StatWidget
					title="Active Shows & Tours"
					value={events.length}
					icon="ph:calendar-star-bold"
					trend="All Events"
				/>
				<StatWidget
					title="Total Tickets Sold"
					value={ticketSummary.totalTicketsSold.toLocaleString()}
					icon="ph:ticket-bold"
					trend={`${ticketSummary.totalOrders} Orders`}
				/>
				<StatWidget
					title="Ticket Revenue"
					value={`$${Number(ticketSummary.totalRevenue || 0).toFixed(2)}`}
					icon="ph:currency-dollar-bold"
					trend="Live Box Office"
				/>
			</div>

			<Tabs defaultValue="events" className="w-full space-y-6">
				<TabsList className="bg-card border border-border p-1 rounded-xl">
					<TabsTrigger
						value="events"
						className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-6"
					>
						Events &amp; Tour Dates ({events.length})
					</TabsTrigger>
					<TabsTrigger
						value="tickets"
						className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-6"
					>
						Ticket Orders &amp; Check-In ({ticketOrders.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="events">
					<TableLayoutWrapper
						title="Events & Tour Dates"
						columns={eventColumns}
						data={paginatedEvents}
						isLoading={eventsLoading}
						skeleton={<ProductListSkeleton />}
						addLabel="Create Event"
						searchQuery={search}
						onSearchChange={(val) => {
							setSearch(val);
							setPage(1);
						}}
						filters={[
							{
								label: "Event Status",
								value: statusFilter,
								options: [
									{ label: "UPCOMING", value: "UPCOMING" },
									{ label: "ON SALE", value: "ON SALE" },
									{ label: "SOLD OUT", value: "SOLD OUT" },
									{ label: "PAST SHOW", value: "PAST SHOW" },
									{ label: "CANCELLED", value: "CANCELLED" },
									{ label: "DRAFT", value: "DRAFT" },
								],
							},
						]}
						onFilterChange={(_, val) => {
							setStatusFilter(val);
							setPage(1);
						}}
						onAddClick={handleAdd}
						paginationProps={{
							currentPage: page,
							totalPages: Math.ceil(filteredEvents.length / pageSize) || 1,
							pageSize,
							totalEntries: filteredEvents.length,
							onPageChange: setPage,
							onPageSizeChange: (s) => {
								setPageSize(Number(s));
								setPage(1);
							},
						}}
					/>
				</TabsContent>

				<TabsContent value="tickets">
					<TableLayoutWrapper
						title="Ticket Sales & Reservations"
						columns={ticketColumns}
						data={filteredTicketOrders}
						isLoading={ticketsLoading}
						skeleton={<ProductListSkeleton />}
						searchQuery={ticketSearch}
						onSearchChange={setTicketSearch}
						filters={[
							{
								label: "Ticket Status",
								value: ticketStatusFilter,
								options: [
									{ label: "Processing", value: "Processing" },
									{ label: "Confirmed", value: "Confirmed" },
									{ label: "Checked In", value: "Checked In" },
									{ label: "Cancelled", value: "Cancelled" },
								],
							},
						]}
						onFilterChange={(_, val) => setTicketStatusFilter(val)}
					/>
				</TabsContent>
			</Tabs>

			<ActionModal
				open={isActionOpen}
				onOpenChange={setIsActionOpen}
				title={selectedEvent ? "Edit Event / Tour Date" : "Create New Event"}
				description="Configure event flyer, venue map embed, artist lineup, and ticket tiers"
				formId="event-form"
				isLoading={createMutation.isPending || updateMutation.isPending}
				submitLabel={selectedEvent ? "Update Event" : "Publish Event"}
			>
				<EventForm
					formId="event-form"
					initialData={selectedEvent || undefined}
					onSubmit={onFormSubmit}
				/>
			</ActionModal>

			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Event Details"
				onEditClick={() => {
					setIsViewOpen(false);
					setIsActionOpen(true);
				}}
			>
				{selectedEvent && (
					<div className="space-y-6">
						{selectedEvent.flyerUrl && (
							<img
								src={selectedEvent.flyerUrl}
								alt={selectedEvent.title}
								className="w-full h-56 object-cover rounded-2xl border border-border"
							/>
						)}

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Badge className="bg-primary text-white uppercase">
									{selectedEvent.status}
								</Badge>
								<Badge variant="outline" className="uppercase">
									{selectedEvent.eventType}
								</Badge>
							</div>
							<h3 className="font-display text-2xl font-bold text-foreground">
								{selectedEvent.title}
							</h3>
							<p className="text-xs font-bold text-primary uppercase">
								{selectedEvent.venue} • {selectedEvent.location}
							</p>
							{(selectedEvent.showTimes?.length || selectedEvent.time) && (
								<div className="flex flex-wrap gap-1.5 pt-1">
									{selectedEvent.showTimes && selectedEvent.showTimes.length > 0 ? (
										selectedEvent.showTimes.map((st, idx) => (
											<Badge
												key={idx}
												variant="outline"
												className="text-[11px] font-semibold"
											>
												{st.label ? `${st.label}: ` : ""}
												{st.time}
												{st.timezone ? ` ${st.timezone}` : ""}
											</Badge>
										))
									) : (
										<Badge variant="outline" className="text-[11px] font-semibold">
											{selectedEvent.time}
										</Badge>
									)}
								</div>
							)}
							<p className="text-sm text-muted-foreground">
								{selectedEvent.description}
							</p>
						</div>

						{selectedEvent.ticketTiers?.length > 0 && (
							<div className="space-y-3">
								<p className="text-xs font-bold uppercase text-primary">
									Ticket Tiers ({selectedEvent.ticketTiers.length})
								</p>
								{selectedEvent.ticketTiers.map((tier, idx) => (
									<div
										key={idx}
										className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
									>
										<div>
											<p className="text-sm font-bold text-foreground">
												{tier.name}
											</p>
											<p className="text-xs text-muted-foreground">
												{tier.soldQuantity} / {tier.totalQuantity} sold
											</p>
										</div>
										<span className="text-lg font-black text-primary">
											${Number(tier.price || 0).toFixed(2)}
										</span>
									</div>
								))}
							</div>
						)}

						{selectedEvent.artists?.length > 0 && (
							<div className="space-y-2">
								<p className="text-xs font-bold uppercase text-muted-foreground">
									Artist Lineup
								</p>
								<div className="flex flex-wrap gap-2">
									{selectedEvent.artists.map((a, i) => (
										<Badge
											key={i}
											variant="secondary"
											className="py-1.5 px-3 flex items-center gap-2"
										>
											{a.imageUrl ? (
												<img
													src={a.imageUrl}
													alt={a.name}
													className="size-5 rounded-full object-cover"
												/>
											) : (
												<Icon
													icon="ph:microphone-stage-bold"
													className="text-primary"
												/>
											)}
											{a.name} ({a.stage}{" "}
											{a.performanceTime && `• ${a.performanceTime}`})
										</Badge>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</ViewDetailsModal>

			<ViewDetailsModal
				open={isTicketViewOpen}
				onOpenChange={setIsTicketViewOpen}
				title="Ticket Reservation Details"
			>
				{selectedTicketOrder && (
					<div className="space-y-6">
						<div className="p-6 rounded-2xl bg-primary/10 border border-primary/30 text-center space-y-2">
							<p className="text-xs font-bold uppercase text-primary">Ticket Code</p>
							<h3 className="font-display text-3xl font-black text-foreground">
								{selectedTicketOrder.ticketCode}
							</h3>
							<Badge className="bg-primary text-white uppercase">
								{selectedTicketOrder.status}
							</Badge>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 rounded-xl bg-card border border-border">
								<p className="text-[10px] font-bold uppercase text-muted-foreground">
									Attendee
								</p>
								<p className="font-bold text-sm">
									{selectedTicketOrder.attendeeName}
								</p>
								<p className="text-xs text-muted-foreground">
									{selectedTicketOrder.email}
								</p>
							</div>
							<div className="p-4 rounded-xl bg-card border border-border">
								<p className="text-[10px] font-bold uppercase text-muted-foreground">
									Total Paid
								</p>
								<p className="font-black text-xl text-primary">
									${Number(selectedTicketOrder.totalAmount || 0).toFixed(2)}
								</p>
							</div>
						</div>

						<div className="space-y-2">
							<p className="text-xs font-bold uppercase text-muted-foreground">
								Tickets Reserved
							</p>
							{selectedTicketOrder.tickets.map((t, i) => (
								<div
									key={i}
									className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
								>
									<div>
										<p className="text-sm font-bold">{t.tierName}</p>
										<p className="text-xs text-muted-foreground">
											Qty: {t.quantity} × ${Number(t.unitPrice).toFixed(2)}
										</p>
									</div>
									<span className="font-bold">${Number(t.subtotal).toFixed(2)}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</ViewDetailsModal>

			<DeleteModal
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				onConfirm={() =>
					deleteMutation.mutate(selectedEvent!._id, {
						onSuccess: () => setIsDeleteOpen(false),
					})
				}
				isLoading={deleteMutation.isPending}
				title="Delete Event"
				description={`Are you sure you want to delete "${selectedEvent?.title}"?`}
			/>
		</div>
	);
}

