"use client";

import DiscountList from "@/components/List/DiscountList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function DiscountClient() {
	return <RouteWrapper middleSlot={<DiscountList />} />;
}

