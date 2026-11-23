"use client";

import React from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	isLoading?: boolean;
	submitLabel?: string;
	onSubmit?: () => void;
	formId?: string;
	onDelete?: () => void;
	maxWidthClass?: string;
}

export default function ActionModal({
	open,
	onOpenChange,
	title,
	description,
	children,
	isLoading = false,
	submitLabel = "Save Changes",
	onSubmit,
	formId,
	onDelete,
	maxWidthClass = "sm:max-w-xl",
}: ActionModalProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className={cn(
					"flex h-full w-full flex-col border-l border-border bg-background p-0",
					maxWidthClass,
				)}
			>
				<SheetHeader className="px-6 py-6 border-b border-border bg-card/80 backdrop-blur-sm">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
							<Icon icon="ph:pencil-simple-slash-bold" className="h-5 w-5" />
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
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

				<SheetFooter className="flex-row items-center justify-between gap-3 border-t border-border bg-card/60 px-6 py-4 sm:justify-between">
					<div>
						{onDelete && (
							<Button
								variant="ghost"
								type="button"
								onClick={onDelete}
								disabled={isLoading}
								className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2"
							>
								<Icon icon="ph:trash-bold" className="h-4 w-4" />
								<span className="hidden sm:inline">Delete</span>
							</Button>
						)}
					</div>

					<div className="flex items-center gap-3">
						<SheetClose asChild>
							<Button
								variant="outline"
								type="button"
								disabled={isLoading}
								className="border-border bg-transparent hover:bg-muted text-foreground"
							>
								Cancel
							</Button>
						</SheetClose>

						<Button
							type={formId ? "submit" : "button"}
							form={formId}
							onClick={!formId ? onSubmit : undefined}
							disabled={isLoading}
							className={cn(
								"min-w-[140px] bg-primary font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25",
							)}
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving...
								</>
							) : (
								submitLabel
							)}
						</Button>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

