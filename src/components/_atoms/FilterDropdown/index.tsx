"use client";
import React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FilterOption {
	label: string;
	value: string;
}

interface FilterDropdownProps {
	label: string;
	placeholder?: string;
	options: FilterOption[];
	value?: string;
	onChange?: (value: string) => void;
}

export const FilterDropdown = ({
	label,
	placeholder = "All",
	options,
	value,
	onChange,
}: FilterDropdownProps) => {
	return (
		<div className="space-y-2">
			<label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
				Filter by {label}
			</label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger className="h-11 border-border bg-background/60 text-foreground focus:ring-primary/30">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					{options.map((opt) => (
						<SelectItem key={opt.value} value={opt.value}>
							{opt.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

