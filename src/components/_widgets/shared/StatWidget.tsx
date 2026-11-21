"use client";

import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { WidgetInfoPopover } from "./WidgetInfoPopover";

interface StatWidgetProps {
	title: string;
	value: string | number;
	icon: string;
	trend: string;
	isNegative?: boolean;
	description?: string;
}

export const StatWidget = ({
	title,
	value,
	icon,
	trend,
	isNegative,
	description,
}: StatWidgetProps) => (
	<div className="relative overflow-hidden rounded-[24px] border border-border bg-card p-6 shadow-md transition-all hover:border-primary/40 hover:shadow-lg group">
		{/* Subtle Wiz Red Gradient Accent */}
		<div className="absolute -bottom-6 -right-6 size-32 rounded-full bg-primary/15 blur-3xl transition-colors group-hover:bg-primary/25" />

		<div className="flex items-center justify-between gap-2 mb-4">
			<div className="flex items-center gap-2.5 min-w-0">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/30">
					<Icon icon={icon} className="size-5" />
				</div>
				<span className="text-[14px] font-semibold text-muted-foreground truncate">
					{title}
				</span>
			</div>

			<div className="flex items-center gap-1.5 shrink-0">
				{description && <WidgetInfoPopover title={title} description={description} />}
				<Select defaultValue="30">
					<SelectTrigger className="w-fit border-none bg-transparent h-auto p-0 text-[12px] font-medium text-muted-foreground focus:ring-0">
						<SelectValue placeholder="30 Days" />
					</SelectTrigger>
					<SelectContent align="end">
						<SelectItem value="30">30 Days</SelectItem>
						<SelectItem value="7">7 Days</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>

		<div className="flex items-center gap-3">
			<h3 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
				{value}
			</h3>
			<div
				className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
					isNegative
						? "bg-destructive/15 text-destructive"
						: "bg-primary/15 text-primary"
				}`}
			>
				<Icon
					icon={isNegative ? "ph:trend-down-bold" : "ph:trend-up-bold"}
					className="size-3"
				/>
				{trend}
			</div>
		</div>
	</div>
);
