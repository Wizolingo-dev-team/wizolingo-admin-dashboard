"use client";
import { Icon } from "@iconify/react";

export const CanceledCustomersWidget = ({ count }: { count: number }) => (
	<div className="rounded-[24px] border border-border bg-card p-8 shadow-sm h-full relative overflow-hidden">
		<div className="flex justify-between items-start">
			<h4 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
				Canceled Orders
			</h4>
			<span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
				System Report
			</span>
		</div>
		<div className="mt-12 flex items-end justify-between">
			<div>
				<h3 className="font-display text-5xl font-black text-foreground">
					{count.toLocaleString()}
				</h3>
				<div className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase text-destructive tracking-widest">
					<Icon icon="ph:warning-circle-bold" /> Attention
				</div>
			</div>
			<div className="flex-1 ml-10 h-24 bg-gradient-to-t from-muted/5 to-transparent relative">
				<div className="absolute inset-0 flex items-center justify-around text-[10px] font-bold text-muted-foreground mt-24">
					{["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((d) => (
						<span key={d}>{d}</span>
					))}
				</div>
				<svg
					className="absolute bottom-0 w-full h-full overflow-visible"
					viewBox="0 0 400 100"
				>
					<path
						d="M0 80 Q 50 20 100 60 T 200 20 T 300 60 T 400 40"
						fill="none"
						stroke="#D70E1D"
						strokeWidth="3"
					/>
					<path
						d="M0 80 Q 50 20 100 60 T 200 20 T 300 60 T 400 40 V 100 H 0 Z"
						fill="#D70E1D"
						opacity="0.15"
					/>
				</svg>
			</div>
		</div>
	</div>
);

