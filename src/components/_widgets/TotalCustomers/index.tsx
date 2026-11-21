"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { WidgetInfoPopover } from "../shared/WidgetInfoPopover";

export interface DailyMetricPoint {
	day: string;
	count: number;
}

const DEFAULT_DAYS: DailyMetricPoint[] = [
	{ day: "Mon", count: 0 },
	{ day: "Tue", count: 0 },
	{ day: "Wed", count: 0 },
	{ day: "Thu", count: 0 },
	{ day: "Fri", count: 0 },
	{ day: "Sat", count: 0 },
	{ day: "Sun", count: 0 },
];

export const TotalCustomersWidget = ({
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
						Fan &amp; Customer Growth
					</h4>
					<WidgetInfoPopover
						title="Fan & Customer Growth"
						description="Displays total registered Wizolingo accounts alongside a 7-day breakdown of account signups by day of the week."
					/>
				</div>
				<p className="text-sm text-muted-foreground">Registered Wizolingo Accounts</p>
			</div>
			<div className="text-right shrink-0">
				<h3 className="font-display text-3xl sm:text-4xl font-black text-foreground">
					{count.toLocaleString()}
				</h3>
				<span className="mt-1 inline-block rounded-md bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-primary">
					REAL TIME
				</span>
			</div>
		</div>

		<div className="h-44 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={dailyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
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
						cursor={{ fill: "rgba(215, 14, 29, 0.08)" }}
						contentStyle={{
							backgroundColor: "#141414",
							border: "1px solid #2e2e2e",
							borderRadius: "10px",
							fontSize: "12px",
							color: "#fff",
						}}
					/>
					<Bar dataKey="count" name="Accounts" fill="#D70E1D" radius={[6, 6, 0, 0]} maxBarSize={28} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	</div>
);
