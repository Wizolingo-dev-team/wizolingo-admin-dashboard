import { StatWidget } from "../shared/StatWidget";

export const ProductsWidget = ({ value }: { value: number }) => (
	<StatWidget
		title="Music & Merch Catalog"
		value={value.toLocaleString()}
		icon="ph:disc-bold"
		trend="Active"
	/>
);

