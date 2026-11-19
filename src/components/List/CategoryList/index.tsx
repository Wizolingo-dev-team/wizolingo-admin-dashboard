"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { categoryColumnsSchema } from "@/components/Tables/columns/definitions";
import ActionModal from "@/components/_modals/ActionModal";
import DeleteModal from "@/components/_modals/DeleteModal";
import CategoryForm from "@/components/Forms/CategoryForm";
import {
	useGetAllCategories,
	useCreateCategory,
	useUpdateCategory,
	useDeleteCategory,
} from "@/hooks/categoryManagement";
import { Category } from "@/types/categoryManagement";
import { CategoryTableSkeleton } from "@/components/Skeletons/CategorySkeletons";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import { Badge } from "@/components/ui/badge";

export default function CategoryList() {
	const { data: categories = [], isLoading } = useGetAllCategories();
	const createMutation = useCreateCategory();
	const updateMutation = useUpdateCategory();
	const deleteMutation = useDeleteCategory();

	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isActionOpen, setIsActionOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");

	const filteredCategories = useMemo(() => {
		return categories.filter((cat) => {
			const matchesSearch = cat.categoryName
				.toLowerCase()
				.includes(search.toLowerCase());
			const matchesType =
				typeFilter === "all" || (cat.categoryType || "general") === typeFilter;
			return matchesSearch && matchesType;
		});
	}, [categories, search, typeFilter]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredCategories.slice(start, start + pageSize);
	}, [filteredCategories, page, pageSize]);

	const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;

	const handleViewClick = (category: Category) => {
		setSelectedCategory(category);
		setIsViewOpen(true);
	};

	const handleEditClick = (category: Category) => {
		setSelectedCategory(category);
		setIsActionOpen(true);
	};

	const handleDeleteClick = (category: Category) => {
		setSelectedCategory(category);
		setIsDeleteOpen(true);
	};

	const handleAddClick = () => {
		setSelectedCategory(null);
		setIsActionOpen(true);
	};

	const handleSubmit = (formData: any) => {
		if (selectedCategory) {
			updateMutation.mutate(
				{ id: selectedCategory._id, payload: formData },
				{ onSuccess: () => setIsActionOpen(false) },
			);
		} else {
			createMutation.mutate(formData, {
				onSuccess: () => setIsActionOpen(false),
			});
		}
	};

	const confirmDelete = () => {
		if (selectedCategory) {
			deleteMutation.mutate(selectedCategory._id, {
				onSuccess: () => setIsDeleteOpen(false),
			});
		}
	};

	const allExistingSubs = Array.from(
		new Set(categories.flatMap((c) => c.subcategories.map((s) => s.subcategoryName))),
	);

	const columns = getColumns(
		categoryColumnsSchema(handleViewClick, handleEditClick, handleDeleteClick),
	);

	return (
		<>
			<TableLayoutWrapper
				title="Categories"
				columns={columns}
				data={paginatedData}
				isLoading={isLoading}
				skeleton={<CategoryTableSkeleton />}
				addLabel="Add Category"
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				filters={[
					{
						label: "Category Scope",
						value: typeFilter,
						options: [
							{ label: "General", value: "general" },
							{ label: "Digital Music", value: "digital_music" },
							{ label: "Artist Merch", value: "merch" },
						],
					},
				]}
				onFilterChange={(_, val) => {
					setTypeFilter(val);
					setPage(1);
				}}
				onAddClick={handleAddClick}
				paginationProps={{
					currentPage: page,
					totalPages,
					pageSize,
					totalEntries: filteredCategories.length,
					onPageChange: setPage,
					onPageSizeChange: (s) => {
						setPageSize(Number(s));
						setPage(1);
					},
				}}
			/>

			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Category Details"
				description="Full overview of the selected category"
				onEditClick={() => {
					setIsViewOpen(false);
					setIsActionOpen(true);
				}}
			>
				{selectedCategory && (
					<div className="space-y-8">
						<div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
							<div>
								<label className="text-xs font-bold uppercase text-muted-foreground">
									Category Name
								</label>
								<p className="text-lg font-bold text-foreground">
									{selectedCategory.categoryName}
								</p>
							</div>
							<Badge className="bg-primary text-white uppercase">
								{selectedCategory.categoryType || "general"}
							</Badge>
						</div>

						<div className="space-y-4">
							<label className="text-xs font-bold uppercase text-muted-foreground">
								Sub-Categories ({selectedCategory.subcategories.length})
							</label>
							<div className="flex flex-wrap gap-2">
								{selectedCategory.subcategories.map((sub) => (
									<div
										key={sub._id}
										className="rounded-full bg-card border border-border px-4 py-2 text-sm font-medium shadow-sm"
									>
										{sub.subcategoryName}
									</div>
								))}
								{selectedCategory.subcategories.length === 0 && (
									<p className="text-xs text-muted-foreground">
										No sub-categories defined.
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
							<div>
								<label className="text-xs font-bold uppercase text-muted-foreground block">
									Created At
								</label>
								<span className="text-sm">
									{new Date(selectedCategory.createdAt).toLocaleString()}
								</span>
							</div>
							<div>
								<label className="text-xs font-bold uppercase text-muted-foreground block">
									Last Updated
								</label>
								<span className="text-sm">
									{new Date(selectedCategory.updatedAt).toLocaleString()}
								</span>
							</div>
						</div>
					</div>
				)}
			</ViewDetailsModal>

			<ActionModal
				open={isActionOpen}
				onOpenChange={setIsActionOpen}
				title={selectedCategory ? "Edit Category" : "Add New Category"}
				description={
					selectedCategory
						? "Update the details of your category"
						: "Create a new category for music releases or artist merch"
				}
				formId="category-form"
				isLoading={createMutation.isPending || updateMutation.isPending}
				submitLabel={selectedCategory ? "Update Category" : "Create Category"}
			>
				<CategoryForm
					formId="category-form"
					initialData={selectedCategory || undefined}
					existingSubCategories={allExistingSubs}
					onSubmit={handleSubmit}
				/>
			</ActionModal>

			<DeleteModal
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				onConfirm={confirmDelete}
				isLoading={deleteMutation.isPending}
				title="Delete Category"
				description={`Are you sure you want to delete "${selectedCategory?.categoryName}"?`}
			/>
		</>
	);
}

