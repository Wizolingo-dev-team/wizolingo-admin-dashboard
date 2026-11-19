/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

/**
 * Next.js redirect configuration
 * Maps backend notification & email deep links (e.g. /admin/orders, /admin/events, /admin/newsletter)
 * directly to the Admin Dashboard routes.
 */
const redirects = [
	{
		source: "/admin/orders",
		destination: "/orders",
		permanent: false,
	},
	{
		source: "/admin/events",
		destination: "/events-management",
		permanent: false,
	},
	{
		source: "/events",
		destination: "/events-management",
		permanent: false,
	},
	{
		source: "/admin/newsletter",
		destination: "/newsletter-management",
		permanent: false,
	},
	{
		source: "/newsletter",
		destination: "/newsletter-management",
		permanent: false,
	},
];

export default redirects;

