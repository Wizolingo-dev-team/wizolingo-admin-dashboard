"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useGetAllWishlists } from "@/hooks/wishlistManagement";
import { WishlistCard } from "../../Cards/WishlistCard";
import { WishlistListSkeleton } from "../../Skeletons/WishlistSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Wishlist } from "@/types/wishlistManagement";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";

export default function WishlistList() {
	const { data: wishlists = [], isLoading } = useGetAllWishlists();
	const [viewType, setViewType] = useState<"grid" | "list">("grid");
	const [search, setSearch] = useState("");
	const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleViewDetails = (wishlist: Wishlist) => {
		setSelectedWishlist(wishlist);
		setIsModalOpen(true);
	};

	const filteredWishlists = wishlists.filter(
		(w) =>
			w.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
			w.user.email.toLowerCase().includes(search.toLowerCase()) ||
			w.user.lastName.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<div className="space-y-8 p-2">
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="font-display text-2xl font-black tracking-tight text-foreground uppercase">
						Fan <span className="text-primary">Wishlists</span>
					</h2>
					<p className="text-sm text-muted-foreground">
						Monitor trending music releases and merch saved by fans
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="relative">
						<Icon
							icon="ph:magnifying-glass-bold"
							className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						/>
						<Input
							placeholder="Search fans..."
							className="h-11 w-[240px] border-border bg-card pl-10 focus:border-primary"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm">
						<Button
							variant={viewType === "grid" ? "default" : "ghost"}
							size="icon"
							className={cn(
								"rounded-xl transition-all duration-300",
								viewType === "grid" &&
									"bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90",
							)}
							onClick={() => setViewType("grid")}
						>
							<Icon icon="ph:squares-four-bold" className="size-5" />
						</Button>
						<Button
							variant={viewType === "list" ? "default" : "ghost"}
							size="icon"
							className={cn(
								"rounded-xl transition-all duration-300",
								viewType === "list" &&
									"bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90",
							)}
							onClick={() => setViewType("list")}
						>
							<Icon icon="ph:list-bold" className="size-5" />
						</Button>
					</div>
				</div>
			</div>

			{isLoading ? (
				<WishlistListSkeleton viewType={viewType} />
			) : filteredWishlists.length > 0 ? (
				<div
					className={cn(
						"grid gap-6 transition-all duration-500",
						viewType === "grid"
							? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
							: "grid-cols-1",
					)}
				>
					{filteredWishlists.map((wishlist) => (
						<WishlistCard
							key={wishlist._id}
							wishlist={wishlist}
							viewType={viewType}
							onViewClick={handleViewDetails}
						/>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center py-16 text-center rounded-[32px] border border-dashed border-border bg-card/50">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 mb-4 text-primary">
						<Icon icon="ph:heart-bold" className="size-8" />
					</div>
					<h3 className="font-display text-lg font-bold text-foreground">
						No Active Fan Wishlists Yet
					</h3>
					<p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
						When fans save songs or merch to their wishlist, they will appear here.
					</p>
				</div>
			)}

			<ViewDetailsModal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				title="Wishlist Details"
				description="Overview of fan's saved items"
			>
				{selectedWishlist && (
					<div className="space-y-6">
						<div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/30">
							<div className="h-14 w-14 shrink-0 rounded-full border border-border overflow-hidden bg-primary flex items-center justify-center">
								{selectedWishlist.user.avatar?.url ? (
									<img
										src={selectedWishlist.user.avatar.url}
										alt="Avatar"
										className="h-full w-full object-cover"
									/>
								) : (
									<span className="text-white font-bold uppercase text-lg">
										{selectedWishlist.user.firstName?.[0]}
										{selectedWishlist.user.lastName?.[0]}
									</span>
								)}
							</div>
							<div>
								<h3 className="font-bold text-foreground text-lg leading-tight capitalize">
									{selectedWishlist.user.firstName}{" "}
									{selectedWishlist.user.lastName}
								</h3>
								<p className="text-xs text-muted-foreground">
									{selectedWishlist.user.email}
								</p>
							</div>
						</div>

						<div className="flex items-center justify-between border-b border-border pb-4 px-1">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
									Saved Count
								</p>
								<p className="text-sm font-semibold text-foreground">
									{selectedWishlist.products.length} Items
								</p>
							</div>
							<div className="text-right">
								<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
									Total Estimated Value
								</p>
								<p className="text-xl font-black text-primary">
									$
									{selectedWishlist.products
										.reduce((acc, p) => acc + (p.price || 0), 0)
										.toFixed(2)}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							{selectedWishlist.products.map((product) => (
								<div
									key={product._id}
									className="group relative rounded-2xl border border-border bg-card p-2 transition-all hover:border-primary/40"
								>
									<div className="aspect-square w-full rounded-xl bg-muted overflow-hidden border border-border">
										{product.attachments?.[0] ? (
											<img
												src={product.attachments[0]}
												alt={product.productName}
												className="h-full w-full object-cover"
											/>
										) : (
											<div className="flex h-full w-full items-center justify-center text-primary/40">
												<Icon
													icon="ph:music-notes-duotone"
													className="size-12"
												/>
											</div>
										)}
									</div>
									<div className="mt-2 px-1 pb-1">
										<p className="text-xs font-bold text-foreground line-clamp-1">
											{product.productName}
										</p>
										<p className="text-xs font-black text-primary mt-0.5">
											${Number(product.price || 0).toFixed(2)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</ViewDetailsModal>
		</div>
	);
}

