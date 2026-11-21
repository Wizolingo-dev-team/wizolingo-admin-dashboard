"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { WidgetInfoPopover } from "../shared/WidgetInfoPopover";

export interface FulfillmentBreakdown {
	name: string;
	value: number;
	color: string;
}

export const DeliveredOrdersWidget = ({
	count,
	revenue,
	breakdown,
}: {
	count: number;
	revenue: number;
	breakdown?: FulfillmentBreakdown[];
}) => {
	const chartData =
		breakdown && breakdown.some((b) => b.value > 0)
			? breakdown
			: [{ name: "Delivered", value: Math.max(count, 1), color: "#D70E1D" }];

	return (
		<div className="rounded-[24px] border border-border bg-card p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between gap-4">
			<div className="flex items-start justify-between gap-4">
				<div>
					<div className="flex items-center gap-2">
						<h4 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
							Completed Orders &amp; Downloads
						</h4>
						<WidgetInfoPopover
							title="Completed Orders & Downloads"
							description="Tracks fulfilled store orders and unlocked digital music downloads, plus the live ratio of Delivered, Pending, and Cancelled orders."
						/>
					</div>
					<p className="text-sm text-muted-foreground">Fulfilled Store &amp; Music Orders</p>
				</div>
				<div className="text-right shrink-0">
					<h3 className="font-display text-3xl sm:text-4xl font-black text-foreground">
						{count.toLocaleString()}
					</h3>
					<p className="mt-1 text-[10px] font-black uppercase text-primary tracking-wider">
						${revenue >= 1000 ? `${(revenue / 1000).toFixed(1)}K` : revenue.toFixed(0)} Fulfilled
					</p>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row items-center gap-4">
				<div className="h-44 w-44 shrink-0">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={chartData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								innerRadius={46}
								outerRadius={68}
								paddingAngle={3}
								strokeWidth={0}
							>
								{chartData.map((entry, idx) => (
									<Cell key={idx} fill={entry.color} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "#141414",
									border: "1px solid #2e2e2e",
									borderRadius: "10px",
									fontSize: "12px",
									color: "#fff",
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>

				<div className="flex-1 w-full space-y-2.5">
					{(breakdown || chartData).map((item) => (
						<div
							key={item.name}
							className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 px-3 py-2 text-xs"
						>
							<div className="flex items-center gap-2">
								<span
									className="size-2.5 rounded-full shrink-0"
									style={{ backgroundColor: item.color }}
								/>
								<span className="font-semibold text-muted-foreground">{item.name}</span>
							</div>
							<span className="font-bold text-foreground">{item.value}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
