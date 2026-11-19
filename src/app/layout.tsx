import type { Metadata, Viewport } from "next";
import "../styles/fonts.css";
import "../styles/globals.css";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@src/providers/ReactQueryProvider";
import { Toaster } from "@src/components/ui/sonner";
import { type ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		default: "Wiz Ofuasia (Wizboyy) — Wizolingo Admin Dashboard",
		template: "%s | Wizolingo Admin",
	},
	description:
		"Official Admin Console for Wiz Ofuasia (Wizboyy) — Digital Music Downloads, Artist Merch Store, Live Events & Ticketing, Newsletter Campaigns, and Fan Management.",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#D70E1D",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="dark font-sans antialiased">
			<body className={cn("min-h-screen bg-background text-foreground font-sans antialiased")}>
				<ReactQueryProvider>
					{children}
					<Toaster richColors position="bottom-left" />
				</ReactQueryProvider>
			</body>
		</html>
	);
}

