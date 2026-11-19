"use client";

import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";

interface DeleteModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	description?: string;
	onConfirm: () => void;
	isLoading?: boolean;
}

export default function DeleteModal({
	open,
	onOpenChange,
	title = "Are you absolutely sure?",
	description = "This action cannot be undone. This will permanently delete this item from your database.",
	onConfirm,
	isLoading = false,
}: DeleteModalProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-[450px] gap-6 border-border bg-card p-6 shadow-2xl">
				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15">
					<Icon icon="ph:warning-octagon-bold" className="h-7 w-7 text-destructive" />
				</div>

				<AlertDialogHeader className="text-center">
					<AlertDialogTitle className="font-display text-xl font-bold text-foreground">
						{title}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-center text-muted-foreground">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter className="sm:justify-center gap-3">
					<AlertDialogCancel asChild>
						<Button
							variant="outline"
							disabled={isLoading}
							className="mt-0 w-full border-border bg-transparent hover:bg-muted text-foreground"
						>
							Cancel
						</Button>
					</AlertDialogCancel>

					<AlertDialogAction asChild>
						<Button
							variant="destructive"
							onClick={(e) => {
								e.preventDefault();
								onConfirm();
							}}
							disabled={isLoading}
							className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md"
						>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Yes, Delete it"
							)}
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

