"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SidebarProvider, useSidebar } from "@/context/sidebar-context";
import { cn } from "@/lib/utils";
import { useGetLoggedInAdmin } from "@/hooks/authManagement";
import { useRouter } from "next/navigation";
import CyndisLoader from "@/components/_atoms/CyndisLoader";

type AuthenticatedLayoutProps = {
	children: React.ReactNode;
};

function LayoutContent({ children }: { children: React.ReactNode }) {
	const { isCollapsed, isMobile } = useSidebar();
	const { data: admin, isLoading, isError } = useGetLoggedInAdmin();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!admin || isError || admin.role !== "admin")) {
			router.replace("/login");
		}
	}, [admin, isLoading, isError, router]);

	if (isLoading) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
				<CyndisLoader />
			</div>
		);
	}

	if (!admin || admin.role !== "admin") return null;

	return (
		<div className="min-h-screen bg-background">
			<Sidebar />
			<div
				className={cn(
					"flex min-h-screen flex-col transition-all duration-300 ease-in-out",
					!isMobile && (isCollapsed ? "pl-[80px]" : "pl-[280px]"),
					isMobile && "pl-0",
				)}
			>
				<Navbar user={admin} />
				<main className="flex-1 overflow-x-hidden p-4 lg:p-6">
					<div className="mx-auto max-w-7xl animate-in fade-in duration-500">
						{children}
					</div>
				</main>
				<Footer />
			</div>
		</div>
	);
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
	return (
		<SidebarProvider>
			<LayoutContent>{children}</LayoutContent>
		</SidebarProvider>
	);
}

