import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(cleanup);

function ResizeObserverStub() {
	const noop = () => {};
	return { observe: noop, unobserve: noop, disconnect: noop };
}

globalThis.ResizeObserver ??=
	ResizeObserverStub as unknown as typeof ResizeObserver;

if (typeof window !== "undefined" && !window.matchMedia) {
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}

