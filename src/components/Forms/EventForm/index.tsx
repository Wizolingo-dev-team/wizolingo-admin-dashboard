"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createEventSchema } from "@/validations/eventManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import type { EventArtist, EventItem, EventStatus, TicketTier } from "@/types/eventManagement";

interface EventFormProps {
	formId: string;
	initialData?: EventItem;
	onSubmit: (data: FormData) => void;
}

export default function EventForm({ formId, initialData, onSubmit }: EventFormProps) {
	const [flyerPreview, setFlyerPreview] = useState<string>(initialData?.flyerUrl || "");
	const [flyerFile, setFlyerFile] = useState<File | null>(null);
	const [artists, setArtists] = useState<EventArtist[]>(
		initialData?.artists || [
			{
				name: "Wiz Ofuasia (Wizboyy)",
				stage: "Main Stage",
				performanceTime: "10:00 PM",
				imageUrl: "",
			},
		],
	);
	const [ticketTiers, setTicketTiers] = useState<TicketTier[]>(
		initialData?.ticketTiers || [
			{
				name: "General Admission",
				description: "Standard concert entry",
				price: 45,
				currency: "USD",
				totalQuantity: 250,
				soldQuantity: 0,
				isActive: true,
			},
		],
	);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(createEventSchema),
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			startDate: initialData?.startDate
				? new Date(initialData.startDate).toISOString().split("T")[0]
				: "",
			endDate: initialData?.endDate
				? new Date(initialData.endDate).toISOString().split("T")[0]
				: "",
			dateLabel: initialData?.dateLabel || "",
			time: initialData?.time || "9:00 PM",
			venue: initialData?.venue || "",
			location: initialData?.location || "",
			mapEmbedUrl: initialData?.mapEmbedUrl || "",
			eventType: initialData?.eventType || "CONCERT",
			status: (initialData?.status || "UPCOMING") as EventStatus,
			websiteUrl: initialData?.websiteUrl || "",
			organizedBy: initialData?.organizedBy || "Wizolingo Music",
			flyerUrl: initialData?.flyerUrl || "",
			isFeatured: initialData?.isFeatured ?? false,
			isActive: initialData?.isActive ?? true,
		},
	});

	const isFeatured = watch("isFeatured");
	const isActive = watch("isActive");

	const handleFlyerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFlyerFile(file);
			setFlyerPreview(URL.createObjectURL(file));
		}
	};

	const addArtist = () => {
		setArtists((prev) => [
			...prev,
			{ name: "", stage: "Main Stage", performanceTime: "", imageUrl: "" },
		]);
	};

	const updateArtist = (idx: number, field: keyof EventArtist, val: string) => {
		setArtists((prev) =>
			prev.map((a, i) => (i === idx ? { ...a, [field]: val } : a)),
		);
	};

	const removeArtist = (idx: number) => {
		setArtists((prev) => prev.filter((_, i) => i !== idx));
	};

	const addTier = () => {
		setTicketTiers((prev) => [
			...prev,
			{
				name: "VIP Table",
				description: "Priority VIP seating & backstage meet",
				price: 120,
				currency: "USD",
				totalQuantity: 50,
				soldQuantity: 0,
				isActive: true,
			},
		]);
	};

	const updateTier = (idx: number, field: keyof TicketTier, val: any) => {
		setTicketTiers((prev) =>
			prev.map((t, i) => (i === idx ? { ...t, [field]: val } : t)),
		);
	};

	const removeTier = (idx: number) => {
		setTicketTiers((prev) => prev.filter((_, i) => i !== idx));
	};

	const onFormSubmit = (data: any) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("startDate", data.startDate);
		if (data.endDate) formData.append("endDate", data.endDate);
		if (data.dateLabel) formData.append("dateLabel", data.dateLabel);
		if (data.time) formData.append("time", data.time);
		formData.append("venue", data.venue);
		formData.append("location", data.location);
		if (data.mapEmbedUrl) formData.append("mapEmbedUrl", data.mapEmbedUrl);
		formData.append("eventType", data.eventType || "CONCERT");
		formData.append("status", data.status || "UPCOMING");
		if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
		formData.append("organizedBy", data.organizedBy || "Wizolingo Music");
		formData.append("isFeatured", String(Boolean(data.isFeatured)));
		formData.append("isActive", String(Boolean(data.isActive)));
		formData.append("artists", JSON.stringify(artists.filter((a) => a.name.trim())));
		formData.append("ticketTiers", JSON.stringify(ticketTiers.filter((t) => t.name.trim())));

		if (flyerFile) {
			formData.append("flyer", flyerFile);
		} else if (data.flyerUrl) {
			formData.append("flyerUrl", data.flyerUrl);
		}

		onSubmit(formData);
	};

	return (
		<form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pb-10">
			{/* Flyer Upload */}
			<div className="space-y-3">
				<Label className="text-sm font-bold flex items-center gap-2">
					<Icon icon="ph:image-bold" className="text-primary size-5" />
					Event Flyer / Poster
				</Label>
				<div className="flex items-center gap-4">
					<div className="size-24 rounded-2xl border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
						{flyerPreview ? (
							<img
								src={flyerPreview}
								alt="Flyer"
								className="size-full object-cover"
							/>
						) : (
							<Icon icon="ph:calendar-star-bold" className="size-10 text-primary/40" />
						)}
					</div>
					<div className="flex-1 space-y-2">
						<Input
							type="file"
							accept="image/*"
							onChange={handleFlyerChange}
							className="h-11 bg-background/60 border-border pt-2"
						/>
						<Input
							{...register("flyerUrl")}
							placeholder="Or paste flyer image URL..."
							className="h-10 bg-background/60 border-border text-xs"
						/>
					</div>
				</div>
			</div>

			{/* Event Core Info */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2 md:col-span-2">
					<Label className="text-sm font-bold">Event Title</Label>
					<Input
						{...register("title")}
						placeholder="e.g. Wiz Ofuasia Live in London — Afrocentric Tour"
						className="h-11 bg-background/60 border-border"
					/>
					{errors.title && (
						<p className="text-xs text-destructive">{errors.title.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Venue Name</Label>
					<Input
						{...register("venue")}
						placeholder="e.g. Indigo at The O2"
						className="h-11 bg-background/60 border-border"
					/>
					{errors.venue && (
						<p className="text-xs text-destructive">{errors.venue.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">City / Country Location</Label>
					<Input
						{...register("location")}
						placeholder="e.g. LONDON, ENGLAND"
						className="h-11 bg-background/60 border-border"
					/>
					{errors.location && (
						<p className="text-xs text-destructive">{errors.location.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Start Date</Label>
					<Input
						type="date"
						{...register("startDate")}
						className="h-11 bg-background/60 border-border"
					/>
					{errors.startDate && (
						<p className="text-xs text-destructive">{errors.startDate.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Show Time</Label>
					<Input
						{...register("time")}
						placeholder="e.g. 9:00 PM"
						className="h-11 bg-background/60 border-border"
					/>
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Event Status</Label>
					<Select
						defaultValue={initialData?.status || "UPCOMING"}
						onValueChange={(val) => setValue("status", val as EventStatus)}
					>
						<SelectTrigger className="h-11 bg-background/60 border-border">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="UPCOMING">UPCOMING</SelectItem>
							<SelectItem value="ON SALE">ON SALE</SelectItem>
							<SelectItem value="SOLD OUT">SOLD OUT</SelectItem>
							<SelectItem value="PAST SHOW">PAST SHOW</SelectItem>
							<SelectItem value="CANCELLED">CANCELLED</SelectItem>
							<SelectItem value="DRAFT">DRAFT</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Event Type Badge</Label>
					<Input
						{...register("eventType")}
						placeholder="CONCERT, TOUR, FESTIVAL"
						className="h-11 bg-background/60 border-border"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">Event Description</Label>
				<Textarea
					{...register("description")}
					placeholder="Describe the live show, age restrictions, dress code, and VIP perks..."
					className="min-h-[100px] bg-background/60 border-border"
				/>
				{errors.description && (
					<p className="text-xs text-destructive">{errors.description.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">
					Google Maps Embed URL (iframe src for Venue Map)
				</Label>
				<Input
					{...register("mapEmbedUrl")}
					placeholder="https://www.google.com/maps/embed?pb=..."
					className="h-11 bg-background/60 border-border"
				/>
			</div>

			{/* Ticket Tiers Builder */}
			<div className="space-y-3 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-bold flex items-center gap-2">
						<Icon icon="ph:ticket-bold" className="text-primary size-5" />
						Ticket Tiers &amp; Pricing ({ticketTiers.length})
					</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addTier}
						className="gap-1.5 border-primary/40 text-primary hover:bg-primary/15"
					>
						<Icon icon="ph:plus-bold" /> Add Tier
					</Button>
				</div>

				{ticketTiers.map((tier, idx) => (
					<div
						key={idx}
						className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-background/50 border border-border"
					>
						<Input
							value={tier.name}
							onChange={(e) => updateTier(idx, "name", e.target.value)}
							placeholder="Tier name (e.g. VIP)"
							className="col-span-4 h-9 text-xs"
						/>
						<Input
							type="number"
							value={tier.price}
							onChange={(e) => updateTier(idx, "price", Number(e.target.value))}
							placeholder="Price ($)"
							className="col-span-3 h-9 text-xs"
						/>
						<Input
							type="number"
							value={tier.totalQuantity}
							onChange={(e) =>
								updateTier(idx, "totalQuantity", Number(e.target.value))
							}
							placeholder="Capacity"
							className="col-span-4 h-9 text-xs"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => removeTier(idx)}
							className="col-span-1 h-8 w-8 text-destructive"
						>
							<Icon icon="ph:trash-bold" />
						</Button>
					</div>
				))}
			</div>

			{/* Artist Lineup Builder */}
			<div className="space-y-3 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-bold flex items-center gap-2">
						<Icon icon="ph:microphone-stage-bold" className="text-primary size-5" />
						Performing Artists Lineup ({artists.length})
					</Label>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addArtist}
						className="gap-1.5 border-primary/40 text-primary hover:bg-primary/15"
					>
						<Icon icon="ph:plus-bold" /> Add Artist
					</Button>
				</div>

				{artists.map((artist, idx) => (
					<div
						key={idx}
						className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-background/50 border border-border"
					>
						<Input
							value={artist.name}
							onChange={(e) => updateArtist(idx, "name", e.target.value)}
							placeholder="Artist Name"
							className="col-span-5 h-9 text-xs"
						/>
						<Input
							value={artist.stage}
							onChange={(e) => updateArtist(idx, "stage", e.target.value)}
							placeholder="Stage"
							className="col-span-3 h-9 text-xs"
						/>
						<Input
							value={artist.performanceTime}
							onChange={(e) =>
								updateArtist(idx, "performanceTime", e.target.value)
							}
							placeholder="10:00 PM"
							className="col-span-3 h-9 text-xs"
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => removeArtist(idx)}
							className="col-span-1 h-8 w-8 text-destructive"
						>
							<Icon icon="ph:trash-bold" />
						</Button>
					</div>
				))}
			</div>

			{/* Visibility Flags */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-bold text-foreground">Featured Tour Date</p>
						<p className="text-xs text-muted-foreground">Highlight on homepage</p>
					</div>
					<Switch
						checked={Boolean(isFeatured)}
						onCheckedChange={(checked) => setValue("isFeatured", checked)}
					/>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-bold text-foreground">Published &amp; Active</p>
						<p className="text-xs text-muted-foreground">Visible on /events page</p>
					</div>
					<Switch
						checked={Boolean(isActive)}
						onCheckedChange={(checked) => setValue("isActive", checked)}
					/>
				</div>
			</div>
		</form>
	);
}

