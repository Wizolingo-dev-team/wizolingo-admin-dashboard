import { StatWidget } from "../shared/StatWidget";

export const ProductsWidget = ({ value }: { value: number }) => (
	<StatWidget
		title="Music & Merch Catalog"
		value={value.toLocaleString()}
		icon="ph:disc-bold"
		trend="Active"
		description="Total published digital tracks, albums, and physical merchandise items currently listed in the store."
	/>
);
