import type { ExtendedBookmarkItem } from "./interfaces";

export {};

declare module "obsidian-typings" {
	export interface BookmarksPluginInstance {
		addItem(item: ExtendedBookmarkItem): void;
		editItem(item: ExtendedBookmarkItem): void;
	}
}
