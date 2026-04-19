import * as vscode from 'vscode';
import { readExtensionConfiguration } from './extensionConfiguration';
import StatusBarQuoteController from './statusBarQuoteController';

let controller: StatusBarQuoteController | undefined;

export function activate(context: vscode.ExtensionContext): void {
	controller = new StatusBarQuoteController(readExtensionConfiguration());
	context.subscriptions.push(controller);
}

export function deactivate(): void {
	controller?.dispose();
	controller = undefined;
}
