import * as vscode from 'vscode';
import * as constants from './constants';

export interface StatusBarQuotesConfiguration {
	readonly category: string;
	readonly language: string;
	readonly displaySeconds: number;
	readonly displayShuffleButton: boolean;
}

export function readExtensionConfiguration(): StatusBarQuotesConfiguration {
	const configuration = vscode.workspace.getConfiguration(constants.EXTENSION_ID);

	return {
		category: configuration.get('category', constants.CATEGORY_ALL),
		language: configuration.get('language', constants.LANG_ENGLISH),
		displaySeconds: configuration.get('display-seconds', constants.DEFAULT_DISPLAY_SECONDS),
		displayShuffleButton: configuration.get('display-shuffle-button', true),
	};
}

export function extensionConfiguration(): vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration(constants.EXTENSION_ID);
}
