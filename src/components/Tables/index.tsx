"use client";

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	title?: string;
	actionSlot?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	title,
	actionSlot,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="border-border w-full rounded-[20px] border bg-card p-6 shadow-sm">
			{(title || actionSlot) && (
				<div className="mb-6 flex items-center justify-between">
					{title && (
						<h2 className="font-display text-foreground text-xl font-bold">{title}</h2>
					)}
					{actionSlot && <div>{actionSlot}</div>}
				</div>
			)}
			<div
				tabIndex={0}
				role="region"
				aria-label={title ? `${title} data table` : "Admin data table"}
				className="overflow-x-auto max-w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-xl"
			>
				<Table>
					<TableHeader className="sticky top-0 z-10 bg-card">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-border border-b hover:bg-transparent"
							>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="text-muted-foreground h-12 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-border/50 hover:bg-muted/30 h-16 border-b transition-colors"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="text-foreground py-4 text-sm font-medium whitespace-nowrap"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-muted-foreground"
								>
									No entries found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

