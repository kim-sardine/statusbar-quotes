​
import * as vscode from 'vscode';
import * as constants from './constants';
import Quoter from './models/quoter';

const supportedCategory = [constants.CATEGORY_ALL, constants.CATEGORY_WISE_SAYING, constants.CATEGORY_PROGRAMMING];
const supportedLanguage = [constants.LANG_ENGLISH, constants.LANG_KOREAN];

const defaultCategory = constants.CATEGORY_ALL;
const defaultLanguage = constants.LANG_ENGLISH;
const defaultDisplaySeconds = constants.DEFAULT_DISPLAY_SECONDS;


export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.show();
	statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
	context.subscriptions.push(statusBarItem);
​

	let initialCategory: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
	let initialLanguage: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
	let initialDisplaySeconds: number = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-seconds", defaultDisplaySeconds);
	const quoter = new Quoter(initialCategory, initialLanguage, initialDisplaySeconds);

	quoter.start();
	quoter.onTimeChanged((args) => {
		statusBarItem.text = args.wiseSayDisplay;
		statusBarItem.tooltip = `"${quoter.getCategory}" in "${quoter.getLanguage}"`;
	});

	context.subscriptions.push(vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
		vscode.window.showInformationMessage(quoter.quoteNow);
	}));
	
	// Settings
	const cmdChangeCatrgory = vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, async () => {
		let category = await vscode.window.showQuickPick(supportedCategory, { placeHolder: `Select category` });
		if (!category) { return; }
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("category", category, true);
		quoter.setCategory(category);
	});
	context.subscriptions.push(cmdChangeCatrgory);
​
	const cmdChangeLanguage = vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, async () => {
		let language = await vscode.window.showQuickPick(supportedLanguage, { placeHolder: `Select Language` });
		if (!language) { return; }
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("language", language, true);
		quoter.setLanguage(language);
	});
	context.subscriptions.push(cmdChangeLanguage);
​
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
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("display-seconds", _display_seconds, true);
	});
	context.subscriptions.push(cmdChangeDisplaySeconds);
​
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
	});
	context.subscriptions.push(onConfigurationChanged);
}
​
export function deactivate() {}
