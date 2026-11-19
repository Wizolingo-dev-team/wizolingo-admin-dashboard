"use client";

import { getSession } from "next-auth/react";

export const AUTH_TOKEN_KEY = "token";

export async function getAuthToken(): Promise<string | null> {
	if (typeof window !== "undefined") {
		const localToken = localStorage.getItem(AUTH_TOKEN_KEY);
		if (localToken) return localToken;
	}

	try {
		const session = await getSession();
		if (session?.user && "backendToken" in session.user) {
			return (session.user as { backendToken?: string }).backendToken ?? null;
		}
	} catch {
		// Fallback to localStorage only
	}

	return null;
}

export function setAuthToken(token: string) {
	if (typeof window !== "undefined") {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
	}
}

export function clearAuth() {
	if (typeof window !== "undefined") {
		localStorage.removeItem(AUTH_TOKEN_KEY);
	}
}

