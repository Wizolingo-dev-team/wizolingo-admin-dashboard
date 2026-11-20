import * as yup from "yup";

export const adminLoginSchema = yup.object({
	email: yup
		.string()
		.trim()
		.lowercase()
		.email("Please enter a valid email address")
		.required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(6, "Password must be at least 6 characters"),
});

export const verifyAdminSchema = yup.object({
	email: yup
		.string()
		.trim()
		.lowercase()
		.email("Invalid email format")
		.required("Email is required"),
	otp: yup
		.string()
		.trim()
		.required("OTP Code is required")
		.matches(/^[0-9]+$/, "Must be only digits")
		.min(6, "OTP must be exactly 6 digits")
		.max(6, "OTP must be exactly 6 digits"),
});

export const resendOtpSchema = yup.object({
	email: yup
		.string()
		.trim()
		.lowercase()
		.email("Invalid email format")
		.required("Email is required"),
});

export const updateUserRoleSchema = yup.object({
	role: yup
		.string()
		.oneOf(["user", "admin"], "Role must be user or admin")
		.required("Role is required"),
});
