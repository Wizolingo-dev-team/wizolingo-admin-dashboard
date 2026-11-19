import * as yup from "yup";

export const updateProfileSchema = yup.object({
	firstName: yup
		.string()
		.required("First name is required")
		.min(2, "First name must be at least 2 characters"),
	lastName: yup
		.string()
		.required("Last name is required")
		.min(2, "Last name must be at least 2 characters"),
	phoneNumber: yup.string().optional().default(""),
	address: yup.string().optional().default(""),
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
		.min(6, "New password must be at least 6 characters"),
	confirmPassword: yup
		.string()
		.required("Please confirm your new password")
		.oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

