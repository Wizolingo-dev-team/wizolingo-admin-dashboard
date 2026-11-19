"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { discountColumnsSchema } from "@/components/Tables/columns/definitions";
import ActionModal from "@/components/_modals/ActionModal";
import DeleteModal from "@/components/_modals/DeleteModal";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import DiscountForm from "@/components/Forms/DiscountForm";
import { DiscountListSkeleton } from "@/components/Skeletons/DiscountListSkeleton";
import {
	useGetAllDiscounts,
	useCreateDiscount,
	useUpdateDiscount,
	useDeleteDiscount,
} from "@/hooks/discountManagement";
import { Discount } from "@/types/discountManagement";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

export default function DiscountList() {
	const { data: discounts = [], isLoading } = useGetAllDiscounts();

	const createMutation = useCreateDiscount();
	const updateMutation = useUpdateDiscount();
	const deleteMutation = useDeleteDiscount();

	const [isActionOpen, setIsActionOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [statusFilter, setStatusFilter] = useState("all");

	const filteredData = useMemo(() => {
		return discounts.filter((d) => {
			const matchesSearch = d.discountCode.toLowerCase().includes(search.toLowerCase());
			const isExpired = new Date(d.expiryDate) < new Date();
			let matchesStatus = true;
			if (statusFilter === "active") matchesStatus = !isExpired;
			if (statusFilter === "expired") matchesStatus = isExpired;

			return matchesSearch && matchesStatus;
		});
	}, [discounts, search, statusFilter]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredData.slice(start, start + pageSize);
	}, [filteredData, page, pageSize]);

	const handleEdit = (d: Discount) => {
		setSelectedDiscount(d);
		setIsActionOpen(true);
	};
	const handleView = (d: Discount) => {
		setSelectedDiscount(d);
		setIsViewOpen(true);
	};
	const handleDelete = (d: Discount) => {
		setSelectedDiscount(d);
		setIsDeleteOpen(true);
	};
	const handleAdd = () => {
		setSelectedDiscount(null);
		setIsActionOpen(true);
	};

	const onFormSubmit = (data: any) => {
		if (selectedDiscount) {
			updateMutation.mutate(
				{ id: selectedDiscount._id, payload: data },
				{ onSuccess: () => setIsActionOpen(false) },
			);
		} else {
			createMutation.mutate(data, { onSuccess: () => setIsActionOpen(false) });
		}
	};

	const columns = getColumns(discountColumnsSchema(handleView, handleEdit, handleDelete));

	return (
		<>
			<TableLayoutWrapper
				title="Discounts & Promo Codes"
				columns={columns}
				data={paginatedData}
				isLoading={isLoading}
				skeleton={<DiscountListSkeleton />}
				addLabel="Add Promo Code"
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				filters={[
					{
						label: "Status",
						value: statusFilter,
						options: [
							{ label: "Active", value: "active" },
							{ label: "Expired", value: "expired" },
						],
					},
				]}
				onFilterChange={(label, value) => {
					if (label === "Status") {
						setStatusFilter(value);
						setPage(1);
					}
				}}
				onAddClick={handleAdd}
				paginationProps={{
					currentPage: page,
					totalPages: Math.ceil(filteredData.length / pageSize) || 1,
					pageSize,
					totalEntries: filteredData.length,
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
				title={selectedDiscount ? "Edit Promo Code" : "Create New Promo Code"}
				formId="discount-form"
				isLoading={createMutation.isPending || updateMutation.isPending}
				submitLabel={selectedDiscount ? "Update Discount" : "Create Discount"}
			>
				<DiscountForm
					formId="discount-form"
					initialData={selectedDiscount || undefined}
					onSubmit={onFormSubmit}
				/>
			</ActionModal>

			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Discount Overview"
				onEditClick={() => {
					setIsViewOpen(false);
					setIsActionOpen(true);
				}}
			>
				{selectedDiscount && (
					<div className="space-y-8">
						<div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/40">
							<span className="text-[10px] font-bold uppercase text-primary mb-2 tracking-widest">
								Promo Coupon
							</span>
							<h2 className="font-display text-4xl font-black text-foreground tracking-tight">
								{selectedDiscount.discountCode}
							</h2>
							<Badge className="mt-4 bg-primary text-white px-4 py-1 rounded-full border-none shadow-md">
								{selectedDiscount.discountPercentage}% OFF
							</Badge>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 rounded-xl border border-border bg-card">
								<p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
									Expires On
								</p>
								<p className="font-bold text-sm">
									{new Date(selectedDiscount.expiryDate).toDateString()}
								</p>
							</div>
							<div className="p-4 rounded-xl border border-border bg-card">
								<p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
									Usage Status
								</p>
								<p
									className={cn(
										"font-bold text-sm",
										new Date(selectedDiscount.expiryDate) < new Date()
											? "text-destructive"
											: "text-emerald-400",
									)}
								>
									{new Date(selectedDiscount.expiryDate) < new Date()
										? "Expired"
										: "Valid / Active"}
								</p>
							</div>
						</div>

						<div className="space-y-3">
							<p className="text-sm font-bold text-foreground flex items-center gap-2">
								<Icon icon="ph:package-bold" className="text-primary" />
								{selectedDiscount.products?.length
									? `Linked to ${selectedDiscount.products.length} Products`
									: "Applies Storewide (All Music & Merch)"}
							</p>
							<div className="space-y-2 max-h-[280px] overflow-y-auto pr-2">
								{(selectedDiscount.products as any[])?.map((p, idx) => (
									<div
										key={p._id || idx}
										className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
									>
										<span className="text-xs font-bold text-foreground">
											{typeof p === "object" ? p.productName : p}
										</span>
										{typeof p === "object" && p.price !== undefined && (
											<span className="text-xs font-bold text-primary">
												${Number(p.price).toFixed(2)}
											</span>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</ViewDetailsModal>

			<DeleteModal
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				onConfirm={() =>
					deleteMutation.mutate(selectedDiscount!._id, {
						onSuccess: () => setIsDeleteOpen(false),
					})
				}
				isLoading={deleteMutation.isPending}
			/>
		</>
	);
}

