"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createProductSchema } from "@/validations/productManagement";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetAllCategories } from "@/hooks/categoryManagement";
import {
	DigitalReleaseType,
	Product,
	ProductType,
	TracklistItem,
} from "@/types/productManagement";

interface TagInputProps {
	tags: string[];
	setTags: (tags: string[]) => void;
	placeholder: string;
	error?: string;
}

const TagInput = ({ tags, setTags, placeholder, error }: TagInputProps) => {
	const [inputValue, setInputValue] = useState("");

	const addTag = (val: string) => {
		const cleanVal = val.trim().replace(/,/g, "");
		if (cleanVal && !tags.includes(cleanVal)) {
			setTags([...tags, cleanVal]);
		}
		setInputValue("");
	};

	const removeTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-2">
			<div
				className={cn(
					"flex flex-wrap items-center gap-2 min-h-12 p-2 rounded-xl border bg-background/60 transition-all focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary",
					error ? "border-destructive" : "border-border",
				)}
			>
				{tags.map((tag, idx) => (
					<Badge
						key={idx}
						variant="secondary"
						className="pl-3 pr-1 py-1 gap-1 bg-primary/15 text-primary border border-primary/30"
					>
						<span className="text-xs font-bold uppercase tracking-wider">{tag}</span>
						<button
							type="button"
							onClick={() => removeTag(idx)}
							className="rounded-full hover:bg-primary/20 p-0.5"
						>
							<Icon icon="ph:x-bold" className="size-3" />
						</button>
					</Badge>
				))}
				<input
					value={inputValue}
					onChange={(e) => {
						if (e.target.value.endsWith(",")) {
							addTag(e.target.value);
						} else {
							setInputValue(e.target.value);
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							addTag(inputValue);
						}
					}}
					placeholder={tags.length === 0 ? placeholder : ""}
					className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px] text-foreground placeholder:text-muted-foreground/60"
				/>
			</div>
			{error && <p className="text-[11px] font-medium text-destructive ml-1">{error}</p>}
		</div>
	);
};

interface ProductFormProps {
	formId: string;
	initialData?: Product;
	onSubmit: (data: FormData) => void;
}

export default function ProductForm({ formId, initialData, onSubmit }: ProductFormProps) {
	const { data: categories = [] } = useGetAllCategories();
	const [previews, setPreviews] = useState<string[]>(initialData?.attachments || []);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [digitalFiles, setDigitalFiles] = useState<File[]>([]);
	const [previewAudioFile, setPreviewAudioFile] = useState<File | null>(null);

	const [colors, setColors] = useState<string[]>(initialData?.color || []);
	const [sizes, setSizes] = useState<string[]>(initialData?.size || []);
	const [tracklist, setTracklist] = useState<TracklistItem[]>(initialData?.tracklist || []);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(createProductSchema),
		defaultValues: {
			productName: initialData?.productName || "",
			productType: (initialData?.productType || "merch") as ProductType,
			description: initialData?.description || "",
			price: initialData?.price || 0,
			quantity: initialData?.quantity ?? 25,
			categories: initialData?.categories?.[0]?._id || "",
			subcategoryId: initialData?.subcategoryId || "",
			colors: initialData?.color?.join(",") || "",
			sizes: initialData?.size?.join(",") || "",
			digitalReleaseType: initialData?.digitalReleaseType || "single",
			artist: initialData?.artist || "Wiz Ofuasia (Wizboyy)",
			releaseDate: initialData?.releaseDate
				? new Date(initialData.releaseDate).toISOString().split("T")[0]
				: "",
			duration: initialData?.duration || "",
			previewUrl: initialData?.previewUrl || "",
			isFeatured: initialData?.isFeatured ?? false,
			isActive: initialData?.isActive ?? true,
		},
	});

	const productType = watch("productType");
	const selectedCatId = watch("categories");
	const isFeatured = watch("isFeatured");
	const isActive = watch("isActive");

	const subCategories =
		categories.find((c) => c._id === selectedCatId)?.subcategories || [];

	useEffect(() => {
		setValue("colors", colors.join(","));
	}, [colors, setValue]);

	useEffect(() => {
		setValue("sizes", sizes.join(","));
	}, [sizes, setValue]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setSelectedFiles((prev) => [...prev, ...files]);
		const newPreviews = files.map((file) => URL.createObjectURL(file));
		setPreviews((prev) => [...prev, ...newPreviews]);
	};

	const removeFile = (index: number) => {
		setPreviews((prev) => prev.filter((_, i) => i !== index));
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const addTrack = () => {
		setTracklist((prev) => [
			...prev,
			{
				trackNumber: prev.length + 1,
				title: "",
				duration: "3:30",
				featuredArtists: "",
			},
		]);
	};

	const updateTrack = (index: number, field: keyof TracklistItem, val: string | number) => {
		setTracklist((prev) =>
			prev.map((item, idx) => (idx === index ? { ...item, [field]: val } : item)),
		);
	};

	const removeTrack = (index: number) => {
		setTracklist((prev) =>
			prev
				.filter((_, idx) => idx !== index)
				.map((item, idx) => ({ ...item, trackNumber: idx + 1 })),
		);
	};

	const onFormSubmit = (data: any) => {
		const formData = new FormData();
		formData.append("productName", data.productName);
		formData.append("productType", data.productType);
		formData.append("description", data.description);
		formData.append("price", String(data.price));
		if (data.categories) formData.append("categories", data.categories);
		if (data.subcategoryId) formData.append("subcategoryId", data.subcategoryId);
		formData.append("isFeatured", String(Boolean(data.isFeatured)));
		formData.append("isActive", String(Boolean(data.isActive)));

		if (data.productType === "merch") {
			formData.append("quantity", String(data.quantity || 0));
			formData.append("colors", colors.join(","));
			formData.append("sizes", sizes.join(","));
			formData.append("shipping", "true");
		} else {
			formData.append("digitalReleaseType", data.digitalReleaseType || "single");
			formData.append("artist", data.artist || "Wiz Ofuasia (Wizboyy)");
			if (data.releaseDate) formData.append("releaseDate", data.releaseDate);
			if (data.duration) formData.append("duration", data.duration);
			if (data.previewUrl) formData.append("previewUrl", data.previewUrl);
			formData.append("tracklist", JSON.stringify(tracklist));
			formData.append("shipping", "false");

			if (previewAudioFile) {
				formData.append("previewFile", previewAudioFile);
			}
			digitalFiles.forEach((file) => {
				formData.append("digitalFiles", file);
			});
		}

		const existingUrls = previews.filter((src) => src.startsWith("http"));
		existingUrls.forEach((url) => {
			formData.append("existingAttachments", url);
		});

		selectedFiles.forEach((file) => {
			formData.append("attachments", file);
		});

		onSubmit(formData);
	};

	return (
		<form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 pb-10">
			{/* Product Type Selector */}
			<div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-card border border-border">
				<button
					type="button"
					onClick={() => setValue("productType", "merch")}
					className={cn(
						"flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
						productType === "merch"
							? "bg-primary text-white shadow-lg shadow-primary/25"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<Icon icon="ph:t-shirt-bold" className="size-4" />
					Artist Merch
				</button>
				<button
					type="button"
					onClick={() => setValue("productType", "digital_music")}
					className={cn(
						"flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
						productType === "digital_music"
							? "bg-primary text-white shadow-lg shadow-primary/25"
							: "text-muted-foreground hover:text-foreground",
					)}
				>
					<Icon icon="ph:music-notes-bold" className="size-4" />
					Digital Music Download
				</button>
			</div>

			{/* 1. Artwork / Gallery Upload Section */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-bold flex items-center gap-2">
						<Icon icon="ph:images-bold" className="text-primary size-5" />
						{productType === "digital_music"
							? "Cover Artwork & Gallery"
							: "Product Images"}
					</Label>
					<span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
						{previews.length} / 5 Images
					</span>
				</div>

				<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
					{previews.map((src, idx) => (
						<div
							key={idx}
							className="relative group aspect-square rounded-2xl border border-border overflow-hidden bg-muted shadow-sm"
						>
							<img src={src} className="object-cover size-full" alt="Preview" />
							<div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
								<button
									type="button"
									onClick={() => removeFile(idx)}
									className="size-8 bg-destructive text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
								>
									<Icon icon="ph:trash-bold" className="size-4" />
								</button>
							</div>
						</div>
					))}

					{previews.length < 5 && (
						<label className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer group">
							<div className="size-10 rounded-full bg-primary/15 flex items-center justify-center group-hover:scale-110 transition-transform">
								<Icon icon="ph:plus-bold" className="size-5 text-primary" />
							</div>
							<span className="mt-2 text-[10px] font-bold uppercase text-muted-foreground">
								Add Image
							</span>
							<input
								type="file"
								multiple
								className="hidden"
								onChange={handleFileChange}
								accept="image/*"
							/>
						</label>
					)}
				</div>
			</div>

			<hr className="border-border/50" />

			{/* 2. Basic Information */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label className="text-sm font-bold">
						{productType === "digital_music" ? "Release Title" : "Product Name"}
					</Label>
					<Input
						{...register("productName")}
						placeholder={
							productType === "digital_music"
								? "e.g. More Billionaires (Deluxe)"
								: "e.g. Wizolingo Tour Hoodie"
						}
						className="h-12 rounded-xl border-border bg-background/60"
					/>
					{errors.productName && (
						<p className="text-[11px] font-medium text-destructive">
							{errors.productName.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Price (USD $)</Label>
					<div className="relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">
							$
						</span>
						<Input
							type="number"
							step="0.01"
							{...register("price")}
							className="h-12 pl-8 rounded-xl border-border bg-background/60"
							placeholder="0.00"
						/>
					</div>
					{errors.price && (
						<p className="text-[11px] font-medium text-destructive">
							{errors.price.message}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">Description</Label>
				<Textarea
					{...register("description")}
					placeholder="Enter detailed release notes, credits, or merch fabric specifications..."
					className="min-h-[110px] rounded-xl border-border bg-background/60 resize-none p-4"
				/>
				{errors.description && (
					<p className="text-[11px] font-medium text-destructive">
						{errors.description.message}
					</p>
				)}
			</div>

			{/* 3. Categorization */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-card border border-border">
				<div className="space-y-2">
					<Label className="text-sm font-bold">Category</Label>
					<Select
						onValueChange={(val) => setValue("categories", val)}
						defaultValue={initialData?.categories?.[0]?._id}
					>
						<SelectTrigger className="h-12 rounded-xl bg-background/60 border-border">
							<SelectValue placeholder="Select Category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat._id} value={cat._id}>
									{cat.categoryName} ({cat.categoryType})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Sub-Category</Label>
					<Select
						disabled={!selectedCatId || subCategories.length === 0}
						onValueChange={(val) => setValue("subcategoryId", val)}
						defaultValue={initialData?.subcategoryId || ""}
					>
						<SelectTrigger className="h-12 rounded-xl bg-background/60 border-border">
							<SelectValue placeholder="Select Sub-Category (Optional)" />
						</SelectTrigger>
						<SelectContent>
							{subCategories.map((sub) => (
								<SelectItem key={sub._id} value={sub._id}>
									{sub.subcategoryName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* 4A. MERCH SPECIFIC FIELDS */}
			{productType === "merch" && (
				<div className="space-y-6 p-5 rounded-2xl bg-card border border-border">
					<div className="flex items-center gap-2">
						<Icon icon="ph:stack-bold" className="text-primary size-5" />
						<h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
							Merch Inventory &amp; Variants
						</h4>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<Label className="text-sm font-bold">Stock Quantity</Label>
							<Input
								type="number"
								{...register("quantity")}
								className="h-12 rounded-xl border-border bg-background/60"
							/>
						</div>

						<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<Label className="text-sm font-bold">Colors</Label>
								<TagInput
									tags={colors}
									setTags={setColors}
									placeholder="Black, Red, White..."
								/>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-bold">Sizes</Label>
								<TagInput
									tags={sizes}
									setTags={setSizes}
									placeholder="S, M, L, XL..."
								/>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* 4B. DIGITAL MUSIC SPECIFIC FIELDS */}
			{productType === "digital_music" && (
				<div className="space-y-6 p-5 rounded-2xl bg-card border border-border">
					<div className="flex items-center gap-2">
						<Icon icon="ph:music-notes-plus-bold" className="text-primary size-5" />
						<h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
							Digital Music Metadata &amp; Download Files
						</h4>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-bold">Release Format</Label>
							<Select
								defaultValue={initialData?.digitalReleaseType || "single"}
								onValueChange={(val) =>
									setValue("digitalReleaseType", val as DigitalReleaseType)
								}
							>
								<SelectTrigger className="h-11 rounded-xl bg-background/60 border-border">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="single">Single</SelectItem>
									<SelectItem value="album">Album</SelectItem>
									<SelectItem value="ep">EP</SelectItem>
									<SelectItem value="instrumental">Instrumental</SelectItem>
									<SelectItem value="stem_pack">Stem Pack</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-bold">Artist Name</Label>
							<Input
								{...register("artist")}
								placeholder="Wiz Ofuasia (Wizboyy)"
								className="h-11 rounded-xl border-border bg-background/60"
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-bold">Release Date</Label>
							<Input
								type="date"
								{...register("releaseDate")}
								className="h-11 rounded-xl border-border bg-background/60"
							/>
						</div>

						<div className="space-y-2">
							<Label className="text-sm font-bold">Duration</Label>
							<Input
								{...register("duration")}
								placeholder="e.g. 03:45 or 42 mins"
								className="h-11 rounded-xl border-border bg-background/60"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-bold">
								Audio Snippet Preview File (Optional)
							</Label>
							<Input
								type="file"
								accept="audio/*"
								onChange={(e) => setPreviewAudioFile(e.target.files?.[0] || null)}
								className="h-11 rounded-xl border-border bg-background/60 pt-2"
							/>
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-bold">Or Preview Stream URL</Label>
							<Input
								{...register("previewUrl")}
								placeholder="https://res.cloudinary.com/..."
								className="h-11 rounded-xl border-border bg-background/60"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold">
							Full Downloadable Master Files (MP3, WAV, FLAC, ZIP)
						</Label>
						<Input
							type="file"
							multiple
							accept=".mp3,.wav,.flac,.aac,.zip,.pdf"
							onChange={(e) => setDigitalFiles(Array.from(e.target.files || []))}
							className="h-11 rounded-xl border-border bg-background/60 pt-2"
						/>
						{initialData?.digitalFiles && initialData.digitalFiles.length > 0 && (
							<div className="flex flex-wrap gap-2 pt-2">
								{initialData.digitalFiles.map((df, i) => (
									<Badge key={i} variant="secondary" className="text-xs">
										{df.fileName} ({df.fileFormat.toUpperCase()})
									</Badge>
								))}
							</div>
						)}
					</div>

					{/* Tracklist Builder */}
					<div className="space-y-3 pt-2 border-t border-border">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-bold">
								Tracklist ({tracklist.length})
							</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addTrack}
								className="gap-1.5 border-primary/40 text-primary hover:bg-primary/15"
							>
								<Icon icon="ph:plus-bold" /> Add Track
							</Button>
						</div>
						{tracklist.map((t, idx) => (
							<div
								key={idx}
								className="grid grid-cols-12 gap-2 items-center bg-background/40 p-2.5 rounded-xl border border-border"
							>
								<span className="col-span-1 text-center font-bold text-xs text-primary">
									#{t.trackNumber}
								</span>
								<Input
									value={t.title}
									onChange={(e) => updateTrack(idx, "title", e.target.value)}
									placeholder="Track title"
									className="col-span-5 h-9 text-xs"
								/>
								<Input
									value={t.featuredArtists}
									onChange={(e) =>
										updateTrack(idx, "featuredArtists", e.target.value)
									}
									placeholder="Feat. artists"
									className="col-span-3 h-9 text-xs"
								/>
								<Input
									value={t.duration}
									onChange={(e) => updateTrack(idx, "duration", e.target.value)}
									placeholder="3:30"
									className="col-span-2 h-9 text-xs"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeTrack(idx)}
									className="col-span-1 h-8 w-8 text-destructive"
								>
									<Icon icon="ph:trash-bold" />
								</Button>
							</div>
						))}
					</div>
				</div>
			)}

			{/* 5. Visibility & Featured Flags */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-card border border-border">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-bold text-foreground">Featured Item</p>
						<p className="text-xs text-muted-foreground">
							Highlight on Wiz Ofuasia homepage
						</p>
					</div>
					<Switch
						checked={Boolean(isFeatured)}
						onCheckedChange={(checked) => setValue("isFeatured", checked)}
					/>
				</div>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-bold text-foreground">Active in Storefront</p>
						<p className="text-xs text-muted-foreground">
							Visible for customers to purchase
						</p>
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

