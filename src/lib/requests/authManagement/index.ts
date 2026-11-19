import { apiClient } from "@/lib/apiClient";
import type {
	AdminLoginPayload,
	AdminUser,
	AuthResponse,
	ResendOtpPayload,
	VerifyAdminPayload,
	VerifyLoginResponse,
} from "@/types/authManagement";

const BASE_URL = "/users";

export const authService = {
	loginAdmin: async (payload: AdminLoginPayload) => {
		return apiClient.post<AuthResponse>(
			`${BASE_URL}/admin/login`,
			payload,
			"Failed to initiate admin login",
		);
	},

	verifyAdminLogin: async (payload: VerifyAdminPayload) => {
		return apiClient.post<VerifyLoginResponse>(
			`${BASE_URL}/admin/verify-login`,
			payload,
			"Failed to verify admin login OTP",
		);
	},

	resendAdminOtp: async (payload: ResendOtpPayload) => {
		return apiClient.post<AuthResponse>(
			`${BASE_URL}/admin/resend-otp`,
			payload,
			"Failed to resend admin OTP",
		);
	},

	getLoggedInAdmin: async () => {
		return apiClient.get<AuthResponse<AdminUser>>(
			`${BASE_URL}/get-logged-in-user`,
			"Failed to fetch admin user session",
		);
	},
};

