import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/lib/requests/profileManagement";
import { useToast } from "@/hooks/useToast";
import type { ChangePasswordPayload } from "@/types/profileManagement";

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: FormData) => profileService.updateProfile(payload),
		onSuccess: (response) => {
			queryClient.setQueryData(["loggedInAdmin"], response.data);
			queryClient.invalidateQueries({ queryKey: ["loggedInAdmin"] });
			toast.success(response.message || "Profile updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});
};

export const useChangePassword = () => {
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: ChangePasswordPayload) => profileService.changePassword(payload),
		onSuccess: (response) => {
			toast.success(response.message || "Password changed successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to change password");
		},
	});
};

