​
import * as vscode from 'vscode';
import * as constants from './constants';
import * as QUOTES from './quotes/index';


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

	private getRandomQuoteFromQuoteList() {
		return this.quoteList[Math.floor(Math.random() * this.quoteList.length)];
	}

	private updateQuoteListAndChangeDisplay(): void {
		this.quoteList = this.loadQuotes();
		this.setQuoteDisplay(this.getRandomQuoteFromQuoteList());
	}

	private loadQuotes(): string[] {
		
		if (this.category === constants.CATEGORY_ALL) {
			let sentences: string[] = [];
			for (const [category, quotesByCategory] of Object.entries(QUOTES)) {
				for (let quote of quotesByCategory) {
					if (quote.language === this.language) {
						sentences = [...sentences, ...quote.sentences];
					}
				}
			}
			return sentences;
		}
		else {
			const parsedCurrentCategory = this.category.toLowerCase().replace(/ /g,"_");
			for (const [category, quotesByCategory] of Object.entries(QUOTES)) {
				if (parsedCurrentCategory === category) {
					for (let quote of quotesByCategory) {
						if (quote.language === this.language) {
							return quote.sentences;
						}
					}
				}
			}
		}

		vscode.window.showWarningMessage(`sorry, "${this.category}" in "${this.language}" is not supported now`);
		return QUOTES.wise_saying[0].sentences;
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
		if (this.displaySeconds === 0) {  // display only one quote.
			this.fireTimeChangedEvent(this.elapsedSeconds, this.quoteDisplay);
			return;
		}
		
		this.elapsedSeconds += 1;
		if (this.elapsedSeconds >= this.displaySeconds) {
			this.elapsedSeconds = 0;
			this.setQuoteDisplay(this.getRandomQuoteFromQuoteList());
		}
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
