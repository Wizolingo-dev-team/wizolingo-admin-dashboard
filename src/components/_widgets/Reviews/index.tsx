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

export interface RatingDistributionPoint {
	rating: string;
	count: number;
}

const DEFAULT_RATINGS: RatingDistributionPoint[] = [
	{ rating: "1★", count: 0 },
	{ rating: "2★", count: 0 },
	{ rating: "3★", count: 0 },
	{ rating: "4★", count: 0 },
	{ rating: "5★", count: 0 },
];

export const ReviewsWidget = ({
	count,
	averageRating = 0,
	ratingData = DEFAULT_RATINGS,
}: {
	count: number;
	averageRating?: number;
	ratingData?: RatingDistributionPoint[];
}) => (
	<div className="rounded-[24px] border border-border bg-card p-6 sm:p-8 shadow-sm h-full flex flex-col justify-between gap-4">
		<div className="flex items-start justify-between gap-4">
			<div>
				<div className="flex items-center gap-2">
					<h4 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
						Music &amp; Merch Reviews
					</h4>
					<WidgetInfoPopover
						title="Music & Merch Reviews"
						description="Shows total verified customer reviews and the star-rating distribution (1★ to 5★) across your music releases and merchandise."
					/>
				</div>
				<p className="text-sm text-muted-foreground">
					{averageRating > 0
						? `Average Rating: ${averageRating.toFixed(1)} / 5.0`
						: "Customer Feedback Breakdown"}
				</p>
			</div>
			<div className="text-right shrink-0">
				<h3 className="font-display text-3xl sm:text-4xl font-black text-foreground">
					{count > 1000 ? `${(count / 1000).toFixed(2)}k` : count}
				</h3>
				<span className="mt-1 inline-block rounded-md bg-primary/15 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase">
					Active
				</span>
			</div>
		</div>

		<div className="h-44 w-full">
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={ratingData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
					<XAxis
						dataKey="rating"
						tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 700 }}
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
					<Bar dataKey="count" name="Reviews" fill="#D70E1D" radius={[6, 6, 0, 0]} maxBarSize={32} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	</div>
);
