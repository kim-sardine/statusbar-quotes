​
import * as vscode from 'vscode';
import * as constants from './constants';
import quotes from './quotes';


const supportedCategory = [constants.CATEGORY_WISE_SAYING, constants.CATEGORY_PROGRAMMING];
const supportedLanguage = [constants.LANG_ENGLISH, constants.LANG_KOREAN];

const defaultCategory = constants.CATEGORY_WISE_SAYING;
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
			let newCategory: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", defaultCategory);
			quoter.setCategory(newCategory);
		}
		else if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
			let newLanguage: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", defaultLanguage);
			quoter.setLanguage(newLanguage);
		}
		else if (event.affectsConfiguration(constants.SETTING_DISPLAY_SECONDS)) {
			let newDisplaySeconds: number = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("display-seconds", defaultDisplaySeconds);
			quoter.setDisplaySeconds(newDisplaySeconds);
		}
	});
	context.subscriptions.push(onConfigurationChanged);
}
​
​
class Quoter {
	private timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();
​
	private elapsedSeconds: number = 0;
	private quoteList: string[] = [];
	private quoteDisplay: string = '';
	private interval: NodeJS.Timer | undefined;

	private category: string;
	private language: string;
	private displaySeconds: number;

	constructor(initialCategory: string, initialLanguage: string, initialDisplaySeconds: number) {
		this.category = initialCategory;
		this.language = initialLanguage;
		this.displaySeconds = initialDisplaySeconds;
				​
		this.updateQuoteListAndChangeDisplay();
	}

	get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
		return this.timeChangedEventEmitter.event;
	}

	get quoteNow(): string {
		return this.quoteDisplay;
	}

	get getCategory(): string {
		return this.category;
	}

	get getLanguage(): string {
		return this.language;
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
		if (this.elapsedSeconds >= this.displaySeconds) {
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
	public setCategory(category: string) {
		this.category = category;
		this.updateQuoteListAndChangeDisplay();
	}
​
	public setDisplaySeconds(displaySeconds: number) {
		this.displaySeconds = displaySeconds;
	}
}
​
export interface TimeChangedEventArgs {
	elapsedSeconds: number,
	wiseSayDisplay: string,
}
​
export function deactivate() {}
