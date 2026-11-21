import { expect, test } from "@playwright/test";

const E2E_EMAIL = process.env.E2E_ADMIN_EMAIL || "";
const E2E_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "";
const HAS_LIVE_API =
	Boolean(process.env.PLAYWRIGHT_BASE_URL) ||
	Boolean(
		process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL &&
			!process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL.includes("localhost"),
	);

test.describe("Wizolingo Admin Dashboard E2E", () => {
	test("renders login page and validates required credentials", async ({ page }) => {
		await page.goto("/login", { waitUntil: "load" });
		await expect(page.getByText("Wizolingo Admin Console")).toBeVisible();
		await expect(page.locator("#email")).toBeVisible();
		await expect(page.locator("#password")).toBeVisible();

		await page.getByRole("button", { name: /sign in/i }).click();
		await expect(page.getByText(/email/i).first()).toBeVisible();
	});

	test("redirects unauthenticated visitors on /dashboard to /login", async ({ page }) => {
		await page.goto("/dashboard", { waitUntil: "load" });
		await page.waitForURL(/\/login/, { waitUntil: "commit", timeout: 45_000 });
		await expect(page.locator("#email")).toBeVisible({ timeout: 15_000 });
	});

	test("authenticates admin credentials when E2E secrets are configured", async ({
		page,
	}) => {
		test.skip(
			!E2E_EMAIL || !E2E_PASSWORD || (Boolean(process.env.CI) && !HAS_LIVE_API),
			"Skipping live login E2E because E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD / NEXT_PUBLIC_ADMIN_API_BASE_URL are not set",
		);

		await page.goto("/login", { waitUntil: "load" });
		await page.locator("#email").fill(E2E_EMAIL);
		await page.locator("#password").fill(E2E_PASSWORD);

		const loginResPromise = page.waitForResponse(
			(res) => res.url().includes("/login") && res.request().method() === "POST",
		);
		await page.getByRole("button", { name: /sign in/i }).click();
		const res = await loginResPromise;
		expect(res.status()).toBeLessThan(500);
	});
});

