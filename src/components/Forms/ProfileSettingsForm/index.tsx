"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
	updateProfileSchema,
	changePasswordSchema,
} from "@/validations/profileManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { Loader2 } from "lucide-react";
import { useUpdateProfile, useChangePassword } from "@/hooks/profileManagement";
import { AdminUser } from "@/types/authManagement";

interface ProfileSettingsFormProps {
	user: AdminUser;
}

export default function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
	const updateProfile = useUpdateProfile();
	const changePassword = useChangePassword();
	const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar?.url || null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isDirty },
		reset,
	} = useForm({
		resolver: yupResolver(updateProfileSchema),
		defaultValues: {
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			phoneNumber: user.phoneNumber || "",
			address: user.address || "",
		},
	});

	const {
		register: registerPwd,
		handleSubmit: handleSubmitPwd,
		formState: { errors: pwdErrors },
		reset: resetPwd,
	} = useForm({
		resolver: yupResolver(changePasswordSchema),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		reset({
			firstName: user.firstName || "",
			lastName: user.lastName || "",
			phoneNumber: user.phoneNumber || "",
			address: user.address || "",
		});
		setAvatarPreview(user.avatar?.url || null);
	}, [user, reset]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	const onSubmitProfile = (data: any) => {
		const formData = new FormData();
		formData.append("firstName", data.firstName);
		formData.append("lastName", data.lastName);
		formData.append("phoneNumber", data.phoneNumber || "");
		formData.append("address", data.address || "");

		if (selectedFile) {
			formData.append("avatar", selectedFile);
		}

		updateProfile.mutate(formData, {
			onSuccess: () => {
				setSelectedFile(null);
			},
		});
	};

	const onSubmitPassword = (data: any) => {
		changePassword.mutate(
			{
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			},
			{
				onSuccess: () => {
					resetPwd();
				},
			},
		);
	};

	return (
		<div className="space-y-12">
			<form
				onSubmit={handleSubmit(onSubmitProfile)}
				className="space-y-8 animate-in fade-in duration-500"
			>
				{/* Avatar Upload Section */}
				<div className="flex flex-col items-center justify-center p-8 rounded-[32px] bg-background/50 border border-dashed border-border relative group">
					<div className="relative">
						<div className="size-28 rounded-full border-4 border-primary/40 shadow-2xl overflow-hidden bg-primary/15 flex items-center justify-center">
							{avatarPreview ? (
								<img
									src={avatarPreview}
									alt="Avatar"
									className="size-full object-cover"
								/>
							) : (
								<Icon
									icon="ph:user-circle-duotone"
									className="size-20 text-primary"
								/>
							)}
						</div>
						<label
							htmlFor="avatar-upload"
							className="absolute bottom-0 right-0 size-9 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95"
						>
							<Icon icon="ph:camera-bold" className="size-5" />
							<input
								type="file"
								id="avatar-upload"
								className="hidden"
								accept="image/*"
								onChange={handleFileChange}
							/>
						</label>
					</div>
					<div className="mt-4 text-center">
						<p className="text-sm font-bold text-foreground">Admin Profile Picture</p>
						<p className="text-xs text-muted-foreground">JPG, PNG or WEBP. Max 5MB</p>
					</div>
				</div>

				{/* Form Fields */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label className="text-sm font-bold flex items-center gap-2">
							<Icon icon="ph:user-bold" className="text-primary" /> First Name
						</Label>
						<Input
							{...register("firstName")}
							className="h-12 rounded-xl border-border bg-background/60"
							placeholder="Wiz"
						/>
						{errors.firstName && (
							<p className="text-xs text-destructive">{errors.firstName.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold flex items-center gap-2">
							Last Name
						</Label>
						<Input
							{...register("lastName")}
							className="h-12 rounded-xl border-border bg-background/60"
							placeholder="Ofuasia"
						/>
						{errors.lastName && (
							<p className="text-xs text-destructive">{errors.lastName.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold flex items-center gap-2 text-muted-foreground">
							<Icon icon="ph:envelope-bold" /> Email Address
						</Label>
						<Input
							value={user.email}
							disabled
							className="h-12 rounded-xl bg-muted/50 border-border cursor-not-allowed italic"
						/>
						<p className="text-[10px] text-muted-foreground ml-1">
							Admin email cannot be changed directly.
						</p>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold flex items-center gap-2">
							<Icon icon="ph:phone-bold" className="text-primary" /> Phone Number
						</Label>
						<Input
							{...register("phoneNumber")}
							className="h-12 rounded-xl border-border bg-background/60"
							placeholder="+1 / +234..."
						/>
						{errors.phoneNumber && (
							<p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold flex items-center gap-2">
						<Icon icon="ph:map-pin-bold" className="text-primary" /> Studio / Management
						Address
					</Label>
					<Textarea
						{...register("address")}
						className="min-h-[100px] rounded-xl border-border bg-background/60 resize-none p-4"
						placeholder="Enter studio or management office address..."
					/>
					{errors.address && (
						<p className="text-xs text-destructive">{errors.address.message}</p>
					)}
				</div>

				<div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
					<Button
						type="submit"
						disabled={updateProfile.isPending || (!isDirty && !selectedFile)}
						className="min-w-[160px] h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
					>
						{updateProfile.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
							</>
						) : (
							"Save Profile Changes"
						)}
					</Button>
				</div>
			</form>

			{/* Change Password Section */}
			<form
				onSubmit={handleSubmitPwd(onSubmitPassword)}
				className="space-y-6 pt-8 border-t border-border"
			>
				<div>
					<h3 className="font-display text-lg font-bold text-foreground uppercase">
						Security &amp; Password
					</h3>
					<p className="text-xs text-muted-foreground">
						Update your admin password (PUT /api/profile/change-password)
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label className="text-xs font-bold uppercase text-muted-foreground">
							Current Password
						</Label>
						<Input
							type="password"
							{...registerPwd("currentPassword")}
							className="h-11 rounded-xl border-border bg-background/60"
							placeholder="••••••••"
						/>
						{pwdErrors.currentPassword && (
							<p className="text-xs text-destructive">
								{pwdErrors.currentPassword.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label className="text-xs font-bold uppercase text-muted-foreground">
							New Password
						</Label>
						<Input
							type="password"
							{...registerPwd("newPassword")}
							className="h-11 rounded-xl border-border bg-background/60"
							placeholder="••••••••"
						/>
						{pwdErrors.newPassword && (
							<p className="text-xs text-destructive">
								{pwdErrors.newPassword.message}
							</p>
						)}
					</div>
					<div className="space-y-2">
						<Label className="text-xs font-bold uppercase text-muted-foreground">
							Confirm New Password
						</Label>
						<Input
							type="password"
							{...registerPwd("confirmPassword")}
							className="h-11 rounded-xl border-border bg-background/60"
							placeholder="••••••••"
						/>
						{pwdErrors.confirmPassword && (
							<p className="text-xs text-destructive">
								{pwdErrors.confirmPassword.message}
							</p>
						)}
					</div>
				</div>

				<div className="flex justify-end">
					<Button
						type="submit"
						variant="secondary"
						disabled={changePassword.isPending}
						className="h-11 px-6 font-bold rounded-xl"
					>
						{changePassword.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Password...
							</>
						) : (
							"Update Password"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}

