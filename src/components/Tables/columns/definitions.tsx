import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import {
	UserActionCell,
	ProductActionCell,
	CategoryActionCell,
	OrderActionCell,
	DiscountActionCell,
	EventActionCell,
	TicketOrderActionCell,
	SubscriberActionCell,
	NewsletterTemplateActionCell,
} from "../cells/ActionCells";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/orderManagement";
import type { TicketOrderStatus } from "@/types/eventManagement";

const SelectionHeader = (
	<Checkbox className="border-muted-foreground/40 data-[state=checked]:bg-primary" />
);

// --- 1. USERS ---
export const userColumnsSchema = (
	onView: (row: any) => void,
	onRoleChange: (id: string, role: "admin" | "user") => void,
) => [
	{
		key: "select",
		header: SelectionHeader,
		render: () => <Checkbox className="border-muted-foreground/40" />,
	},
	{
		key: "user",
		header: "Customer",
		render: (row: any) => (
			<div className="flex items-center gap-3">
				<div className="size-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center overflow-hidden">
					{row.avatar?.url ? (
						<img src={row.avatar.url} className="size-full object-cover" alt="" />
					) : (
						<span className="text-xs font-bold text-primary uppercase">
							{row.firstName?.[0]}
							{row.lastName?.[0]}
						</span>
					)}
				</div>
				<div>
					<div className="font-bold text-foreground capitalize leading-tight">
						{row.firstName} {row.lastName}
					</div>
					<div className="text-muted-foreground text-xs">{row.email}</div>
				</div>
			</div>
		),
	},
	{
		key: "role",
		header: "Access Level",
		render: (row: any) => (
			<Badge
				className={cn(
					"px-3 py-1 rounded-full border-none shadow-none font-bold text-[10px] uppercase tracking-wider",
					row.role === "admin"
						? "bg-primary text-white"
						: "bg-muted text-muted-foreground",
				)}
			>
				{row.role}
			</Badge>
		),
	},
	{
		key: "isVerified",
		header: "Verified",
		render: (row: any) => (
			<Badge
				variant="outline"
				className={cn(
					"text-[10px] font-bold uppercase",
					row.isVerified
						? "border-emerald-500/40 text-emerald-400"
						: "border-amber-500/40 text-amber-400",
				)}
			>
				{row.isVerified ? "Verified" : "Unverified"}
			</Badge>
		),
	},
	{
		key: "orderCount",
		header: "Orders",
		render: (row: any) => (
			<span className="font-bold text-foreground">{row.orderCount || 0}</span>
		),
	},
	{
		key: "wishlistCount",
		header: "Wishlist",
		render: (row: any) => (
			<span className="text-muted-foreground">{row.wishlistCount || 0}</span>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<UserActionCell
				onView={() => onView(row)}
				onRoleChange={(role) => onRoleChange(row._id, role)}
				currentRole={row.role}
			/>
		),
	},
];

// --- 2. PRODUCTS (MERCH & DIGITAL MUSIC) ---
export const productColumnsSchema = (
	onView: (row: any) => void,
	onEdit: (row: any) => void,
	onDelete: (row: any) => void,
) => [
	{
		key: "select",
		header: SelectionHeader,
		render: () => <Checkbox className="border-muted-foreground/40" />,
	},
	{
		key: "productName",
		header: "Product / Release",
		render: (row: any) => (
			<div className="flex items-center gap-3">
				<div className="size-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
					{row.attachments?.[0] ? (
						<img src={row.attachments[0]} alt="" className="object-cover size-full" />
					) : (
						<Icon
							icon={
								row.productType === "digital_music"
									? "ph:music-notes-bold"
									: "ph:package-bold"
							}
							className="size-6 text-primary"
						/>
					)}
				</div>
				<div>
					<div className="font-bold text-foreground">{row.productName}</div>
					<div className="text-xs text-muted-foreground">
						{row.productType === "digital_music"
							? `${row.artist || "Wiz Ofuasia"} • ${(row.digitalReleaseType || "single").toUpperCase()}`
							: `${row.quantity} in stock`}
					</div>
				</div>
			</div>
		),
	},
	{
		key: "productType",
		header: "Type",
		render: (row: any) => (
			<Badge
				className={cn(
					"text-[10px] font-bold uppercase",
					row.productType === "digital_music"
						? "bg-primary/20 text-primary border border-primary/30"
						: "bg-secondary text-secondary-foreground",
				)}
			>
				{row.productType === "digital_music" ? "Digital Music" : "Artist Merch"}
			</Badge>
		),
	},
	{
		key: "price",
		header: "Price (USD)",
		render: (row: any) => (
			<span className="font-bold text-foreground">${Number(row.price || 0).toFixed(2)}</span>
		),
	},
	{
		key: "sold",
		header: "Sales / Downloads",
		render: (row: any) => (
			<div className="text-xs">
				<span className="font-bold text-foreground">{row.sold || 0} sold</span>
				{row.productType === "digital_music" && (
					<span className="text-muted-foreground block">
						{row.downloadCount || 0} downloads
					</span>
				)}
			</div>
		),
	},
	{
		key: "isActive",
		header: "Status",
		render: (row: any) => (
			<Badge
				variant="outline"
				className={cn(
					"text-[10px] font-bold uppercase",
					row.isActive
						? "border-emerald-500/40 text-emerald-400"
						: "border-muted-foreground/40 text-muted-foreground",
				)}
			>
				{row.isActive ? "Active" : "Hidden"}
			</Badge>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<ProductActionCell
				onView={() => onView(row)}
				onEdit={() => onEdit(row)}
				onDelete={() => onDelete(row)}
			/>
		),
	},
];

// --- 3. CATEGORIES ---
export const categoryColumnsSchema = (
	onView: (cat: any) => void,
	onEdit: (cat: any) => void,
	onDelete: (cat: any) => void,
) => [
	{
		key: "select",
		header: SelectionHeader,
		render: () => <Checkbox className="border-muted-foreground/40" />,
	},
	{
		key: "categoryName",
		header: "Category Name",
		render: (row: any) => (
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
					<Icon icon="ph:folder-open-bold" className="size-5" />
				</div>
				<span className="font-bold text-foreground">{row.categoryName}</span>
			</div>
		),
	},
	{
		key: "categoryType",
		header: "Type",
		render: (row: any) => (
			<Badge variant="secondary" className="uppercase text-[10px] font-bold">
				{row.categoryType || "general"}
			</Badge>
		),
	},
	{
		key: "subcategories",
		header: "Sub-Categories",
		render: (row: any) => (
			<span className="text-xs font-semibold text-muted-foreground">
				{row.subcategories?.length || 0} sub-categories
			</span>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<CategoryActionCell
				onView={() => onView(row)}
				onEdit={() => onEdit(row)}
				onDelete={() => onDelete(row)}
			/>
		),
	},
];

// --- 4. DISCOUNTS ---
export const discountColumnsSchema = (
	onView: (row: any) => void,
	onEdit: (row: any) => void,
	onDelete: (row: any) => void,
) => [
	{
		key: "select",
		header: SelectionHeader,
		render: () => <Checkbox className="border-muted-foreground/40" />,
	},
	{
		key: "discountCode",
		header: "Coupon Code",
		render: (row: any) => (
			<code className="bg-primary text-white px-3 py-1.5 rounded-lg font-bold tracking-wider">
				{row.discountCode}
			</code>
		),
	},
	{
		key: "discountPercentage",
		header: "Discount %",
		render: (row: any) => (
			<span className="font-black text-foreground">{row.discountPercentage}% OFF</span>
		),
	},
	{
		key: "expiryDate",
		header: "Expires",
		render: (row: any) => {
			const expired = new Date(row.expiryDate) < new Date();
			return (
				<span
					className={cn(
						"text-xs font-semibold",
						expired ? "text-destructive" : "text-emerald-400",
					)}
				>
					{new Date(row.expiryDate).toLocaleDateString()}{" "}
					{expired ? "(Expired)" : ""}
				</span>
			);
		},
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<DiscountActionCell
				onView={() => onView(row)}
				onEdit={() => onEdit(row)}
				onDelete={() => onDelete(row)}
			/>
		),
	},
];

// --- 5. ORDERS ---
export const orderColumnsSchema = (
	onView: (row: any) => void,
	onUpdateStatus: (id: string, status: OrderStatus) => void,
) => [
	{
		key: "select",
		header: SelectionHeader,
		render: () => <Checkbox className="border-muted-foreground/40" />,
	},
	{
		key: "_id",
		header: "Order ID",
		render: (row: any) => (
			<span className="font-bold text-foreground">#{row._id?.slice(-6).toUpperCase()}</span>
		),
	},
	{
		key: "user",
		header: "Customer",
		render: (row: any) => (
			<div>
				<div className="font-semibold text-foreground">
					{typeof row.user === "object" && row.user
						? `${row.user.firstName} ${row.user.lastName}`
						: row.email}
				</div>
				<div className="text-xs text-muted-foreground">{row.email}</div>
			</div>
		),
	},
	{
		key: "orderType",
		header: "Type",
		render: (row: any) => (
			<Badge variant="outline" className="uppercase text-[10px] font-bold">
				{row.orderType || "merch"}
			</Badge>
		),
	},
	{
		key: "createdAt",
		header: "Date",
		render: (row: any) => (
			<span className="text-muted-foreground text-xs">
				{new Date(row.createdAt).toLocaleDateString()}
			</span>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row: any) => (
			<Badge
				className={cn(
					"px-3 py-1 rounded-full border-none shadow-none font-bold text-[10px] uppercase tracking-wider",
					row.status === "Delivered" || row.status === "Payment Confirmed"
						? "bg-emerald-600 text-white"
						: row.status === "Cancelled"
							? "bg-destructive text-white"
							: "bg-primary text-white",
				)}
			>
				{row.status}
			</Badge>
		),
	},
	{
		key: "amount",
		header: "Total",
		render: (row: any) => (
			<span className="font-black text-foreground">
				${Number(row.amount || 0).toFixed(2)}
			</span>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<OrderActionCell
				onView={() => onView(row)}
				onUpdateStatus={(status) => onUpdateStatus(row._id, status)}
				currentStatus={row.status}
			/>
		),
	},
];

// --- 6. EVENTS ---
export const eventColumnsSchema = (
	onView: (row: any) => void,
	onEdit: (row: any) => void,
	onDelete: (row: any) => void,
) => [
	{
		key: "title",
		header: "Event / Tour",
		render: (row: any) => (
			<div className="flex items-center gap-3">
				<div className="size-12 rounded-lg bg-muted overflow-hidden border border-border flex items-center justify-center">
					{row.flyerUrl ? (
						<img src={row.flyerUrl} alt="" className="size-full object-cover" />
					) : (
						<Icon icon="ph:calendar-star-bold" className="size-6 text-primary" />
					)}
				</div>
				<div>
					<div className="font-bold text-foreground">{row.title}</div>
					<div className="text-xs text-muted-foreground">
						{row.venue} • {row.location}
					</div>
				</div>
			</div>
		),
	},
	{
		key: "startDate",
		header: "Date",
		render: (row: any) => (
			<div className="text-xs">
				<div className="font-bold text-foreground">
					{row.dateLabel || new Date(row.startDate).toLocaleDateString()}
				</div>
				{row.time && <div className="text-muted-foreground">{row.time}</div>}
			</div>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row: any) => (
			<Badge
				className={cn(
					"text-[10px] font-bold uppercase",
					row.status === "ON SALE" || row.status === "UPCOMING"
						? "bg-primary text-white"
						: row.status === "SOLD OUT"
							? "bg-amber-600 text-white"
							: "bg-muted text-muted-foreground",
				)}
			>
				{row.status}
			</Badge>
		),
	},
	{
		key: "ticketTiers",
		header: "Tiers / Sold",
		render: (row: any) => {
			const tiers = row.ticketTiers || [];
			const totalSold = tiers.reduce((s: number, t: any) => s + (t.soldQuantity || 0), 0);
			const totalCap = tiers.reduce((s: number, t: any) => s + (t.totalQuantity || 0), 0);
			return (
				<span className="text-xs font-bold text-foreground">
					{totalSold} / {totalCap} tickets ({tiers.length} tiers)
				</span>
			);
		},
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<EventActionCell
				onView={() => onView(row)}
				onEdit={() => onEdit(row)}
				onDelete={() => onDelete(row)}
			/>
		),
	},
];

// --- 7. TICKET ORDERS ---
export const ticketOrderColumnsSchema = (
	onView: (row: any) => void,
	onUpdateStatus: (orderId: string, status: TicketOrderStatus) => void,
) => [
	{
		key: "ticketCode",
		header: "Ticket Code",
		render: (row: any) => (
			<code className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded font-bold text-xs">
				{row.ticketCode}
			</code>
		),
	},
	{
		key: "attendeeName",
		header: "Attendee",
		render: (row: any) => (
			<div>
				<div className="font-bold text-foreground">{row.attendeeName}</div>
				<div className="text-xs text-muted-foreground">{row.email}</div>
			</div>
		),
	},
	{
		key: "event",
		header: "Event",
		render: (row: any) => (
			<span className="font-semibold text-foreground">
				{typeof row.event === "object" && row.event ? row.event.title : "Event"}
			</span>
		),
	},
	{
		key: "totalAmount",
		header: "Total",
		render: (row: any) => (
			<span className="font-black text-foreground">
				${Number(row.totalAmount || 0).toFixed(2)}
			</span>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row: any) => (
			<Badge
				className={cn(
					"text-[10px] font-bold uppercase",
					row.status === "Confirmed" || row.status === "Checked In"
						? "bg-emerald-600 text-white"
						: row.status === "Cancelled"
							? "bg-destructive text-white"
							: "bg-primary text-white",
				)}
			>
				{row.status}
			</Badge>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<TicketOrderActionCell
				onView={() => onView(row)}
				onUpdateStatus={(status) => onUpdateStatus(row._id, status)}
				currentStatus={row.status}
			/>
		),
	},
];

// --- 8. NEWSLETTER SUBSCRIBERS ---
export const subscriberColumnsSchema = (
	onView: (row: any) => void,
	onEdit: (row: any) => void,
	onDelete: (row: any) => void,
) => [
	{
		key: "email",
		header: "Subscriber",
		render: (row: any) => (
			<div>
				<div className="font-bold text-foreground">{row.email}</div>
				{row.name && <div className="text-xs text-muted-foreground">{row.name}</div>}
			</div>
		),
	},
	{
		key: "source",
		header: "Source",
		render: (row: any) => (
			<Badge variant="secondary" className="uppercase text-[10px] font-bold">
				{row.source || "popup"}
			</Badge>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row: any) => (
			<Badge
				className={cn(
					"text-[10px] font-bold uppercase",
					row.status === "subscribed"
						? "bg-emerald-600 text-white"
						: "bg-muted text-muted-foreground",
				)}
			>
				{row.status}
			</Badge>
		),
	},
	{
		key: "subscribedAt",
		header: "Subscribed On",
		render: (row: any) => (
			<span className="text-xs text-muted-foreground">
				{new Date(row.subscribedAt || row.createdAt).toLocaleDateString()}
			</span>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<SubscriberActionCell
				onView={() => onView(row)}
				onEdit={() => onEdit(row)}
				onDelete={() => onDelete(row)}
			/>
		),
	},
];

// --- 9. NEWSLETTER TEMPLATES ---
export const newsletterTemplateColumnsSchema = (
	onView: (row: any) => void,
	onEdit: (row: any) => void,
	onDelete: (row: any) => void,
	onSend: (row: any) => void,
) => [
	{
		key: "name",
		header: "Campaign Template",
		render: (row: any) => (
			<div>
				<div className="font-bold text-foreground">{row.name}</div>
				<div className="text-xs text-muted-foreground">{row.subject}</div>
			</div>
		),
	},
	{
		key: "category",
		header: "Category",
		render: (row: any) => (
			<Badge variant="outline" className="uppercase text-[10px] font-bold">
				{row.category || "general"}
			</Badge>
		),
	},
	{
		key: "status",
		header: "Status",
		render: (row: any) => (
			<Badge
				className={cn(
					"text-[10px] font-bold uppercase",
					row.status === "sent"
						? "bg-emerald-600 text-white"
						: "bg-primary/20 text-primary border border-primary/30",
				)}
			>
				{row.status}
			</Badge>
		),
	},
	{
		key: "sentCount",
		header: "Total Sent",
		render: (row: any) => (
			<span className="font-bold text-foreground">{row.sentCount || 0} emails</span>
		),
	},
	{
		key: "actions",
		header: "Actions",
		render: (row: any) => (
			<NewsletterTemplateActionCell
				onView={() => onView(row)}
				onEdit={() => onEdit(row)}
				onDelete={() => onDelete(row)}
				onSend={() => onSend(row)}
			/>
		),
	},
];

