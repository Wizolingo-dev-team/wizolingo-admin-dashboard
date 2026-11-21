import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/lib/requests/authManagement";
import { useRouter } from "next/navigation";
import { setAuthToken, clearAuth, getAuthToken } from "@/utils/auth";
import { useToast } from "@/hooks/useToast";
import type {
	AdminLoginPayload,
	VerifyAdminPayload,
	ResendOtpPayload,
} from "@/types/authManagement";

export const useAdminLogin = () => {
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: AdminLoginPayload) => authService.loginAdmin(payload),
		onSuccess: (data) => {
			toast.success(data.message || "Admin OTP sent to your email.");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Login failed.");
		},
	});
};

export const useVerifyAdminLogin = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: VerifyAdminPayload) => authService.verifyAdminLogin(payload),
		onSuccess: (response) => {
			if (response.data) {
				setAuthToken(response.data);
				queryClient.invalidateQueries({ queryKey: ["loggedInAdmin"] });
				toast.success(response.message || "Welcome Admin!");
				router.push("/dashboard");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message || "Verification failed.");
		},
	});
};

export const useResendAdminOtp = () => {
	const toast = useToast();

	return useMutation({
		mutationFn: (payload: ResendOtpPayload) => authService.resendAdminOtp(payload),
		onSuccess: (data) => {
			toast.success(data.message || "New OTP sent successfully.");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to resend OTP.");
		},
	});
};

export const useLogoutAdmin = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const toast = useToast();

	return () => {
		clearAuth();
		queryClient.removeQueries({ queryKey: ["loggedInAdmin"] });
		toast.success("Logged out successfully");
		router.push("/login");
	};
};

export const useGetLoggedInAdmin = () => {
	return useQuery({
		queryKey: ["loggedInAdmin"],
		queryFn: async () => {
			const token = await getAuthToken();
			if (!token) return null;
			const response = await authService.getLoggedInAdmin();
			return response.data;
		},
		retry: 1,
	});
};

