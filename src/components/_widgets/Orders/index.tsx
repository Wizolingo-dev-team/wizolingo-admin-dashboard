import { StatWidget } from "../shared/StatWidget";

export const OrdersWidget = ({ value }: { value: number }) => (
	<StatWidget
		title="Store & Ticket Orders"
		value={value.toLocaleString()}
		icon="ph:shopping-bag-bold"
		trend="All Time"
	/>
);

