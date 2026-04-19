import * as vscode from 'vscode';
import * as constants from './constants';
import { extensionConfiguration, readExtensionConfiguration, StatusBarQuotesConfiguration } from './extensionConfiguration';
import { supportedCategories, supportedLanguages } from './models/categoryRegistry';
import Quoter from './models/quoter';

class StatusBarQuoteController implements vscode.Disposable {
	private readonly statusBarItem: vscode.StatusBarItem;
	private readonly statusBarItemForShuffle: vscode.StatusBarItem;
	private readonly quoter: Quoter;
	private readonly disposables: vscode.Disposable[] = [];
	private configuration: StatusBarQuotesConfiguration;

	constructor(initialConfiguration: StatusBarQuotesConfiguration = readExtensionConfiguration()) {
		this.configuration = initialConfiguration;
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
		this.statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
		this.statusBarItem.show();

		this.statusBarItemForShuffle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
		this.statusBarItemForShuffle.text = '$(search-refresh)';
		this.statusBarItemForShuffle.tooltip = 'Click to see new quotes';
		this.statusBarItemForShuffle.command = constants.CMD_SHUFFLE_QUOTES;
		this.setShuffleButtonVisible(initialConfiguration.displayShuffleButton);

		this.quoter = new Quoter(
			initialConfiguration.category,
			initialConfiguration.language,
			initialConfiguration.displaySeconds,
		);

		this.disposables.push(
			this.statusBarItem,
			this.statusBarItemForShuffle,
			this.quoter,
			this.quoter.onTimeChanged(() => this.renderQuote()),
			...this.registerCommands(),
			vscode.workspace.onDidChangeConfiguration(event => this.onConfigurationChanged(event)),
		);

		this.renderQuote();
		this.quoter.start();
	}

	public dispose(): void {
		while (this.disposables.length > 0) {
			this.disposables.pop()?.dispose();
		}
	}

	private registerCommands(): vscode.Disposable[] {
		return [
			vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
				vscode.window.showInformationMessage(this.quoter.quoteModalText);
			}),
			vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, async () => {
				const category = await vscode.window.showQuickPick([...supportedCategories], { placeHolder: 'Select category' });
				if (!category) { return; }

				await extensionConfiguration().update('category', category, true);
				this.applyCategory(category);
			}),
			vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, async () => {
				const language = await vscode.window.showQuickPick([...supportedLanguages], { placeHolder: 'Select Language' });
				if (!language) { return; }

				await extensionConfiguration().update('language', language, true);
				this.applyLanguage(language);
			}),
			vscode.commands.registerCommand(constants.CMD_CHANGE_DISPLAY_SECONDS, async () => {
				const displaySeconds = await vscode.window.showInputBox({
					prompt: 'Quote change time interval (seconds)',
					placeHolder: `Range : 0 (do not change quote) ~ ${constants.MAXIMUM_DISPLAY_SECONDS} (${constants.MAXIMUM_DISPLAY_SECONDS_HUMANIZE})`,
				});
				const parsedDisplaySeconds = this.parseDisplaySeconds(displaySeconds);
				if (parsedDisplaySeconds === undefined) {
					vscode.window.showWarningMessage(`You can only enter number between 0 and ${constants.MAXIMUM_DISPLAY_SECONDS}`);
					return;
				}

				await extensionConfiguration().update('display-seconds', parsedDisplaySeconds, true);
				this.applyDisplaySeconds(parsedDisplaySeconds);
			}),
			vscode.commands.registerCommand(constants.CMD_SHUFFLE_QUOTES, async () => {
				this.quoter.initElapsedSeconds();
				this.quoter.displayRandomQuote();
			}),
		];
	}

	private parseDisplaySeconds(displaySeconds: string | undefined): number | undefined {
		if (!displaySeconds) {
			return undefined;
		}

		const parsedDisplaySeconds = Number.parseInt(displaySeconds, 10);
		if (Number.isNaN(parsedDisplaySeconds)) {
			return undefined;
		}

		return Math.min(parsedDisplaySeconds, constants.MAXIMUM_DISPLAY_SECONDS);
	}

	private onConfigurationChanged(event: vscode.ConfigurationChangeEvent): void {
		const nextConfiguration = readExtensionConfiguration();

		if (event.affectsConfiguration(constants.SETTING_CATEGORY)) {
			this.applyCategory(nextConfiguration.category);
		}
		if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
			this.applyLanguage(nextConfiguration.language);
		}
		if (event.affectsConfiguration(constants.SETTING_DISPLAY_SECONDS)) {
			this.applyDisplaySeconds(nextConfiguration.displaySeconds);
		}
		if (event.affectsConfiguration(constants.SETTING_DISPLAY_SHUFFLE_BUTTON)) {
			this.applyShuffleButtonVisible(nextConfiguration.displayShuffleButton);
		}
	}

	private applyCategory(category: string): void {
		if (this.configuration.category === category) {
			return;
		}

		this.configuration = { ...this.configuration, category };
		this.quoter.setCategory(category);
	}

	private applyLanguage(language: string): void {
		if (this.configuration.language === language) {
			return;
		}

		this.configuration = { ...this.configuration, language };
		this.quoter.setLanguage(language);
	}

	private applyDisplaySeconds(displaySeconds: number): void {
		if (this.configuration.displaySeconds === displaySeconds) {
			return;
		}

		this.configuration = { ...this.configuration, displaySeconds };
		this.quoter.setDisplaySeconds(displaySeconds);
	}

	private applyShuffleButtonVisible(displayShuffleButton: boolean): void {
		if (this.configuration.displayShuffleButton === displayShuffleButton) {
			return;
		}

		this.configuration = { ...this.configuration, displayShuffleButton };
		this.setShuffleButtonVisible(displayShuffleButton);
	}

	private renderQuote(): void {
		this.statusBarItem.text = this.quoter.quoteText;
		this.statusBarItem.tooltip = this.quoter.quoteTooltip;
	}

	private setShuffleButtonVisible(visible: boolean): void {
		if (visible) {
			this.statusBarItemForShuffle.show();
		} else {
			this.statusBarItemForShuffle.hide();
		}
	}
}

export default StatusBarQuoteController;
