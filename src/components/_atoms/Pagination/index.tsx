"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalEntries: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: string) => void;
	isLoading?: boolean;
}

export const Pagination = ({
	currentPage,
	totalPages,
	pageSize,
	totalEntries,
	onPageChange,
	onPageSizeChange,
	isLoading,
}: PaginationProps) => {
	const startRange = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const endRange = Math.min(currentPage * pageSize, totalEntries);

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
			<div className="flex items-center gap-4">
				<p className="text-sm text-muted-foreground">
					{isLoading
						? "Loading entries..."
						: `Showing ${startRange} to ${endRange} of ${totalEntries} entries`}
				</p>
				<Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
					<SelectTrigger className="w-20 h-9 bg-card border-border text-foreground">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="25">25</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					className="gap-1 hover:bg-primary/15 hover:text-primary"
					disabled={currentPage === 1 || isLoading}
					onClick={() => onPageChange(currentPage - 1)}
				>
					<Icon icon="ph:caret-left" /> Previous
				</Button>

				{[...Array(Math.max(1, totalPages))].map((_, i) => {
					const pageNum = i + 1;
					if (
						totalPages > 5 &&
						Math.abs(pageNum - currentPage) > 1 &&
						pageNum !== 1 &&
						pageNum !== totalPages
					) {
						return pageNum === 2 || pageNum === totalPages - 1 ? (
							<span key={pageNum} className="px-1 text-muted-foreground">
								...
							</span>
						) : null;
					}

					return (
						<Button
							key={pageNum}
							variant={currentPage === pageNum ? "default" : "ghost"}
							size="sm"
							onClick={() => onPageChange(pageNum)}
							className={
								currentPage === pageNum
									? "size-9 p-0 bg-primary text-white hover:bg-primary/90"
									: "size-9 p-0"
							}
						>
							{pageNum}
						</Button>
					);
				})}

				<Button
					variant="ghost"
					size="sm"
					className="gap-1 hover:bg-primary/15 hover:text-primary"
					disabled={currentPage === totalPages || totalPages === 0 || isLoading}
					onClick={() => onPageChange(currentPage + 1)}
				>
					Next <Icon icon="ph:caret-right" />
				</Button>
			</div>
		</div>
	);
};

