import { expect, test, type Page } from "@playwright/test";

const E2E_EMAIL = process.env.E2E_ADMIN_EMAIL || "";
const E2E_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "";

const MAX_CLICK_TO_PAINT_MS = 200; // Google Web Vitals INP "Good" threshold
const MAX_POST_RESPONSE_FEEDBACK_MS = 500; // Immediate UI feedback after API resolves

async function installClickPaintProbe(page: Page) {
	await page.evaluate(() => {
		(window as unknown as { __lastClickPaintMs: number }).__lastClickPaintMs = 0;
		document.addEventListener(
			"click",
			() => {
				const start = performance.now();
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						(
							window as unknown as { __lastClickPaintMs: number }
						).__lastClickPaintMs = performance.now() - start;
					});
				});
			},
			{ capture: true },
		);
	});
}

async function getLastClickPaintMs(page: Page): Promise<number> {
	return page.evaluate(
		() => (window as unknown as { __lastClickPaintMs: number }).__lastClickPaintMs,
	);
}

test.describe("Wizolingo Admin Performance: Click-to-Action Latency & Web Vitals", () => {
	test("login form buttons, password toggle, and validation paint within 200ms INP threshold", async ({
		page,
	}) => {
		await page.goto("/login", { waitUntil: "load" });
		await page.reload({ waitUntil: "load" });
		await installClickPaintProbe(page);

		// 1. Password visibility toggle click-to-paint latency
		const passwordInput = page.locator("#password");
		const toggleBtn = page.getByRole("button", { name: /show password/i });

		await toggleBtn.click();
		await expect(passwordInput).toHaveAttribute("type", "text");
		const toggleLatencyMs = await getLastClickPaintMs(page);
		expect(toggleLatencyMs).toBeLessThan(MAX_CLICK_TO_PAINT_MS);

		// 2. Empty submit -> inline validation feedback within 200ms
		await page.getByRole("button", { name: /sign in/i }).click();
		await expect(page.locator("p.text-destructive").first()).toBeVisible();
		const validationLatencyMs = await getLastClickPaintMs(page);
		expect(validationLatencyMs).toBeLessThan(MAX_CLICK_TO_PAINT_MS);

		// 3. FCP stays under 5000ms on warm load
		const fcpMs = await page.evaluate(() => {
			const paintEntries = performance.getEntriesByType("paint");
			const fcp = paintEntries.find((e) => e.name === "first-contentful-paint");
			return fcp ? fcp.startTime : 0;
		});
		expect(fcpMs).toBeLessThan(5000);
	});

	test("login API response immediately triggers UI feedback without post-response stall", async ({
		page,
	}) => {
		test.skip(
			!E2E_EMAIL || !E2E_PASSWORD,
			"Skipping live login perf test because E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD are not set",
		);

		await page.goto("/login", { waitUntil: "load" });
		await page.locator("#email").fill(E2E_EMAIL);
		await page.locator("#password").fill(E2E_PASSWORD);

		const responsePromise = page.waitForResponse(
			(res) => res.url().includes("/login") && res.request().method() === "POST",
		);

		await page.getByRole("button", { name: /sign in/i }).click();
		await responsePromise;
		const afterResponseTs = await page.evaluate(() => performance.now());

		// Immediately transitions to /verify-login or /dashboard
		await page.waitForURL(/\/(verify-login|dashboard)/, {
			waitUntil: "commit",
			timeout: 15_000,
		});
		const afterRedirectTs = await page.evaluate(() => performance.now());
		expect(afterRedirectTs - afterResponseTs).toBeLessThan(
			MAX_POST_RESPONSE_FEEDBACK_MS,
		);
	});
});

