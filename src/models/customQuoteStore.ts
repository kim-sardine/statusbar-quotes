import * as vscode from 'vscode';
import * as constants from '../constants';
import {
	CustomCategory,
	CustomQuote,
	CustomQuoteSource,
	CustomQuoteState,
	CUSTOM_QUOTE_STATE_VERSION,
	customQuoteFromId,
	customQuoteId,
	emptyCustomQuoteState,
} from './customQuote';

export const CUSTOM_QUOTE_STATE_KEY = constants.SETTING_CUSTOM_QUOTES;
export const SELECTED_CUSTOM_CATEGORY_KEY = 'statusbar-quotes.selected-custom-category-id';

export interface CustomQuoteStorage {
	get<T>(key: string, defaultValue: T): T;
	update(key: string, value: unknown): Thenable<void> | Promise<void>;
}

export class InMemoryCustomQuoteStorage implements CustomQuoteStorage {
	private readonly values = new Map<string, unknown>();

	public get<T>(key: string, defaultValue: T): T {
		return (this.values.has(key) ? this.values.get(key) : defaultValue) as T;
	}

	public async update(key: string, value: unknown): Promise<void> {
		if (value === undefined) {
			this.values.delete(key);
			return;
		}

		this.values.set(key, value);
	}
}

class VsCodeCustomQuoteStorage implements CustomQuoteStorage {
	constructor(private readonly memento: vscode.Memento) { }

	public get<T>(key: string, defaultValue: T): T {
		if (key === CUSTOM_QUOTE_STATE_KEY) {
			return vscode.workspace.getConfiguration(constants.EXTENSION_ID).get('custom-quotes', defaultValue);
		}

		return this.memento.get(key, defaultValue);
	}

	public update(key: string, value: unknown): Thenable<void> {
		if (key === CUSTOM_QUOTE_STATE_KEY) {
			return vscode.workspace.getConfiguration(constants.EXTENSION_ID).update('custom-quotes', value, true);
		}

		return this.memento.update(key, value);
	}
}

export class CustomQuoteStore implements CustomQuoteSource {
	constructor(private readonly storage: CustomQuoteStorage) { }

	public static fromMemento(memento: vscode.Memento): CustomQuoteStore {
		return new CustomQuoteStore(new VsCodeCustomQuoteStorage(memento));
	}

	public getState(): CustomQuoteState {
		return this.normalizeState(this.storage.get(CUSTOM_QUOTE_STATE_KEY, emptyCustomQuoteState()));
	}

	public getSelectedCustomCategoryId(): string | undefined {
		const selectedCategoryName = this.storage.get<string | undefined>(SELECTED_CUSTOM_CATEGORY_KEY, undefined);
		return selectedCategoryName && this.hasCategory(selectedCategoryName) ? selectedCategoryName : undefined;
	}

	public async setSelectedCustomCategoryId(categoryName: string | undefined): Promise<void> {
		if (categoryName && !this.hasCategory(categoryName)) {
			throw new Error('Custom category was not found.');
		}

		await this.storage.update(SELECTED_CUSTOM_CATEGORY_KEY, categoryName);
	}

	public listCategories(): readonly CustomCategory[] {
		return Object.keys(this.getState().categories).map(categoryName => ({
			id: categoryName,
			name: categoryName,
		}));
	}

	public listQuotes(categoryName?: string): readonly CustomQuote[] {
		const state = this.getState();
		if (categoryName) {
			return this.quotesForCategory(categoryName, state.categories[categoryName] ?? []);
		}

		return Object.entries(state.categories).flatMap(([name, quotes]) => this.quotesForCategory(name, quotes));
	}

	public async addCategory(name: string): Promise<CustomCategory> {
		const categoryName = this.requiredText(name, 'Category name cannot be empty.');
		const existingCategory = this.listCategories().find(category => category.name.toLocaleLowerCase() === categoryName.toLocaleLowerCase());
		if (existingCategory) {
			return existingCategory;
		}

		const state = this.getState();
		await this.saveState({
			...state,
			categories: {
				...state.categories,
				[categoryName]: [],
			},
		});
		return { id: categoryName, name: categoryName };
	}

	public async renameCategory(categoryName: string, name: string): Promise<CustomCategory> {
		const nextCategoryName = this.requiredText(name, 'Category name cannot be empty.');
		const state = this.getState();
		const quotes = state.categories[categoryName];
		if (!quotes) {
			throw new Error('Custom category was not found.');
		}
		if (categoryName !== nextCategoryName && this.hasCategory(nextCategoryName)) {
			throw new Error('Custom category name is already used.');
		}

		const { [categoryName]: _removedCategory, ...remainingCategories } = state.categories;
		await this.saveState({
			...state,
			categories: {
				...remainingCategories,
				[nextCategoryName]: quotes,
			},
		});
		if (this.getSelectedCustomCategoryId() === categoryName) {
			await this.storage.update(SELECTED_CUSTOM_CATEGORY_KEY, nextCategoryName);
		}

		return { id: nextCategoryName, name: nextCategoryName };
	}

	public async deleteCategory(categoryName: string): Promise<void> {
		const state = this.getState();
		if (!state.categories[categoryName]) {
			throw new Error('Custom category was not found.');
		}

		const selectedCategoryName = this.storage.get<string | undefined>(SELECTED_CUSTOM_CATEGORY_KEY, undefined);
		const { [categoryName]: _removedCategory, ...remainingCategories } = state.categories;
		await this.saveState({
			...state,
			categories: remainingCategories,
		});

		if (selectedCategoryName === categoryName) {
			await this.storage.update(SELECTED_CUSTOM_CATEGORY_KEY, undefined);
		}
	}

	public async addCustomQuote(categoryName: string, sentence: string): Promise<CustomQuote> {
		const quote = this.requiredText(sentence, 'Quote text cannot be empty.');
		const state = this.getState();
		const quotes = state.categories[categoryName];
		if (!quotes) {
			throw new Error('Custom category was not found.');
		}

		await this.saveState({
			...state,
			categories: {
				...state.categories,
				[categoryName]: [...quotes, quote],
			},
		});
		return this.quoteForCategory(categoryName, quote, quotes.length);
	}

	public async addQuote(categoryName: string, sentence: string): Promise<CustomQuote> {
		return await this.addCustomQuote(categoryName, sentence);
	}

	public async updateCustomQuote(quoteId: string, sentence: string): Promise<CustomQuote> {
		const quote = this.requiredText(sentence, 'Quote text cannot be empty.');
		const location = customQuoteFromId(quoteId);
		if (!location) {
			throw new Error('Custom quote was not found.');
		}

		const state = this.getState();
		const quotes = state.categories[location.categoryName];
		if (!quotes || location.quoteIndex < 0 || location.quoteIndex >= quotes.length) {
			throw new Error('Custom quote was not found.');
		}

		const nextQuotes = [...quotes];
		nextQuotes[location.quoteIndex] = quote;
		await this.saveState({
			...state,
			categories: {
				...state.categories,
				[location.categoryName]: nextQuotes,
			},
		});
		return this.quoteForCategory(location.categoryName, quote, location.quoteIndex);
	}

	public async updateQuote(quoteId: string, sentence: string): Promise<CustomQuote> {
		return await this.updateCustomQuote(quoteId, sentence);
	}

	public async deleteCustomQuote(quoteId: string): Promise<void> {
		const location = customQuoteFromId(quoteId);
		if (!location) {
			throw new Error('Custom quote was not found.');
		}

		const state = this.getState();
		const quotes = state.categories[location.categoryName];
		if (!quotes || location.quoteIndex < 0 || location.quoteIndex >= quotes.length) {
			throw new Error('Custom quote was not found.');
		}

		await this.saveState({
			...state,
			categories: {
				...state.categories,
				[location.categoryName]: quotes.filter((_quote, index) => index !== location.quoteIndex),
			},
		});
	}

	public async deleteQuote(quoteId: string): Promise<void> {
		await this.deleteCustomQuote(quoteId);
	}

	private async saveState(state: CustomQuoteState): Promise<void> {
		await this.storage.update(CUSTOM_QUOTE_STATE_KEY, this.normalizeState(state));
	}

	private hasCategory(categoryName: string): boolean {
		return Object.prototype.hasOwnProperty.call(this.getState().categories, categoryName);
	}

	private requiredText(value: string, message: string): string {
		const trimmedValue = value.trim();
		if (!trimmedValue) {
			throw new Error(message);
		}

		return trimmedValue;
	}

	private normalizeState(value: unknown): CustomQuoteState {
		if (!this.isState(value)) {
			return emptyCustomQuoteState();
		}

		return {
			version: CUSTOM_QUOTE_STATE_VERSION,
			categories: Object.fromEntries(
				Object.entries(value.categories)
					.map(([categoryName, quotes]) => [categoryName.trim(), quotes.map(quote => quote.trim()).filter(Boolean)])
					.filter(([categoryName]) => categoryName),
			),
		};
	}

	private isState(value: unknown): value is CustomQuoteState {
		if (!value || typeof value !== 'object') {
			return false;
		}

		const candidate = value as Partial<CustomQuoteState>;
		return candidate.version === CUSTOM_QUOTE_STATE_VERSION
			&& !!candidate.categories
			&& typeof candidate.categories === 'object'
			&& !Array.isArray(candidate.categories)
			&& Object.values(candidate.categories).every(quotes => (
				Array.isArray(quotes) && quotes.every(quote => typeof quote === 'string')
			));
	}

	private quotesForCategory(categoryName: string, quotes: readonly string[]): CustomQuote[] {
		return quotes.map((quote, index) => this.quoteForCategory(categoryName, quote, index));
	}

	private quoteForCategory(categoryName: string, sentence: string, quoteIndex: number): CustomQuote {
		return {
			id: customQuoteId(categoryName, quoteIndex),
			categoryId: categoryName,
			sentence,
		};
	}
}
