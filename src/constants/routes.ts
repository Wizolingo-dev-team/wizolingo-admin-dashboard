export const ROUTES = {
	DASHBOARD: "/dashboard",
	ORDERS: "/orders",
	USER_DETAILS: (id: string) => `/user-management/${id}`,
	PRODUCTS: "/product-management",
	CATEGORY: "/category-management",
	DISCOUNT: "/discount-management",
	EVENTS: "/events-management",
	NEWSLETTER: "/newsletter-management",
	NOTIFICATIONS: "/notifications-management",
	REVIEWS: "/reviews-management",
	USERS: "/user-management",
	ACTIVITY: "/activity-logs",
	SETTINGS: "/settings",
	HELP: "#",
	LOGOUT: "/",
} as const;

export const getRoute = (path: string, params?: Record<string, string>) => {
	if (!params) return path;
	const queryString = new URLSearchParams(params).toString();
	return `${path}?${queryString}`;
};

