import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
			<span className="font-display text-7xl font-black text-primary">404</span>
			<h1 className="mt-4 font-display text-2xl font-bold text-foreground">
				Page Not Found
			</h1>
			<p className="mt-2 max-w-md text-sm text-muted-foreground">
				The admin route you are looking for does not exist or has been moved.
			</p>
			<Button asChild className="mt-6 bg-primary text-white font-bold">
				<Link href="/dashboard">Return to Dashboard</Link>
			</Button>
		</div>
	);
}

