"use client";

import React, { useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCategorySchema } from "@/validations/categoryManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Category, CategoryType } from "@/types/categoryManagement";

interface CategoryFormProps {
	formId: string;
	initialData?: Category;
	existingSubCategories?: string[];
	onSubmit: (data: any) => void;
}

export default function CategoryForm({
	formId,
	initialData,
	existingSubCategories = [],
	onSubmit,
}: CategoryFormProps) {
	const [subQuery, setSubQuery] = useState("");

	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(createCategorySchema),
		defaultValues: {
			categoryName: initialData?.categoryName || "",
			categoryType: (initialData?.categoryType || "general") as CategoryType,
			subcategories:
				initialData?.subcategories.map((s) => ({
					subcategoryName: s.subcategoryName,
				})) || [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "subcategories",
	});

	const suggestions = useMemo(() => {
		if (!subQuery.trim()) return [];
		const currentSubs = fields.map((f) => f.subcategoryName.toLowerCase());
		return existingSubCategories
			.filter((s) => s.toLowerCase().includes(subQuery.toLowerCase()))
			.filter((s) => !currentSubs.includes(s.toLowerCase()));
	}, [subQuery, existingSubCategories, fields]);

	const handleAddSub = (name: string) => {
		if (!name.trim()) return;
		const exists = fields.find(
			(f) => f.subcategoryName.toLowerCase() === name.toLowerCase(),
		);
		if (!exists) {
			append({ subcategoryName: name.trim() });
		}
		setSubQuery("");
	};

	return (
		<form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* Category Name */}
			<div className="space-y-2">
				<Label htmlFor="categoryName" className="text-sm font-semibold">
					Category Name
				</Label>
				<Input
					id="categoryName"
					placeholder="e.g. Afrobeats Albums, Tour Apparel, Vinyl & Merch"
					{...register("categoryName")}
					className={cn(
						"h-12 bg-background/60 border-border",
						errors.categoryName && "border-destructive",
					)}
				/>
				{errors.categoryName && (
					<p className="text-xs text-destructive">{errors.categoryName.message}</p>
				)}
			</div>

			{/* Category Type */}
			<div className="space-y-2">
				<Label className="text-sm font-semibold">Category Scope</Label>
				<Select
					defaultValue={initialData?.categoryType || "general"}
					onValueChange={(val) => setValue("categoryType", val as CategoryType)}
				>
					<SelectTrigger className="h-12 bg-background/60 border-border">
						<SelectValue placeholder="Select category type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="general">General (All Store Items)</SelectItem>
						<SelectItem value="digital_music">Digital Music Releases</SelectItem>
						<SelectItem value="merch">Artist Merch &amp; Apparel</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Sub Categories Section */}
			<div className="space-y-3">
				<Label className="text-sm font-semibold">Sub-Categories</Label>

				<div className="relative">
					<div className="relative flex items-center">
						<Input
							placeholder="Type sub-category and press Enter..."
							value={subQuery}
							onChange={(e) => setSubQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddSub(subQuery);
								}
							}}
							className="h-12 pr-12 bg-background/60 border-border"
						/>
						<Button
							type="button"
							size="icon"
							variant="ghost"
							className="absolute right-1 h-10 w-10 text-primary hover:bg-primary/15"
							onClick={() => handleAddSub(subQuery)}
						>
							<Icon icon="ph:plus-circle-bold" className="size-6" />
						</Button>
					</div>

					{suggestions.length > 0 && (
						<div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
							<ul className="py-1">
								{suggestions.map((s) => (
									<li
										key={s}
										onClick={() => handleAddSub(s)}
										className="flex cursor-pointer items-center px-4 py-2 text-sm hover:bg-muted"
									>
										<Icon
											icon="ph:magnifying-glass"
											className="mr-2 size-4 text-muted-foreground"
										/>
										{s}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>

				<div className="flex flex-wrap gap-2 pt-2">
					{fields.map((field, index) => (
						<Badge
							key={field.id}
							variant="secondary"
							className="flex items-center gap-1 bg-primary/15 px-3 py-1.5 text-primary border border-primary/30"
						>
							{field.subcategoryName}
							<button
								type="button"
								onClick={() => remove(index)}
								className="ml-1 rounded-full hover:bg-primary/20"
							>
								<Icon icon="ph:x-bold" className="size-3" />
							</button>
						</Badge>
					))}
					{fields.length === 0 && (
						<p className="text-xs text-muted-foreground italic">
							No sub-categories added yet.
						</p>
					)}
				</div>
			</div>
		</form>
	);
}

