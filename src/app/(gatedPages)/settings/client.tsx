"use client";

import React from "react";
import RouteWrapper from "@/layouts/RouteWrapper";
import ProfileSettingsForm from "@/components/Forms/ProfileSettingsForm";
import { UserSettingsSkeleton } from "@/components/Skeletons/UserSettingsSkeleton";
import { useGetLoggedInAdmin } from "@/hooks/authManagement";
import { Icon } from "@iconify/react";

export default function SettingsClient() {
	const { data: user, isLoading } = useGetLoggedInAdmin();

	return (
		<RouteWrapper
			middleSlot={
				<div className="p-4 max-w-5xl mx-auto space-y-8 w-full">
					{/* Header Section */}
					<div className="flex items-center gap-4">
						<div className="size-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-sm">
							<Icon icon="ph:user-gear-bold" className="size-8" />
						</div>
						<div>
							<h1 className="font-display text-3xl font-black tracking-tight text-foreground uppercase">
								Account <span className="text-primary">Settings</span>
							</h1>
							<p className="text-sm text-muted-foreground font-medium">
								Update your admin profile information, avatar, and security password
							</p>
						</div>
					</div>

					{/* Main Content Area */}
					<div className="bg-card rounded-[32px] border border-border p-8 shadow-sm">
						{isLoading ? (
							<UserSettingsSkeleton />
						) : user ? (
							<ProfileSettingsForm user={user} />
						) : (
							<div className="py-20 text-center flex flex-col items-center justify-center gap-4">
								<div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
									<Icon icon="ph:user-minus-bold" className="size-8" />
								</div>
								<p className="text-muted-foreground font-medium">
									We couldn&apos;t retrieve your profile data. Please try logging
									in again.
								</p>
							</div>
						)}
					</div>
				</div>
			}
		/>
	);
}

