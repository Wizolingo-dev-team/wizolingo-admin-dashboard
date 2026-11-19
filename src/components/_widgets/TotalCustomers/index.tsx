"use client";

export const TotalCustomersWidget = ({ count }: { count: number }) => {
	const days = ["M", "T", "W", "T", "F", "S", "S"];
	return (
		<div className="rounded-[24px] border border-border bg-card p-8 shadow-sm h-full">
			<div className="flex justify-between">
				<div>
					<h4 className="font-display text-lg font-bold text-foreground uppercase tracking-tight">
						Fan &amp; Customer Growth
					</h4>
					<p className="text-sm text-muted-foreground">Registered Wizolingo Accounts</p>
					<div className="mt-6">
						<h3 className="font-display text-4xl font-black text-foreground">
							{count.toLocaleString()}
						</h3>
						<span className="mt-2 inline-block rounded-md bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
							REAL TIME
						</span>
					</div>
				</div>
				<div className="flex items-end gap-3 pb-2">
					{days.map((day, i) => (
						<div key={i} className="flex flex-col items-center gap-2 group">
							<div
								className={`w-3 rounded-full transition-all duration-700 ${
									i === 6
										? "bg-primary h-24"
										: "bg-muted h-16 group-hover:bg-primary/40"
								}`}
							/>
							<span className="text-[11px] font-bold text-primary">{day}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

