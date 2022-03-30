
import * as vscode from 'vscode';
import * as constants from './constants';
import Quoter from './models/quoter';

const supportedCategory = [
	constants.CATEGORY_ALL,
	constants.CATEGORY_WISE_SAYING,
	constants.CATEGORY_PROGRAMMING,
	constants.CATEGORY_STARTUP,
	constants.CATEGORY_HTWFAIP,
];
const supportedLanguage = [constants.LANG_ENGLISH, constants.LANG_KOREAN];

const defaultCategory = constants.CATEGORY_ALL;
const defaultLanguage = constants.LANG_ENGLISH;
const defaultDisplaySeconds = constants.DEFAULT_DISPLAY_SECONDS;
const defaultDisplayShuffleButton = true;


export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
	statusBarItem.show();
	statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
	context.subscriptions.push(statusBarItem);

	const statusBarItemforShuffle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
	statusBarItemforShuffle.show();
	statusBarItemforShuffle.text = '$(search-refresh)';
	statusBarItemforShuffle.tooltip = 'Click to see new quotes';
	statusBarItemforShuffle.command = constants.CMD_SHUFFLE_QUOTES;
	context.subscriptions.push(statusBarItemforShuffle);


	let initialCategory: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
	let initialLanguage: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
	let initialDisplaySeconds: number = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-seconds", defaultDisplaySeconds);
	let initialDisplayShuffleButton: boolean = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-shuffle-button", defaultDisplayShuffleButton);

	const quoter = new Quoter(initialCategory, initialLanguage, initialDisplaySeconds);
	if (initialDisplayShuffleButton) {
		statusBarItemforShuffle.show();
	}

	quoter.start();
	quoter.onTimeChanged(_ => {
		statusBarItem.text = quoter.quoteText;
		statusBarItem.tooltip = quoter.quoteTooltip;
	});

	context.subscriptions.push(vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
		vscode.window.showInformationMessage(quoter.quoteModalText);
	}));

	// Settings
	const cmdChangeCatrgory = vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, async () => {
		let category = await vscode.window.showQuickPick(supportedCategory, { placeHolder: `Select category` });
		if (!category) { return; }

		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("category", category, true);
		quoter.setCategory(category);
	});
	context.subscriptions.push(cmdChangeCatrgory);

	const cmdChangeLanguage = vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, async () => {
		let language = await vscode.window.showQuickPick(supportedLanguage, { placeHolder: `Select Language` });
		if (!language) { return; }

		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("language", language, true);
		quoter.setLanguage(language);
	});
	context.subscriptions.push(cmdChangeLanguage);

	const cmdChangeDisplaySeconds = vscode.commands.registerCommand(constants.CMD_CHANGE_DISPLAY_SECONDS, async () => {
		let display_seconds = await vscode.window.showInputBox(
			{
				prompt: 'Quote change time interval (seconds)',
				placeHolder: `Range : 0 (do not change quote) ~ ${constants.MAXIMUM_DISPLAY_SECONDS} (${constants.MAXIMUM_DISPLAY_SECONDS_HUMANIZE})`
			}
		);
		if (!display_seconds || isNaN(parseInt(display_seconds))) {
			vscode.window.showWarningMessage(`You can only enter number between 0 and ${constants.MAXIMUM_DISPLAY_SECONDS}`);
			return;
		}

		let _display_seconds: number = parseInt(display_seconds);
		if (_display_seconds > constants.MAXIMUM_DISPLAY_SECONDS) {
			_display_seconds = constants.MAXIMUM_DISPLAY_SECONDS;
		}

		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("display-seconds", _display_seconds, true);
	});
	context.subscriptions.push(cmdChangeDisplaySeconds);

	const cmdShuffleQuotes = vscode.commands.registerCommand(constants.CMD_SHUFFLE_QUOTES, async () => {
		quoter.initElapsedSeconds();
		quoter.displayRandomQuote();
	});
	context.subscriptions.push(cmdShuffleQuotes);

	const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration(constants.SETTING_CATEGORY)) {
			let newCategory: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
			quoter.setCategory(newCategory);
		}
		else if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
			let newLanguage: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
			quoter.setLanguage(newLanguage);
		}
		else if (event.affectsConfiguration(constants.SETTING_DISPLAY_SECONDS)) {
			// TODO: Validation
			let newDisplaySeconds: number = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-seconds", defaultDisplaySeconds);
			quoter.setDisplaySeconds(newDisplaySeconds);
		}
		else if (event.affectsConfiguration(constants.SETTING_DISPLAY_SHUFFLE_BUTTON)) {
			let newDisplayShuffleButton: boolean = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-shuffle-button", defaultDisplayShuffleButton);
			if (newDisplayShuffleButton) {
				statusBarItemforShuffle.show();
			} else {
				statusBarItemforShuffle.hide();
			}
		}
	});
	context.subscriptions.push(onConfigurationChanged);
}

// TODO: Dispose on deactivation
export function deactivate() { }
