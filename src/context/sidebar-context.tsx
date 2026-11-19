"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
	isCollapsed: boolean;
	toggleSidebar: () => void;
	isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024);
			if (window.innerWidth < 1024) {
				setIsCollapsed(true);
			} else {
				setIsCollapsed(false);
			}
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const toggleSidebar = () => {
		setIsCollapsed((prev) => !prev);
	};

	return (
		<SidebarContext.Provider value={{ isCollapsed, toggleSidebar, isMobile }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
}

