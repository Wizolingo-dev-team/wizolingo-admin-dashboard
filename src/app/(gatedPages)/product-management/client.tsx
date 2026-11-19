"use client";

import ProductList from "@/components/List/ProductList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function ProductClient() {
	return <RouteWrapper middleSlot={<ProductList />} />;
}

