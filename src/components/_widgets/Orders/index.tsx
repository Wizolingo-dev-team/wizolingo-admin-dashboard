import { StatWidget } from "../shared/StatWidget";

export const OrdersWidget = ({ value }: { value: number }) => (
	<StatWidget
		title="Store & Ticket Orders"
		value={value.toLocaleString()}
		icon="ph:shopping-bag-bold"
		trend="All Time"
		description="Total number of store/merch purchases combined with event ticket reservations placed across the platform."
	/>
);
