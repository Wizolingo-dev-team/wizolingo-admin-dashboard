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
import { DatePicker } from "@/components/ui/date-picker";
import { Icon } from "@iconify/react";
import type {
	EventArtist,
	EventItem,
	EventStatus,
	ShowTimeItem,
	TicketTier,
} from "@/types/eventManagement";

const SHOW_TIME_OPTIONS = [
	"12:00 AM",
	"1:00 AM",
	"2:00 AM",
	"6:00 AM",
	"8:00 AM",
	"10:00 AM",
	"12:00 PM",
	"1:00 PM",
	"2:00 PM",
	"3:00 PM",
	"4:00 PM",
	"5:00 PM",
	"6:00 PM",
	"6:30 PM",
	"7:00 PM",
	"7:30 PM",
	"8:00 PM",
	"8:30 PM",
	"9:00 PM",
	"9:30 PM",
	"10:00 PM",
	"10:30 PM",
	"11:00 PM",
	"11:30 PM",
];

const TIMEZONE_OPTIONS = [
	{ label: "WAT — West Africa Time (Lagos, UTC+1)", value: "WAT" },
	{ label: "GMT / BST — London (UTC+0 / +1)", value: "GMT" },
	{ label: "CET / CEST — Central Europe (Berlin, Paris, UTC+1 / +2)", value: "CET" },
	{ label: "EST / EDT — US East Coast (New York, UTC-5 / -4)", value: "EST" },
	{ label: "CST / CDT — US Central (Chicago, UTC-6 / -5)", value: "CST" },
	{ label: "PST / PDT — US West Coast (LA, UTC-8 / -7)", value: "PST" },
	{ label: "EAT — East Africa Time (Nairobi, UTC+3)", value: "EAT" },
	{ label: "SAST — South Africa (Johannesburg, UTC+2)", value: "SAST" },
	{ label: "GST — Gulf Standard Time (Dubai, UTC+4)", value: "GST" },
	{ label: "AEST — Australia East (Sydney, UTC+10)", value: "AEST" },
];

const EVENT_TYPE_OPTIONS = [
	"CONCERT",
	"TOUR",
	"FESTIVAL",
	"ALBUM LAUNCH",
	"MEET & GREET",
	"PRIVATE SHOW",
];

interface EventFormProps {
	formId: string;
	initialData?: EventItem;
	onSubmit: (data: FormData) => void;
}

export default function EventForm({ formId, initialData, onSubmit }: EventFormProps) {
	const [flyerPreview, setFlyerPreview] = useState<string>(initialData?.flyerUrl || "");
	const [flyerFile, setFlyerFile] = useState<File | null>(null);
	const [artistFiles, setArtistFiles] = useState<Record<number, File>>({});
	const [artistPreviews, setArtistPreviews] = useState<Record<number, string>>({});
	const [artists, setArtists] = useState<EventArtist[]>(() => {
		if (initialData?.artists && initialData.artists.length > 0) {
			return initialData.artists.map((a) => ({
				...a,
				showTimes:
					a.showTimes && a.showTimes.length > 0
						? a.showTimes.map((st) => ({
								_id: st._id,
								time: st.time,
								timezone: st.timezone || "WAT",
								label: st.label || "",
							}))
						: [
								{
									time: a.performanceTime || "10:00 PM",
									timezone: a.timezone || "WAT",
									label: "",
								},
							],
			}));
		}
		return [
			{
				name: "Wiz Ofuasia (Wizboyy)",
				stage: "Main Stage",
				performanceTime: "10:00 PM",
				timezone: "WAT",
				showTimes: [{ time: "10:00 PM", timezone: "WAT", label: "" }],
				imageUrl: "",
			},
		];
	});
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
	const [showTimes, setShowTimes] = useState<ShowTimeItem[]>(() => {
		if (initialData?.showTimes && initialData.showTimes.length > 0) {
			return initialData.showTimes.map((s) => ({
				_id: s._id,
				time: s.time,
				timezone: s.timezone || "WAT",
				label: s.label || "",
			}));
		}
		if (initialData?.time) {
			return [
				{
					time: initialData.time.replace(/\s*\(?[A-Z]{2,5}\)?$/, "").trim() || "9:00 PM",
					timezone: initialData.timezone || "WAT",
					label: "",
				},
			];
		}
		return [{ time: "9:00 PM", timezone: "WAT", label: "" }];
	});

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
			time: initialData?.time
				? initialData.time.replace(/\s*\(?[A-Z]{2,5}\)?$/, "").trim()
				: "9:00 PM",
			timezone: initialData?.timezone || "WAT",
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
	const startDateValue = watch("startDate");
	const endDateValue = watch("endDate");
	const eventTypeValue = watch("eventType");

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
			{
				name: "",
				stage: "Main Stage",
				performanceTime: "10:00 PM",
				timezone: "WAT",
				showTimes: [{ time: "10:00 PM", timezone: "WAT", label: "" }],
				imageUrl: "",
			},
		]);
	};

	const addArtistShowTime = (artistIdx: number) => {
		setArtists((prev) =>
			prev.map((a, i) =>
				i === artistIdx
					? {
							...a,
							showTimes: [
								...(a.showTimes || []),
								{ time: "10:00 PM", timezone: "WAT", label: "" },
							],
						}
					: a,
			),
		);
	};

	const updateArtistShowTime = (
		artistIdx: number,
		timeIdx: number,
		field: keyof ShowTimeItem,
		val: string,
	) => {
		setArtists((prev) =>
			prev.map((a, i) => {
				if (i !== artistIdx) return a;
				const nextTimes = (a.showTimes || []).map((st, j) =>
					j === timeIdx ? { ...st, [field]: val } : st,
				);
				return {
					...a,
					showTimes: nextTimes,
					performanceTime: nextTimes[0]?.time || a.performanceTime,
					timezone: nextTimes[0]?.timezone || a.timezone,
				};
			}),
		);
	};

	const removeArtistShowTime = (artistIdx: number, timeIdx: number) => {
		setArtists((prev) =>
			prev.map((a, i) => {
				if (i !== artistIdx) return a;
				const nextTimes = (a.showTimes || []).filter((_, j) => j !== timeIdx);
				return {
					...a,
					showTimes: nextTimes,
					performanceTime: nextTimes[0]?.time || "",
					timezone: nextTimes[0]?.timezone || "",
				};
			}),
		);
	};

	const updateArtist = (idx: number, field: keyof EventArtist, val: string) => {
		setArtists((prev) =>
			prev.map((a, i) => (i === idx ? { ...a, [field]: val } : a)),
		);
	};

	const removeArtist = (idx: number) => {
		setArtists((prev) => prev.filter((_, i) => i !== idx));
		setArtistFiles((prev) => {
			const next: Record<number, File> = {};
			Object.entries(prev).forEach(([k, v]) => {
				const num = Number(k);
				if (num < idx) next[num] = v;
				else if (num > idx) next[num - 1] = v;
			});
			return next;
		});
		setArtistPreviews((prev) => {
			const next: Record<number, string> = {};
			Object.entries(prev).forEach(([k, v]) => {
				const num = Number(k);
				if (num < idx) next[num] = v;
				else if (num > idx) next[num - 1] = v;
			});
			return next;
		});
	};

	const handleArtistImageChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setArtistFiles((prev) => ({ ...prev, [idx]: file }));
		setArtistPreviews((prev) => ({ ...prev, [idx]: URL.createObjectURL(file) }));
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

	const addShowTime = () => {
		setShowTimes((prev) => [
			...prev,
			{ time: "9:00 PM", timezone: "WAT", label: "" },
		]);
	};

	const updateShowTime = (idx: number, field: keyof ShowTimeItem, val: string) => {
		setShowTimes((prev) =>
			prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item)),
		);
	};

	const removeShowTime = (idx: number) => {
		setShowTimes((prev) => prev.filter((_, i) => i !== idx));
	};

	const onFormSubmit = (data: any) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("startDate", data.startDate);
		if (data.endDate) formData.append("endDate", data.endDate);
		if (data.dateLabel) formData.append("dateLabel", data.dateLabel);
		const cleanedShowTimes = showTimes
			.filter((s) => s.time.trim())
			.map((s) => ({
				time: s.time.trim(),
				timezone: s.timezone.trim(),
				label: (s.label || "").trim(),
			}));
		formData.append("showTimes", JSON.stringify(cleanedShowTimes));
		const primary = cleanedShowTimes[0];
		if (primary) {
			const formattedTime = primary.timezone
				? `${primary.time} ${primary.timezone}`
				: primary.time;
			formData.append("time", formattedTime);
			if (primary.timezone) formData.append("timezone", primary.timezone);
		}
		formData.append("venue", data.venue);
		formData.append("location", data.location);
		if (data.mapEmbedUrl) formData.append("mapEmbedUrl", data.mapEmbedUrl);
		formData.append("eventType", data.eventType || "CONCERT");
		formData.append("status", data.status || "UPCOMING");
		if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
		formData.append("organizedBy", data.organizedBy || "Wizolingo Music");
		formData.append("isFeatured", String(Boolean(data.isFeatured)));
		formData.append("isActive", String(Boolean(data.isActive)));
		const filteredArtists = artists.filter((a) => a.name.trim());
		const serializedArtists = filteredArtists.map((a) => {
			const cleanedTimes = (a.showTimes || [])
				.filter((st) => st.time.trim())
				.map((st) => ({
					time: st.time.trim(),
					timezone: st.timezone.trim(),
					label: (st.label || "").trim(),
				}));
			return {
				...a,
				showTimes: cleanedTimes,
				performanceTime: cleanedTimes[0]?.time || a.performanceTime || "",
				timezone: cleanedTimes[0]?.timezone || a.timezone || "",
			};
		});
		formData.append("artists", JSON.stringify(serializedArtists));
		formData.append("ticketTiers", JSON.stringify(ticketTiers.filter((t) => t.name.trim())));

		const imageIndexes: number[] = [];
		artists.forEach((a, originalIdx) => {
			if (!a.name.trim()) return;
			const filteredIdx = filteredArtists.indexOf(a);
			const file = artistFiles[originalIdx];
			if (file && filteredIdx !== -1) {
				formData.append("artistImages", file);
				imageIndexes.push(filteredIdx);
			}
		});
		if (imageIndexes.length > 0) {
			formData.append("artistImageIndexes", JSON.stringify(imageIndexes));
		}

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
					<DatePicker
						value={startDateValue || ""}
						onChange={(val) =>
							setValue("startDate", val, { shouldValidate: true })
						}
						placeholder="Pick start date"
					/>
					{errors.startDate && (
						<p className="text-xs text-destructive">{errors.startDate.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">End Date (Optional)</Label>
					<DatePicker
						value={endDateValue || ""}
						onChange={(val) =>
							setValue("endDate", val, { shouldValidate: true })
						}
						placeholder="Pick end date"
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
					<Select
						value={eventTypeValue || "CONCERT"}
						onValueChange={(val) => setValue("eventType", val)}
					>
						<SelectTrigger className="h-11 bg-background/60 border-border">
							<SelectValue placeholder="Select event type" />
						</SelectTrigger>
						<SelectContent>
							{EVENT_TYPE_OPTIONS.map((type) => (
								<SelectItem key={type} value={type}>
									{type}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Show Times & Time Zones Builder */}
			<div className="space-y-3 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<div>
						<Label className="text-sm font-bold flex items-center gap-2">
							<Icon icon="ph:clock-bold" className="text-primary size-5" />
							Show Times &amp; Time Zones ({showTimes.length})
						</Label>
						<p className="text-[11px] text-muted-foreground mt-0.5">
							Add one or more show times with their corresponding time zones (e.g.
							Doors Open, Main Set).
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addShowTime}
						className="gap-1.5 border-primary/40 text-primary hover:bg-primary/15 shrink-0"
					>
						<Icon icon="ph:plus-bold" /> Add Show Time
					</Button>
				</div>

				{showTimes.map((st, idx) => (
					<div
						key={idx}
						className="grid grid-cols-12 gap-2 items-end p-3 rounded-xl bg-background/50 border border-border"
					>
						<div className="col-span-4 space-y-1">
							<Label className="text-[10px] font-bold uppercase text-muted-foreground">
								Show Time
							</Label>
							<Select
								value={st.time || "9:00 PM"}
								onValueChange={(val) => updateShowTime(idx, "time", val)}
							>
								<SelectTrigger className="h-9 text-xs bg-background/60 border-border">
									<SelectValue placeholder="Select show time" />
								</SelectTrigger>
								<SelectContent>
									{SHOW_TIME_OPTIONS.map((t) => (
										<SelectItem key={t} value={t}>
											{t}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="col-span-4 space-y-1">
							<Label className="text-[10px] font-bold uppercase text-muted-foreground">
								Time Zone
							</Label>
							<Select
								value={st.timezone || "WAT"}
								onValueChange={(val) => updateShowTime(idx, "timezone", val)}
							>
								<SelectTrigger className="h-9 text-xs bg-background/60 border-border">
									<SelectValue placeholder="Select time zone" />
								</SelectTrigger>
								<SelectContent>
									{TIMEZONE_OPTIONS.map((tz) => (
										<SelectItem key={tz.value} value={tz.value}>
											{tz.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="col-span-3 space-y-1">
							<Label className="text-[10px] font-bold uppercase text-muted-foreground">
								Label (Optional)
							</Label>
							<Input
								value={st.label || ""}
								onChange={(e) => updateShowTime(idx, "label", e.target.value)}
								placeholder="e.g. Main Set"
								className="h-9 text-xs"
							/>
						</div>

						<div className="col-span-1 flex justify-end">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => removeShowTime(idx)}
								disabled={showTimes.length <= 1}
								className="h-9 w-9 text-destructive hover:bg-destructive/15 disabled:opacity-35"
								title="Remove show time"
							>
								<Icon icon="ph:trash-bold" />
							</Button>
						</div>
					</div>
				))}
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
					Google Maps Location / Embed URL
				</Label>
				<Input
					{...register("mapEmbedUrl")}
					onBlur={(e) => {
						const val = e.target.value.trim();
						const srcMatch = val.match(/src=["']([^"']+)["']/i);
						if (srcMatch?.[1]) {
							setValue("mapEmbedUrl", srcMatch[1]);
						}
					}}
					placeholder="Paste Google Maps share link (maps.app.goo.gl/...) or Embed iframe src"
					className="h-11 bg-background/60 border-border"
				/>
				<p className="text-[11px] text-muted-foreground">
					Supports Google Maps Embed URLs, full &lt;iframe&gt; snippets, or share links
					(auto-resolved on the event page).
				</p>
			</div>

			{/* Ticket Tiers Builder */}
			<div className="space-y-3 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<div>
						<Label className="text-sm font-bold flex items-center gap-2">
							<Icon icon="ph:ticket-bold" className="text-primary size-5" />
							Ticket Tiers &amp; Pricing ({ticketTiers.length})
						</Label>
						<p className="text-[11px] text-muted-foreground mt-0.5">
							Define ticket categories (e.g. General Admission, VIP), USD price, and
							total capacity.
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addTier}
						className="gap-1.5 border-primary/40 text-primary hover:bg-primary/15 shrink-0"
					>
						<Icon icon="ph:plus-bold" /> Add Tier
					</Button>
				</div>

				{ticketTiers.map((tier, idx) => (
					<div
						key={idx}
						className="space-y-3 p-3 rounded-xl bg-background/50 border border-border"
					>
						<div className="grid grid-cols-12 gap-2 items-end">
							<div className="col-span-5 space-y-1">
								<Label className="text-[10px] font-bold uppercase text-muted-foreground">
									Tier Name
								</Label>
								<Input
									value={tier.name}
									onChange={(e) => updateTier(idx, "name", e.target.value)}
									placeholder="e.g. General Admission"
									className="h-9 text-xs"
								/>
							</div>
							<div className="col-span-3 space-y-1">
								<Label className="text-[10px] font-bold uppercase text-muted-foreground">
									Price (USD $)
								</Label>
								<Input
									type="number"
									min={0}
									step="0.01"
									value={tier.price}
									onChange={(e) =>
										updateTier(idx, "price", Number(e.target.value))
									}
									placeholder="45"
									className="h-9 text-xs"
								/>
							</div>
							<div className="col-span-3 space-y-1">
								<Label className="text-[10px] font-bold uppercase text-muted-foreground">
									Capacity {tier.soldQuantity > 0 ? `(${tier.soldQuantity} sold)` : ""}
								</Label>
								<Input
									type="number"
									min={0}
									value={tier.totalQuantity}
									onChange={(e) =>
										updateTier(idx, "totalQuantity", Number(e.target.value))
									}
									placeholder="250"
									className="h-9 text-xs"
								/>
							</div>
							<div className="col-span-1 flex justify-end">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeTier(idx)}
									className="h-9 w-9 text-destructive"
								>
									<Icon icon="ph:trash-bold" />
								</Button>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Input
								value={tier.description}
								onChange={(e) => updateTier(idx, "description", e.target.value)}
								placeholder="Tier perks / description (e.g. Standard concert entry)"
								className="h-8 text-xs flex-1"
							/>
							<div className="flex items-center gap-2 shrink-0">
								<span className="text-[10px] font-bold uppercase text-muted-foreground">
									Active
								</span>
								<Switch
									checked={tier.isActive}
									onCheckedChange={(checked) =>
										updateTier(idx, "isActive", checked)
									}
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Artist Lineup Builder */}
			<div className="space-y-3 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<div>
						<Label className="text-sm font-bold flex items-center gap-2">
							<Icon icon="ph:microphone-stage-bold" className="text-primary size-5" />
							Performing Artists Lineup ({artists.length})
						</Label>
						<p className="text-[11px] text-muted-foreground mt-0.5">
							Add artists, stage, set time, and upload or link an artist photo.
						</p>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addArtist}
						className="gap-1.5 border-primary/40 text-primary hover:bg-primary/15 shrink-0"
					>
						<Icon icon="ph:plus-bold" /> Add Artist
					</Button>
				</div>

				{artists.map((artist, idx) => {
					const photoSrc = artistPreviews[idx] || artist.imageUrl;
					const artistTimes = artist.showTimes || [
						{
							time: artist.performanceTime || "10:00 PM",
							timezone: artist.timezone || "WAT",
							label: "",
						},
					];
					return (
						<div
							key={idx}
							className="space-y-3 p-3 rounded-xl bg-background/50 border border-border"
						>
							<div className="grid grid-cols-12 gap-2 items-center">
								<div className="col-span-6">
									<Input
										value={artist.name}
										onChange={(e) => updateArtist(idx, "name", e.target.value)}
										placeholder="Artist Name"
										className="h-9 text-xs"
									/>
								</div>
								<div className="col-span-5">
									<Input
										value={artist.stage}
										onChange={(e) => updateArtist(idx, "stage", e.target.value)}
										placeholder="Stage"
										className="h-9 text-xs"
									/>
								</div>
								<div className="col-span-1 flex justify-end">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeArtist(idx)}
										className="h-8 w-8 text-destructive"
									>
										<Icon icon="ph:trash-bold" />
									</Button>
								</div>
							</div>

							<div className="space-y-2 rounded-lg border border-border/60 bg-card/40 p-2.5">
								<div className="flex items-center justify-between">
									<span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
										Set Times &amp; Time Zones ({artistTimes.length})
									</span>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => addArtistShowTime(idx)}
										className="h-7 px-2 text-[11px] gap-1 border-primary/40 text-primary hover:bg-primary/15"
									>
										<Icon icon="ph:plus-bold" className="size-3" /> Add Time
									</Button>
								</div>
								{artistTimes.map((st, timeIdx) => (
									<div
										key={timeIdx}
										className="grid grid-cols-12 gap-2 items-center"
									>
										<div className="col-span-4">
											<Select
												value={st.time || "10:00 PM"}
												onValueChange={(val) =>
													updateArtistShowTime(idx, timeIdx, "time", val)
												}
											>
												<SelectTrigger className="h-8 text-xs bg-background/60 border-border">
													<SelectValue placeholder="Set Time" />
												</SelectTrigger>
												<SelectContent>
													{SHOW_TIME_OPTIONS.map((t) => (
														<SelectItem key={t} value={t}>
															{t}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="col-span-4">
											<Select
												value={st.timezone || "WAT"}
												onValueChange={(val) =>
													updateArtistShowTime(idx, timeIdx, "timezone", val)
												}
											>
												<SelectTrigger className="h-8 text-xs bg-background/60 border-border">
													<SelectValue placeholder="Time Zone" />
												</SelectTrigger>
												<SelectContent>
													{TIMEZONE_OPTIONS.map((tz) => (
														<SelectItem key={tz.value} value={tz.value}>
															{tz.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="col-span-3">
											<Input
												value={st.label || ""}
												onChange={(e) =>
													updateArtistShowTime(
														idx,
														timeIdx,
														"label",
														e.target.value,
													)
												}
												placeholder="Label (opt.)"
												className="h-8 text-xs"
											/>
										</div>
										<div className="col-span-1 flex justify-end">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => removeArtistShowTime(idx, timeIdx)}
												disabled={artistTimes.length <= 1}
												className="h-8 w-8 text-destructive hover:bg-destructive/15 disabled:opacity-35"
												title="Remove set time"
											>
												<Icon icon="ph:trash-bold" />
											</Button>
										</div>
									</div>
								))}
							</div>

							<div className="flex items-center gap-3">
								<div className="size-10 rounded-full border border-border bg-muted overflow-hidden flex items-center justify-center shrink-0">
									{photoSrc ? (
										<img
											src={photoSrc}
											alt={artist.name || "Artist"}
											className="size-full object-cover"
										/>
									) : (
										<Icon
											icon="ph:user-bold"
											className="size-4 text-muted-foreground"
										/>
									)}
								</div>
								<label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[11px] font-bold hover:border-primary/50 transition-colors shrink-0">
									<Icon icon="ph:upload-simple-bold" className="text-primary" />
									Upload Photo
									<input
										type="file"
										accept="image/*"
										className="hidden"
										onChange={(e) => handleArtistImageChange(idx, e)}
									/>
								</label>
								<Input
									value={artist.imageUrl}
									onChange={(e) =>
										updateArtist(idx, "imageUrl", e.target.value)
									}
									placeholder="Or paste artist image URL..."
									className="h-8 text-xs flex-1"
								/>
							</div>
						</div>
					);
				})}
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

