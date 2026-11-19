"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useVerifyAdminLogin, useResendAdminOtp } from "@/hooks/authManagement";

export default function VerifyLoginForm() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const router = useRouter();

	const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const { mutate: verifyLogin, isPending: isVerifying } = useVerifyAdminLogin();
	const { mutate: resendOtp, isPending: isResending } = useResendAdminOtp();

	useEffect(() => {
		if (!email) {
			router.push("/login");
		}
	}, [email, router]);

	const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (isNaN(Number(value))) return;

		const newOtp = [...otp];
		newOtp[index] = value.substring(value.length - 1);
		setOtp(newOtp);

		if (value && index < 5 && inputRefs.current[index + 1]) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (
			e.key === "Backspace" &&
			!otp[index] &&
			index > 0 &&
			inputRefs.current[index - 1]
		) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const text = e.clipboardData.getData("text").trim();
		if (/^[0-9]{6}$/.test(text)) {
			const digits = text.split("");
			setOtp(digits);
			inputRefs.current[5]?.focus();
		}
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const completeOtp = otp.join("");

		if (completeOtp.length !== 6 || !email) return;

		verifyLogin({
			email,
			otp: completeOtp,
		});
	};

	const handleResend = () => {
		if (!email) return;

		setOtp(new Array(6).fill(""));
		inputRefs.current[0]?.focus();

		resendOtp({ email });
	};

	return (
		<form className="space-y-8 mt-2" onSubmit={onSubmit}>
			<div className="flex justify-center items-center gap-2 sm:gap-3">
				{otp.map((digit, index) => (
					<Input
						key={index}
						type="text"
						maxLength={1}
						ref={(ref) => {
							inputRefs.current[index] = ref;
						}}
						value={digit}
						onChange={(e) => handleChange(index, e)}
						onKeyDown={(e) => handleKeyDown(index, e)}
						onPaste={handlePaste}
						className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-background/80 border-border text-foreground focus-visible:ring-primary/60 transition-all shadow-sm"
						autoComplete="one-time-code"
						inputMode="numeric"
						disabled={isVerifying}
					/>
				))}
			</div>

			<div className="text-center">
				<p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
					Didn&apos;t receive the code?{" "}
					<button
						type="button"
						onClick={handleResend}
						disabled={isResending || isVerifying}
						className="text-primary font-semibold hover:underline underline-offset-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
					>
						{isResending && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
						{isResending ? "Resending..." : "Resend Code"}
					</button>
				</p>
			</div>

			<Button
				className="w-full bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 h-11"
				type="submit"
				disabled={isVerifying}
			>
				{isVerifying ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Verifying...
					</>
				) : (
					"Verify & Enter Dashboard"
				)}
			</Button>
		</form>
	);
}

