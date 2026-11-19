"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

export default function BreadCrumbs() {
	const pathname = usePathname();
	const pathSegments = pathname.split("/").filter((segment) => segment !== "");

	const formatSegment = (segment: string) => {
		return segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
	};

	const breadcrumbs = [
		{ label: "Dashboard", href: "/dashboard" },
		...pathSegments
			.filter((s) => s !== "dashboard")
			.map((segment, index, arr) => {
				const href = "/" + arr.slice(0, index + 1).join("/");
				return {
					label: formatSegment(segment),
					href,
				};
			}),
	];

	return (
		<nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium">
			<ol className="flex items-center gap-2">
				{breadcrumbs.map((crumb, index) => {
					const isLast = index === breadcrumbs.length - 1;

					return (
						<Fragment key={crumb.href + index}>
							{index > 0 && (
								<li className="flex items-center text-muted-foreground/40">
									<Icon icon="lucide:chevron-right" className="h-4 w-4" />
								</li>
							)}

							<li>
								{isLast ? (
									<span
										aria-current="page"
										className="text-foreground font-semibold cursor-default"
									>
										{crumb.label}
									</span>
								) : (
									<Link
										href={crumb.href}
										className="text-muted-foreground transition-colors hover:text-primary hover:underline hover:underline-offset-4"
									>
										{crumb.label}
									</Link>
								)}
							</li>
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}

