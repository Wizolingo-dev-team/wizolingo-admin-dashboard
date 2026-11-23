"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { blogColumnsSchema } from "@/components/Tables/columns/definitions";
import ActionModal from "@/components/_modals/ActionModal";
import DeleteModal from "@/components/_modals/DeleteModal";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import BlogForm from "@/components/Forms/BlogForm";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import {
	useGetAllBlogsAdmin,
	useCreateBlog,
	useUpdateBlog,
	useDeleteBlog,
	useGetBlogCategories,
} from "@/hooks/blogManagement";
import type { BlogItem } from "@/types/blogManagement";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import { StatWidget } from "@/components/_widgets/shared/StatWidget";
import { cn } from "@/lib/utils";

export default function BlogList() {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [statusTab, setStatusTab] = useState("all");

	const { data: blogData, isLoading } = useGetAllBlogsAdmin({
		page,
		limit: pageSize,
		search,
		category: categoryFilter !== "all" ? categoryFilter : undefined,
		status: statusTab !== "all" ? statusTab : undefined,
	});

	const { data: serverCategories = [] } = useGetBlogCategories();

	const createMutation = useCreateBlog();
	const updateMutation = useUpdateBlog();
	const deleteMutation = useDeleteBlog();

	const [isActionOpen, setIsActionOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedBlog, setSelectedBlog] = useState<BlogItem | null>(null);

	const blogs = useMemo(() => blogData?.data || [], [blogData?.data]);
	const totalEntries = blogData?.total || 0;
	const totalPages = blogData?.totalPages || 1;

	// Summary stats
	const stats = useMemo(() => {
		const totalViews = blogs.reduce((acc, curr) => acc + (curr.views || 0), 0);
		const publishedCount = blogs.filter((b) => b.status === "Published").length;
		const draftCount = blogs.filter((b) => b.status === "Draft").length;
		return {
			total: totalEntries,
			published: publishedCount,
			draft: draftCount,
			views: totalViews,
		};
	}, [blogs, totalEntries]);

	const handleEdit = React.useCallback((blog: BlogItem) => {
		setSelectedBlog(blog);
		setIsActionOpen(true);
	}, []);

	const handleView = React.useCallback((blog: BlogItem) => {
		setSelectedBlog(blog);
		setIsViewOpen(true);
	}, []);

	const handleDelete = React.useCallback((blog: BlogItem) => {
		setSelectedBlog(blog);
		setIsDeleteOpen(true);
	}, []);

	const handleAdd = () => {
		setSelectedBlog(null);
		setIsActionOpen(true);
	};

	const onFormSubmit = (formData: FormData) => {
		if (selectedBlog) {
			updateMutation.mutate(
				{ id: selectedBlog._id, payload: formData },
				{ onSuccess: () => setIsActionOpen(false) },
			);
		} else {
			createMutation.mutate(formData, { onSuccess: () => setIsActionOpen(false) });
		}
	};

	const confirmDelete = () => {
		if (!selectedBlog) return;
		deleteMutation.mutate(selectedBlog._id, {
			onSuccess: () => setIsDeleteOpen(false),
		});
	};

	const columns = useMemo(
		() => getColumns(blogColumnsSchema(handleView, handleEdit, handleDelete)),
		[handleView, handleEdit, handleDelete],
	);

	// Category filter options
	const categoryOptions = useMemo(() => {
		const list = [
			{ label: "All Categories", value: "all" },
			...serverCategories.map((c) => ({ label: `${c.name} (${c.count})`, value: c.name })),
		];
		return list;
	}, [serverCategories]);

	// Render Markdown formatted article in ViewDetails modal
	const renderContentHtml = (md: string) => {
		if (!md) return <p className="text-muted-foreground italic">No article content.</p>;
		const lines = md.split("\n");

		return lines.map((line, idx) => {
			const trimmed = line.trim();
			if (!trimmed) return <div key={idx} className="h-3" />;

			if (trimmed.startsWith("# ")) {
				return (
					<h1 key={idx} className="text-xl font-bold text-foreground mt-4 mb-2">
						{trimmed.slice(2)}
					</h1>
				);
			}
			if (trimmed.startsWith("## ")) {
				return (
					<h2 key={idx} className="text-lg font-bold text-foreground mt-3 mb-2">
						{trimmed.slice(3)}
					</h2>
				);
			}
			if (trimmed.startsWith("### ")) {
				return (
					<h3 key={idx} className="text-base font-semibold text-foreground mt-2 mb-1">
						{trimmed.slice(4)}
					</h3>
				);
			}
			if (trimmed.startsWith("> ")) {
				return (
					<blockquote
						key={idx}
						className="border-l-4 border-primary bg-primary/5 py-1.5 pl-3 italic text-foreground/90 rounded-r my-2 text-sm"
					>
						{trimmed.slice(2)}
					</blockquote>
				);
			}
			if (trimmed.startsWith("![") && trimmed.includes("](")) {
				const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
				if (match) {
					const [, alt = "", url = ""] = match;
					const [caption, size] = alt.split("|");
					return (
						<div key={idx} className="my-4 text-center">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={url}
								alt={caption || "Article illustration"}
								className={cn(
									"mx-auto rounded-xl border border-border object-cover shadow-md",
									size === "small"
										? "max-w-[300px]"
										: size === "large"
											? "max-w-[750px]"
											: size === "full"
												? "max-w-full"
												: "max-w-[500px]",
								)}
							/>
							{caption && caption !== "Inline image" && (
								<p className="text-xs text-muted-foreground italic mt-1.5">{caption}</p>
							)}
						</div>
					);
				}
			}

			return (
				<p key={idx} className="text-sm leading-relaxed text-foreground/90 my-1.5">
					{trimmed}
				</p>
			);
		});
	};

	return (
		<div className="space-y-6">
			{/* Top Summary Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatWidget
					title="Total Articles"
					value={stats.total}
					icon="ph:newspaper-bold"
					trend="All Posts"
				/>
				<StatWidget
					title="Published Posts"
					value={stats.published}
					icon="ph:check-circle-bold"
					trend="Live on Website"
				/>
				<StatWidget
					title="Drafts"
					value={stats.draft}
					icon="ph:note-pencil-bold"
					trend="In Progress"
				/>
				<StatWidget
					title="Total Views"
					value={stats.views.toLocaleString()}
					icon="ph:eye-bold"
					trend="Reader Engagements"
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
							All Articles
						</TabsTrigger>
						<TabsTrigger
							value="Published"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Published
						</TabsTrigger>
						<TabsTrigger
							value="Draft"
							className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-4 text-xs"
						>
							Drafts
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Data Table */}
			<TableLayoutWrapper
				title="Blog & Editorial Management"
				columns={columns}
				data={blogs}
				isLoading={isLoading}
				skeleton={<ProductListSkeleton />}
				addLabel="Create Blog Post"
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				filters={[
					{
						label: "Category",
						value: categoryFilter,
						options: categoryOptions,
					},
				]}
				onFilterChange={(_, val) => {
					setCategoryFilter(val);
					setPage(1);
				}}
				onAddClick={handleAdd}
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

			{/* Create / Edit Modal */}
			<ActionModal
				open={isActionOpen}
				onOpenChange={setIsActionOpen}
				title={selectedBlog ? "Edit Blog Article" : "Create Blog Article"}
				description="Write rich article content, format text, upload inline pictures, and configure post metadata"
				formId="blog-form"
				maxWidthClass="sm:max-w-3xl"
				isLoading={createMutation.isPending || updateMutation.isPending}
				submitLabel={selectedBlog ? "Update Article" : "Publish Article"}
			>
				<BlogForm
					formId="blog-form"
					initialData={selectedBlog || undefined}
					onSubmit={onFormSubmit}
					isLoading={createMutation.isPending || updateMutation.isPending}
				/>
			</ActionModal>

			{/* View Details Modal */}
			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Blog Article Preview"
				maxWidthClass="sm:max-w-2xl"
				onEditClick={() => {
					setIsViewOpen(false);
					setIsActionOpen(true);
				}}
			>
				{selectedBlog && (
					<div className="space-y-6 p-6">
						{/* Cover Image */}
						{selectedBlog.coverImage && (
							<div className="overflow-hidden rounded-xl border border-border aspect-[16/9] max-h-64 w-full">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={selectedBlog.coverImage}
									alt={selectedBlog.title}
									className="size-full object-cover"
								/>
							</div>
						)}

						{/* Header Details */}
						<div>
							<div className="flex flex-wrap items-center gap-2 mb-2">
								<Badge className="bg-primary text-white text-[10px] uppercase font-bold tracking-wider">
									{selectedBlog.category}
								</Badge>
								<Badge
									variant="outline"
									className={cn(
										"text-[10px] font-bold uppercase",
										selectedBlog.status === "Published"
											? "border-emerald-500/40 text-emerald-400"
											: "border-amber-500/40 text-amber-400",
									)}
								>
									{selectedBlog.status}
								</Badge>
								<span className="text-xs text-muted-foreground">•</span>
								<span className="text-xs text-muted-foreground">{selectedBlog.readTime}</span>
								<span className="text-xs text-muted-foreground">•</span>
								<span className="text-xs text-muted-foreground">{selectedBlog.views} views</span>
							</div>

							<h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
								{selectedBlog.title}
							</h2>

							<div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground font-mono">
								<span>/blogs/{selectedBlog.slug}</span>
							</div>

							{selectedBlog.excerpt && (
								<p className="mt-3 text-sm text-muted-foreground italic border-l-2 border-primary/40 pl-3">
									{selectedBlog.excerpt}
								</p>
							)}
						</div>

						{/* Metadata summary */}
						<div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card/60 p-4 text-xs">
							<div>
								<span className="text-muted-foreground block">Author</span>
								<span className="font-semibold text-foreground">{selectedBlog.author}</span>
							</div>
							<div>
								<span className="text-muted-foreground block">Published Date</span>
								<span className="font-semibold text-foreground">
									{selectedBlog.date ||
										(selectedBlog.createdAt
											? new Date(selectedBlog.createdAt).toLocaleDateString()
											: "—")}
								</span>
							</div>
							{selectedBlog.tags && selectedBlog.tags.length > 0 && (
								<div className="col-span-2">
									<span className="text-muted-foreground block mb-1">Tags</span>
									<div className="flex flex-wrap gap-1">
										{selectedBlog.tags.map((t, idx) => (
											<Badge
												key={idx}
												variant="secondary"
												className="text-[10px] font-medium bg-muted text-muted-foreground"
											>
												#{t}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Content Body */}
						<div className="border-t border-border pt-4">
							<h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
								Article Content
							</h4>
							<div className="space-y-1">{renderContentHtml(selectedBlog.content)}</div>
						</div>
					</div>
				)}
			</ViewDetailsModal>

			{/* Delete Confirmation Modal */}
			<DeleteModal
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				title="Delete Blog Article?"
				description={`Are you sure you want to delete "${selectedBlog?.title}"? This will permanently remove the blog post and its associated inline media.`}
				isLoading={deleteMutation.isPending}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}
