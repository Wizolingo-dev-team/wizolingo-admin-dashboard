"use client";

import Image from "next/image";
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
				<div className="relative h-24 w-24 animate-bounce rounded-full border-2 border-primary/40 bg-card shadow-2xl p-3 overflow-hidden">
					<Image
						src="/assets/images/wiz-logo-white.png"
						alt="Wiz Ofuasia Admin Loading..."
						fill
						className="object-contain p-3"
						priority
					/>
				</div>
				<span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary animate-pulse">
					Loading Wizolingo Admin
				</span>
				<div className="h-2 w-16 animate-pulse rounded-[100%] bg-primary/20 blur-sm" />
			</div>
		</div>
	);
}

