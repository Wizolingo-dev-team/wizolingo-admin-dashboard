"use client";

import { cn } from "@/lib/utils";

interface WizLoaderProps {
	className?: string;
}

export default function CyndisLoader({ className }: WizLoaderProps) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center bg-background/80 backdrop-blur-sm",
				className,
			)}
		>
			<div className="relative flex flex-col items-center justify-center gap-4">
				<div className="relative flex h-24 w-24 animate-bounce items-center justify-center rounded-full border-2 border-primary/50 bg-card shadow-2xl shadow-primary/20">
					<span className="font-display text-4xl font-black tracking-tighter text-white select-none">
						W<span className="text-primary">.</span>
					</span>
				</div>
				<span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary animate-pulse">
					Loading Wizolingo Admin
				</span>
				<div className="h-2 w-16 animate-pulse rounded-[100%] bg-primary/20 blur-sm" />
			</div>
		</div>
	);
}
