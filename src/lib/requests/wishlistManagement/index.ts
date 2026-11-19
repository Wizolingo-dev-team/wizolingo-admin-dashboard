import { apiClient } from "@/lib/apiClient";
import type { Wishlist, WishlistResponse } from "@/types/wishlistManagement";

const BASE_URL = "/wishlists";

export const wishlistService = {
	getMyWishlist: async () => {
		return apiClient.get<WishlistResponse<Wishlist>>(
			`${BASE_URL}`,
			"Failed to fetch wishlist",
		);
	},
};

