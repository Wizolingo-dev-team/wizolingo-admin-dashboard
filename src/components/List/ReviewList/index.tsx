"use client";

import React, { useState, useMemo } from "react";
import { useGetAllAdminReviews } from "@/hooks/reviewManagement";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";

export default function ReviewList() {
	const { data, isLoading } = useGetAllAdminReviews();
	const reviews = data?.reviews || [];

	const [search, setSearch] = useState("");
	const [ratingFilter, setRatingFilter] = useState("all");

	const filteredReviews = useMemo(() => {
		return reviews.filter((r) => {
			const matchesSearch =
				(r.review || "").toLowerCase().includes(search.toLowerCase()) ||
				(r.product?.productName || "").toLowerCase().includes(search.toLowerCase()) ||
				`${r.user?.firstName || ""} ${r.user?.lastName || ""}`
					.toLowerCase()
					.includes(search.toLowerCase());
			const matchesRating =
				ratingFilter === "all" || String(r.rating) === ratingFilter;
			return matchesSearch && matchesRating;
		});
	}, [reviews, search, ratingFilter]);

	const columns = getColumns([
		{
			key: "user",
			header: "Fan / Reviewer",
			render: (row: any) => (
				<div>
					<div className="font-bold text-foreground">
						{row.user
							? `${row.user.firstName} ${row.user.lastName}`
							: "Verified Fan"}
					</div>
					<div className="text-xs text-muted-foreground">{row.user?.email}</div>
				</div>
			),
		},
		{
			key: "product",
			header: "Product / Release",
			render: (row: any) => (
				<div className="flex items-center gap-2">
					<span className="font-bold text-foreground">
						{row.product?.productName || "Catalog Item"}
					</span>
					{row.product?.productType && (
						<Badge variant="outline" className="text-[10px] uppercase">
							{row.product.productType === "digital_music" ? "Music" : "Merch"}
						</Badge>
					)}
				</div>
			),
		},
		{
			key: "rating",
			header: "Rating",
			render: (row: any) => (
				<div className="flex items-center gap-1 text-primary">
					{[...Array(5)].map((_, idx) => (
						<Icon
							key={idx}
							icon={idx < row.rating ? "ph:star-fill" : "ph:star"}
							className="size-4"
						/>
					))}
				</div>
			),
		},
		{
			key: "review",
			header: "Comment",
			render: (row: any) => (
				<p className="max-w-md truncate text-sm text-muted-foreground">{row.review}</p>
			),
		},
		{
			key: "createdAt",
			header: "Date",
			render: (row: any) => (
				<span className="text-xs text-muted-foreground">
					{new Date(row.createdAt).toLocaleDateString()}
				</span>
			),
		},
	]);

	return (
		<TableLayoutWrapper
			title="Product & Music Reviews"
			columns={columns}
			data={filteredReviews}
			isLoading={isLoading}
			skeleton={<ProductListSkeleton />}
			searchQuery={search}
			onSearchChange={setSearch}
			filters={[
				{
					label: "Star Rating",
					value: ratingFilter,
					options: [
						{ label: "5 Stars", value: "5" },
						{ label: "4 Stars", value: "4" },
						{ label: "3 Stars", value: "3" },
						{ label: "2 Stars", value: "2" },
						{ label: "1 Star", value: "1" },
					],
				},
			]}
			onFilterChange={(_, val) => setRatingFilter(val)}
		/>
	);
}

