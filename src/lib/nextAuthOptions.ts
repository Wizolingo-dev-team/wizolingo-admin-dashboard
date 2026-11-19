import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import env from "@src/env";

export const nextAuthOptions: NextAuthConfig = {
	secret: env.NEXTAUTH_SECRET,
	session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
				otp: { label: "OTP", type: "text" },
				isOtpFlow: { label: "isOtpFlow", type: "text" },
			},
			async authorize(credentials) {
				try {
					let data;

					if (
						credentials?.isOtpFlow === "true" &&
						credentials?.otp &&
						credentials?.email
					) {
						const response = await axios.post(
							`${env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/users/admin/verify-login`,
							{ email: credentials.email, otp: credentials.otp },
						);
						data = response.data;
					} else if (credentials?.email && credentials?.password) {
						const response = await axios.post(
							`${env.NEXT_PUBLIC_ADMIN_API_BASE_URL}/users/admin/login`,
							{ email: credentials.email, password: credentials.password },
						);
						data = response.data;
					} else {
						throw new Error("Missing credentials");
					}

					if (!data.success) throw new Error(data.message || "Login failed");

					const token = data.data || data.token;
					if (!token || typeof token !== "string") {
						return null;
					}

					return {
						id: String(credentials.email),
						email: String(credentials.email),
						role: "admin",
						backendToken: token,
					};
				} catch (error: any) {
					console.error("Auth Error:", error?.response?.data || error.message);
					return null;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.backendToken = (user as any).backendToken;
				token.role = (user as any).role;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = {
				...session.user,
				role: token.role as string,
				backendToken: token.backendToken as string,
			} as any;
			return session;
		},
	},
	pages: { signIn: "/login" },
};

