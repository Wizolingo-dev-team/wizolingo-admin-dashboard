import type { ApiResponse, MongoEntity } from "@/types/common";
import type { Category } from "@/types/categoryManagement";
import type { Discount } from "@/types/discountManagement";

export type ProductType = "merch" | "digital_music";

export type DigitalReleaseType =
	| "single"
	| "album"
	| "ep"
	| "instrumental"
	| "stem_pack"
	| "";

export type DigitalFileFormat = "mp3" | "wav" | "flac" | "aac" | "zip" | "pdf";

export type DigitalFile = {
	_id?: string;
	fileName: string;
	fileUrl?: string;
	publicId?: string;
	fileFormat: DigitalFileFormat;
	fileSize: number;
};

export type TracklistItem = {
	trackNumber: number;
	title: string;
	duration: string;
	featuredArtists: string;
};

export type Product = MongoEntity & {
	productName: string;
	slug: string;
	productType: ProductType;
	description: string;
	price: number;
	categories: Category[];
	subcategoryId?: string | null;
	discounts?: Discount | null;
	// Merch fields
	quantity: number;
	color: string[];
	size: string[];
	shipping: boolean;
	// Digital music fields
	digitalReleaseType: DigitalReleaseType;
	artist: string;
	releaseDate?: string;
	duration: string;
	previewUrl: string;
	digitalFiles: DigitalFile[];
	tracklist: TracklistItem[];
	downloadCount: number;
	// Shared metadata
	sold: number;
	attachments: string[];
	isFeatured: boolean;
	isActive: boolean;
};

export type GetAllProductsParams = {
	productType?: ProductType;
};

export type ProductResponse<T = unknown> = ApiResponse<T>;

