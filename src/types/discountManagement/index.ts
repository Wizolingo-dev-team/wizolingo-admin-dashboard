import type { ApiResponse, MongoEntity } from "@/types/common";
import type { Product } from "@/types/productManagement";

export type Discount = MongoEntity & {
	discountCode: string;
	discountPercentage: number;
	products: Array<string | Pick<Product, "_id" | "productName" | "price" | "productType" | "attachments">>;
	expiryDate: string;
	isActive: boolean;
};

export type CreateDiscountPayload = {
	discountCode: string;
	discountPercentage: number;
	products: string[];
	expiryDate: string;
	isActive?: boolean;
};

export type UpdateDiscountPayload = Partial<CreateDiscountPayload>;

export type DiscountResponse<T = unknown> = ApiResponse<T>;

