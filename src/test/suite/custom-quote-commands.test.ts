import * as assert from 'assert';
import * as vscode from 'vscode';
import * as constants from '../../constants';

interface WindowOverrides {
	showInputBox: typeof vscode.window.showInputBox;
	showQuickPick: typeof vscode.window.showQuickPick;
	showInformationMessage: typeof vscode.window.showInformationMessage;
}

suite('Custom quote command flow', () => {
	test('add category then add quote refreshes the selected status bar quote', async () => {
		await vscode.extensions.getExtension('kim-sardine.statusbar-quotes')?.activate();

		const categoryName = `Smoke ${Date.now()}`;
		const quoteText = 'Ship small, verify honestly.';
		const inputValues = [categoryName, quoteText];
		let modalMessage: string | undefined;
		const windowOverrides = vscode.window as unknown as WindowOverrides;
		const originalShowInputBox = windowOverrides.showInputBox;
		const originalShowQuickPick = windowOverrides.showQuickPick;
		const originalShowInformationMessage = windowOverrides.showInformationMessage;

		windowOverrides.showInputBox = (async () => inputValues.shift()) as typeof vscode.window.showInputBox;
		windowOverrides.showQuickPick = (async (items: readonly unknown[] | Thenable<readonly unknown[]>) => {
			const resolvedItems = await Promise.resolve(items);
			return resolvedItems.find(item => typeof item === 'object' && !!item && (item as vscode.QuickPickItem).label === categoryName) ?? resolvedItems[0];
		}) as unknown as typeof vscode.window.showQuickPick;
		windowOverrides.showInformationMessage = (async (message: string) => {
			modalMessage = message;
			return undefined;
		}) as typeof vscode.window.showInformationMessage;

		try {
			await vscode.commands.executeCommand(constants.CMD_ADD_CUSTOM_CATEGORY);
			await vscode.commands.executeCommand(constants.CMD_ADD_CUSTOM_QUOTE);
			await vscode.commands.executeCommand(constants.CMD_SHOW_QUOTE_ON_MODAL);

			assert.strictEqual(modalMessage, quoteText);
		} finally {
			windowOverrides.showInputBox = originalShowInputBox;
			windowOverrides.showQuickPick = originalShowQuickPick;
			windowOverrides.showInformationMessage = originalShowInformationMessage;
		}
	});
	test('choosing custom category from settings leaves the settings sentinel visible', async () => {
		await vscode.extensions.getExtension('kim-sardine.statusbar-quotes')?.activate();

		const categoryName = `Settings Smoke ${Date.now()}`;
		const quoteText = 'Stay visible from settings.';
		const inputValues = [categoryName, quoteText];
		const windowOverrides = vscode.window as unknown as WindowOverrides;
		const originalShowInputBox = windowOverrides.showInputBox;
		const originalShowQuickPick = windowOverrides.showQuickPick;

		windowOverrides.showInputBox = (async () => inputValues.shift()) as typeof vscode.window.showInputBox;
		windowOverrides.showQuickPick = (async (items: readonly unknown[] | Thenable<readonly unknown[]>) => {
			const resolvedItems = await Promise.resolve(items);
			return resolvedItems.find(item => typeof item === 'object' && !!item && (item as vscode.QuickPickItem).label === categoryName) ?? resolvedItems[0];
		}) as unknown as typeof vscode.window.showQuickPick;

		try {
			await vscode.commands.executeCommand(constants.CMD_ADD_CUSTOM_CATEGORY);
			await vscode.commands.executeCommand(constants.CMD_ADD_CUSTOM_QUOTE);
			await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update('category', constants.CATEGORY_CHOOSE_CUSTOM, true);

			assert.strictEqual(
				vscode.workspace.getConfiguration(constants.EXTENSION_ID).get('category'),
				constants.CATEGORY_CHOOSE_CUSTOM,
			);
		} finally {
			windowOverrides.showInputBox = originalShowInputBox;
			windowOverrides.showQuickPick = originalShowQuickPick;
		}
	});

});
