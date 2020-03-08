​
import * as vscode from 'vscode';
import * as constants from './constants';
import quotes from './quotes';

const DISPLAY_TIME_IN_SEC = 10;

const supportedCategory = [constants.CATEGORY_WISE_SAYING, constants.CATEGORY_PROGRAMMING_QUOTES];
const supportedLanguage = [constants.LANG_ENGLISH, constants.LANG_KOREAN];

const defaultCategory = constants.CATEGORY_WISE_SAYING;
const defaultLanguage = constants.LANG_ENGLISH;


export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.show();
	statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
	context.subscriptions.push(statusBarItem);
​

	let initial_category: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
	let initial_language: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
	const quoter = new Quoter(initial_category, initial_language);

	quoter.start();
	quoter.onTimeChanged((args) => {
		statusBarItem.text = args.wiseSayDisplay;
		statusBarItem.tooltip = args.wiseSayDisplay;

	});

	context.subscriptions.push(vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
		vscode.window.showInformationMessage(quoter.quoteNow, {modal:true});
	}));
	
	const cmdSelectCatrgory = vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, async () => {
		let category = await vscode.window.showQuickPick(supportedCategory, { placeHolder: `Select category` });
		if (!category) { return; }
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("category", category, true);
		quoter.setCategory(category);
	});
	context.subscriptions.push(cmdSelectCatrgory);
​
	const cmdSelectLanguage = vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, async () => {
		let language = await vscode.window.showQuickPick(supportedLanguage, { placeHolder: `Select Language` });
		if (!language) { return; }
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("language", language, true);
		quoter.setLanguage(language);
	});
	context.subscriptions.push(cmdSelectLanguage);
​
	const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration(constants.SETTING_CATEGORY)) {
			let changed_category: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
			quoter.setCategory(changed_category);
		}
		else if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
			let changed_language: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
			quoter.setLanguage(changed_language);
		}
	});
	context.subscriptions.push(onConfigurationChanged);
}
​
​
class Quoter {
	private timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();
​
	private elapsedSeconds: number;
	private quoteList: string[];
	private quoteDisplay: string;
	private category: string;
	private language: string;
	private interval: NodeJS.Timer | undefined;
​
	constructor(initial_category: string, initial_language: string) {
		this.elapsedSeconds = 0;
		this.category = initial_category;
		this.language = initial_language;
		this.quoteList = [];
		this.quoteDisplay = '';
				​
		this.updateQuoteListAndChangeDisplay();
	}

	get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
		return this.timeChangedEventEmitter.event;
	}

	get quoteNow(): string {
		return this.quoteDisplay;
	}

	private updateQuoteListAndChangeDisplay(): void {
		this.quoteList = this.loadQuotes();
		this.setQuoteDisplay(this.quoteList[0]);
	}

	private loadQuotes(): string[] {
		for (const quote of quotes) {
			if ( this.category === quote.category && this.language === quote.language) {
				return quote.sentences;
			}
		}
		vscode.window.showWarningMessage(`sorry, "${this.category}" in "${this.language}" is not supported now`);
		return quotes[0].sentences;
	}

	private setQuoteDisplay(quote: string): void {
		this.quoteDisplay = quote;
	}
​
	private fireTimeChangedEvent(elapsedSeconds: number, wiseSayDisplay: string): void {
		const args: TimeChangedEventArgs = {
			elapsedSeconds,
			wiseSayDisplay
		};
		this.timeChangedEventEmitter.fire(args);
	}

	private tick() {
		if (this.elapsedSeconds >= DISPLAY_TIME_IN_SEC) {
			this.elapsedSeconds = 0;
			
			var quote = this.quoteList[Math.floor(Math.random() * this.quoteList.length)];
			this.setQuoteDisplay(quote);
		}
		this.elapsedSeconds += 1;
		this.fireTimeChangedEvent(this.elapsedSeconds, this.quoteDisplay);
	}

	public start() {
		this.interval = setInterval(() => {
			this.tick();
		}, 1000);
	}
	​
	public setLanguage(language: string) {
		this.language = language;
		this.updateQuoteListAndChangeDisplay();
	}
​
	​
	public setCategory(category: string) {
		this.category = category;
		this.updateQuoteListAndChangeDisplay();
	}
}
​
export interface TimeChangedEventArgs {
	elapsedSeconds: number,
	wiseSayDisplay: string,
}
​
export function deactivate() {}
