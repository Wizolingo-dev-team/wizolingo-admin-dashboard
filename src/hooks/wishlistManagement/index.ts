import { useQuery } from "@tanstack/react-query";
import { userManagementService } from "@/lib/requests/userManagement";
import { productService } from "@/lib/requests/productManagement";
import type { Wishlist } from "@/types/wishlistManagement";
import type { Product } from "@/types/productManagement";

/**
 * Aggregates customer wishlists from `/users/admin/all-users` (which populates `wishlists`)
 * and enriches product IDs with product details from `/products/admin/all-products`.
 */
export const useGetAllWishlists = () => {
	return useQuery({
		queryKey: ["adminWishlists"],
		queryFn: async (): Promise<Wishlist[]> => {
			const [usersRes, productsRes] = await Promise.all([
				userManagementService.getAllUsers(),
				productService.getAllProducts(),
			]);

			const users = usersRes.data || [];
			const products = productsRes.data || [];
			const productMap = new Map<string, Product>(products.map((p) => [p._id, p]));

			const wishlists: Wishlist[] = [];
			for (const u of users) {
				const rawProducts = u.wishlists?.products || [];
				if (rawProducts.length > 0) {
					const enrichedProducts = rawProducts
						.map((p: any) =>
							typeof p === "string" ? productMap.get(p) : (p as Product),
						)
						.filter(Boolean) as Product[];

					if (enrichedProducts.length > 0) {
						wishlists.push({
							_id: u.wishlists?._id || `wl_${u._id}`,
							createdAt: u.createdAt,
							updatedAt: u.updatedAt,
							user: {
								_id: u._id,
								firstName: u.firstName,
								lastName: u.lastName,
								email: u.email,
								avatar: u.avatar,
							},
							products: enrichedProducts,
						});
					}
				}
			}

			return wishlists;
		},
	});
};

