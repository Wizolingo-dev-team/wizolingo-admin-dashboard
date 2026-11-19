"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { productColumnsSchema } from "@/components/Tables/columns/definitions";
import ActionModal from "@/components/_modals/ActionModal";
import DeleteModal from "@/components/_modals/DeleteModal";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import ProductForm from "@/components/Forms/ProductForm";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import {
	useGetAllProducts,
	useCreateProduct,
	useUpdateProduct,
	useDeleteProduct,
} from "@/hooks/productManagement";
import { useGetAllCategories } from "@/hooks/categoryManagement";
import { Product } from "@/types/productManagement";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

export default function ProductList() {
	const { data: products = [], isLoading } = useGetAllProducts();
	const { data: categories = [] } = useGetAllCategories();

	const createMutation = useCreateProduct();
	const updateMutation = useUpdateProduct();
	const deleteMutation = useDeleteProduct();

	const [isActionOpen, setIsActionOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [selectedCategory, setSelectedCategoryFilter] = useState("all");
	const [selectedType, setSelectedTypeFilter] = useState("all");

	const filteredProducts = useMemo(() => {
		return products.filter((p) => {
			const matchesSearch =
				p.productName.toLowerCase().includes(search.toLowerCase()) ||
				(p.artist || "").toLowerCase().includes(search.toLowerCase());

			const matchesCategory =
				selectedCategory === "all" ||
				p.categories.some((cat) => cat._id === selectedCategory);

			const matchesType = selectedType === "all" || p.productType === selectedType;

			return matchesSearch && matchesCategory && matchesType;
		});
	}, [products, search, selectedCategory, selectedType]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredProducts.slice(start, start + pageSize);
	}, [filteredProducts, page, pageSize]);

	const handleEdit = (p: Product) => {
		setSelectedProduct(p);
		setIsActionOpen(true);
	};
	const handleView = (p: Product) => {
		setSelectedProduct(p);
		setIsViewOpen(true);
	};
	const handleDelete = (p: Product) => {
		setSelectedProduct(p);
		setIsDeleteOpen(true);
	};
	const handleAdd = () => {
		setSelectedProduct(null);
		setIsActionOpen(true);
	};

	const onFormSubmit = (formData: FormData) => {
		if (selectedProduct) {
			updateMutation.mutate(
				{ id: selectedProduct._id, payload: formData },
				{ onSuccess: () => setIsActionOpen(false) },
			);
		} else {
			createMutation.mutate(formData, { onSuccess: () => setIsActionOpen(false) });
		}
	};

	const columns = getColumns(productColumnsSchema(handleView, handleEdit, handleDelete));

	return (
		<>
			<TableLayoutWrapper
				title="Music & Merch Catalog"
				columns={columns}
				data={paginatedData}
				isLoading={isLoading}
				skeleton={<ProductListSkeleton />}
				addLabel="Add Release / Merch"
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				filters={[
					{
						label: "Product Type",
						value: selectedType,
						options: [
							{ label: "Digital Music Downloads", value: "digital_music" },
							{ label: "Artist Merch & Apparel", value: "merch" },
						],
					},
					{
						label: "Category",
						value: selectedCategory,
						options: categories.map((c) => ({
							label: c.categoryName,
							value: c._id,
						})),
					},
				]}
				onFilterChange={(label, value) => {
					if (label === "Category") {
						setSelectedCategoryFilter(value);
						setPage(1);
					}
					if (label === "Product Type") {
						setSelectedTypeFilter(value);
						setPage(1);
					}
				}}
				onAddClick={handleAdd}
				paginationProps={{
					currentPage: page,
					totalPages: Math.ceil(filteredProducts.length / pageSize) || 1,
					pageSize,
					totalEntries: filteredProducts.length,
					onPageChange: setPage,
					onPageSizeChange: (s) => {
						setPageSize(Number(s));
						setPage(1);
					},
				}}
			/>

			<ActionModal
				open={isActionOpen}
				onOpenChange={setIsActionOpen}
				title={selectedProduct ? "Edit Release / Merch" : "Add Music Release or Merch"}
				description="Manage digital music downloads, tracklists, and physical artist merchandise"
				formId="product-form"
				isLoading={createMutation.isPending || updateMutation.isPending}
				submitLabel={selectedProduct ? "Update Item" : "Create Item"}
			>
				<ProductForm
					formId="product-form"
					initialData={selectedProduct || undefined}
					onSubmit={onFormSubmit}
				/>
			</ActionModal>

			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Catalog Item Details"
				onEditClick={() => {
					setIsViewOpen(false);
					setIsActionOpen(true);
				}}
			>
				{selectedProduct && (
					<div className="space-y-6">
						{selectedProduct.attachments?.length > 0 && (
							<div className="grid grid-cols-2 gap-4">
								{selectedProduct.attachments.map((img, i) => (
									<img
										key={i}
										src={img}
										alt={selectedProduct.productName}
										className="rounded-xl border border-border object-cover h-40 w-full"
									/>
								))}
							</div>
						)}

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Badge className="bg-primary text-white uppercase text-[10px]">
									{selectedProduct.productType === "digital_music"
										? `Digital Music • ${selectedProduct.digitalReleaseType || "single"}`
										: "Artist Merch"}
								</Badge>
								{selectedProduct.isFeatured && (
									<Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
										Featured
									</Badge>
								)}
							</div>
							<h3 className="font-display text-2xl font-bold text-foreground">
								{selectedProduct.productName}
							</h3>
							{selectedProduct.productType === "digital_music" && (
								<p className="text-xs font-bold text-primary uppercase tracking-wider">
									Artist: {selectedProduct.artist || "Wiz Ofuasia (Wizboyy)"}
								</p>
							)}
							<p className="text-sm text-muted-foreground leading-relaxed">
								{selectedProduct.description}
							</p>
						</div>

						<div className="grid grid-cols-3 gap-4 border-y border-border py-4">
							<div>
								<p className="text-[10px] font-bold text-muted-foreground uppercase">
									Price
								</p>
								<p className="text-xl font-black text-primary">
									${Number(selectedProduct.price || 0).toFixed(2)}
								</p>
							</div>
							<div className="border-l border-border pl-4">
								<p className="text-[10px] font-bold text-muted-foreground uppercase">
									{selectedProduct.productType === "digital_music"
										? "Downloads"
										: "Stock"}
								</p>
								<p className="text-xl font-bold text-foreground">
									{selectedProduct.productType === "digital_music"
										? `${selectedProduct.downloadCount || 0}`
										: `${selectedProduct.quantity} Units`}
								</p>
							</div>
							<div className="border-l border-border pl-4">
								<p className="text-[10px] font-bold text-muted-foreground uppercase">
									Sold
								</p>
								<p className="text-xl font-bold text-foreground">
									{selectedProduct.sold || 0}
								</p>
							</div>
						</div>

						{selectedProduct.productType === "merch" && (
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<p className="text-xs font-bold text-muted-foreground uppercase">
										Sizes
									</p>
									<div className="flex flex-wrap gap-2">
										{selectedProduct.size?.length ? (
											selectedProduct.size.map((s) => (
												<Badge key={s} variant="secondary">
													{s}
												</Badge>
											))
										) : (
											<span className="text-xs text-muted-foreground">
												Standard
											</span>
										)}
									</div>
								</div>
								<div className="space-y-2">
									<p className="text-xs font-bold text-muted-foreground uppercase">
										Colors
									</p>
									<div className="flex flex-wrap gap-2">
										{selectedProduct.color?.length ? (
											selectedProduct.color.map((c) => (
												<Badge key={c} variant="secondary">
													{c}
												</Badge>
											))
										) : (
											<span className="text-xs text-muted-foreground">
												Default
											</span>
										)}
									</div>
								</div>
							</div>
						)}

						{selectedProduct.productType === "digital_music" && (
							<div className="space-y-4">
								{selectedProduct.previewUrl && (
									<div className="space-y-2 p-4 rounded-xl bg-card border border-border">
										<p className="text-xs font-bold uppercase text-primary">
											Audio Preview Snippet
										</p>
										<audio
											controls
											src={selectedProduct.previewUrl}
											className="w-full h-10"
										/>
									</div>
								)}

								{selectedProduct.tracklist?.length > 0 && (
									<div className="space-y-2">
										<p className="text-xs font-bold uppercase text-muted-foreground">
											Tracklist ({selectedProduct.tracklist.length})
										</p>
										<div className="space-y-1.5">
											{selectedProduct.tracklist.map((t, idx) => (
												<div
													key={idx}
													className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border text-xs"
												>
													<div className="flex items-center gap-3">
														<span className="font-bold text-primary">
															#{t.trackNumber}
														</span>
														<span className="font-semibold text-foreground">
															{t.title}
														</span>
														{t.featuredArtists && (
															<span className="text-muted-foreground">
																(feat. {t.featuredArtists})
															</span>
														)}
													</div>
													<span className="text-muted-foreground">
														{t.duration}
													</span>
												</div>
											))}
										</div>
									</div>
								)}

								{selectedProduct.digitalFiles?.length > 0 && (
									<div className="space-y-2">
										<p className="text-xs font-bold uppercase text-muted-foreground">
											Master Download Files ({selectedProduct.digitalFiles.length})
										</p>
										<div className="space-y-2">
											{selectedProduct.digitalFiles.map((df, i) => (
												<div
													key={i}
													className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
												>
													<div className="flex items-center gap-2">
														<Icon
															icon="ph:file-audio-bold"
															className="text-primary size-5"
														/>
														<span className="text-xs font-bold">
															{df.fileName}
														</span>
														<Badge variant="secondary" className="text-[10px] uppercase">
															{df.fileFormat}
														</Badge>
													</div>
													{df.fileUrl && (
														<a
															href={df.fileUrl}
															target="_blank"
															rel="noopener noreferrer"
															className="text-xs font-bold text-primary hover:underline"
														>
															Download
														</a>
													)}
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</ViewDetailsModal>

			<DeleteModal
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				onConfirm={() =>
					deleteMutation.mutate(selectedProduct!._id, {
						onSuccess: () => setIsDeleteOpen(false),
					})
				}
				isLoading={deleteMutation.isPending}
			/>
		</>
	);
}

