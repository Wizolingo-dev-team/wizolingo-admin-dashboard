import { ReactNode } from "react";

export type ColumnType =
	| "text"
	| "image"
	| "date"
	| "status"
	| "currency"
	| "action"
	| "truncate"
	| "custom"
	| "select";

export type BaseColumnSchema<T> = {
	key: keyof T | string;
	header: string | ReactNode;
	type?: ColumnType;
	render?: (row: T) => ReactNode;
};

