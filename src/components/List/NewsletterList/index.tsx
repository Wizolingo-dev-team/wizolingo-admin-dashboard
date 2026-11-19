"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import {
	subscriberColumnsSchema,
	newsletterTemplateColumnsSchema,
} from "@/components/Tables/columns/definitions";
import ActionModal from "@/components/_modals/ActionModal";
import DeleteModal from "@/components/_modals/DeleteModal";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import NewsletterTemplateForm from "@/components/Forms/NewsletterTemplateForm";
import SubscriberForm from "@/components/Forms/SubscriberForm";
import { ProductListSkeleton } from "@/components/Skeletons/ProductListSkeleton";
import {
	useGetSubscribers,
	useAddSubscriber,
	useUpdateSubscriber,
	useDeleteSubscriber,
	useGetNewsletterTemplates,
	useCreateNewsletterTemplate,
	useUpdateNewsletterTemplate,
	useDeleteNewsletterTemplate,
	useSendNewsletterCampaign,
} from "@/hooks/newsletterManagement";
import type {
	NewsletterSubscriber,
	NewsletterTemplate,
} from "@/types/newsletterManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatWidget } from "@/components/_widgets/shared/StatWidget";

export default function NewsletterList() {
	const { data: subscribers = [], isLoading: subsLoading } = useGetSubscribers();
	const { data: templates = [], isLoading: templatesLoading } = useGetNewsletterTemplates();

	const addSubMutation = useAddSubscriber();
	const updateSubMutation = useUpdateSubscriber();
	const deleteSubMutation = useDeleteSubscriber();

	const createTemplateMutation = useCreateNewsletterTemplate();
	const updateTemplateMutation = useUpdateNewsletterTemplate();
	const deleteTemplateMutation = useDeleteNewsletterTemplate();
	const sendCampaignMutation = useSendNewsletterCampaign();

	// Subscriber Modal states
	const [isSubActionOpen, setIsSubActionOpen] = useState(false);
	const [isSubViewOpen, setIsSubViewOpen] = useState(false);
	const [isSubDeleteOpen, setIsSubDeleteOpen] = useState(false);
	const [selectedSubscriber, setSelectedSubscriber] =
		useState<NewsletterSubscriber | null>(null);

	// Template Modal states
	const [isTplActionOpen, setIsTplActionOpen] = useState(false);
	const [isTplViewOpen, setIsTplViewOpen] = useState(false);
	const [isTplDeleteOpen, setIsTplDeleteOpen] = useState(false);
	const [isSendModalOpen, setIsSendModalOpen] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState<NewsletterTemplate | null>(null);
	const [testEmail, setTestEmail] = useState("");

	const [subSearch, setSubSearch] = useState("");
	const [subStatusFilter, setSubStatusFilter] = useState("all");
	const [tplSearch, setTplSearch] = useState("");

	const activeSubCount = useMemo(
		() => subscribers.filter((s) => s.status === "subscribed").length,
		[subscribers],
	);

	const totalEmailsSent = useMemo(
		() => templates.reduce((acc, t) => acc + (t.sentCount || 0), 0),
		[templates],
	);

	const filteredSubscribers = useMemo(() => {
		return subscribers.filter((s) => {
			const matchesSearch =
				s.email.toLowerCase().includes(subSearch.toLowerCase()) ||
				(s.name || "").toLowerCase().includes(subSearch.toLowerCase());
			const matchesStatus =
				subStatusFilter === "all" || s.status === subStatusFilter;
			return matchesSearch && matchesStatus;
		});
	}, [subscribers, subSearch, subStatusFilter]);

	const filteredTemplates = useMemo(() => {
		return templates.filter(
			(t) =>
				t.name.toLowerCase().includes(tplSearch.toLowerCase()) ||
				t.subject.toLowerCase().includes(tplSearch.toLowerCase()),
		);
	}, [templates, tplSearch]);

	const subscriberColumns = getColumns(
		subscriberColumnsSchema(
			(s) => {
				setSelectedSubscriber(s);
				setIsSubViewOpen(true);
			},
			(s) => {
				setSelectedSubscriber(s);
				setIsSubActionOpen(true);
			},
			(s) => {
				setSelectedSubscriber(s);
				setIsSubDeleteOpen(true);
			},
		),
	);

	const templateColumns = getColumns(
		newsletterTemplateColumnsSchema(
			(t) => {
				setSelectedTemplate(t);
				setIsTplViewOpen(true);
			},
			(t) => {
				setSelectedTemplate(t);
				setIsTplActionOpen(true);
			},
			(t) => {
				setSelectedTemplate(t);
				setIsTplDeleteOpen(true);
			},
			(t) => {
				setSelectedTemplate(t);
				setTestEmail("");
				setIsSendModalOpen(true);
			},
		),
	);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
				<StatWidget
					title="Inner Circle Subscribers"
					value={activeSubCount.toLocaleString()}
					icon="ph:users-three-bold"
					trend="Active"
				/>
				<StatWidget
					title="Campaign Templates"
					value={templates.length}
					icon="ph:envelope-open-bold"
					trend="Resend Ready"
				/>
				<StatWidget
					title="Total Campaign Emails Sent"
					value={totalEmailsSent.toLocaleString()}
					icon="ph:paper-plane-tilt-bold"
					trend="Delivered"
				/>
			</div>

			<Tabs defaultValue="templates" className="w-full space-y-6">
				<TabsList className="bg-card border border-border p-1 rounded-xl">
					<TabsTrigger
						value="templates"
						className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-6"
					>
						Campaign Templates ({templates.length})
					</TabsTrigger>
					<TabsTrigger
						value="subscribers"
						className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold rounded-lg px-6"
					>
						Subscribers ({subscribers.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="templates">
					<TableLayoutWrapper
						title="Newsletter Campaign Templates"
						columns={templateColumns}
						data={filteredTemplates}
						isLoading={templatesLoading}
						skeleton={<ProductListSkeleton />}
						addLabel="New Campaign Template"
						searchQuery={tplSearch}
						onSearchChange={setTplSearch}
						filters={[]}
						onAddClick={() => {
							setSelectedTemplate(null);
							setIsTplActionOpen(true);
						}}
					/>
				</TabsContent>

				<TabsContent value="subscribers">
					<TableLayoutWrapper
						title="Inner Circle Subscribers"
						columns={subscriberColumns}
						data={filteredSubscribers}
						isLoading={subsLoading}
						skeleton={<ProductListSkeleton />}
						addLabel="Add Subscriber"
						searchQuery={subSearch}
						onSearchChange={setSubSearch}
						filters={[
							{
								label: "Status",
								value: subStatusFilter,
								options: [
									{ label: "Subscribed", value: "subscribed" },
									{ label: "Unsubscribed", value: "unsubscribed" },
								],
							},
						]}
						onFilterChange={(_, val) => setSubStatusFilter(val)}
						onAddClick={() => {
							setSelectedSubscriber(null);
							setIsSubActionOpen(true);
						}}
					/>
				</TabsContent>
			</Tabs>

			{/* Template Create/Edit Modal */}
			<ActionModal
				open={isTplActionOpen}
				onOpenChange={setIsTplActionOpen}
				title={selectedTemplate ? "Edit Campaign Template" : "Create Campaign Template"}
				formId="newsletter-template-form"
				isLoading={
					createTemplateMutation.isPending || updateTemplateMutation.isPending
				}
				submitLabel={selectedTemplate ? "Update Template" : "Save Template"}
			>
				<NewsletterTemplateForm
					formId="newsletter-template-form"
					initialData={selectedTemplate || undefined}
					onSubmit={(data) => {
						if (selectedTemplate) {
							updateTemplateMutation.mutate(
								{ id: selectedTemplate._id, payload: data },
								{ onSuccess: () => setIsTplActionOpen(false) },
							);
						} else {
							createTemplateMutation.mutate(data, {
								onSuccess: () => setIsTplActionOpen(false),
							});
						}
					}}
				/>
			</ActionModal>

			{/* Template Preview Modal */}
			<ViewDetailsModal
				open={isTplViewOpen}
				onOpenChange={setIsTplViewOpen}
				title="Campaign Preview"
				onEditClick={() => {
					setIsTplViewOpen(false);
					setIsTplActionOpen(true);
				}}
			>
				{selectedTemplate && (
					<div className="space-y-6">
						<div className="space-y-1">
							<Badge className="bg-primary text-white uppercase">
								{selectedTemplate.category}
							</Badge>
							<h3 className="font-display text-xl font-bold text-foreground">
								{selectedTemplate.name}
							</h3>
							<p className="text-sm font-semibold text-muted-foreground">
								Subject: {selectedTemplate.subject}
							</p>
						</div>

						<div className="rounded-2xl border border-border bg-white text-black p-6 shadow-inner">
							<div
								className="prose prose-sm max-w-none"
								dangerouslySetInnerHTML={{
									__html: selectedTemplate.htmlContent,
								}}
							/>
						</div>
					</div>
				)}
			</ViewDetailsModal>

			{/* Send Campaign / Test Email Modal */}
			<ActionModal
				open={isSendModalOpen}
				onOpenChange={setIsSendModalOpen}
				title="Send Newsletter Campaign"
				description={`Template: ${selectedTemplate?.name || ""}`}
				isLoading={sendCampaignMutation.isPending}
				submitLabel={
					testEmail.trim()
						? "Send Test Email"
						: `Broadcast to ${activeSubCount} Subscribers`
				}
				onSubmit={() => {
					if (!selectedTemplate) return;
					sendCampaignMutation.mutate(
						{
							id: selectedTemplate._id,
							payload: testEmail.trim() ? { testEmail: testEmail.trim() } : {},
						},
						{ onSuccess: () => setIsSendModalOpen(false) },
					);
				}}
			>
				<div className="space-y-6">
					<div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 space-y-2">
						<p className="text-xs font-bold uppercase text-primary">
							Campaign Broadcast
						</p>
						<p className="text-sm text-foreground">
							Leave the test email field blank to broadcast this campaign immediately
							to all <strong>{activeSubCount}</strong> active Inner Circle subscribers
							via Resend.
						</p>
					</div>

					<div className="space-y-2">
						<Label className="text-sm font-bold">
							Send Test Email First (Optional)
						</Label>
						<Input
							type="email"
							value={testEmail}
							onChange={(e) => setTestEmail(e.target.value)}
							placeholder="Enter an email address to send a [TEST] preview..."
							className="h-11 bg-background/60 border-border"
						/>
					</div>
				</div>
			</ActionModal>

			{/* Subscriber Create/Edit Modal */}
			<ActionModal
				open={isSubActionOpen}
				onOpenChange={setIsSubActionOpen}
				title={selectedSubscriber ? "Edit Subscriber" : "Add Inner Circle Subscriber"}
				formId="subscriber-form"
				isLoading={addSubMutation.isPending || updateSubMutation.isPending}
				submitLabel={selectedSubscriber ? "Update Subscriber" : "Add Subscriber"}
			>
				<SubscriberForm
					formId="subscriber-form"
					initialData={selectedSubscriber || undefined}
					onSubmit={(data) => {
						if (selectedSubscriber) {
							updateSubMutation.mutate(
								{ id: selectedSubscriber._id, payload: data },
								{ onSuccess: () => setIsSubActionOpen(false) },
							);
						} else {
							addSubMutation.mutate(data, {
								onSuccess: () => setIsSubActionOpen(false),
							});
						}
					}}
				/>
			</ActionModal>

			<ViewDetailsModal
				open={isSubViewOpen}
				onOpenChange={setIsSubViewOpen}
				title="Subscriber Details"
				onEditClick={() => {
					setIsSubViewOpen(false);
					setIsSubActionOpen(true);
				}}
			>
				{selectedSubscriber && (
					<div className="space-y-4">
						<div className="p-4 rounded-xl bg-card border border-border">
							<p className="text-xs text-muted-foreground uppercase font-bold">
								Email
							</p>
							<p className="text-lg font-bold">{selectedSubscriber.email}</p>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 rounded-xl bg-card border border-border">
								<p className="text-xs text-muted-foreground uppercase font-bold">
									Source
								</p>
								<p className="font-bold uppercase">{selectedSubscriber.source}</p>
							</div>
							<div className="p-4 rounded-xl bg-card border border-border">
								<p className="text-xs text-muted-foreground uppercase font-bold">
									Status
								</p>
								<p className="font-bold uppercase text-primary">
									{selectedSubscriber.status}
								</p>
							</div>
						</div>
					</div>
				)}
			</ViewDetailsModal>

			<DeleteModal
				open={isTplDeleteOpen}
				onOpenChange={setIsTplDeleteOpen}
				onConfirm={() =>
					deleteTemplateMutation.mutate(selectedTemplate!._id, {
						onSuccess: () => setIsTplDeleteOpen(false),
					})
				}
				isLoading={deleteTemplateMutation.isPending}
				title="Delete Campaign Template"
			/>

			<DeleteModal
				open={isSubDeleteOpen}
				onOpenChange={setIsSubDeleteOpen}
				onConfirm={() =>
					deleteSubMutation.mutate(selectedSubscriber!._id, {
						onSuccess: () => setIsSubDeleteOpen(false),
					})
				}
				isLoading={deleteSubMutation.isPending}
				title="Delete Subscriber"
			/>
		</div>
	);
}

