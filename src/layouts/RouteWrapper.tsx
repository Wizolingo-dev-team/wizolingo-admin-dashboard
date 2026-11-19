import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface RouteWrapperProps {
	topLeftSlot?: ReactNode;
	topRightSlot?: ReactNode;
	middleSlot?: ReactNode;
	children?: ReactNode;
}

const baseStyles = {
	top: "flex flex-col items-start gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm",
	middle: "grid grid-cols-1 gap-6",
	children: "flex flex-col flex-1 min-h-0 w-full",
};

export default function RouteWrapper({
	topLeftSlot,
	topRightSlot,
	middleSlot,
	children,
}: RouteWrapperProps = {}) {
	const hasSlots = !!topLeftSlot || !!topRightSlot || !!middleSlot;

	return (
		<section className={cn("flex flex-col gap-6 w-full h-full", !hasSlots && "p-0 gap-0")}>
			{(!!topLeftSlot || !!topRightSlot) && (
				<div className="grid shrink-0 grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-6">
					{!!topLeftSlot && (
						<div className={cn(baseStyles.top, "lg:col-span-3")}>{topLeftSlot}</div>
					)}
					{!!topRightSlot && (
						<div className={cn(baseStyles.top, "lg:col-span-1")}>{topRightSlot}</div>
					)}
				</div>
			)}

			{!!middleSlot && <div className={cn(baseStyles.middle, "shrink-0")}>{middleSlot}</div>}

			{children && <div className={cn(baseStyles.children)}>{children}</div>}
		</section>
	);
}

