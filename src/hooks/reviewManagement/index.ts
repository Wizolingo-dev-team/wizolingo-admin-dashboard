import { useQuery } from "@tanstack/react-query";
import { reviewAdminService } from "@/lib/requests/reviewManagement";

export const useGetAllAdminReviews = () => {
	return useQuery({
		queryKey: ["admin", "reviews", "all"],
		queryFn: async () => {
			const response = await reviewAdminService.getAllReviews();
			return {
				reviews: response.data || [],
				count: response.count || (response.data ? response.data.length : 0),
			};
		},
	});
};

