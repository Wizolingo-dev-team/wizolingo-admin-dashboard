"use client";

import EventList from "@/components/List/EventList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function EventsClient() {
	return <RouteWrapper middleSlot={<EventList />} />;
}

