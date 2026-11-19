import Image from "next/image";
import VerifyLoginForm from "@/components/_auths/VerifyLoginForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import AuthBackgroundShape from "@/constants/svg/auth-background-shape";
import { Suspense } from "react";

export default function VerifyLoginPage() {
	return (
		<div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden bg-background px-4 py-10 sm:px-6 lg:px-8">
			<div className="absolute z-0 scale-125 md:scale-100">
				<AuthBackgroundShape />
			</div>

			<Card className="z-10 w-full animate-in fade-in zoom-in-95 duration-500 border border-border bg-card/95 backdrop-blur-sm shadow-2xl sm:max-w-lg">
				<CardHeader className="flex flex-col items-center gap-3 text-center pb-2">
					<div className="relative h-24 w-44 mb-1">
						<Image
							src="/assets/images/wiz-logo-white.png"
							alt="Wiz Ofuasia Logo"
							fill
							className="object-contain"
							priority
						/>
					</div>

					<div className="space-y-1">
						<CardTitle className="font-display text-2xl font-extrabold text-foreground tracking-wide uppercase">
							Two-Step Admin Verification
						</CardTitle>
						<CardDescription className="text-muted-foreground text-sm font-medium">
							Enter the 6-digit security OTP sent to your admin email address.
						</CardDescription>
					</div>
				</CardHeader>

				<CardContent>
					<div className="space-y-6">
						<Suspense
							fallback={
								<div className="h-40 w-full animate-pulse bg-muted rounded-md" />
							}
						>
							<VerifyLoginForm />
						</Suspense>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

