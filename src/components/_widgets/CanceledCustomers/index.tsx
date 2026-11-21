"use client";

import { Icon } from "@iconify/react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { WidgetInfoPopover } from "../shared/WidgetInfoPopover";
import type { DailyMetricPoint } from "../TotalCustomers";

const DEFAULT_DAYS: DailyMetricPoint[] = [
	{ day: "Mon", count: 0 },
	{ day: "Tue", count: 0 },
	{ day: "Wed", count: 0 },
	{ day: "Thu", count: 0 },
	{ day: "Fri", count: 0 },
	{ day: "Sat", count: 0 },
	{ day: "Sun", count: 0 },
];

export const CanceledCustomersWidget = ({
	count,
	dailyData = DEFAULT_DAYS,
}: {
	count: number;
	dailyData?: DailyMetricPoint[];
}) => (
	<div className="rounded-[24px] border border-border bg-card p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between gap-4">
		<div className="flex items-start justify-between gap-4">
			<div>
				<div className="flex items-center gap-2">
					<h4 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
						Canceled Orders
					</h4>
					<WidgetInfoPopover
						title="Canceled Orders"
						description="Monitors orders marked as Cancelled across days of the week so you can spot checkout friction or fulfillment issues early."
					/>
				</div>
				<div className="mt-1 flex items-center gap-1 text-[10px] font-black uppercase text-destructive tracking-widest">
					<Icon icon="ph:warning-circle-bold" /> System Report
				</div>
			</div>
			<h3 className="font-display text-3xl sm:text-4xl font-black text-foreground">
				{count.toLocaleString()}
			</h3>
		</div>

		<div className="h-44 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={dailyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
					<defs>
						<linearGradient id="canceledAreaGrad" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#D70E1D" stopOpacity={0.35} />
							<stop offset="95%" stopColor="#D70E1D" stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
					<XAxis
						dataKey="day"
						tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						allowDecimals={false}
						tick={{ fill: "#9ca3af", fontSize: 11 }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "#141414",
							border: "1px solid #2e2e2e",
							borderRadius: "10px",
							fontSize: "12px",
							color: "#fff",
						}}
					/>
					<Area
						type="monotone"
						dataKey="count"
						name="Canceled"
						stroke="#D70E1D"
						strokeWidth={2.5}
						fill="url(#canceledAreaGrad)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	</div>
);
