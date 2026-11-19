"use client";

import OrderList from "@/components/List/OrderList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function OrdersClient() {
	return <RouteWrapper middleSlot={<OrderList />} />;
}

