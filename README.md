# Bookmarks children

The plugin allows to quickly bookmarks the children of a folder.

Folder will be created in group recursively, removing the "parent" of the folder.

For example, adding `folder1/folder2/file.md` :
- By clicking and adding from folder1, all the structure will be recreated in the bookmarks.
- By clicking on `folder2`, only folder2 will be created in the bookmarks.

By default, the bookmarks will be added in the root, and it won't change.
Also, the order of the structure don't be saved if you readd the same folder.

Bookmarks api is a mess to deal with, so feel free to improve!

### 📝 Usage
Right click in a folder in the file explorer, and click on `Bookmarks children`.

## 📥 Installation

- [ ] From Obsidian's community plugins
- [x] Using BRAT with `https://github.com/Mara-Li/obsidian-children-bookmark`
- [x] From the release page: 
    - Download the latest release
    - Unzip `bookmarks-children.zip` in `.obsidian/plugins/` path
    - In Obsidian settings, reload the plugin
    - Enable the plugin


### 🎼 Languages

- [x] English
- [x] French

To add a translation:
1. Fork the repository
2. Add the translation in the `src/i18n/locales` folder with the name of the language (ex: `fr.json`). 
    - You can get your locale language from Obsidian using [obsidian translation](https://github.com/obsidianmd/obsidian-translations) or using the commands (in templater for example) : `<% tp.obsidian.moment.locale() %>`
    - Copy the content of the [`en.json`](./src/i18n/locales/en.json) file in the new file
    - Translate the content
3. Edit `i18n/i18next.ts` :
    - Add `import * as <lang> from "./locales/<lang>.json";`
    - Edit the `ressource` part with adding : `<lang> : {translation: <lang>}`

