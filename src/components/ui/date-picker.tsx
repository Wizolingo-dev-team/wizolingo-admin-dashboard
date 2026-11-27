"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

interface DatePickerProps {
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	disablePastDates?: boolean;
	startYear?: number;
	endYear?: number;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Select date",
	disabled = false,
	className,
	disablePastDates = false,
	startYear = 2000,
	endYear = new Date().getFullYear() + 5,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	const selectedDate = React.useMemo(() => {
		if (!value) return undefined;
		const parsed = parseISO(value);
		return isValid(parsed) ? parsed : undefined;
	}, [value]);

	const [displayMonth, setDisplayMonth] = React.useState<Date>(() => selectedDate || new Date());

	React.useEffect(() => {
		if (selectedDate) {
			setDisplayMonth(selectedDate);
		}
	}, [selectedDate]);

	const years = React.useMemo(() => {
		const minYear = disablePastDates ? Math.max(startYear, new Date().getFullYear()) : startYear;
		const maxYear = Math.max(minYear, endYear);
		const list: number[] = [];
		for (let y = maxYear; y >= minYear; y--) {
			list.push(y);
		}
		return list;
	}, [startYear, endYear, disablePastDates]);

	const handleSelect = (date: Date | undefined) => {
		if (date) {
			onChange(format(date, "yyyy-MM-dd"));
			setDisplayMonth(date);
		} else {
			onChange("");
		}
		setOpen(false);
	};

	const handleMonthSelect = (monthIndexStr: string) => {
		const monthIndex = Number(monthIndexStr);
		if (!Number.isNaN(monthIndex)) {
			setDisplayMonth(new Date(displayMonth.getFullYear(), monthIndex, 1));
		}
	};

	const handleYearSelect = (yearStr: string) => {
		const year = Number(yearStr);
		if (!Number.isNaN(year)) {
			setDisplayMonth(new Date(year, displayMonth.getMonth(), 1));
		}
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
							className="ml-2 rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
						>
							<X className="h-3.5 w-3.5" />
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-[min(calc(100vw-2rem),320px)] sm:w-auto p-0 bg-card border-border shadow-2xl rounded-xl overflow-hidden"
				align="start"
			>
				{/* Quick Month & Year Selector (Custom Shadcn Select) */}
				<div className="grid grid-cols-[1fr_92px] gap-2 p-3 pb-2.5 border-b border-border/60 bg-muted/20">
					<Select
						value={String(displayMonth.getMonth())}
						onValueChange={handleMonthSelect}
					>
						<SelectTrigger className="h-8 bg-background/80 border-border text-xs font-semibold">
							<SelectValue placeholder="Month" />
						</SelectTrigger>
						<SelectContent className="max-h-60">
							{MONTHS.map((m, idx) => (
								<SelectItem key={m} value={String(idx)} className="text-xs">
									{m}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={String(displayMonth.getFullYear())}
						onValueChange={handleYearSelect}
					>
						<SelectTrigger className="h-8 bg-background/80 border-border text-xs font-semibold">
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent className="max-h-60">
							{years.map((yr) => (
								<SelectItem key={yr} value={String(yr)} className="text-xs">
									{yr}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Day Calendar Grid */}
				<div className="flex justify-center">
					<Calendar
						mode="single"
						month={displayMonth}
						onMonthChange={setDisplayMonth}
						selected={selectedDate}
						onSelect={handleSelect}
						disabled={
							disablePastDates
								? (date) => date < new Date(new Date().setHours(0, 0, 0, 0))
								: undefined
						}
						className="p-2.5 sm:p-3"
						initialFocus
					/>
				</div>

				{/* Quick Footer Actions */}
				<div className="flex items-center justify-between gap-2 border-t border-border/60 bg-muted/10 px-3 py-2">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => handleSelect(new Date())}
						className="h-7 px-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:text-primary"
					>
						Today
					</Button>
					{selectedDate && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleSelect(undefined)}
							className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
						>
							Clear
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

