import { TFile } from "obsidian";
import type { ExtendedBookmarkItem } from "./interfaces";
import type BookmarksChildren from "./main";

function createRoot(fullPath: string, rootPath?: string) {
	if (rootPath) return fullPath.replace(`${rootPath}/`, "");
	return fullPath;
}

export function addOrUpdateBookmark(
	bookmarks: ExtendedBookmarkItem[],
	fullPath: string,
	rootPath?: string
): ExtendedBookmarkItem[] {
	const parts = createRoot(fullPath, rootPath).split("/"); // Divise le chemin en parties
	const currentLevel = [...bookmarks]; // Crée une copie pour éviter de modifier directement l'original
	let pointer = currentLevel;

	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		const isFile = i === parts.length - 1; // Dernière partie = fichier

		const title = isFile ? part.replace(/\.md$/, "") : part;

		// Cherche l'élément existant
		let existingItem = pointer.find(
			(item) => item.title === title && item.type === (isFile ? "file" : "group")
		);

		if (!existingItem) {
			// Si l'élément n'existe pas, on le crée
			if (isFile)
				existingItem = {
					title: title,
					type: "file",
					path: fullPath,
				};
			else {
				existingItem = {
					title: title,
					type: "group",
					items: [],
				};
			}
			pointer.push(existingItem);
		}

		// Passe au niveau suivant si ce n'est pas un fichier
		if (!isFile) {
			existingItem.items = existingItem.items || [];
			pointer = existingItem.items;
		}
	}

	return currentLevel; // Retourne la liste modifiée
}

function testPaths(rules: string[], path: string) {
	for (const rule of rules) {
		try {
			const regex = new RegExp(rule);
			if (regex.exec(path)) return true;
		} catch (e) {
			console.error(e);
			if (path.includes(rule)) return true;
		}
	}
	return false;
}

export function createFromPaths(
	files: string[],
	root?: string,
	plugin?: BookmarksChildren
) {
	let res: ExtendedBookmarkItem[] = [];
	for (const file of files) {
		if (!plugin) res = addOrUpdateBookmark(res, file, root);
		else {
			const settings = plugin.settings;
			const mode = settings.mode;
			const rules = settings.rules.filter((x) => x.length > 0);
			//remove duplicate
			const uniqueRules = [...new Set(rules)];
			const fileAsTFile = plugin.app.vault.getAbstractFileByPath(file);
			if (!fileAsTFile || !(fileAsTFile instanceof TFile)) continue;
			const frontmatter = plugin.app.metadataCache.getFileCache(fileAsTFile)?.frontmatter;
			if (
				mode === "include" &&
				(testPaths(uniqueRules, file) || frontmatter?.children_bookmarks)
			) {
				//read frontmatter and search for "children_bookmarks" property
				res = addOrUpdateBookmark(res, file, root);
			} else if (
				(mode === "exclude" && !testPaths(settings.rules, file)) ||
				frontmatter?.children_bookmarks !== false
			) {
				res = addOrUpdateBookmark(res, file, root);
			}
		}
	}
	return res;
}
