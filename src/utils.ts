import type { ExtendedBookmarkItem } from "./interfaces";

export function addOrUpdateBookmark(
	bookmarks: ExtendedBookmarkItem[],
	fullPath: string,
	rootPath?: string
): ExtendedBookmarkItem[] {
	const parts = rootPath
		? fullPath.replace(`${rootPath}/`, "").split("/")
		: fullPath.split("/"); // Divise le chemin en parties
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
export function createFromPaths(folders: string[], root?: string) {
	let res: ExtendedBookmarkItem[] = [];
	for (const folder of folders) {
		res = addOrUpdateBookmark(res, folder, root);
	}
	return res;
}
