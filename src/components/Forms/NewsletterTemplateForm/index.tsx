"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createNewsletterTemplateSchema } from "@/validations/newsletterManagement";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	CreateTemplatePayload,
	NewsletterTemplate,
	NewsletterTemplateCategory,
} from "@/types/newsletterManagement";

interface NewsletterTemplateFormProps {
	formId: string;
	initialData?: NewsletterTemplate;
	onSubmit: (data: CreateTemplatePayload) => void;
}

export default function NewsletterTemplateForm({
	formId,
	initialData,
	onSubmit,
}: NewsletterTemplateFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CreateTemplatePayload>({
		// @ts-ignore
		resolver: yupResolver(createNewsletterTemplateSchema),
		defaultValues: {
			name: initialData?.name || "",
			subject: initialData?.subject || "",
			previewText: initialData?.previewText || "",
			category: (initialData?.category || "general") as NewsletterTemplateCategory,
			htmlContent:
				initialData?.htmlContent ||
				`<h2>New Release Alert from Wiz Ofuasia!</h2>\n<p>Stream and download the latest Wizolingo drop today on the official store.</p>`,
		},
	});

	return (
		<form id={formId} onSubmit={handleSubmit(onSubmit as any)} className="space-y-6 pb-8">
			<div className="space-y-2">
				<Label className="text-sm font-bold">Internal Template Name</Label>
				<Input
					{...register("name")}
					placeholder="e.g. More Billionaires Deluxe Drop Announcement"
					className="h-11 bg-background/60 border-border"
				/>
				{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label className="text-sm font-bold">Email Subject Line</Label>
					<Input
						{...register("subject")}
						placeholder="New Wiz Ofuasia Music & Tour Dates Inside!"
						className="h-11 bg-background/60 border-border"
					/>
					{errors.subject && (
						<p className="text-xs text-destructive">{errors.subject.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label className="text-sm font-bold">Campaign Category</Label>
					<Select
						defaultValue={initialData?.category || "general"}
						onValueChange={(val) =>
							setValue("category", val as NewsletterTemplateCategory)
						}
					>
						<SelectTrigger className="h-11 bg-background/60 border-border">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="release">Music Release</SelectItem>
							<SelectItem value="tour">Tour &amp; Events</SelectItem>
							<SelectItem value="merch">Merch Drop</SelectItem>
							<SelectItem value="general">General Update</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">Inbox Preview Text (Optional)</Label>
				<Input
					{...register("previewText")}
					placeholder="Exclusive update for the Wizolingo Inner Circle..."
					className="h-11 bg-background/60 border-border"
				/>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-bold">HTML Email Content</Label>
				<Textarea
					{...register("htmlContent")}
					placeholder="<h2>Hello Inner Circle!</h2><p>Write your HTML newsletter body here...</p>"
					className="min-h-[220px] font-mono text-xs bg-background/60 border-border p-4"
				/>
				{errors.htmlContent && (
					<p className="text-xs text-destructive">{errors.htmlContent.message}</p>
				)}
			</div>
		</form>
	);
}

