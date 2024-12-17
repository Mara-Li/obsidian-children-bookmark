import { expect, it } from "bun:test";
import type { ExtendedBookmarkItem } from "../src/interfaces";
import { addOrUpdateBookmark, createFromPaths } from "../src/utils";

const existingBookmarks: ExtendedBookmarkItem[] = [
	{
		path: "Welcome.md",
		type: "file",
		title: "Welcome",
	},
	{
		title: "folder",
		type: "group",
		items: [],
	},
];

it("should add a bookmark", () => {
	let res = addOrUpdateBookmark(existingBookmarks, "folder/subfolder/note1.md");
	res = addOrUpdateBookmark(res, "newFolder/note2.md");
	expect(res).toEqual([
		{
			path: "Welcome.md",
			type: "file",
			title: "Welcome",
		},
		{
			title: "folder",
			type: "group",
			items: [
				{
					title: "subfolder",
					type: "group",
					items: [
						{
							title: "note1",
							type: "file",
							path: "folder/subfolder/note1.md",
						},
					],
				},
			],
		},
		{
			title: "newFolder",
			type: "group",
			items: [
				{
					title: "note2",
					type: "file",
					path: "newFolder/note2.md",
				},
			],
		},
	]);
});

it("should add from a list of paths", () => {
	const paths = ["folder1/note1.md", "folder2/note2.md"];
	const res = createFromPaths(paths);
	console.log(JSON.stringify(res, null, 2));
	expect(res).toEqual([
		{
			title: "folder1",
			type: "group",
			items: [
				{
					title: "note1",
					type: "file",
					path: "folder1/note1.md",
				},
			],
		},
		{
			title: "folder2",
			type: "group",
			items: [
				{
					title: "note2",
					type: "file",
					path: "folder2/note2.md",
				},
			],
		},
	]);
});

it("should add the existing bookmarks", () => {
	const paths = ["folder1/note1.md", "folder2/note2.md"];
	const res = createFromPaths(paths);
	const newBooksmarks = existingBookmarks.concat(res);
	expect(newBooksmarks).toEqual([
		{
			path: "Welcome.md",
			type: "file",
			title: "Welcome",
		},
		{
			title: "folder",
			type: "group",
			items: [
				{
					title: "subfolder",
					type: "group",
					items: [
						{
							title: "note1",
							type: "file",
							path: "folder/subfolder/note1.md",
						},
					],
				},
			],
		},
		{
			title: "folder1",
			type: "group",
			items: [
				{
					title: "note1",
					type: "file",
					path: "folder1/note1.md",
				},
			],
		},
		{
			title: "folder2",
			type: "group",
			items: [
				{
					title: "note2",
					type: "file",
					path: "folder2/note2.md",
				},
			],
		},
	]);
});
