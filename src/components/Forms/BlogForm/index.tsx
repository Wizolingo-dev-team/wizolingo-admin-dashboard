"use client";

import React, { useState, useRef, useMemo } from "react";
import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { format, parseISO, isValid } from "date-fns";
import { useUploadBlogInlineImage, useGetBlogCategories } from "@/hooks/blogManagement";
import type { BlogItem, BlogStatus } from "@/types/blogManagement";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BlogFormProps {
	formId: string;
	initialData?: BlogItem;
	onSubmit: (data: FormData) => void;
	isLoading?: boolean;
}

const DEFAULT_CATEGORIES = [
	"Music",
	"Tour & Shows",
	"Afrobeats",
	"Interviews",
	"New Releases",
	"Articles",
	"Behind The Scenes",
	"Press",
	"Culture",
];

export default function BlogForm({
	formId,
	initialData,
	onSubmit,
	isLoading = false,
}: BlogFormProps) {
	const uploadInlineImageMutation = useUploadBlogInlineImage();
	const { data: serverCategories = [] } = useGetBlogCategories();

	const categoryOptions = useMemo(() => {
		const existingNames = serverCategories.map((c) => c.name).filter(Boolean);
		const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingNames]));
		return combined;
	}, [serverCategories]);

	// Form State
	const [title, setTitle] = useState(initialData?.title || "");
	const [slug, setSlug] = useState(initialData?.slug || "");
	const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
	const [content, setContent] = useState(initialData?.content || "");
	const [category, setCategory] = useState(initialData?.category || "Music");
	const [customCategory, setCustomCategory] = useState("");
	const [isCustomCategory, setIsCustomCategory] = useState(false);
	const [author, setAuthor] = useState(initialData?.author || "Wiz Ofuasia Editorial");
	const [status, setStatus] = useState<BlogStatus>(initialData?.status || "Published");
	const [publishedDate, setPublishedDate] = useState<string>(() => {
		if (initialData?.isoDate) {
			const parsed = parseISO(initialData.isoDate);
			if (isValid(parsed)) return format(parsed, "yyyy-MM-dd");
		}
		if (initialData?.date) {
			const parsed = new Date(initialData.date);
			if (!Number.isNaN(parsed.getTime())) return format(parsed, "yyyy-MM-dd");
		}
		if (initialData?.createdAt) {
			const parsed = parseISO(initialData.createdAt);
			if (isValid(parsed)) return format(parsed, "yyyy-MM-dd");
		}
		return format(new Date(), "yyyy-MM-dd");
	});
	const [tagsString, setTagsString] = useState((initialData?.tags || []).join(", "));
	const [coverImagePreview, setCoverImagePreview] = useState(initialData?.coverImage || "");
	const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

	// Editor tab: 'write' | 'preview'
	const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

	// Textarea ref for inserting formatting
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const inlineFileInputRef = useRef<HTMLInputElement>(null);
	const coverFileInputRef = useRef<HTMLInputElement>(null);

	// Auto-slug generator from title if slug not manually customized
	const handleTitleChange = (val: string) => {
		setTitle(val);
		if (!initialData) {
			const autoSlug = val
				.toLowerCase()
				.trim()
				.replace(/[^\w\s-]/g, "")
				.replace(/[\s_-]+/g, "-")
				.replace(/^-+|-+$/g, "");
			setSlug(autoSlug);
		}
	};

	// Word count & read time calculation
	const { wordCount, readTime } = useMemo(() => {
		const cleanText = content.replace(/!\[.*?\]\(.*?\)/g, "").replace(/[#*`_>[\]()]/g, "");
		const words = cleanText.trim().split(/\s+/).filter(Boolean).length;
		const minutes = Math.max(1, Math.ceil(words / 200));
		return {
			wordCount: words,
			readTime: `${minutes} min read`,
		};
	}, [content]);

	// Detected inline images in content: ![alt|size](url)
	const inlineImages = useMemo(() => {
		const regex = /!\[(.*?)\]\((.*?)\)/g;
		const list: { alt: string; size: string; url: string; raw: string }[] = [];
		let match: RegExpExecArray | null = regex.exec(content);
		while (match !== null) {
			const raw = match[0];
			const altPart = match[1] || "";
			const url = match[2] || "";
			const [alt = "", size = "medium"] = altPart.split("|");
			list.push({ alt: alt.trim() || "Inline image", size: size.trim().toLowerCase(), url, raw });
			match = regex.exec(content);
		}
		return list;
	}, [content]);

	// Helper to insert markdown text around cursor
	const insertFormat = (before: string, after = "", placeholder = "text") => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const currentText = textarea.value;
		const selected = currentText.substring(start, end);

		const replacement = before + (selected || placeholder) + after;
		const updated = currentText.substring(0, start) + replacement + currentText.substring(end);

		setContent(updated);

		setTimeout(() => {
			textarea.focus();
			const newCursorPos = start + before.length + (selected || placeholder).length;
			textarea.setSelectionRange(newCursorPos, newCursorPos);
		}, 0);
	};

	// Inline image file upload handler
	const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please upload an image file (PNG, JPG, WEBP)");
			return;
		}

		if (file.size > 20 * 1024 * 1024) {
			toast.error("Image file must be under 20MB");
			return;
		}

		const formData = new FormData();
		formData.append("image", file);

		try {
			const res = await uploadInlineImageMutation.mutateAsync(formData);
			if (res.success && res.url) {
				const altDescription = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
				const markdownSnippet = `\n\n![${altDescription}|medium](${res.url})\n\n`;

				const textarea = textareaRef.current;
				if (textarea) {
					const start = textarea.selectionStart;
					const end = textarea.selectionEnd;
					const currentText = textarea.value;
					const updated =
						currentText.substring(0, start) + markdownSnippet + currentText.substring(end);
					setContent(updated);
				} else {
					setContent((prev) => prev + markdownSnippet);
				}
				toast.success("Inline image inserted into article!");
			}
		} catch (err: any) {
			toast.error(err?.message || "Failed to upload inline image");
		} finally {
			if (inlineFileInputRef.current) {
				inlineFileInputRef.current.value = "";
			}
		}
	};

	// Change size of an existing inline image in the markdown
	const handleSetImageSize = (
		img: { alt: string; size: string; url: string; raw: string },
		newSize: "small" | "medium" | "large" | "full",
	) => {
		const newRaw = `![${img.alt}|${newSize}](${img.url})`;
		setContent((prev) => prev.replace(img.raw, newRaw));
	};

	// Remove inline image from markdown
	const handleRemoveInlineImage = (raw: string) => {
		setContent((prev) => prev.replace(raw, ""));
		toast.info("Image removed from content");
	};

	// Cover Image selection
	const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select an image file");
			return;
		}
		setCoverImageFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setCoverImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// Form Submit
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.trim()) {
			toast.error("Please enter a blog post title");
			return;
		}

		if (!content.trim() || content.trim().length < 10) {
			toast.error("Please write at least 10 characters of content");
			return;
		}

		const finalCategory = isCustomCategory ? customCategory.trim() : category;
		if (!finalCategory) {
			toast.error("Please specify a blog category");
			return;
		}

		const formData = new FormData();
		formData.append("title", title.trim());
		if (slug.trim()) formData.append("slug", slug.trim());
		formData.append("content", content.trim());
		formData.append("excerpt", excerpt.trim());
		formData.append("category", finalCategory);
		formData.append("author", author.trim() || "Wiz Ofuasia Editorial");
		formData.append("status", status);
		formData.append("readTime", readTime);

		if (publishedDate) {
			formData.append("isoDate", publishedDate);
			const parsedDate = parseISO(publishedDate);
			if (isValid(parsedDate)) {
				formData.append(
					"date",
					parsedDate.toLocaleDateString("en-US", {
						month: "long",
						day: "numeric",
						year: "numeric",
					}),
				);
			}
		}

		// Parse tags
		const tagsArray = tagsString
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);
		tagsArray.forEach((tag) => formData.append("tags", tag));

		// Cover image
		if (coverImageFile) {
			formData.append("coverImage", coverImageFile);
		} else if (coverImagePreview) {
			formData.append("coverImageUrl", coverImagePreview);
		}

		onSubmit(formData);
	};

	// Markdown Renderer for Live Preview
	const renderInlineFormatting = (text: string): React.ReactNode => {
		const tokenRegex = /(!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
		const parts = text.split(tokenRegex);

		return parts.map((part, idx) => {
			if (part.startsWith("![") && part.includes("](")) {
				const match = part.match(/!\[(.*?)\]\((.*?)\)/);
				if (match) {
					const [, altText = "", url = ""] = match;
					const [alt = "", size = "medium"] = altText.split("|");
					const cleanSize = size.trim().toLowerCase();

					let sizeClass = "max-w-[500px]";
					if (cleanSize === "small" || cleanSize === "sm") {
						sizeClass = "max-w-[300px]";
					} else if (cleanSize === "large" || cleanSize === "lg") {
						sizeClass = "max-w-[750px]";
					} else if (cleanSize === "full") {
						sizeClass = "max-w-full";
					}

					return (
						<span key={idx} className="my-6 block text-center">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={url}
								alt={alt || "Blog inline image"}
								className={cn(
									"mx-auto rounded-xl border border-border object-cover shadow-lg transition-transform",
									sizeClass,
								)}
							/>
							{alt && alt !== "Inline image" && (
								<span className="text-muted-foreground mt-2 block text-xs italic">
									{alt}
								</span>
							)}
						</span>
					);
				}
			}

			if (part.startsWith("**") && part.endsWith("**")) {
				return (
					<strong key={idx} className="font-extrabold text-foreground">
						{part.slice(2, -2)}
					</strong>
				);
			}

			if (part.startsWith("*") && part.endsWith("*")) {
				return (
					<em key={idx} className="italic text-foreground/90">
						{part.slice(1, -1)}
					</em>
				);
			}

			if (part.startsWith("`") && part.endsWith("`")) {
				return (
					<code
						key={idx}
						className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary"
					>
						{part.slice(1, -1)}
					</code>
				);
			}

			if (part.startsWith("[") && part.includes("](")) {
				const match = part.match(/\[(.*?)\]\((.*?)\)/);
				if (match) {
					const [, linkText, url] = match;
					return (
						<a
							key={idx}
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
						>
							{linkText}
						</a>
					);
				}
			}

			return <React.Fragment key={idx}>{part}</React.Fragment>;
		});
	};

	const parseMarkdownPreview = (md: string) => {
		if (!md) return <p className="text-muted-foreground italic">No content written yet.</p>;

		const lines = md.split("\n");
		const elements: React.ReactNode[] = [];
		let currentListItems: React.ReactNode[] = [];
		let inList = false;

		const flushList = (key: number) => {
			if (currentListItems.length > 0) {
				elements.push(
					<ul key={`ul-${key}`} className="my-3 list-disc space-y-1.5 pl-6 text-foreground/90">
						{currentListItems}
					</ul>,
				);
				currentListItems = [];
				inList = false;
			}
		};

		lines.forEach((line, index) => {
			const trimmed = line.trim();

			// Horizontal rule
			if (trimmed === "---" || trimmed === "***") {
				flushList(index);
				elements.push(<hr key={index} className="my-6 border-border" />);
				return;
			}

			// Headings
			if (trimmed.startsWith("# ")) {
				flushList(index);
				elements.push(
					<h1
						key={index}
						className="mb-4 mt-6 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
					>
						{renderInlineFormatting(trimmed.slice(2))}
					</h1>,
				);
				return;
			}
			if (trimmed.startsWith("## ")) {
				flushList(index);
				elements.push(
					<h2
						key={index}
						className="mb-3 mt-5 font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
					>
						{renderInlineFormatting(trimmed.slice(3))}
					</h2>,
				);
				return;
			}
			if (trimmed.startsWith("### ")) {
				flushList(index);
				elements.push(
					<h3
						key={index}
						className="mb-2 mt-4 font-display text-lg font-semibold text-foreground sm:text-xl"
					>
						{renderInlineFormatting(trimmed.slice(4))}
					</h3>,
				);
				return;
			}

			// Blockquote
			if (trimmed.startsWith("> ")) {
				flushList(index);
				elements.push(
					<blockquote
						key={index}
						className="my-4 border-l-4 border-primary bg-primary/5 py-2 pl-4 pr-3 italic text-foreground/90 rounded-r-lg"
					>
						{renderInlineFormatting(trimmed.slice(2))}
					</blockquote>,
				);
				return;
			}

			// Bullet List
			if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
				inList = true;
				currentListItems.push(
					<li key={index} className="leading-relaxed">
						{renderInlineFormatting(trimmed.slice(2))}
					</li>,
				);
				return;
			}

			// Numbered list
			const numMatch = trimmed.match(/^\d+\.\s+(.*)/);
			if (numMatch) {
				inList = true;
				currentListItems.push(
					<li key={index} className="leading-relaxed">
						{renderInlineFormatting(numMatch[1] || "")}
					</li>,
				);
				return;
			}

			// Empty line
			if (!trimmed) {
				flushList(index);
				return;
			}

			// Regular paragraph
			flushList(index);
			elements.push(
				<p key={index} className="my-3 leading-relaxed text-foreground/90 text-sm sm:text-base">
					{renderInlineFormatting(line)}
				</p>,
			);
		});

		flushList(lines.length);
		return elements;
	};

	return (
		<form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6 pb-8">
			{/* 1. Cover / Featured Image Upload Card */}
			<div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm">
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Icon icon="ph:image-square-bold" className="size-5 text-primary" />
						<Label className="text-sm font-bold text-foreground">Featured Cover Image</Label>
					</div>
					{coverImagePreview && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => {
								setCoverImagePreview("");
								setCoverImageFile(null);
								if (coverFileInputRef.current) coverFileInputRef.current.value = "";
							}}
							className="h-7 text-xs text-destructive hover:bg-destructive/10"
						>
							<Icon icon="ph:trash-bold" className="mr-1 size-3.5" />
							Remove Image
						</Button>
					)}
				</div>

				<input
					ref={coverFileInputRef}
					type="file"
					accept="image/*"
					onChange={handleCoverImageChange}
					className="hidden"
				/>

				{coverImagePreview ? (
					<div className="relative group overflow-hidden rounded-xl border border-border/80 bg-black/40 aspect-[16/8] max-h-56 w-full">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={coverImagePreview}
							alt="Cover Preview"
							className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
							<Button
								type="button"
								variant="secondary"
								size="sm"
								onClick={() => coverFileInputRef.current?.click()}
								className="gap-1.5 text-xs bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20"
							>
								<Icon icon="ph:arrow-clockwise-bold" className="size-4" />
								Replace Cover Image
							</Button>
						</div>
					</div>
				) : (
					<div
						onClick={() => coverFileInputRef.current?.click()}
						className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40 p-8 cursor-pointer transition-all duration-200 group text-center"
					>
						<div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
							<Icon icon="ph:upload-simple-bold" className="size-6" />
						</div>
						<div className="text-sm font-semibold text-foreground">
							Click to upload featured cover image
						</div>
						<p className="text-xs text-muted-foreground">
							High resolution PNG, JPG, or WEBP (up to 20MB). Recommended: 16:9 ratio.
						</p>
					</div>
				)}
			</div>

			{/* 2. Article Title & Slug */}
			<div className="grid grid-cols-1 gap-4">
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Article Title <span className="text-primary">*</span>
					</Label>
					<Input
						value={title}
						onChange={(e) => handleTitleChange(e.target.value)}
						placeholder="e.g. Wiz Ofuasia Announces 2027 European Tour & New Single..."
						required
						className="h-11 bg-card border-border font-semibold text-foreground placeholder:text-muted-foreground/60"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
						<span>URL Slug Preview</span>
						<span className="text-[10px] lowercase text-muted-foreground font-normal">
							/blogs/{slug || "post-slug"}
						</span>
					</Label>
					<Input
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						placeholder="wiz-ofuasia-announces-2027-european-tour"
						className="h-9 bg-muted/30 border-border text-xs font-mono text-muted-foreground"
					/>
				</div>
			</div>

			{/* 3. Metadata Grid: Category, Status, Author, Tags */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* Category */}
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
						<span>Category</span>
						<button
							type="button"
							onClick={() => setIsCustomCategory(!isCustomCategory)}
							className="text-[10px] text-primary hover:underline"
						>
							{isCustomCategory ? "Choose from list" : "+ Custom category"}
						</button>
					</Label>

					{isCustomCategory ? (
						<Input
							value={customCategory}
							onChange={(e) => setCustomCategory(e.target.value)}
							placeholder="Enter custom category name..."
							className="h-10 bg-card border-border text-sm"
						/>
					) : (
						<Select value={category} onValueChange={setCategory}>
							<SelectTrigger className="h-10 bg-card border-border text-sm">
								<SelectValue placeholder="Select Category" />
							</SelectTrigger>
							<SelectContent>
								{categoryOptions.map((cat) => (
									<SelectItem key={cat} value={cat}>
										{cat}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>

				{/* Status */}
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Post Status
					</Label>
					<Select value={status} onValueChange={(val) => setStatus(val as BlogStatus)}>
						<SelectTrigger className="h-10 bg-card border-border text-sm">
							<SelectValue placeholder="Select Status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Published">
								<div className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-emerald-500" />
									<span>Published (Live)</span>
								</div>
							</SelectItem>
							<SelectItem value="Draft">
								<div className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-amber-500" />
									<span>Draft (Hidden)</span>
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Author */}
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Author
					</Label>
					<Input
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder="Wiz Ofuasia Editorial"
						className="h-10 bg-card border-border text-sm"
					/>
				</div>

				{/* Tags */}
				<div className="flex flex-col gap-1.5">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
						Tags (Comma separated)
					</Label>
					<Input
						value={tagsString}
						onChange={(e) => setTagsString(e.target.value)}
						placeholder="Music, Tour, Album, Press"
						className="h-10 bg-card border-border text-sm"
					/>
				</div>

				{/* Publish Date (supports backdating) */}
				<div className="flex flex-col gap-1.5 sm:col-span-2">
					<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
						<span>Publish Date</span>
						<span className="text-[10px] lowercase font-normal text-muted-foreground">
							Pick any past or current date (backdating supported)
						</span>
					</Label>
					<DatePicker
						value={publishedDate}
						onChange={setPublishedDate}
						placeholder="Select publish date"
						className="h-10 bg-card border-border text-sm"
					/>
				</div>
			</div>

			{/* 4. Excerpt / Short Summary */}
			<div className="flex flex-col gap-1.5">
				<Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
					<span>Article Excerpt / Teaser</span>
					<span className="text-[10px] text-muted-foreground">
						Brief snippet for cards and search engines
					</span>
				</Label>
				<Textarea
					value={excerpt}
					onChange={(e) => setExcerpt(e.target.value)}
					placeholder="A brief 1-2 sentence preview of this article..."
					rows={2}
					className="bg-card border-border text-sm resize-none"
				/>
			</div>

			{/* 5. Rich Text & Inline Images Editor */}
			<div className="flex flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
				{/* Editor Top Bar: Tabs & Metrics */}
				<div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={() => setActiveTab("write")}
							className={cn(
								"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
								activeTab === "write"
									? "bg-primary text-white shadow-sm"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
							)}
						>
							<Icon icon="ph:pen-nib-bold" className="size-3.5" />
							Write
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("preview")}
							className={cn(
								"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
								activeTab === "preview"
									? "bg-primary text-white shadow-sm"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
							)}
						>
							<Icon icon="ph:eye-bold" className="size-3.5" />
							Live Preview
						</button>
					</div>

					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span className="flex items-center gap-1">
							<Icon icon="ph:text-t-bold" className="size-3.5" />
							{wordCount} words
						</span>
						<span className="flex items-center gap-1">
							<Icon icon="ph:clock-bold" className="size-3.5" />
							{readTime}
						</span>
						{inlineImages.length > 0 && (
							<Badge
								variant="outline"
								className="text-[10px] font-semibold border-primary/30 text-primary"
							>
								{inlineImages.length} image{inlineImages.length > 1 ? "s" : ""}
							</Badge>
						)}
					</div>
				</div>

				{/* Formatting Toolbar (shown in write mode) */}
				{activeTab === "write" && (
					<div className="flex flex-wrap items-center gap-1 border-b border-border/80 bg-background/50 px-3 py-2">
						{/* Bold */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Bold (**text**)"
							onClick={() => insertFormat("**", "**", "bold text")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:text-b-bold" className="size-4" />
						</Button>

						{/* Italic */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Italic (*text*)"
							onClick={() => insertFormat("*", "*", "italic text")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:text-italic-bold" className="size-4" />
						</Button>

						<div className="h-4 w-px bg-border mx-1" />

						{/* Heading 1 */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Heading 1 (# Heading)"
							onClick={() => insertFormat("# ", "", "Main Heading")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground font-black text-xs"
						>
							H1
						</Button>

						{/* Heading 2 */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Heading 2 (## Heading)"
							onClick={() => insertFormat("## ", "", "Section Heading")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground font-bold text-xs"
						>
							H2
						</Button>

						{/* Heading 3 */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Heading 3 (### Heading)"
							onClick={() => insertFormat("### ", "", "Subheading")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-xs"
						>
							H3
						</Button>

						<div className="h-4 w-px bg-border mx-1" />

						{/* Bullet List */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Bullet List (- item)"
							onClick={() => insertFormat("- ", "", "List item")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:list-bullets-bold" className="size-4" />
						</Button>

						{/* Numbered List */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Numbered List (1. item)"
							onClick={() => insertFormat("1. ", "", "First item")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:list-numbers-bold" className="size-4" />
						</Button>

						{/* Quote */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Blockquote (> quote)"
							onClick={() => insertFormat("> ", "", "Notable quote...")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:quotes-bold" className="size-4" />
						</Button>

						{/* Code */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Inline Code (`code`)"
							onClick={() => insertFormat("`", "`", "code")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:code-bold" className="size-4" />
						</Button>

						{/* Link */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Link ([text](https://...))"
							onClick={() => insertFormat("[", "](https://wizofuasia.com)", "link title")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:link-bold" className="size-4" />
						</Button>

						{/* Divider */}
						<Button
							type="button"
							variant="ghost"
							size="icon"
							title="Divider (---)"
							onClick={() => insertFormat("\n\n---\n\n", "")}
							className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<Icon icon="ph:minus-bold" className="size-4" />
						</Button>

						<div className="h-4 w-px bg-border mx-1" />

						{/* Upload Inline Image Button */}
						<input
							ref={inlineFileInputRef}
							type="file"
							accept="image/*"
							onChange={handleInlineImageUpload}
							className="hidden"
						/>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => inlineFileInputRef.current?.click()}
							disabled={uploadInlineImageMutation.isPending}
							className="h-8 gap-1.5 border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary text-xs font-semibold"
						>
							{uploadInlineImageMutation.isPending ? (
								<Icon icon="ph:spinner-bold" className="size-4 animate-spin" />
							) : (
								<Icon icon="ph:image-square-bold" className="size-4" />
							)}
							{uploadInlineImageMutation.isPending ? "Uploading..." : "Insert Inline Image"}
						</Button>
					</div>
				)}

				{/* Write / Preview Tab Body */}
				<div className="p-4">
					{activeTab === "write" ? (
						<div className="flex flex-col gap-2">
							<Textarea
								ref={textareaRef}
								value={content}
								onChange={(e) => setContent(e.target.value)}
								placeholder="Write your blog post in rich markdown... Use the toolbar above to format headings, quotes, links, and upload inline photos directly between paragraphs!"
								rows={16}
								required
								className="font-mono text-sm leading-relaxed bg-background/60 border-border focus:border-primary/50 text-foreground resize-y min-h-[350px]"
							/>
							<div className="flex items-center justify-between text-xs text-muted-foreground px-1">
								<span>
									Markdown syntax supported: <code className="text-primary font-mono">**bold**</code>,{" "}
									<code className="text-primary font-mono">*italic*</code>,{" "}
									<code className="text-primary font-mono"># H1</code>,{" "}
									<code className="text-primary font-mono">![Alt|size](url)</code>
								</span>
								<button
									type="button"
									onClick={() => setActiveTab("preview")}
									className="text-primary hover:underline font-semibold"
								>
									Preview Article →
								</button>
							</div>
						</div>
					) : (
						<div className="min-h-[350px] rounded-xl border border-border/80 bg-background/70 p-6">
							{/* Preview Header */}
							<div className="mb-6 border-b border-border pb-4">
								<div className="flex flex-wrap items-center gap-2 mb-2">
									<Badge className="bg-primary text-white font-bold text-xs uppercase tracking-wider">
										{isCustomCategory ? customCategory || "Custom" : category}
									</Badge>
									<span className="text-xs text-muted-foreground">•</span>
									<span className="text-xs text-muted-foreground">{readTime}</span>
									<span className="text-xs text-muted-foreground">•</span>
									<span className="text-xs text-muted-foreground">By {author}</span>
									{publishedDate && isValid(parseISO(publishedDate)) && (
										<>
											<span className="text-xs text-muted-foreground">•</span>
											<span className="text-xs text-muted-foreground">
												{format(parseISO(publishedDate), "MMMM d, yyyy")}
											</span>
										</>
									)}
								</div>
								<h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
									{title || "Untitled Blog Post"}
								</h1>
								{excerpt && (
									<p className="mt-2 text-sm sm:text-base text-muted-foreground italic leading-relaxed">
										{excerpt}
									</p>
								)}
							</div>

							{/* Preview Body */}
							<div className="prose prose-invert max-w-none">
								{parseMarkdownPreview(content)}
							</div>
						</div>
					)}
				</div>

				{/* 6. Inline Images Gallery Strip (if any images present in post) */}
				{inlineImages.length > 0 && (
					<div className="border-t border-border bg-muted/20 p-4">
						<div className="mb-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Icon icon="ph:images-square-bold" className="size-4 text-primary" />
								<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
									Inline Images in Article ({inlineImages.length})
								</span>
							</div>
							<span className="text-[11px] text-muted-foreground">
								Adjust display width or remove from markdown
							</span>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{inlineImages.map((img, idx) => (
								<div
									key={idx}
									className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5"
								>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={img.url}
										alt={img.alt}
										className="size-14 rounded-lg object-cover border border-border shrink-0"
									/>
									<div className="flex flex-col min-w-0 flex-1">
										<span className="truncate text-xs font-semibold text-foreground">
											{img.alt || "Uploaded Image"}
										</span>

										<div className="mt-1 flex items-center gap-1">
											{(["small", "medium", "large", "full"] as const).map((sz) => (
												<button
													key={sz}
													type="button"
													onClick={() => handleSetImageSize(img, sz)}
													className={cn(
														"px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors",
														img.size === sz
															? "bg-primary text-white"
															: "bg-muted/80 text-muted-foreground hover:text-foreground",
													)}
												>
													{sz === "small"
														? "Sm"
														: sz === "medium"
															? "Md"
															: sz === "large"
																? "Lg"
																: "100%"}
												</button>
											))}

											<button
												type="button"
												title="Remove Image"
												onClick={() => handleRemoveInlineImage(img.raw)}
												className="ml-auto size-6 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
											>
												<Icon icon="ph:trash-bold" className="size-3.5" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</form>
	);
}
