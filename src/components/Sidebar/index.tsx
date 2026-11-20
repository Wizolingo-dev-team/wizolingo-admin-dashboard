"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/sidebar-context";
import { MENU_ITEMS, BOTTOM_MENU_ITEMS, LOGOUT_ITEM } from "@/constants/SidebarMenuItems";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { clearAuth } from "@/utils/auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface SidebarItemProps {
	item: { label: string; icon: string; href: string };
	isCollapsed: boolean;
	isActive: boolean;
	isLogout?: boolean;
	onClick?: () => void;
}

const SidebarItem = ({ item, isCollapsed, isActive, isLogout, onClick }: SidebarItemProps) => {
	const itemStyles = cn(
		"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 group",
		"aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground aria-[current=page]:shadow-lg aria-[current=page]:shadow-primary/20",
		!isActive && "text-muted-foreground hover:bg-muted hover:text-foreground",
		isCollapsed && "justify-center px-2",
		isLogout && !isActive && "hover:bg-destructive/15 hover:text-destructive",
	);

	const iconClasses = cn(
		"h-5 w-5 shrink-0 transition-colors",
		isActive
			? "text-white"
			: isLogout
				? "group-hover:text-destructive"
				: "group-hover:text-primary",
	);

	const renderContent = () => (
		<>
			<Icon icon={item.icon} className={iconClasses} aria-hidden="true" />
			{!isCollapsed && <span className="truncate">{item.label}</span>}
		</>
	);

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					{onClick ? (
						<button type="button" onClick={onClick} className={itemStyles}>
							{renderContent()}
						</button>
					) : (
						<Link
							href={item.href}
							aria-current={isActive ? "page" : undefined}
							className={itemStyles}
						>
							{renderContent()}
						</Link>
					)}
				</TooltipTrigger>
				{isCollapsed && (
					<TooltipContent
						side="right"
						className="flex items-center gap-4 bg-card border-border text-foreground font-semibold"
					>
						{item.label}
					</TooltipContent>
				)}
			</Tooltip>
		</TooltipProvider>
	);
};

export default function Sidebar({ className }: { className?: string }) {
	const { isCollapsed, isMobile, toggleSidebar } = useSidebar();
	const pathname = usePathname();
	const router = useRouter();
	const queryClient = useQueryClient();

	const handleLogout = () => {
		clearAuth();
		queryClient.removeQueries({ queryKey: ["loggedInAdmin"] });
		toast.success("Logged out successfully");
		router.push("/login");
	};

	const SidebarContent = () => (
		<div className="flex h-full flex-col bg-[#141414] border-r border-border">
			<div
				className={cn(
					"flex h-20 items-center justify-center border-b border-border/60 transition-all duration-300",
					isCollapsed ? "px-2" : "px-5",
				)}
			>
				<Link href="/dashboard" className="flex items-center justify-center">
					{isCollapsed ? (
						<span className="font-display text-base font-extrabold tracking-tight text-white leading-none">
							WIZ
						</span>
					) : (
						<div className="flex flex-col">
							<span className="font-display text-base font-extrabold tracking-tight text-white leading-none">
								WIZ OFUASIA
							</span>
							<span className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mt-1">
								Admin Console
							</span>
						</div>
					)}
				</Link>
			</div>

			<ScrollArea className="flex-1 py-5 px-3">
				<nav aria-label="Primary Admin Navigation" className="space-y-1">
					{MENU_ITEMS.map((item) => (
						<SidebarItem
							key={item.href}
							item={item}
							isCollapsed={isCollapsed}
							isActive={pathname.startsWith(item.href)}
						/>
					))}
				</nav>
			</ScrollArea>

			<div className="mt-auto border-t border-border/60 p-3 space-y-1">
				{BOTTOM_MENU_ITEMS.map((item) => (
					<SidebarItem
						key={item.href}
						item={item}
						isCollapsed={isCollapsed}
						isActive={pathname.startsWith(item.href)}
					/>
				))}

				<div className="my-2 border-t border-border/40" />

				<SidebarItem
					item={LOGOUT_ITEM}
					isCollapsed={isCollapsed}
					isActive={false}
					isLogout
					onClick={handleLogout}
				/>
			</div>
		</div>
	);

	if (isMobile) {
		return (
			<Sheet open={!isCollapsed} onOpenChange={toggleSidebar}>
				<SheetContent side="left" className="p-0 w-[280px] border-r-border bg-[#141414]">
					<SidebarContent />
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<aside
			className={cn(
				"fixed left-0 top-0 z-30 h-screen bg-[#141414] transition-all duration-300 ease-in-out",
				isCollapsed ? "w-[80px]" : "w-[280px]",
				className,
			)}
		>
			<SidebarContent />
		</aside>
	);
}

