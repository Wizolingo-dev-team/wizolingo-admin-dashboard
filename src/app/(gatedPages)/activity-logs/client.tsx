"use client";

import ActivityList from "@/components/List/ActivityList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function ActivityClient() {
	return <RouteWrapper middleSlot={<ActivityList />} />;
}

