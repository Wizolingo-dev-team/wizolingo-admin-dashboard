"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/orderManagement";
import type { TicketOrderStatus } from "@/types/eventManagement";

interface StandardActionProps {
	onView: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

const BaseActionCell = ({ onView, onEdit, onDelete }: StandardActionProps) => (
	<div className="flex items-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			onClick={(e) => {
				e.stopPropagation();
				onView();
			}}
			className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
		>
			<Icon icon="ph:eye-bold" className="size-5" />
		</Button>
		<Button
			variant="ghost"
			size="icon"
			onClick={(e) => {
				e.stopPropagation();
				onEdit();
			}}
			className="size-8 text-muted-foreground hover:bg-primary/15 hover:text-primary transition-colors"
		>
			<Icon icon="ph:pencil-simple-line-bold" className="size-5" />
		</Button>
		<Button
			variant="ghost"
			size="icon"
			onClick={(e) => {
				e.stopPropagation();
				onDelete();
			}}
			className="size-8 text-muted-foreground hover:bg-destructive/15 hover:text-destructive transition-colors"
		>
			<Icon icon="ph:trash-bold" className="size-5" />
		</Button>
	</div>
);

interface OrderActionProps {
	onView: () => void;
	onUpdateStatus: (status: OrderStatus) => void;
	currentStatus: string;
}

export const OrderActionCell = ({
	onView,
	onUpdateStatus,
	currentStatus,
}: OrderActionProps) => (
	<div className="flex items-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			onClick={(e) => {
				e.stopPropagation();
				onView();
			}}
			className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
		>
			<Icon icon="ph:eye-bold" className="size-5" />
		</Button>

		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground hover:bg-primary/15 hover:text-primary transition-all"
					onClick={(e) => e.stopPropagation()}
				>
					<Icon icon="ph:arrow-clockwise-bold" className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56 rounded-xl border-border bg-card shadow-xl">
				<DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">
					Update Order Status
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{(
					[
						"Processing",
						"Payment Confirmed",
						"On the way",
						"Delivered",
						"Cancelled",
					] as OrderStatus[]
				).map((status) => (
					<DropdownMenuItem
						key={status}
						className="gap-2 cursor-pointer font-medium py-2.5"
						disabled={currentStatus === status}
						onClick={() => onUpdateStatus(status)}
					>
						<Icon
							icon={
								status === "Cancelled"
									? "ph:x-circle-bold"
									: "ph:check-circle-bold"
							}
							className={cn(
								"size-4",
								status === "Cancelled" ? "text-destructive" : "text-primary",
							)}
						/>
						{status}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
);

export const TicketOrderActionCell = ({
	onView,
	onUpdateStatus,
	currentStatus,
}: {
	onView: () => void;
	onUpdateStatus: (status: TicketOrderStatus) => void;
	currentStatus: TicketOrderStatus;
}) => (
	<div className="flex items-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			onClick={(e) => {
				e.stopPropagation();
				onView();
			}}
			className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
		>
			<Icon icon="ph:eye-bold" className="size-5" />
		</Button>

		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground hover:bg-primary/15 hover:text-primary transition-all"
					onClick={(e) => e.stopPropagation()}
				>
					<Icon icon="ph:arrow-clockwise-bold" className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-52 rounded-xl border-border bg-card shadow-xl">
				<DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">
					Update Ticket Status
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{(["Processing", "Confirmed", "Checked In", "Cancelled"] as TicketOrderStatus[]).map(
					(status) => (
						<DropdownMenuItem
							key={status}
							className="gap-2 cursor-pointer font-medium py-2"
							disabled={currentStatus === status}
							onClick={() => onUpdateStatus(status)}
						>
							<Icon
								icon={
									status === "Cancelled"
										? "ph:x-circle-bold"
										: "ph:check-circle-bold"
								}
								className={cn(
									"size-4",
									status === "Cancelled" ? "text-destructive" : "text-primary",
								)}
							/>
							{status}
						</DropdownMenuItem>
					),
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
);

export const UserActionCell = ({
	onView,
	onRoleChange,
	currentRole,
}: {
	onView: () => void;
	onRoleChange: (role: "admin" | "user") => void;
	currentRole: string;
}) => (
	<div className="flex items-center gap-2">
		<Button
			variant="ghost"
			size="icon"
			onClick={onView}
			className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
		>
			<Icon icon="ph:eye-bold" className="size-5" />
		</Button>
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground hover:bg-primary/15 hover:text-primary"
				>
					<Icon icon="ph:shield-check-bold" className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48 rounded-xl border-border bg-card shadow-xl">
				<DropdownMenuItem
					disabled={currentRole === "admin"}
					onClick={() => onRoleChange("admin")}
					className="cursor-pointer"
				>
					Promote to Admin
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={currentRole === "user"}
					onClick={() => onRoleChange("user")}
					className="cursor-pointer"
				>
					Demote to User
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>
);

export const NewsletterTemplateActionCell = ({
	onView,
	onEdit,
	onDelete,
	onSend,
}: StandardActionProps & { onSend: () => void }) => (
	<div className="flex items-center gap-1.5">
		<Button
			variant="ghost"
			size="icon"
			title="Send Campaign / Test"
			onClick={(e) => {
				e.stopPropagation();
				onSend();
			}}
			className="size-8 text-primary hover:bg-primary/15"
		>
			<Icon icon="ph:paper-plane-tilt-bold" className="size-5" />
		</Button>
		<BaseActionCell onView={onView} onEdit={onEdit} onDelete={onDelete} />
	</div>
);

export const CategoryActionCell = (props: StandardActionProps) => <BaseActionCell {...props} />;
export const ProductActionCell = (props: StandardActionProps) => <BaseActionCell {...props} />;
export const DiscountActionCell = (props: StandardActionProps) => <BaseActionCell {...props} />;
export const EventActionCell = (props: StandardActionProps) => <BaseActionCell {...props} />;
export const SubscriberActionCell = (props: StandardActionProps) => <BaseActionCell {...props} />;
export const BlogActionCell = (props: StandardActionProps) => <BaseActionCell {...props} />;

export const BookingActionCell = ({
	onView,
	onDelete,
	onUpdateStatus,
	currentStatus,
}: {
	onView: () => void;
	onDelete: () => void;
	onUpdateStatus: (status: any) => void;
	currentStatus: string;
}) => (
	<div className="flex items-center gap-1.5">
		<Button
			variant="ghost"
			size="icon"
			title="View Details"
			onClick={onView}
			className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
		>
			<Icon icon="ph:eye-bold" className="size-5" />
		</Button>
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					title="Update Status"
					className="size-8 text-muted-foreground hover:bg-primary/15 hover:text-primary"
				>
					<Icon icon="ph:clock-clockwise-bold" className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-44 rounded-xl border-border bg-card shadow-xl">
				<DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Change Status</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-border" />
				{(["pending", "reviewed", "contacted", "confirmed", "rejected", "completed"] as const).map(
					(st) => (
						<DropdownMenuItem
							key={st}
							onClick={() => onUpdateStatus(st)}
							className="cursor-pointer capitalize text-xs flex items-center justify-between"
						>
							<span>{st}</span>
							{currentStatus === st && <Icon icon="ph:check-bold" className="size-3.5 text-primary" />}
						</DropdownMenuItem>
					),
				)}
			</DropdownMenuContent>
		</DropdownMenu>
		<Button
			variant="ghost"
			size="icon"
			title="Delete Booking"
			onClick={onDelete}
			className="size-8 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
		>
			<Icon icon="ph:trash-bold" className="size-5" />
		</Button>
	</div>
);


