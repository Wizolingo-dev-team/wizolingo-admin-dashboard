"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

interface SearchBarProps {
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export const SearchBar = ({
	placeholder = "Search...",
	value,
	onChange,
	className,
}: SearchBarProps) => {
	return (
		<div className={`relative w-full max-w-sm ${className || ""}`}>
			<Icon
				icon="ph:magnifying-glass"
				className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-5"
			/>
			<Input
				value={value}
				onChange={(e) => onChange?.(e.target.value)}
				placeholder={placeholder}
				className="pl-10 h-11 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
			/>
		</div>
	);
};

