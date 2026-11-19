import React from "react";
import { cn } from "@/lib/utils";

export const WishlistListSkeleton = ({ viewType = "grid" }: { viewType?: "grid" | "list" }) => (
	<div
		className={cn(
			"grid gap-6",
			viewType === "grid"
				? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				: "grid-cols-1",
		)}
	>
		{[1, 2, 3, 4].map((i) => (
			<div
				key={i}
				className="h-64 rounded-2xl border border-border bg-card p-6 animate-pulse space-y-4"
			>
				<div className="flex items-center gap-3">
					<div className="size-12 rounded-full bg-muted" />
					<div className="space-y-2 flex-1">
						<div className="h-4 w-32 bg-muted rounded" />
						<div className="h-3 w-24 bg-muted rounded" />
					</div>
				</div>
				<div className="grid grid-cols-3 gap-2 pt-4">
					<div className="aspect-square rounded-lg bg-muted" />
					<div className="aspect-square rounded-lg bg-muted" />
					<div className="aspect-square rounded-lg bg-muted" />
				</div>
			</div>
		))}
	</div>
);

