"use client";

import BookingList from "@/components/List/BookingList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function BookingsClient() {
	return <RouteWrapper middleSlot={<BookingList />} />;
}

