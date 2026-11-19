"use client";

export const DeliveredOrdersWidget = ({
	count,
	revenue,
}: {
	count: number;
	revenue: number;
}) => (
	<div className="rounded-[24px] border border-border bg-card p-8 shadow-sm h-full flex justify-between">
		<div>
			<h4 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
				Completed Orders &amp; Downloads
			</h4>
			<p className="text-sm text-muted-foreground">Fulfilled Store &amp; Music Orders</p>
			<div className="mt-8">
				<h3 className="font-display text-4xl font-black text-foreground">
					{count.toLocaleString()}
				</h3>
				<p className="mt-2 text-[10px] font-black uppercase text-primary tracking-wider">
					Verified Fulfillment
				</p>
			</div>
		</div>
		<div className="relative flex items-center justify-center">
			<div className="size-32 rounded-full border-[14px] border-muted border-t-primary border-l-primary relative flex items-center justify-center shadow-inner">
				<span className="text-sm font-black text-foreground">
					${revenue >= 1000 ? `${(revenue / 1000).toFixed(1)}K` : revenue.toFixed(0)}
				</span>
			</div>
		</div>
	</div>
);

