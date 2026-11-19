import type { ApiResponse, MongoEntity } from "@/types/common";

export type NotificationType =
	| "order"
	| "download"
	| "event"
	| "newsletter"
	| "auth"
	| "system";

export type NotificationUserSummary = {
	_id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
};

export type Notification = MongoEntity & {
	user: string | NotificationUserSummary;
	title: string;
	description: string;
	type: NotificationType;
	onClick: string;
	read: boolean;
};

export type BroadcastNotificationPayload = {
	userId?: string;
	title: string;
	description: string;
	type?: NotificationType;
	onClick?: string;
};

export type NotificationResponse<T = unknown> = ApiResponse<T>;

