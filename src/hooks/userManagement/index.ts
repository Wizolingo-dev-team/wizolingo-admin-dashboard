import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userManagementService } from "@/lib/requests/userManagement";
import { useToast } from "@/hooks/useToast";
import type { UpdateUserRolePayload } from "@/types/userManagement";

export const useGetAllUsers = () => {
	return useQuery({
		queryKey: ["allUsers"],
		queryFn: async () => {
			const response = await userManagementService.getAllUsers();
			return response.data || [];
		},
		retry: 1,
	});
};

export const useUpdateUserRole = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRolePayload }) =>
			userManagementService.updateUserRole(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["allUsers"] });
			toast.success(data.message || "User role updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update user role");
		},
	});
};

