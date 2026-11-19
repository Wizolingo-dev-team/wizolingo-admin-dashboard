import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/lib/requests/activityManagement";

export const useGetAllActivities = () => {
	return useQuery({
		queryKey: ["activities", "all"],
		queryFn: async () => {
			const response = await activityService.getAllActivities();
			return response.data || [];
		},
	});
};

