import * as assert from 'assert';
import * as constants from '../../constants';
import { customCategoryKey } from '../../models/customQuote';
import { CustomQuoteStore, InMemoryCustomQuoteStorage, SELECTED_CUSTOM_CATEGORY_KEY } from '../../models/customQuoteStore';
import QuoteRepository from '../../models/quoteRepository';
import Quoter from '../../models/quoter';
import { initialRuntimeConfiguration, runtimeCategory } from '../../statusBarQuoteController';

suite('Custom quotes', () => {
	test('store returns an empty versioned state by default', () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());

		assert.deepStrictEqual(store.getState(), {
			version: 2,
			categories: {},
		});
	});

	test('store persists custom categories and quotes', async () => {
		const storage = new InMemoryCustomQuoteStorage();
		const store = new CustomQuoteStore(storage);

		const category = await store.addCategory('My Principles');
		const quote = await store.addQuote(category.id, 'Ship small, verify honestly.');
		const restoredStore = new CustomQuoteStore(storage);

		assert.deepStrictEqual(restoredStore.getState().categories, {
			[category.name]: ['Ship small, verify honestly.'],
		});
		assert.deepStrictEqual(restoredStore.listCategories(), [category]);
		assert.deepStrictEqual(restoredStore.listQuotes(), [quote]);
	});

	test('store rejects invalid category and quote input', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());

		await assert.rejects(() => store.addCategory('   '), /Category name cannot be empty/);
		await assert.rejects(() => store.addQuote('missing', 'Keep going.'), /Custom category was not found/);

		const category = await store.addCategory('Focus');
		await assert.rejects(() => store.addQuote(category.id, '   '), /Quote text cannot be empty/);
	});

	test('custom quotes are language-agnostic and available through their category key', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('My Principles');
		await store.addQuote(category.id, 'Stay close to the user.');
		const repository = new QuoteRepository(undefined, store);

		const englishResult = repository.findQuotes(customCategoryKey(category.id), constants.LANG_ENGLISH);
		const koreanResult = repository.findQuotes(customCategoryKey(category.id), constants.LANG_KOREAN);

		assert.strictEqual(englishResult.supported, true);
		assert.strictEqual(koreanResult.supported, true);
		assert.strictEqual(englishResult.quotes[0].sentence, 'Stay close to the user.');
		assert.strictEqual(koreanResult.quotes[0].sentence, 'Stay close to the user.');
		assert.strictEqual(englishResult.quotes[0].category, 'My Principles');
		assert.strictEqual(englishResult.quotes[0].language, constants.LANG_CUSTOM);
	});

	test('All category includes custom quotes without breaking built-in language filtering', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('My Principles');
		await store.addQuote(category.id, 'Remember why this matters.');
		const repository = new QuoteRepository(undefined, store);

		const result = repository.findQuotes(constants.CATEGORY_ALL, constants.LANG_ENGLISH);

		assert.strictEqual(result.supported, true);
		assert.ok(result.quotes.some(quote => quote.sentence === 'Remember why this matters.'));
		assert.ok(result.quotes.some(quote => quote.language === constants.LANG_ENGLISH));
	});

	test('selected empty custom category can refresh from placeholder to newly added quote', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('My Principles');
		const quoter = new Quoter(
			customCategoryKey(category.id),
			constants.LANG_ENGLISH,
			constants.DEFAULT_DISPLAY_SECONDS,
			new QuoteRepository(undefined, store),
		);

		assert.strictEqual(quoter.quoteModalText, 'No custom quotes in "My Principles" yet. Add one from the Command Palette or Settings JSON.');

		await store.addQuote(category.id, 'Ship small, verify honestly.');
		quoter.refreshQuotes();

		assert.strictEqual(quoter.quoteText, '$(quote) Ship small, verify honestly.');
		assert.strictEqual(quoter.quoteTooltip, `"My Principles" in "${constants.LANG_CUSTOM}"`);
		assert.strictEqual(quoter.quoteModalText, 'Ship small, verify honestly.');
	});

	test('quoter displays, shuffles, and notifies custom quotes', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('Focus');
		await store.addQuote(category.id, 'First quote');
		await store.addQuote(category.id, 'Second quote');
		const quoterRandomValues = [0, 0.6];
		const quoter = new Quoter(
			customCategoryKey(category.id),
			constants.LANG_KOREAN,
			constants.DEFAULT_DISPLAY_SECONDS,
			new QuoteRepository(undefined, store),
			() => quoterRandomValues.shift() ?? 0,
		);

		const changed = new Promise<void>(resolve => {
			const disposable = quoter.onTimeChanged(() => {
				disposable.dispose();
				resolve();
			});
		});

		quoter.displayRandomQuote();
		await changed;

		assert.strictEqual(quoter.quoteText, '$(quote) Second quote');
		assert.strictEqual(quoter.quoteTooltip, `"Focus" in "${constants.LANG_CUSTOM}"`);
	});

	test('timer rotates custom quotes with the configured interval', async function () {
		this.timeout(4000);
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('Focus');
		await store.addQuote(category.id, 'First quote');
		await store.addQuote(category.id, 'Second quote');
		const quoterRandomValues = [0, 0.6];
		const quoter = new Quoter(
			customCategoryKey(category.id),
			constants.LANG_ENGLISH,
			1,
			new QuoteRepository(undefined, store),
			() => quoterRandomValues.shift() ?? 0,
		);

		try {
			const changed = new Promise<void>(resolve => {
				const disposable = quoter.onTimeChanged(() => {
					disposable.dispose();
					resolve();
				});
			});
			quoter.start();
			await changed;

			assert.strictEqual(quoter.quoteText, '$(quote) Second quote');
		} finally {
			quoter.stop();
		}
	});

	test('deleting a selected custom category clears selected category state', async () => {
		const storage = new InMemoryCustomQuoteStorage();
		const store = new CustomQuoteStore(storage);
		const category = await store.addCategory('Focus');

		await store.setSelectedCustomCategoryId(category.id);
		await store.deleteCategory(category.id);

		assert.strictEqual(storage.get<string | undefined>(SELECTED_CUSTOM_CATEGORY_KEY, undefined), undefined);
	});

	test('renaming a category rejects duplicate category names', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const first = await store.addCategory('Focus');
		const second = await store.addCategory('Principles');

		await assert.rejects(() => store.renameCategory(second.id, first.name), /Custom category name is already used/);
	});


	test('settings category picker sentinel resolves to All until the picker selects a concrete category', () => {
		assert.strictEqual(runtimeCategory(constants.CATEGORY_CHOOSE_CUSTOM), constants.CATEGORY_ALL);
	});

	test('runtime configuration uses persisted selected custom category on activation', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('Persisted Focus');

		await store.setSelectedCustomCategoryId(category.id);
		const configuration = initialRuntimeConfiguration({
			category: constants.CATEGORY_ALL,
			language: constants.LANG_ENGLISH,
			displaySeconds: constants.DEFAULT_DISPLAY_SECONDS,
			displayShuffleButton: true,
		}, store);

		assert.strictEqual(configuration.category, customCategoryKey(category.id));
	});

	test('editing and deleting quotes preserves unrelated quotes', async () => {
		const store = new CustomQuoteStore(new InMemoryCustomQuoteStorage());
		const category = await store.addCategory('Focus');
		const first = await store.addQuote(category.id, 'First');
		const second = await store.addQuote(category.id, 'Second');

		await store.updateQuote(first.id, 'Updated first');
		await store.deleteQuote(second.id);

		assert.deepStrictEqual(store.getState().categories.Focus, ['Updated first']);
	});
});
