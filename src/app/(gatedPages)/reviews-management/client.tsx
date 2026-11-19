"use client";

import ReviewList from "@/components/List/ReviewList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function ReviewsClient() {
	return <RouteWrapper middleSlot={<ReviewList />} />;
}

