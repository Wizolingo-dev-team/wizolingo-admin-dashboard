"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	disablePastDates?: boolean;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Select date",
	disabled = false,
	className,
	disablePastDates = false,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	const selectedDate = React.useMemo(() => {
		if (!value) return undefined;
		const parsed = parseISO(value);
		return isValid(parsed) ? parsed : undefined;
	}, [value]);

	const handleSelect = (date: Date | undefined) => {
		if (date) {
			onChange(format(date, "yyyy-MM-dd"));
		} else {
			onChange("");
		}
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full h-11 justify-between text-left font-normal bg-background/60 border-border hover:bg-background/80",
						!selectedDate && "text-muted-foreground",
						className,
					)}
				>
					<span className="flex items-center gap-2 truncate">
						<CalendarIcon className="h-4 w-4 text-primary shrink-0" />
						{selectedDate ? format(selectedDate, "PPP") : placeholder}
					</span>
					{selectedDate && (
						<span
							role="button"
							tabIndex={0}
							aria-label="Clear date"
							onClick={(e) => {
								e.stopPropagation();
								onChange("");
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.stopPropagation();
									onChange("");
								}
							}}
							className="ml-2 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
						>
							<X className="h-3.5 w-3.5" />
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0 bg-card border-border" align="start">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={handleSelect}
					disabled={
						disablePastDates
							? (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
							: undefined
					}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}

