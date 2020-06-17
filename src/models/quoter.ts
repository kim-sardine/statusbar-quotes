import * as vscode from 'vscode';
import * as constants from '../constants';
import * as QUOTES from '../quotes/index';


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
		this.quoteDisplay = `$(quote) ${quote}`;
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


interface TimeChangedEventArgs {
	elapsedSeconds: number,
	wiseSayDisplay: string,
}
​
export default Quoter;
