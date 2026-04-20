import * as constants from '../constants';
import Quote from './quote';

export const CUSTOM_QUOTE_STATE_VERSION = 2;
export const CUSTOM_CATEGORY_PREFIX = 'custom:';

export interface CustomQuoteState {
	readonly version: typeof CUSTOM_QUOTE_STATE_VERSION;
	readonly categories: Readonly<Record<string, readonly string[]>>;
}

export interface CustomCategory {
	readonly id: string;
	readonly name: string;
}

export interface CustomQuote {
	readonly id: string;
	readonly categoryId: string;
	readonly sentence: string;
}

export interface CustomQuoteSource {
	getState(): CustomQuoteState;
}

export function emptyCustomQuoteState(): CustomQuoteState {
	return {
		version: CUSTOM_QUOTE_STATE_VERSION,
		categories: {},
	};
}

export function customCategoryKey(categoryName: string): string {
	return `${CUSTOM_CATEGORY_PREFIX}${encodeURIComponent(categoryName)}`;
}

export function customCategoryIdFromKey(categoryKey: string): string | undefined {
	if (!categoryKey.startsWith(CUSTOM_CATEGORY_PREFIX)) {
		return undefined;
	}

	return decodeURIComponent(categoryKey.slice(CUSTOM_CATEGORY_PREFIX.length));
}

export function customQuoteId(categoryName: string, quoteIndex: number): string {
	return `${quoteIndex}:${categoryName}`;
}

export function customQuoteFromId(quoteId: string): { categoryName: string; quoteIndex: number } | undefined {
	const separatorIndex = quoteId.indexOf(':');
	if (separatorIndex < 1) {
		return undefined;
	}

	const quoteIndex = Number.parseInt(quoteId.slice(0, separatorIndex), 10);
	if (Number.isNaN(quoteIndex)) {
		return undefined;
	}

	return {
		quoteIndex,
		categoryName: quoteId.slice(separatorIndex + 1),
	};
}

export function customQuotesForCategory(source: CustomQuoteSource, categoryKey: string): Quote[] | undefined {
	const categoryName = customCategoryIdFromKey(categoryKey);
	if (!categoryName) {
		return undefined;
	}

	const sentences = source.getState().categories[categoryName];
	if (!sentences) {
		return undefined;
	}

	if (sentences.length === 0) {
		return [new Quote(constants.LANG_CUSTOM, categoryName, `No custom quotes in "${categoryName}" yet. Add one from the Command Palette or Settings JSON.`)];
	}

	return sentences.map(sentence => new Quote(constants.LANG_CUSTOM, categoryName, sentence));
}

export function allCustomQuotes(source: CustomQuoteSource): Quote[] {
	return Object.entries(source.getState().categories).flatMap(([categoryName, sentences]) => (
		sentences.map(sentence => new Quote(constants.LANG_CUSTOM, categoryName, sentence))
	));
}
