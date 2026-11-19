"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wishlist } from "@/types/wishlistManagement";

interface WishlistCardProps {
	wishlist: Wishlist;
	viewType: "grid" | "list";
	onViewClick: (w: Wishlist) => void;
}

export const WishlistCard = ({ wishlist, viewType, onViewClick }: WishlistCardProps) => {
	const mainProduct = wishlist.products[0];
	const userInitials = `${wishlist.user.firstName?.[0] || "W"}${wishlist.user.lastName?.[0] || "Z"}`;
	const displayImage = mainProduct?.attachments?.[0];
	const userAvatar = wishlist.user.avatar?.url;

	if (viewType === "list") {
		return (
			<div className="group relative flex items-center gap-6 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg">
				<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-muted shadow-inner overflow-hidden">
					{displayImage ? (
						<img src={displayImage} alt="" className="h-full w-full object-cover" />
					) : (
						<Icon icon="ph:music-notes-duotone" className="size-10 text-primary/40" />
					)}
				</div>

				<div className="flex flex-1 items-center gap-4">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 overflow-hidden">
						{userAvatar ? (
							<img src={userAvatar} alt="User" className="h-full w-full object-cover" />
						) : (
							<span className="text-[10px] font-bold text-primary uppercase">
								{userInitials}
							</span>
						)}
					</div>

					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<span className="text-sm font-bold text-foreground capitalize">
								{wishlist.user.firstName} {wishlist.user.lastName}
							</span>
							<Badge
								variant="outline"
								className="text-[10px] border-primary/40 text-primary"
							>
								{wishlist.products.length} Items
							</Badge>
						</div>
						<p className="text-xs text-muted-foreground">{wishlist.user.email}</p>
					</div>
				</div>

				<div className="text-right">
					<p className="text-lg font-black text-foreground">
						${Number(mainProduct?.price || 0).toFixed(2)}
					</p>
					<p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
						Top Saved Item
					</p>
				</div>

				<Button
					variant="ghost"
					size="icon"
					onClick={() => onViewClick(wishlist)}
					className="hover:bg-primary/15 hover:text-primary transition-colors"
				>
					<Icon icon="ph:eye-bold" className="size-5" />
				</Button>
			</div>
		);
	}

	return (
		<div className="group relative overflow-hidden rounded-[28px] border border-border bg-card p-4 transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary overflow-hidden shadow-lg shadow-primary/20 border border-border">
						{userAvatar ? (
							<img src={userAvatar} alt="User" className="h-full w-full object-cover" />
						) : (
							<span className="text-[10px] font-bold text-white uppercase">
								{userInitials}
							</span>
						)}
					</div>
					<div className="leading-none">
						<p className="text-xs font-bold text-foreground truncate max-w-[120px]">
							{wishlist.user.firstName} {wishlist.user.lastName}
						</p>
						<span className="text-[10px] text-muted-foreground">Fan Wishlist</span>
					</div>
				</div>
			</div>

			<div className="relative aspect-square w-full rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border">
				{displayImage ? (
					<img
						src={displayImage}
						alt=""
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
					/>
				) : (
					<Icon icon="ph:music-notes-duotone" className="size-20 text-primary/30" />
				)}
				<div className="absolute bottom-3 left-3 bg-background/85 backdrop-blur-md px-3 py-1 rounded-lg border border-border">
					<p className="text-lg font-black text-primary tracking-tight">
						${Number(mainProduct?.price || 0).toFixed(2)}
					</p>
				</div>
			</div>

			<div className="mt-4 flex items-end justify-between">
				<div>
					<p className="text-[10px] font-bold uppercase tracking-widest text-primary">
						Wishlist
					</p>
					<p className="text-sm font-medium text-muted-foreground">
						{wishlist.products.length} Items Saved
					</p>
				</div>
				<Button
					size="sm"
					onClick={() => onViewClick(wishlist)}
					className="rounded-xl bg-primary px-4 font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
				>
					View
				</Button>
			</div>
		</div>
	);
};

