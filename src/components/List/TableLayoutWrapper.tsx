"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { DataTable } from "@/components/Tables";
import { SearchBar } from "../_atoms/SearchBar";
import { FilterDropdown } from "../_atoms/FilterDropdown";
import { Pagination } from "../_atoms/Pagination";

interface FilterConfig {
	label: string;
	value?: string;
	options: { label: string; value: string }[];
}

interface Props {
	title: string;
	columns: any[];
	data: any[];
	addLabel?: string;
	filters: FilterConfig[];
	onAddClick?: () => void;
	isLoading?: boolean;
	skeleton?: React.ReactNode;
	searchQuery?: string;
	onSearchChange?: (val: string) => void;
	onFilterChange?: (filterLabel: string, value: string) => void;
	paginationProps?: {
		currentPage: number;
		totalPages: number;
		pageSize: number;
		totalEntries: number;
		onPageChange: (page: number) => void;
		onPageSizeChange: (size: string) => void;
	};
}

export const TableLayoutWrapper = ({
	title,
	columns,
	data,
	addLabel,
	filters,
	onAddClick,
	isLoading,
	skeleton,
	searchQuery,
	onSearchChange,
	onFilterChange,
	paginationProps,
}: Props) => {
	return (
		<div className="space-y-6">
			{filters.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-6 rounded-[20px] border border-border shadow-sm">
					{filters.map((f) => (
						<FilterDropdown
							key={f.label}
							label={f.label}
							value={f.value}
							options={f.options}
							onChange={(val) => onFilterChange?.(f.label, val)}
						/>
					))}
				</div>
			)}

			<div className="flex flex-wrap items-center justify-between gap-4">
				<SearchBar
					value={searchQuery || ""}
					onChange={onSearchChange || (() => {})}
					placeholder={`Search ${title.toLowerCase()}...`}
				/>

				{onAddClick && addLabel && (
					<div className="flex items-center gap-3">
						<Button
							className="h-11 gap-2 bg-primary hover:bg-primary/90 text-white font-bold px-6 shadow-lg shadow-primary/20 transition-all active:scale-95"
							onClick={onAddClick}
						>
							<Icon icon="ph:plus-bold" className="size-5" />
							{addLabel}
						</Button>
					</div>
				)}
			</div>

			<div className="min-h-[380px]">
				{isLoading && skeleton ? (
					skeleton
				) : (
					<DataTable title={title} columns={columns} data={data} />
				)}
			</div>

			{paginationProps && <Pagination {...paginationProps} isLoading={isLoading} />}
		</div>
	);
};

