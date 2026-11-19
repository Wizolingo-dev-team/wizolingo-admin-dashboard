import { cn } from "@/lib/utils";
import React from "react";

const SkeletonBox = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse bg-muted rounded", className)} />
);

export const ProductListSkeleton = () => {
	return (
		<div className="border-border w-full rounded-[20px] border bg-card p-6 shadow-sm">
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					className="flex items-center justify-between border-b border-border/40 h-20 py-4 last:border-0"
				>
					<SkeletonBox className="h-5 w-5 ml-2" />
					<div className="flex items-center gap-3 flex-1 ml-8">
						<SkeletonBox className="size-14 rounded-lg" />
						<div className="space-y-2">
							<SkeletonBox className="h-4 w-48" />
							<SkeletonBox className="h-3 w-32" />
						</div>
					</div>
					<div className="flex-1">
						<SkeletonBox className="h-4 w-24" />
					</div>
					<div className="flex-1">
						<SkeletonBox className="h-4 w-16" />
					</div>
					<div className="flex-1">
						<SkeletonBox className="h-4 w-10" />
					</div>
					<div className="flex items-center gap-2 mr-2">
						<SkeletonBox className="size-8 rounded-md" />
						<SkeletonBox className="size-8 rounded-md" />
						<SkeletonBox className="size-8 rounded-md" />
					</div>
				</div>
			))}
		</div>
	);
};

