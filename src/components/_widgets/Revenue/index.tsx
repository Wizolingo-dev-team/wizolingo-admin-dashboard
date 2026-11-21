import { StatWidget } from "../shared/StatWidget";

export const RevenueWidget = ({ value }: { value: number }) => (
	<StatWidget
		title="Total Revenue"
		value={`$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
		icon="ph:currency-dollar-bold"
		trend="Live"
		description="Combined gross revenue from all non-cancelled store/merch orders and confirmed event ticket sales."
	/>
);
