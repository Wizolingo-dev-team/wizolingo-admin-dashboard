import React from "react";

export const UserSettingsSkeleton = () => (
	<div className="space-y-8 animate-pulse">
		<div className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-muted/40 border border-border">
			<div className="size-28 rounded-full bg-muted" />
			<div className="h-4 w-32 bg-muted rounded mt-4" />
		</div>
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{[1, 2, 3, 4].map((i) => (
				<div key={i} className="space-y-2">
					<div className="h-4 w-24 bg-muted rounded" />
					<div className="h-12 w-full bg-muted rounded-xl" />
				</div>
			))}
		</div>
		<div className="h-24 w-full bg-muted rounded-xl" />
	</div>
);

