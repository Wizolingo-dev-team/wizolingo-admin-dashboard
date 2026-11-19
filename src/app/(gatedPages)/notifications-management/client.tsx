"use client";

import NotificationList from "@/components/List/NotificationList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function NotificationsClient() {
	return <RouteWrapper middleSlot={<NotificationList />} />;
}

