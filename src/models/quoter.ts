import * as vscode from 'vscode';
import * as constants from '../constants';
import * as QUOTES from '../quotes/index';


class Quoter {
	private timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();

	private elapsedSeconds: number = 0;
	private quoteList: string[] = [];
	private interval: NodeJS.Timer | undefined;
	private category: string;
	private language: string;
	private displaySeconds: number;

	public quoteText: string = '';
	public quoteTooltip: string = '';
	public quoteModalText: string = '';

	constructor(initialCategory: string, initialLanguage: string, initialDisplaySeconds: number) {
		this.category = initialCategory;
		this.language = initialLanguage;
		this.displaySeconds = initialDisplaySeconds;

		this.updateQuoteListAndChangeDisplay();
	}

	get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
		return this.timeChangedEventEmitter.event;
	}

	public displayRandomQuote(): void {
		this.setQuoteText(this.getRandomQuoteFromQuoteList());
	}

	public initElapsedSeconds(): void {
		this.elapsedSeconds = 0;
	}

	private getRandomQuoteFromQuoteList(): string {
		return this.quoteList[Math.floor(Math.random() * this.quoteList.length)];
	}

	private updateQuoteListAndChangeDisplay(): void {
		this.quoteList = this.loadQuotes();
		this.displayRandomQuote();
	}

	private loadQuotes(): string[] {
		if (this.category === constants.CATEGORY_ALL) {
			let sentences: string[] = [];
			for (const [_, quotesByCategory] of Object.entries(QUOTES)) {
				for (let quote of quotesByCategory) {
					if (quote.language === this.language) {
						sentences = [...sentences, ...quote.sentences];
					}
				}
			}
			return sentences;
		}
		else {
			const parsedCurrentCategory = this.category.toLowerCase().replace(/ /g, "_");
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

	private setQuoteText(quote: string): void {
		this.quoteText = `$(quote) ${quote}`;
		this.quoteTooltip = `"${this.category}" in "${this.language}"`;
		this.quoteModalText = quote;
	}

	private fireTimeChangedEvent(): void {
		this.timeChangedEventEmitter.fire({});
	}

	private tick() {
		if (this.displaySeconds === 0) {  // display only one quote all along.
			this.fireTimeChangedEvent();
			return;
		}

		this.elapsedSeconds += 1;
		if (this.elapsedSeconds >= this.displaySeconds) {
			this.elapsedSeconds = 0;
			this.displayRandomQuote();
		}
		this.fireTimeChangedEvent();
	}

	public start() {
		this.interval = setInterval(() => {
			this.tick();
		}, 1000);
	}

	public setLanguage(language: string) {
		this.language = language;
		this.updateQuoteListAndChangeDisplay();
	}

	public setCategory(category: string) {
		this.category = category;
		this.updateQuoteListAndChangeDisplay();
	}

	public setDisplaySeconds(displaySeconds: number) {
		this.displaySeconds = displaySeconds;
	}
}

interface TimeChangedEventArgs { }

export default Quoter;
