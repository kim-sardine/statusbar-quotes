import Quote from './quote';

export interface PresentedQuote {
	readonly quoteText: string;
	readonly quoteTooltip: string;
	readonly quoteModalText: string;
}

export function presentQuote(quote: Quote): PresentedQuote {
	return {
		quoteText: `$(quote) ${quote.sentence}`,
		quoteTooltip: `"${quote.category}" in "${quote.language}"`,
		quoteModalText: quote.sentence,
	};
}
