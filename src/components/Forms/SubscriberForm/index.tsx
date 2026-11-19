"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSubscriberSchema } from "@/validations/newsletterManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	CreateSubscriberPayload,
	NewsletterStatus,
	NewsletterSubscriber,
} from "@/types/newsletterManagement";

interface SubscriberFormProps {
	formId: string;
	initialData?: NewsletterSubscriber;
	onSubmit: (data: CreateSubscriberPayload) => void;
}

export default function SubscriberForm({
	formId,
	initialData,
	onSubmit,
}: SubscriberFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreateSubscriberPayload>({
		// @ts-ignore
		resolver: yupResolver(createSubscriberSchema),
		defaultValues: {
			email: initialData?.email || "",
			name: initialData?.name || "",
			status: (initialData?.status || "subscribed") as NewsletterStatus,
		},
	});

	return (
		<form id={formId} onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
			<div className="space-y-2">
				<Label className="text-sm font-bold">Subscriber Email</Label>
				<Input
					type="email"
					{...register("email")}
					placeholder="fan@example.com"
					className="h-11 bg-background/60 border-border"
				/>
				{errors.email && (
					<p className="text-xs text-destructive">{errors.email.message}</p>
				)}
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">Fan Name (Optional)</Label>
				<Input
					{...register("name")}
					placeholder="Full Name"
					className="h-11 bg-background/60 border-border"
				/>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">Subscription Status</Label>
				<Select
					defaultValue={initialData?.status || "subscribed"}
					onValueChange={(val) => setValue("status", val as NewsletterStatus)}
				>
					<SelectTrigger className="h-11 bg-background/60 border-border">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="subscribed">Subscribed</SelectItem>
						<SelectItem value="unsubscribed">Unsubscribed</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</form>
	);
}

