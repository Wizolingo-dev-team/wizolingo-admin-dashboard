"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createDiscountSchema } from "@/validations/discountManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllProducts } from "@/hooks/productManagement";
import { Discount, CreateDiscountPayload } from "@/types/discountManagement";
import { cn } from "@/lib/utils";

interface DiscountFormProps {
	formId: string;
	initialData?: Discount;
	onSubmit: (data: CreateDiscountPayload) => void;
}

export default function DiscountForm({ formId, initialData, onSubmit }: DiscountFormProps) {
	const { data: products = [] } = useGetAllProducts();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CreateDiscountPayload>({
		// @ts-ignore
		resolver: yupResolver(createDiscountSchema),
		defaultValues: {
			discountCode: initialData?.discountCode || "",
			discountPercentage: initialData?.discountPercentage || 15,
			products: initialData?.products
				? (initialData.products as any[]).map((p) => (typeof p === "string" ? p : p._id))
				: [],
			expiryDate: initialData?.expiryDate
				? new Date(initialData.expiryDate).toISOString().split("T")[0]
				: "",
			isActive: initialData?.isActive ?? true,
		},
	});

	const selectedProducts = watch("products") || [];

	const toggleProduct = (id: string) => {
		const isSelected = selectedProducts.includes(id);
		const nextValue = isSelected
			? selectedProducts.filter((pId) => pId !== id)
			: [...selectedProducts, id];

		setValue("products", nextValue, { shouldValidate: true });
	};

	return (
		<form id={formId} onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 pb-10">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="space-y-2">
					<Label className="text-sm font-bold">Coupon Code</Label>
					<div className="relative">
						<Icon
							icon="ph:ticket-bold"
							className="absolute left-4 top-1/2 -translate-y-1/2 text-primary size-5"
						/>
						<Input
							{...register("discountCode")}
							placeholder="WIZOLINGO20"
							className="h-12 pl-12 uppercase font-bold tracking-widest bg-background/60 border-border"
						/>
					</div>
					{errors.discountCode && (
						<p className="text-xs text-destructive font-medium mt-1">
							{errors.discountCode.message}
						</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Discount Percentage (1% – 100%)</Label>
					<Input
						type="number"
						min={1}
						max={100}
						{...register("discountPercentage")}
						placeholder="20"
						className="h-12 bg-background/60 border-border"
					/>
					{errors.discountPercentage && (
						<p className="text-xs text-destructive font-medium mt-1">
							{errors.discountPercentage.message}
						</p>
					)}
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">Expiry Date</Label>
				<Input
					type="date"
					{...register("expiryDate")}
					className="h-12 bg-background/60 border-border"
				/>
				{errors.expiryDate && (
					<p className="text-xs text-destructive font-medium mt-1">
						{errors.expiryDate.message}
					</p>
				)}
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Label className="text-sm font-bold">
						Applicable Products (Optional — applies storewide if none selected)
					</Label>
					<Badge
						variant="secondary"
						className="bg-primary/15 text-primary border border-primary/30"
					>
						{selectedProducts.length} Selected
					</Badge>
				</div>

				<div className="rounded-xl border border-border overflow-hidden">
					<div className="bg-muted/40 p-3 border-b border-border">
						<p className="text-[10px] font-bold uppercase text-muted-foreground">
							Select Music Releases or Merch Items
						</p>
					</div>
					<ScrollArea className="h-[240px] bg-card">
						<div className="p-2 space-y-1">
							{products.map((product) => {
								const isChecked = selectedProducts.includes(product._id);
								const inputId = `product-${product._id}`;

								return (
									<div
										key={product._id}
										className={cn(
											"flex items-center gap-3 p-3 rounded-lg transition-colors",
											isChecked ? "bg-primary/10" : "hover:bg-muted/40",
										)}
									>
										<Checkbox
											id={inputId}
											checked={isChecked}
											onCheckedChange={() => toggleProduct(product._id)}
										/>

										<Label
											htmlFor={inputId}
											className="flex items-center gap-3 cursor-pointer flex-1"
										>
											{product.attachments?.[0] ? (
												<img
													src={product.attachments[0]}
													alt=""
													className="size-8 rounded object-cover border border-border"
												/>
											) : (
												<div className="size-8 rounded bg-muted flex items-center justify-center">
													<Icon
														icon="ph:disc-bold"
														className="size-4 text-primary"
													/>
												</div>
											)}
											<div>
												<p className="text-sm font-bold leading-none text-foreground">
													{product.productName}
												</p>
												<p className="text-[10px] text-muted-foreground mt-0.5">
													${Number(product.price || 0).toFixed(2)} •{" "}
													{product.productType === "digital_music"
														? "Digital Music"
														: "Merch"}
												</p>
											</div>
										</Label>
									</div>
								);
							})}
						</div>
					</ScrollArea>
				</div>
			</div>
		</form>
	);
}

