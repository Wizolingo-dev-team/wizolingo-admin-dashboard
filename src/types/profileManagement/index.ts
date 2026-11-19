import type { ApiResponse } from "@/types/common";
import type { AdminUser } from "@/types/authManagement";

export type UpdateProfilePayload = FormData;

export type ChangePasswordPayload = {
	currentPassword: string;
	newPassword: string;
};

export type UpdateProfileResponse = ApiResponse<AdminUser>;
export type ChangePasswordResponse = ApiResponse;

