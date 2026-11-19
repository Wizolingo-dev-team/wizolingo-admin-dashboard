"use client";

import React, { useState, useMemo } from "react";
import { TableLayoutWrapper } from "../TableLayoutWrapper";
import { getColumns } from "@/components/Tables/columns/columnFactory";
import { userColumnsSchema } from "@/components/Tables/columns/definitions";
import { useGetAllUsers, useUpdateUserRole } from "@/hooks/userManagement";
import { UserListSkeleton } from "@/components/Skeletons/UserListSkeleton";
import ViewDetailsModal from "@/components/_modals/ViewDetailsModal";
import { User } from "@/types/userManagement";
import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function UsersList() {
	const { data: users = [], isLoading } = useGetAllUsers();
	const updateRoleMutation = useUpdateUserRole();

	const [isViewOpen, setIsViewOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [roleFilter, setRoleFilter] = useState("all");

	const filteredData = useMemo(() => {
		return users.filter((u) => {
			const matchesSearch =
				u.firstName.toLowerCase().includes(search.toLowerCase()) ||
				u.email.toLowerCase().includes(search.toLowerCase()) ||
				u.lastName.toLowerCase().includes(search.toLowerCase());

			const matchesRole = roleFilter === "all" || u.role === roleFilter;

			return matchesSearch && matchesRole;
		});
	}, [users, search, roleFilter]);

	const paginatedData = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredData.slice(start, start + pageSize);
	}, [filteredData, page, pageSize]);

	const handleView = (user: User) => {
		setSelectedUser(user);
		setIsViewOpen(true);
	};

	const handleRoleChange = (id: string, role: "admin" | "user") => {
		updateRoleMutation.mutate({ id, payload: { role } });
	};

	const columns = getColumns(userColumnsSchema(handleView, handleRoleChange));

	return (
		<>
			<TableLayoutWrapper
				title="User Base"
				columns={columns}
				data={paginatedData}
				isLoading={isLoading || updateRoleMutation.isPending}
				skeleton={<UserListSkeleton />}
				searchQuery={search}
				onSearchChange={(val) => {
					setSearch(val);
					setPage(1);
				}}
				onFilterChange={(label, value) => {
					if (label === "Role") {
						setRoleFilter(value);
						setPage(1);
					}
				}}
				filters={[
					{
						label: "Role",
						value: roleFilter,
						options: [
							{ label: "Admin", value: "admin" },
							{ label: "User", value: "user" },
						],
					},
				]}
				paginationProps={{
					currentPage: page,
					totalPages: Math.ceil(filteredData.length / pageSize) || 1,
					pageSize,
					totalEntries: filteredData.length,
					onPageChange: setPage,
					onPageSizeChange: (s) => {
						setPageSize(Number(s));
						setPage(1);
					},
				}}
			/>

			<ViewDetailsModal
				open={isViewOpen}
				onOpenChange={setIsViewOpen}
				title="Fan & Customer Profile"
				description="Comprehensive view of customer account & purchases"
			>
				{selectedUser && (
					<div className="space-y-8">
						<div className="flex flex-col items-center text-center space-y-4 p-6 rounded-3xl bg-primary/10 border border-primary/30">
							<div className="size-24 rounded-full border-4 border-primary/40 shadow-xl overflow-hidden bg-card flex items-center justify-center">
								{selectedUser.avatar?.url ? (
									<img
										src={selectedUser.avatar.url}
										className="size-full object-cover"
										alt=""
									/>
								) : (
									<Icon
										icon="ph:user-circle-duotone"
										className="size-16 text-primary"
									/>
								)}
							</div>
							<div>
								<h3 className="font-display text-2xl font-black text-foreground uppercase tracking-tight">
									{selectedUser.firstName} {selectedUser.lastName}
								</h3>
								<p className="text-muted-foreground font-medium">
									{selectedUser.email}
								</p>
								<Badge className="mt-2 bg-primary text-white border-none px-4 uppercase">
									{selectedUser.role}
								</Badge>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-3">
								<div className="size-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
									<Icon icon="ph:shopping-bag-bold" className="size-5" />
								</div>
								<div>
									<p className="text-[10px] font-bold uppercase text-muted-foreground">
										Total Orders
									</p>
									<p className="text-lg font-black">{selectedUser.orderCount}</p>
								</div>
							</div>
							<div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex items-center gap-3">
								<div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
									<Icon icon="ph:heart-bold" className="size-5" />
								</div>
								<div>
									<p className="text-[10px] font-bold uppercase text-muted-foreground">
										Wishlist Items
									</p>
									<p className="text-lg font-black">
										{selectedUser.wishlistCount}
									</p>
								</div>
							</div>
						</div>

						<div className="space-y-4 pt-4 border-t border-border">
							<div className="flex justify-between items-center">
								<span className="text-sm font-bold text-muted-foreground">
									Phone Number
								</span>
								<span className="text-sm font-medium">
									{selectedUser.phoneNumber || "Not provided"}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-bold text-muted-foreground">
									Shipping Address
								</span>
								<span className="text-sm font-medium text-right max-w-[220px]">
									{selectedUser.address || "No address provided"}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-bold text-muted-foreground">
									Joined Date
								</span>
								<span className="text-sm font-medium">
									{new Date(selectedUser.createdAt).toDateString()}
								</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm font-bold text-muted-foreground">
									Account Status
								</span>
								<Badge
									variant="outline"
									className={cn(
										"font-bold uppercase text-[10px]",
										selectedUser.isVerified
											? "border-emerald-500/40 text-emerald-400"
											: "border-amber-500/40 text-amber-400",
									)}
								>
									{selectedUser.isVerified ? "Verified" : "Pending Verification"}
								</Badge>
							</div>
						</div>
					</div>
				)}
			</ViewDetailsModal>
		</>
	);
}

