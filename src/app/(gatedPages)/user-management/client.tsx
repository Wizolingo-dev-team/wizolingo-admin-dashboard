"use client";

import UsersList from "@/components/List/UsersList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function UsersClient() {
	return <RouteWrapper middleSlot={<UsersList />} />;
}

