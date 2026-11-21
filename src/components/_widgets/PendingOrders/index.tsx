import { StatWidget } from "../shared/StatWidget";

export const PendingOrdersWidget = ({ value }: { value: number }) => (
	<StatWidget
		title="Pending Orders"
		value={value.toLocaleString()}
		icon="ph:clock-countdown-bold"
		trend="Queue"
		description="Orders currently in 'Processing' or 'Payment Confirmed' status awaiting fulfillment or digital delivery."
	/>
);
