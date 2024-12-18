import dedent from "dedent";
import i18next from "i18next";
import { type App, PluginSettingTab, Setting, sanitizeHTMLToDom } from "obsidian";
import type { BookmarksChildrenSettings } from "./interfaces";
import type BookmarksChildren from "./main";

export class BookmarksChildrenSettingsTab extends PluginSettingTab {
	plugin: BookmarksChildren;
	settings: BookmarksChildrenSettings;

	constructor(app: App, plugin: BookmarksChildren) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = plugin.settings;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const desc = sanitizeHTMLToDom(dedent`
		<p>${i18next.t("settings.allow")}</p>
			<li>${i18next.t("settings.regex")}</li>
			<li> ${i18next.t("settings.strictness")}</li>
		</p>
		
		<p>${i18next.t("settings.property", { property: "children_bookmarks" })}
			<li> ${i18next.t("settings.property_include")} <u><code><bold>true</bold></code></u></li>
			<li>${i18next.t("settings.property_exclude")} <u><code><bold>false</bold></code></u></li>
		</p>
		`);

		new Setting(containerEl).setHeading().setDesc(desc);
		new Setting(containerEl)
			.setName(i18next.t("settings.mode.name"))
			.setDesc(i18next.t("settings.mode.desc"))
			.addDropdown((dropdown) => {
				dropdown
					.addOption("exclude", i18next.t("settings.exclude"))
					.addOption("include", i18next.t("settings.include"))
					.setValue(this.settings.mode);

				dropdown.onChange(async (value) => {
					if (value === "include") this.settings.mode = "include";
					else this.settings.mode = "exclude";
					await this.plugin.saveSettings();
				});
			})

			.addButton((cb) => {
				cb.setButtonText(i18next.t("settings.newRules")).onClick(async () => {
					this.settings.rules.push("");
					await this.plugin.saveSettings();
					this.display();
				});
			});

		for (const index in this.settings.rules) {
			const path = this.settings.rules[index];
			new Setting(containerEl)
				.addText((text) => {
					text.setValue(path).onChange(async (value) => {
						this.settings.rules[index] = value;
						await this.plugin.saveSettings();
					});
					text.inputEl.style.width = "100%";
				})

				.addExtraButton((cb) => {
					cb.setIcon("trash")
						.setTooltip(i18next.t("settings.delete"))
						.onClick(async () => {
							const index = this.settings.rules.indexOf(path);
							this.settings.rules.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						});
				}).infoEl.style.display = "none";
		}
	}
}
