"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row gap-4 relative",
				month: "flex flex-col gap-4",
				month_caption: "flex justify-center pt-1 relative items-center h-8",
				caption_label: "text-sm font-bold text-foreground",
				nav: "flex items-center gap-1 absolute inset-x-0 top-0 justify-between px-1 z-10",
				button_previous: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border-border",
				),
				button_next: cn(
					buttonVariants({ variant: "outline" }),
					"h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 border-border",
				),
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex",
				weekday:
					"text-muted-foreground rounded-md w-9 font-semibold text-[0.75rem] text-center",
				week: "flex w-full mt-2",
				day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
				day_button: cn(
					buttonVariants({ variant: "ghost" }),
					"h-9 w-9 p-0 font-medium aria-selected:opacity-100 hover:bg-primary/20 hover:text-foreground",
				),
				selected:
					"bg-primary text-primary-foreground rounded-md hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
				today: "bg-muted text-foreground font-bold rounded-md border border-primary/40",
				outside: "text-muted-foreground/40 opacity-50",
				disabled: "text-muted-foreground/30 opacity-40",
				range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				Chevron: ({ orientation }) =>
					orientation === "left" ? (
						<ChevronLeft className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					),
			}}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };

