"use client";

import { useSidebar } from "@/context/sidebar-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import BreadCrumbs from "@/components/_atoms/BreadCrumbs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminUser } from "@/types/authManagement";
import { getGreeting } from "@/utils/getGreeting";
import { clearAuth } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
	useGetNotifications,
	useMarkAllNotificationsRead,
	useMarkOneNotificationRead,
	useDeleteNotification,
} from "@/hooks/notificationManagement";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { io } from "socket.io-client";
import env from "@src/env";

interface NavbarProps {
	user?: AdminUser;
}

export default function Navbar({ user }: NavbarProps) {
	const { toggleSidebar, isCollapsed } = useSidebar();
	const router = useRouter();
	const queryClient = useQueryClient();

	const { data: notifications = [] } = useGetNotifications();
	const { mutate: markAllRead } = useMarkAllNotificationsRead();
	const { mutate: markOneRead } = useMarkOneNotificationRead();
	const { mutate: deleteNotification } = useDeleteNotification();

	// Real-time Socket.io Notification Subscription
	useEffect(() => {
		if (!user?._id) return;

		const socketBaseUrl = env.NEXT_PUBLIC_ADMIN_API_BASE_URL.replace(/\/api\/?$/, "");
		const socket = io(socketBaseUrl, {
			transports: ["websocket", "polling"],
		});

		socket.on("connect", () => {
			socket.emit("join", user._id);
		});

		socket.on("new-notification", (notif: { title?: string; description?: string }) => {
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
			queryClient.invalidateQueries({ queryKey: ["adminAllNotifications"] });
			if (notif?.title) {
				toast.info(notif.title, {
					description: notif.description,
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, [user?._id, queryClient]);

	const unreadCount = useMemo(
		() => notifications.filter((n) => !n.read).length,
		[notifications],
	);

	const { text: greetingText, Icon: GreetingIcon } = useMemo(() => getGreeting(), []);

	const initials =
		user?.firstName && user?.lastName
			? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
			: "WZ";

	const displayName = user?.firstName
		? `${user.firstName} ${user.lastName}`
		: "Wizolingo Admin";

	const displayEmail = user?.email || "info@wizofuasia.com";

	const handleLogout = () => {
		clearAuth();
		queryClient.removeQueries({ queryKey: ["loggedInAdmin"] });
		toast.success("Logged out successfully");
		router.push("/login");
	};

	return (
		<header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-[#141414]/95 backdrop-blur supports-[backdrop-filter]:bg-[#141414]/80 px-6">
			{/* LEFT SECTION: Sidebar Toggle & Breadcrumbs */}
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
					className="h-9 w-9 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground hidden lg:flex"
				>
					<Icon
						icon={isCollapsed ? "lucide:panel-left-open" : "lucide:panel-left-close"}
						className="h-5 w-5"
					/>
					<span className="sr-only">Toggle Sidebar</span>
				</Button>

				<Button
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
					className="lg:hidden h-9 w-9 text-muted-foreground"
				>
					<Icon icon="lucide:menu" className="h-5 w-5" />
				</Button>

				<div className="hidden lg:block h-6 w-[1px] bg-border/60 mx-1" />

				<div className="hidden md:block">
					<BreadCrumbs />
				</div>
			</div>

			{/* CENTER SECTION: Greeting */}
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:flex items-center gap-2 text-sm text-muted-foreground select-none">
				<GreetingIcon className="h-4 w-4 text-primary" />
				<span>
					{greetingText},{" "}
					<span className="font-semibold text-foreground">{displayName}</span>
				</span>
			</div>

			{/* RIGHT SECTION: Notifications, Email & Avatar */}
			<div className="flex items-center gap-3 sm:gap-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
						>
							<Icon icon="lucide:bell" className="h-5 w-5" />
							{unreadCount > 0 && (
								<span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white border-2 border-background animate-in zoom-in duration-300">
									{unreadCount > 9 ? "9+" : unreadCount}
								</span>
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-80 rounded-xl border-border bg-card p-0 shadow-2xl overflow-hidden"
						forceMount
					>
						<div className="flex items-center justify-between px-4 py-3 bg-muted/40">
							<DropdownMenuLabel className="p-0 font-bold text-sm">
								Notifications
							</DropdownMenuLabel>
							{unreadCount > 0 && (
								<button
									type="button"
									onClick={() => markAllRead()}
									className="text-[10px] font-bold text-primary uppercase tracking-wider hover:underline"
								>
									Mark all as read
								</button>
							)}
						</div>
						<DropdownMenuSeparator className="m-0" />
						<ScrollArea className="h-80">
							{notifications.length > 0 ? (
								<div className="flex flex-col">
									{notifications.map((n) => (
										<div
											key={n._id}
											className={cn(
												"relative flex flex-col gap-1 p-4 border-b border-border/50 transition-colors hover:bg-muted/30",
												!n.read && "bg-primary/10",
											)}
										>
											<div className="flex items-start justify-between gap-2">
												<Link
													href={n.onClick || "/dashboard"}
													onClick={() => !n.read && markOneRead(n._id)}
													className="flex-1 space-y-1"
												>
													<p
														className={cn(
															"text-xs leading-none",
															!n.read
																? "font-bold text-foreground"
																: "font-medium text-muted-foreground",
														)}
													>
														{n.title}
													</p>
													<p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
														{n.description}
													</p>
													<p className="text-[9px] text-muted-foreground/60 font-medium">
														{new Date(n.createdAt).toLocaleDateString()}{" "}
														at{" "}
														{new Date(n.createdAt).toLocaleTimeString(
															[],
															{ hour: "2-digit", minute: "2-digit" },
														)}
													</p>
												</Link>
												<div className="flex flex-col gap-1">
													{!n.read && (
														<Button
															variant="ghost"
															size="icon"
															className="h-6 w-6 text-primary hover:text-primary hover:bg-primary/15 rounded-full"
															onClick={() => markOneRead(n._id)}
														>
															<Icon
																icon="lucide:check-circle"
																className="h-3.5 w-3.5"
															/>
														</Button>
													)}
													<Button
														variant="ghost"
														size="icon"
														className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/15 rounded-full"
														onClick={() => deleteNotification(n._id)}
													>
														<Icon
															icon="lucide:trash-2"
															className="h-3.5 w-3.5"
														/>
													</Button>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center h-full py-12 text-center">
									<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
										<Icon
											icon="lucide:bell-off"
											className="h-6 w-6 text-muted-foreground/50"
										/>
									</div>
									<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
										No notifications
									</p>
								</div>
							)}
						</ScrollArea>
					</DropdownMenuContent>
				</DropdownMenu>

				<span className="hidden lg:block text-sm font-medium text-muted-foreground">
					{displayEmail}
				</span>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="relative h-10 w-10 rounded-lg p-0 hover:bg-transparent focus-visible:ring-0"
						>
							<Avatar
								key={user?.avatar?.public_id}
								className="h-10 w-10 rounded-lg border border-border bg-secondary transition-all hover:ring-2 hover:ring-primary/40"
							>
								<AvatarImage
									src={user?.avatar?.url}
									alt={displayName}
									className="object-cover"
								/>
								<AvatarFallback className="rounded-lg bg-primary text-white font-bold">
									{initials}
								</AvatarFallback>
							</Avatar>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-56 border-border bg-card text-card-foreground shadow-xl"
						align="end"
						forceMount
					>
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-bold leading-none text-foreground">
									{displayName}
								</p>
								<p className="text-xs leading-none text-muted-foreground">
									{displayEmail}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem
							onClick={() => router.push("/settings")}
							className="cursor-pointer"
						>
							<Icon icon="lucide:settings" className="mr-2 h-4 w-4" />
							Account Settings
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem
							onClick={handleLogout}
							className="text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer"
						>
							<Icon icon="lucide:log-out" className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}

