"use client";

import CategoryList from "@/components/List/CategoryList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function CategoryClient() {
	return <RouteWrapper middleSlot={<CategoryList />} />;
}

