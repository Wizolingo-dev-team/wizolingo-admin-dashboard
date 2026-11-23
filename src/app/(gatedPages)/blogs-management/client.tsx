"use client";

import BlogList from "@/components/List/BlogList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function BlogsClient() {
	return <RouteWrapper middleSlot={<BlogList />} />;
}

