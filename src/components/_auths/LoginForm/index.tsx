"use client";

import { useState } from "react";
import { Shield, ShieldOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAdminLogin } from "@/hooks/authManagement";
import { adminLoginSchema } from "@/validations/authManagement";
import { AdminLoginPayload } from "@/types/authManagement";

export default function LoginForm() {
	const [isVisible, setIsVisible] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AdminLoginPayload>({
		resolver: yupResolver(adminLoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate: login, isPending } = useAdminLogin();

	const onSubmit = (data: AdminLoginPayload) => {
		login(data, {
			onSuccess: () => {
				router.push(`/verify-login?email=${encodeURIComponent(data.email)}`);
			},
		});
	};

	return (
		<form className="space-y-6 mt-2" onSubmit={handleSubmit(onSubmit)}>
			{/* Email */}
			<div className="space-y-2">
				<Label
					htmlFor="email"
					className="text-sm font-semibold text-foreground leading-none"
				>
					Admin Email Address <span className="text-primary">*</span>
				</Label>
				<Input
					{...register("email")}
					type="email"
					id="email"
					placeholder="info@wizofuasia.com"
					className={`h-11 bg-background/80 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/60 transition-all ${
						errors.email ? "border-destructive focus-visible:ring-destructive" : ""
					}`}
				/>
				{errors.email && (
					<p className="text-xs text-destructive font-medium">{errors.email.message}</p>
				)}
			</div>

			{/* Password */}
			<div className="w-full space-y-2">
				<div className="flex items-center justify-between">
					<Label htmlFor="password" className="text-sm font-semibold text-foreground">
						Password <span className="text-primary">*</span>
					</Label>
				</div>

				<div className="relative">
					<Input
						{...register("password")}
						id="password"
						type={isVisible ? "text" : "password"}
						placeholder="••••••••••••••••"
						className={`h-11 pr-10 bg-background/80 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/60 transition-all ${
							errors.password
								? "border-destructive focus-visible:ring-destructive"
								: ""
						}`}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => setIsVisible((prevState) => !prevState)}
						className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:text-primary hover:bg-transparent"
					>
						{isVisible ? (
							<ShieldOff className="h-4 w-4" />
						) : (
							<Shield className="h-4 w-4" />
						)}
						<span className="sr-only">
							{isVisible ? "Hide password" : "Show password"}
						</span>
					</Button>
				</div>
				{errors.password && (
					<p className="text-xs text-destructive font-medium">
						{errors.password.message}
					</p>
				)}
			</div>

			<div className="flex items-center justify-start space-x-2">
				<Checkbox
					id="rememberMe"
					className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
				/>
				<Label
					htmlFor="rememberMe"
					className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
				>
					Remember Me
				</Label>
			</div>

			<Button
				className="w-full h-11 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
				type="submit"
				disabled={isPending}
			>
				{isPending ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Sending Admin OTP...
					</>
				) : (
					"Sign In"
				)}
			</Button>
		</form>
	);
}

