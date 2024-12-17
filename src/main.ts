import i18next from "i18next";
import { Notice, Plugin, TFolder } from "obsidian";
import type { BookmarksPluginInstance } from "obsidian-typings";
import { resources, translationLanguage } from "./i18n";
import { DEFAULT_SETTINGS, type SyncBookmarkSettings } from "./interfaces";
import { createFromPaths } from "./utils";

export default class SyncBookmark extends Plugin {
	settings!: SyncBookmarkSettings;
	bookmarkInstance: BookmarksPluginInstance | undefined = undefined;

	getItems(folder: TFolder) {
		const filePaths: string[] = [];
		for (const file of folder.children) {
			if (file instanceof TFolder) {
				filePaths.push(...this.getItems(file));
			} else {
				filePaths.push(file.path);
			}
		}
		console.log(filePaths);
		return filePaths;
	}

	createBookMarks(folder: TFolder) {
		if (!this.bookmarkInstance) return;
		const root = folder.parent?.path === "/" ? undefined : folder.parent?.path;
		const filePaths = this.getItems(folder);
		const newBookmarks = createFromPaths(filePaths, root);
		for (const bookmark of newBookmarks) {
			const existing = this.bookmarkInstance
				.getBookmarks()
				.find((x) => x.title === bookmark.title);
			if (existing) {
				this.bookmarkInstance.removeItem(existing);
				this.bookmarkInstance.addItem(bookmark);
			} else this.bookmarkInstance.addItem(bookmark);
		}
	}

	async onload() {
		console.log(`[${this.manifest.name}] Loaded`);
		await this.loadSettings();
		//load i18next
		await i18next.init({
			lng: translationLanguage,
			fallbackLng: "en",
			resources,
			returnNull: false,
			returnEmptyString: false,
		});

		if (!this.app.internalPlugins.plugins.bookmarks.instance.plugin.enabled)
			new Notice(i18next.t("error.bookmarkPluginNotEnabled"));
		else this.bookmarkInstance = this.app.internalPlugins.plugins.bookmarks.instance;

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (file instanceof TFolder) {
					menu.addItem((item) => {
						item
							.setTitle(i18next.t("menu.add"))
							.setIcon("bookmark")
							.onClick(() => {
								console.log("Add bookmark");
								this.createBookMarks(file);
							});
					});
				}
			})
		);
	}

	onunload() {
		console.log(`[${this.manifest.name}] Unloaded`);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
