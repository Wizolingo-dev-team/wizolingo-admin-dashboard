"use client";
import React from "react";
import { cn } from "@/lib/utils";

const SkeletonBox = ({ className }: { className?: string }) => (
	<div className={cn("animate-pulse bg-muted rounded", className)} />
);

export default function OrderListSkeleton() {
	return (
		<div className="space-y-6 w-full">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-6 rounded-[20px] border border-border">
				{[1, 2, 3].map((i) => (
					<SkeletonBox key={i} className="h-12 w-full rounded-xl" />
				))}
			</div>

			<div className="flex justify-between items-center">
				<SkeletonBox className="h-11 w-64 rounded-xl" />
				<SkeletonBox className="h-11 w-40 rounded-xl" />
			</div>

			<div className="bg-card rounded-[20px] p-6 border border-border shadow-sm space-y-4">
				<div className="flex justify-between pb-4 border-b border-border/50">
					{[1, 2, 3, 4, 5].map((i) => (
						<SkeletonBox key={i} className="h-4 w-20 rounded" />
					))}
				</div>
				{[1, 2, 3, 4, 5, 6].map((i) => (
					<div
						key={i}
						className="flex justify-between items-center py-4 border-b border-border/30 last:border-0"
					>
						<SkeletonBox className="h-5 w-24 rounded" />
						<SkeletonBox className="h-5 w-32 rounded" />
						<SkeletonBox className="h-5 w-16 rounded" />
						<SkeletonBox className="h-8 w-24 rounded-full" />
						<SkeletonBox className="h-8 w-16 rounded-lg" />
					</div>
				))}
			</div>
		</div>
	);
}

