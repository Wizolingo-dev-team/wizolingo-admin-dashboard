import type { ApiResponse, CloudinaryAsset, MongoEntity } from "@/types/common";
import type { Product } from "@/types/productManagement";

export type Wishlist = MongoEntity & {
	user: {
		_id: string;
		firstName: string;
		lastName: string;
		email: string;
		avatar?: CloudinaryAsset;
	};
	products: Product[];
};

export type WishlistResponse<T = unknown> = ApiResponse<T>;

