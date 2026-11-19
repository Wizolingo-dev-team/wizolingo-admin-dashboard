import type { ApiResponse, CloudinaryAsset, MongoEntity } from "@/types/common";

export type UserRole = "user" | "admin";

export type AdminLoginPayload = {
	email: string;
	password: string;
};

export type VerifyAdminPayload = {
	email: string;
	otp: string;
};

export type ResendOtpPayload = {
	email: string;
};

export type AdminUser = MongoEntity & {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	avatar: CloudinaryAsset;
	role: UserRole;
	isVerified: boolean;
	orders?: Array<{ _id: string; status: string; amount: number; createdAt: string }>;
	wishlists?: { _id: string; products: string[] } | null;
};

export type AuthResponse<T = unknown> = ApiResponse<T>;

export type VerifyLoginResponse = {
	success: boolean;
	message: string;
	data: string; // Admin JWT token
};

