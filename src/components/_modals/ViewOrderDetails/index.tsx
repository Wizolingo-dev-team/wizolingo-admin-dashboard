"use client";
import React from "react";
import ViewDetailsModal from "../ViewDetailsModal";
import { Order } from "@/types/orderManagement";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ViewOrderDetailsProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	order: Order | null;
}

export default function ViewOrderDetails({
	open,
	onOpenChange,
	order,
}: ViewOrderDetailsProps) {
	if (!order) return null;

	const customerName =
		typeof order.user === "object" && order.user
			? `${order.user.firstName} ${order.user.lastName}`
			: order.email;

	return (
		<ViewDetailsModal
			open={open}
			onOpenChange={onOpenChange}
			title="Order Details"
			description={`Order #${order._id.slice(-8).toUpperCase()} • ${order.orderType.toUpperCase()}`}
		>
			<div className="space-y-8">
				{/* Status & Date */}
				<div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
					<div className="space-y-1">
						<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
							Placed On
						</p>
						<p className="text-sm font-bold text-foreground">
							{new Date(order.createdAt).toLocaleString()}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Badge className="bg-primary text-white uppercase font-bold text-[10px]">
							{order.status}
						</Badge>
						<Badge
							variant="outline"
							className={cn(
								"uppercase font-bold text-[10px]",
								order.paymentStatus === "completed"
									? "border-emerald-500/40 text-emerald-400"
									: "border-amber-500/40 text-amber-400",
							)}
						>
							Payment: {order.paymentStatus}
						</Badge>
						{(order.orderType === "digital" || order.orderType === "mixed") && (
							<Badge
								variant="outline"
								className={cn(
									"uppercase font-bold text-[10px]",
									order.downloadUnlocked
										? "border-emerald-500/40 text-emerald-400"
										: "border-muted-foreground/40 text-muted-foreground",
								)}
							>
								{order.downloadUnlocked ? "Downloads Unlocked" : "Downloads Locked"}
							</Badge>
						)}
					</div>
				</div>

				{/* Customer Info Section */}
				<div className="space-y-4">
					<h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
						Customer &amp; Delivery Information
					</h3>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="rounded-2xl border border-border bg-card p-4">
							<p className="text-[10px] font-black uppercase text-muted-foreground mb-1">
								Customer
							</p>
							<p className="text-sm font-bold text-foreground">{customerName}</p>
							<p className="text-xs text-muted-foreground">{order.email}</p>
						</div>
						<div className="rounded-2xl border border-border bg-card p-4">
							<p className="text-[10px] font-black uppercase text-muted-foreground mb-1">
								Contact Phone
							</p>
							<p className="text-sm font-bold text-foreground">
								{order.phone || "Not provided"}
							</p>
						</div>
						{order.orderType !== "digital" && (
							<div className="col-span-full rounded-2xl border border-border bg-card p-4">
								<p className="text-[10px] font-black uppercase text-muted-foreground mb-1">
									Shipping Destination
								</p>
								<p className="text-sm font-bold text-foreground">
									{[
										order.address,
										order.city,
										order.state,
										order.country,
										order.postalCode,
									]
										.filter(Boolean)
										.join(", ") || "Digital / No physical shipping address"}
								</p>
								{order.additionalInfo && (
									<p className="text-xs text-muted-foreground mt-1">
										Note: {order.additionalInfo}
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Products Section */}
				<div className="space-y-4">
					<h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
						Items Ordered ({order.products.length})
					</h3>
					<div className="space-y-3">
						{order.products.map((item, idx) => (
							<div
								key={idx}
								className="flex items-center justify-between rounded-2xl border border-border bg-card p-3 transition-colors"
							>
								<div className="flex items-center gap-4">
									<div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted flex items-center justify-center">
										{item.attachments?.[0] ? (
											<img
												src={item.attachments[0]}
												alt={item.productName}
												className="size-full object-cover"
											/>
										) : (
											<Icon
												icon={
													item.productType === "digital_music"
														? "ph:music-notes-bold"
														: "ph:t-shirt-bold"
												}
												className="size-6 text-primary"
											/>
										)}
									</div>
									<div className="flex flex-col gap-1">
										<span className="text-sm font-bold text-foreground">
											{item.productName}
										</span>
										<div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase">
											<span>Qty: {item.quantity}</span>
											<span>•</span>
											<span>
												{item.productType === "digital_music"
													? "Digital Release"
													: "Merch"}
											</span>
											{item.size && <span>• Size: {item.size}</span>}
											{item.color && <span>• Color: {item.color}</span>}
										</div>
									</div>
								</div>
								<div className="text-right">
									<p className="text-sm font-black text-foreground">
										${(item.price * item.quantity).toFixed(2)}
									</p>
									<p className="text-[10px] font-medium text-muted-foreground">
										${Number(item.price).toFixed(2)} each
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Pricing Summary */}
				<div className="rounded-3xl border border-primary/30 bg-card p-6 text-foreground shadow-xl">
					<div className="space-y-3">
						<div className="flex justify-between text-xs font-bold text-muted-foreground">
							<span>Items Subtotal</span>
							<span>
								$
								{Number(
									order.subtotal || order.amount - (order.deliveryFee || 0),
								).toFixed(2)}
							</span>
						</div>
						{order.discountAmount > 0 && (
							<div className="flex justify-between text-xs font-bold text-emerald-400">
								<span>Discount ({order.discountCode})</span>
								<span>-${Number(order.discountAmount).toFixed(2)}</span>
							</div>
						)}
						<div className="flex justify-between text-xs font-bold text-muted-foreground">
							<span>Delivery Fee</span>
							<span>${Number(order.deliveryFee || 0).toFixed(2)}</span>
						</div>
						<div className="border-t border-border pt-4 flex justify-between items-end">
							<span className="text-sm font-black uppercase tracking-widest">
								Total Amount ({order.currency || "USD"})
							</span>
							<span className="text-3xl font-black text-primary">
								${Number(order.amount || 0).toFixed(2)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</ViewDetailsModal>
	);
}

