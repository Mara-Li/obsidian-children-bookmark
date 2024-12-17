import type { BookmarkItem as BaseBookmarkItem } from "obsidian-typings";

export interface SyncBookmarkSettings {
	folders: string[];
}

export const DEFAULT_SETTINGS: SyncBookmarkSettings = {
	folders: [],
};

export interface ExtendedBookmarkItem
	extends Omit<BaseBookmarkItem, "type" | "items" | "query" | "subpath"> {
	type: BaseBookmarkItem["type"] | "group"; // Fusion de l'ancien type + "group"
	query?: string;
	subpath?: string;
	ctime?: number;
	path?: string;
	items?: ExtendedBookmarkItem[]; // Support récursif
}
