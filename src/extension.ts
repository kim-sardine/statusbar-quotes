​
import * as vscode from 'vscode';
import * as constants from './constants';
import quotes from './quotes';

export function activate(context: vscode.ExtensionContext) {
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.show();
	statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
	context.subscriptions.push(statusBarItem);
​

	let initial_category: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", constants.CATEGORY_WISE_SAYING);
	let initial_language: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", constants.LANG_ENGLISH);
	const quoter = new Quoter(initial_category, initial_language);

	quoter.start();
	quoter.onTimeChanged((args) => {
		statusBarItem.text = args.wiseSayDisplay;
		statusBarItem.tooltip = args.wiseSayDisplay;

	});

	context.subscriptions.push(vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
		vscode.window.showInformationMessage(quoter.quoteNow, {modal:true});
	}));
​
	
	const cmdSelectLanguage = vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, async () => {
		let language = await vscode.window.showQuickPick([constants.LANG_ENGLISH, constants.LANG_KOREAN], { placeHolder: `Select Language` });
		if (!language) { return; }
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("language", language, true);
		quoter.setLanguage(language);
	});
	context.subscriptions.push(cmdSelectLanguage);
​
	
	const cmdSelectCatrgory = vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, async () => {
		let category = await vscode.window.showQuickPick([constants.CATEGORY_WISE_SAYING], { placeHolder: `Select category` });
		if (!category) { return; }
​
		await vscode.workspace.getConfiguration(constants.EXTENSION_ID).update("category", category, true);
		quoter.setCategory(category);
	});
	context.subscriptions.push(cmdSelectCatrgory);
​
​
	const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
			let changed_language: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("language", constants.LANG_ENGLISH);
			quoter.setLanguage(changed_language);
		}
		else if (event.affectsConfiguration(constants.SETTING_CATEGORY)) {
			let changed_category: string = vscode.workspace.getConfiguration(constants.EXTENSION_ID).get("category", constants.CATEGORY_WISE_SAYING);
			quoter.setCategory(changed_category);
		}
	});
	context.subscriptions.push(onConfigurationChanged);
}
​
​
class Quoter {
	private timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();
	
	readonly DISPLAY_TIME_IN_SEC = 10;
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
			if ( quote.category === this.category && quote.language === this.language) {
				return quote.sentences;
			}
		}
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
		if (this.elapsedSeconds >= this.DISPLAY_TIME_IN_SEC) {
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
