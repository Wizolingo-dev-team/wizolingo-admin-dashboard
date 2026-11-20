import * as yup from "yup";

export const updateProfileSchema = yup.object({
	firstName: yup
		.string()
		.trim()
		.required("First name is required")
		.min(2, "First name must be at least 2 characters")
		.max(32, "First name cannot exceed 32 characters"),
	lastName: yup
		.string()
		.trim()
		.required("Last name is required")
		.min(2, "Last name must be at least 2 characters")
		.max(32, "Last name cannot exceed 32 characters"),
	phoneNumber: yup.string().trim().optional().default(""),
	address: yup.string().trim().optional().default(""),
	avatar: yup.mixed().optional(),
});

export const changePasswordSchema = yup.object({
	currentPassword: yup
		.string()
		.required("Current password is required")
		.min(6, "Password must be at least 6 characters"),
	newPassword: yup
		.string()
		.required("New password is required")
		.min(6, "New password must be at least 6 characters")
		.max(64, "New password cannot exceed 64 characters"),
	confirmPassword: yup
		.string()
		.required("Please confirm your new password")
		.oneOf([yup.ref("newPassword")], "Passwords do not match"),
});
