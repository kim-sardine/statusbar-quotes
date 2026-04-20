import * as vscode from 'vscode';
import * as constants from '../constants';
import Quote from './quote';
import QuoteRepository from './quoteRepository';
import { presentQuote } from './quotePresenter';

class Quoter implements vscode.Disposable {
	private readonly timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();

	private elapsedSeconds: number = 0;
	private quoteList: Quote[] = [];
	private interval: NodeJS.Timeout | undefined;
	private category: string;
	private language: string;
	private displaySeconds: number;

	public quoteText: string = '';
	public quoteTooltip: string = '';
	public quoteModalText: string = '';

	constructor(
		initialCategory: string,
		initialLanguage: string,
		initialDisplaySeconds: number,
		private readonly quoteRepository: QuoteRepository = new QuoteRepository(),
		private readonly random: () => number = () => Math.random(),
	) {
		this.category = initialCategory;
		this.language = initialLanguage;
		this.displaySeconds = initialDisplaySeconds;

		this.updateQuoteListAndChangeDisplay(false);
	}

	get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
		return this.timeChangedEventEmitter.event;
	}

	public displayRandomQuote(): void {
		this.selectRandomQuote();
		this.fireTimeChangedEvent();
	}

	public initElapsedSeconds(): void {
		this.elapsedSeconds = 0;
	}

	public start(): void {
		this.stop();
		this.interval = setInterval(() => {
			this.tick();
		}, 1000);
	}

	public stop(): void {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = undefined;
		}
	}

	public dispose(): void {
		this.stop();
		this.timeChangedEventEmitter.dispose();
	}

	public setLanguage(language: string): void {
		this.language = language;
		this.updateQuoteListAndChangeDisplay(true);
	}

	public setCategory(category: string): void {
		this.category = category;
		this.updateQuoteListAndChangeDisplay(true);
	}

	public setDisplaySeconds(displaySeconds: number): void {
		this.displaySeconds = displaySeconds;
	}

	public refreshQuotes(): void {
		this.updateQuoteListAndChangeDisplay(true);
	}

	private getRandomQuoteFromQuoteList(): Quote {
		if (this.quoteList.length === 0) {
			return new Quote(constants.LANG_CUSTOM, this.category, 'No custom quotes are available yet.');
		}

		return this.quoteList[Math.floor(this.random() * this.quoteList.length)];
	}

	private updateQuoteListAndChangeDisplay(notify: boolean): void {
		const result = this.quoteRepository.findQuotes(this.category, this.language);
		this.quoteList = result.quotes;

		if (!result.supported) {
			vscode.window.showWarningMessage(`sorry, "${this.category}" in "${this.language}" is not supported now`);
		}

		this.selectRandomQuote();
		if (notify) {
			this.fireTimeChangedEvent();
		}
	}

	private selectRandomQuote(): void {
		const quote = this.getRandomQuoteFromQuoteList();
		const presentedQuote = presentQuote(quote);
		this.quoteText = presentedQuote.quoteText;
		this.quoteTooltip = presentedQuote.quoteTooltip;
		this.quoteModalText = presentedQuote.quoteModalText;
	}

	private fireTimeChangedEvent(): void {
		this.timeChangedEventEmitter.fire({});
	}

	private tick(): void {
		if (this.displaySeconds === 0) {  // display only one quote all along.
			this.fireTimeChangedEvent();
			return;
		}

		this.elapsedSeconds += 1;
		if (this.elapsedSeconds >= this.displaySeconds) {
			this.elapsedSeconds = 0;
			this.selectRandomQuote();
		}
		this.fireTimeChangedEvent();
	}
}

interface TimeChangedEventArgs { }

export default Quoter;
