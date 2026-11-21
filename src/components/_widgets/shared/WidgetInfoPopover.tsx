"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WidgetInfoPopoverProps {
	title: string;
	description: string;
}

export function WidgetInfoPopover({ title, description }: WidgetInfoPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label={`About ${title}`}
					className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				>
					<Icon icon="ph:info-bold" className="size-4" />
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={6}
				className="w-72 rounded-xl border border-border bg-[#181818] p-3.5 text-foreground shadow-xl"
			>
				<div className="space-y-1.5">
					<p className="font-display text-xs font-bold uppercase tracking-wider text-primary">
						{title}
					</p>
					<p className="text-xs leading-relaxed text-muted-foreground">
						{description}
					</p>
				</div>
			</PopoverContent>
		</Popover>
	);
}

