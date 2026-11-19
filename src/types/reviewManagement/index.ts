import type { ApiResponse, CloudinaryAsset, MongoEntity } from "@/types/common";
import type { ProductType } from "@/types/productManagement";

export type ReviewAdmin = MongoEntity & {
	user: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
		avatar?: CloudinaryAsset;
	};
	product: {
		_id: string;
		productName: string;
		productType: ProductType;
		attachments: string[];
		price: number;
	};
	review: string;
	rating: number;
};

export type ReviewAdminResponse<T = unknown> = ApiResponse<T>;

