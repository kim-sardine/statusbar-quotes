import * as vscode from 'vscode';
import * as constants from '../constants';
import * as QUOTES from '../quotes/index';
import Quote from './quote';
import Quotes from './quotes';

class Quoter {
	private timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();

	private elapsedSeconds: number = 0;
	private quoteList: Quote[] = [];
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

	private getRandomQuoteFromQuoteList(): Quote {
		return this.quoteList[Math.floor(Math.random() * this.quoteList.length)];
	}

	private updateQuoteListAndChangeDisplay(): void {
		this.quoteList = this.loadQuoteList();
		this.displayRandomQuote();
	}

	private loadQuoteList(): Quote[] {
		let quoteList: Quote[] = [];
		if (this.category === constants.CATEGORY_ALL) {
			for (const [quoteCategory, quotesByCategory] of Object.entries(QUOTES)) {
				for (let quotes of quotesByCategory) {
					if (quotes.language === this.language) {
						quoteList = [...quoteList, ...this.convertQuotesToQuoteList(quotes)];
					}
				}
			}
			return quoteList;
		}
		else {
			const parsedCurrentCategory = this.category.toLowerCase().replace(/\(|\)/g, "").replace(/ /g, "_");
			for (const [quoteCategory, quotesByCategory] of Object.entries(QUOTES)) {
				if (parsedCurrentCategory === quoteCategory) {
					for (let quotes of quotesByCategory) {
						if (quotes.language === this.language) {
							return this.convertQuotesToQuoteList(quotes);
						}
					}
				}
			}
		}

		vscode.window.showWarningMessage(`sorry, "${this.category}" in "${this.language}" is not supported now`);
		return this.convertQuotesToQuoteList(QUOTES.wise_saying[0]);
	}

	private convertQuotesToQuoteList(quotes: Quotes): Quote[] {
		let quoteList: Quote[] = [];
		for (let sentence of quotes.sentences) {
			quoteList.push(new Quote(quotes.language, quotes.category, sentence));
		}
		return quoteList;
	}

	private setQuoteText(quote: Quote): void {
		this.quoteText = `$(quote) ${quote.sentence}`;
		this.quoteTooltip = `"${quote.category}" in "${quote.language}"`;
		this.quoteModalText = quote.sentence;
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
