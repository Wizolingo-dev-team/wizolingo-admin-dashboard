import type { ApiResponse, CloudinaryAsset, MongoEntity } from "@/types/common";
import type { UserRole } from "@/types/authManagement";

export type User = MongoEntity & {
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
	address: string;
	avatar: CloudinaryAsset;
	role: UserRole;
	isVerified: boolean;
	orderCount: number;
	wishlistCount: number;
	orders?: Array<{
		_id: string;
		amount: number;
		status: string;
		orderType: string;
		createdAt: string;
	}>;
	wishlists?: {
		_id: string;
		products: string[];
	} | null;
};

export type UpdateUserRolePayload = {
	role: UserRole;
};

export type UserResponse<T = unknown> = ApiResponse<T>;

