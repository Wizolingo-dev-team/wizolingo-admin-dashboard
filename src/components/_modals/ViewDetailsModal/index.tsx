"use client";

import React from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

interface ViewDetailsModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	onEditClick?: () => void;
}

export default function ViewDetailsModal({
	open,
	onOpenChange,
	title,
	description,
	children,
	onEditClick,
}: ViewDetailsModalProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="flex h-full w-full flex-col border-l border-border bg-background p-0 sm:max-w-xl"
			>
				<SheetHeader className="px-6 py-6 border-b border-border bg-card/80">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
								<Icon icon="ph:eye-bold" className="h-5 w-5" />
							</div>
							<div className="space-y-1 text-left">
								<SheetTitle className="font-display text-xl font-bold text-foreground">
									{title}
								</SheetTitle>
								{description && (
									<SheetDescription className="text-sm text-muted-foreground">
										{description}
									</SheetDescription>
								)}
							</div>
						</div>
						{onEditClick && (
							<Button
								variant="outline"
								size="sm"
								onClick={onEditClick}
								className="gap-2 border-primary/40 text-primary hover:bg-primary/15"
							>
								<Icon icon="ph:pencil-simple-bold" />
								Edit
							</Button>
						)}
					</div>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

				<div className="border-t border-border p-6 bg-card/60">
					<Button
						variant="secondary"
						className="w-full font-bold"
						onClick={() => onOpenChange(false)}
					>
						Close Details
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

