"use client";

import NewsletterList from "@/components/List/NewsletterList";
import RouteWrapper from "@/layouts/RouteWrapper";

export default function NewsletterClient() {
	return <RouteWrapper middleSlot={<NewsletterList />} />;
}

