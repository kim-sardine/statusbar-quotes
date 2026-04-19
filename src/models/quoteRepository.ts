import * as constants from '../constants';
import * as quoteGroups from '../quotes';
import Quote from './quote';
import Quotes from './quotes';
import { quoteGroupKeyForCategory } from './categoryRegistry';

export interface QuoteLookupResult {
	readonly quotes: Quote[];
	readonly supported: boolean;
}

type QuoteGroupMap = Record<string, readonly Quotes[]>;

class QuoteRepository {
	constructor(private readonly groups: QuoteGroupMap = quoteGroups) { }

	public findQuotes(category: string, language: string): QuoteLookupResult {
		if (category === constants.CATEGORY_ALL) {
			return {
				quotes: this.findAllByLanguage(language),
				supported: true,
			};
		}

		const groupKey = quoteGroupKeyForCategory(category);
		const matchingGroup = groupKey ? this.groups[groupKey] : undefined;
		const matchingQuotes = matchingGroup?.find(quotes => quotes.language === language);

		if (matchingQuotes) {
			return {
				quotes: this.toQuoteList(matchingQuotes),
				supported: true,
			};
		}

		return {
			quotes: this.fallbackQuotes(),
			supported: false,
		};
	}

	private findAllByLanguage(language: string): Quote[] {
		return Object.values(this.groups).flatMap(group => (
			group
				.filter(quotes => quotes.language === language)
				.flatMap(quotes => this.toQuoteList(quotes))
		));
	}

	private fallbackQuotes(): Quote[] {
		return this.toQuoteList(this.groups.wise_saying[0]);
	}

	private toQuoteList(quotes: Quotes): Quote[] {
		return quotes.sentences.map(sentence => new Quote(quotes.language, quotes.category, sentence));
	}
}

export default QuoteRepository;
