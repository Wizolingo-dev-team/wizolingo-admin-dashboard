"use client";

export const ReviewsWidget = ({ count }: { count: number }) => (
	<div className="rounded-[24px] border border-border bg-card p-8 shadow-sm h-full">
		<div className="flex justify-between items-start">
			<div>
				<h3 className="font-display text-4xl font-black text-foreground">
					{count > 1000 ? `${(count / 1000).toFixed(2)}k` : count}
				</h3>
				<p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
					Music &amp; Merch Reviews
				</p>
			</div>
			<span className="rounded-md bg-primary/15 px-2.5 py-1 text-[10px] font-black text-primary uppercase">
				Active
			</span>
		</div>
		<div className="mt-8 flex items-end justify-between px-2">
			{[0.4, 0.7, 0.5, 0.8, 0.6, 0.9, 0.6].map((h, i) => (
				<div key={i} className="flex flex-col items-center gap-4">
					<div
						className="w-3 rounded-full bg-primary/30 transition-all duration-500 hover:bg-primary"
						style={{ height: `${h * 80}px` }}
					/>
					<span className="text-[10px] font-bold text-primary">0{i + 1}</span>
				</div>
			))}
		</div>
	</div>
);

