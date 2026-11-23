import { ROUTES } from "@/constants/routes";

export const MENU_ITEMS = [
	{
		label: "Dashboard",
		icon: "lucide:layout-dashboard",
		href: ROUTES.DASHBOARD,
	},
	{
		label: "Orders",
		icon: "lucide:shopping-bag",
		href: ROUTES.ORDERS,
	},
	{
		label: "Music & Merch",
		icon: "lucide:disc-3",
		href: ROUTES.PRODUCTS,
	},
	{
		label: "Categories",
		icon: "lucide:layout-grid",
		href: ROUTES.CATEGORY,
	},
	{
		label: "Events & Tickets",
		icon: "lucide:calendar-heart",
		href: ROUTES.EVENTS,
	},
	{
		label: "Bookings",
		icon: "lucide:calendar-check",
		href: ROUTES.BOOKINGS,
	},
	{
		label: "Blogs",
		icon: "lucide:newspaper",
		href: ROUTES.BLOGS,
	},
	{
		label: "Newsletter",
		icon: "lucide:mail-check",
		href: ROUTES.NEWSLETTER,
	},
	{
		label: "Discounts",
		icon: "lucide:ticket-percent",
		href: ROUTES.DISCOUNT,
	},
	{
		label: "Reviews",
		icon: "lucide:star",
		href: ROUTES.REVIEWS,
	},
	{
		label: "Notifications",
		icon: "lucide:bell-ring",
		href: ROUTES.NOTIFICATIONS,
	},
	{
		label: "Users",
		icon: "lucide:users",
		href: ROUTES.USERS,
	},
	{
		label: "Activity Logs",
		icon: "lucide:activity",
		href: ROUTES.ACTIVITY,
	},
];

export const BOTTOM_MENU_ITEMS = [
	{
		label: "Settings",
		icon: "lucide:settings",
		href: ROUTES.SETTINGS,
	},
];

export const LOGOUT_ITEM = {
	label: "Logout",
	icon: "lucide:log-out",
	href: ROUTES.LOGOUT,
};

