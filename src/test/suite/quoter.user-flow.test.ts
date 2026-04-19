import * as assert from 'assert';
import Quoter from '../../models/quoter';
import Quotes from '../../models/quotes';
import * as constants from '../../constants';
import * as quoteGroups from '../../quotes';

interface ExpectedQuote {
	category: string;
	language: string;
	sentence: string;
}

const supportedCategories = [
	constants.CATEGORY_WISE_SAYING,
	constants.CATEGORY_PROGRAMMING,
	constants.CATEGORY_STARTUP,
	constants.CATEGORY_HTWFAIP,
];

const supportedLanguages = [
	constants.LANG_ENGLISH,
	constants.LANG_KOREAN,
];

function allQuoteCollections(): Quotes[] {
	return (Object.values(quoteGroups) as Quotes[][]).flat();
}

function quotesFor(category: string, language: string): ExpectedQuote[] {
	return allQuoteCollections()
		.filter(quotes => quotes.category === category && quotes.language === language)
		.flatMap(quotes => quotes.sentences.map(sentence => ({
			category: quotes.category,
			language: quotes.language,
			sentence,
		})));
}

function allQuotesFor(language: string): ExpectedQuote[] {
	return allQuoteCollections()
		.filter(quotes => quotes.language === language)
		.flatMap(quotes => quotes.sentences.map(sentence => ({
			category: quotes.category,
			language: quotes.language,
			sentence,
		})));
}

function randomValueForIndex(index: number, length: number): number {
	return (index + 0.1) / length;
}

function withRandomValues<T>(values: number[], action: () => T): T {
	const originalRandom = Math.random;
	let nextValueIndex = 0;
	Math.random = () => values[Math.min(nextValueIndex++, values.length - 1)];

	try {
		return action();
	} finally {
		Math.random = originalRandom;
	}
}

async function withRandomValuesAsync<T>(values: number[], action: () => Promise<T>): Promise<T> {
	const originalRandom = Math.random;
	let nextValueIndex = 0;
	Math.random = () => values[Math.min(nextValueIndex++, values.length - 1)];

	try {
		return await action();
	} finally {
		Math.random = originalRandom;
	}
}

function assertDisplayedQuote(quoter: Quoter, expected: ExpectedQuote): void {
	assert.strictEqual(quoter.quoteText, `$(quote) ${expected.sentence}`);
	assert.strictEqual(quoter.quoteTooltip, `"${expected.category}" in "${expected.language}"`);
	assert.strictEqual(quoter.quoteModalText, expected.sentence);
}

function stopQuoter(quoter: Quoter): void {
	quoter.stop();
}

function waitForNextChange(quoter: Quoter): Promise<void> {
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => {
			disposable.dispose();
			reject(new Error('Timed out waiting for quote change event.'));
		}, 2500);

		const disposable = quoter.onTimeChanged(() => {
			clearTimeout(timeout);
			disposable.dispose();
			resolve();
		});
	});
}

suite('Quoter user flow regression', () => {
	for (const category of supportedCategories) {
		for (const language of supportedLanguages) {
			test(`displays a ${language} quote from ${category}`, () => {
				const expectedQuotes = quotesFor(category, language);
				assert.ok(expectedQuotes.length > 0, `Expected fixture quotes for ${category} in ${language}.`);

				withRandomValues([0], () => {
					const quoter = new Quoter(category, language, constants.DEFAULT_DISPLAY_SECONDS);

					assertDisplayedQuote(quoter, expectedQuotes[0]);
				});
			});
		}
	}

	test('All category displays quotes from the selected language and keeps the source category in the tooltip', () => {
		const expectedQuotes = allQuotesFor(constants.LANG_ENGLISH);
		assert.ok(expectedQuotes.length > supportedCategories.length);

		withRandomValues([randomValueForIndex(expectedQuotes.length - 1, expectedQuotes.length)], () => {
			const quoter = new Quoter(constants.CATEGORY_ALL, constants.LANG_ENGLISH, constants.DEFAULT_DISPLAY_SECONDS);

			assertDisplayedQuote(quoter, expectedQuotes[expectedQuotes.length - 1]);
			assert.notStrictEqual(quoter.quoteTooltip, `"${constants.CATEGORY_ALL}" in "${constants.LANG_ENGLISH}"`);
		});
	});

	test('changing category and language reloads the quote shown to the user', () => {
		const firstWiseSaying = quotesFor(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH)[0];
		const firstStartup = quotesFor(constants.CATEGORY_STARTUP, constants.LANG_ENGLISH)[0];
		const firstKoreanStartup = quotesFor(constants.CATEGORY_STARTUP, constants.LANG_KOREAN)[0];

		withRandomValues([0, 0, 0], () => {
			const quoter = new Quoter(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH, constants.DEFAULT_DISPLAY_SECONDS);
			assertDisplayedQuote(quoter, firstWiseSaying);

			quoter.setCategory(constants.CATEGORY_STARTUP);
			assertDisplayedQuote(quoter, firstStartup);

			quoter.setLanguage(constants.LANG_KOREAN);
			assertDisplayedQuote(quoter, firstKoreanStartup);
		});
	});

	test('shuffle displays another quote from the current category and language', () => {
		const expectedQuotes = quotesFor(constants.CATEGORY_PROGRAMMING, constants.LANG_ENGLISH);
		assert.ok(expectedQuotes.length > 1);

		withRandomValues([0, randomValueForIndex(1, expectedQuotes.length)], () => {
			const quoter = new Quoter(constants.CATEGORY_PROGRAMMING, constants.LANG_ENGLISH, constants.DEFAULT_DISPLAY_SECONDS);
			assertDisplayedQuote(quoter, expectedQuotes[0]);

			quoter.initElapsedSeconds();
			quoter.displayRandomQuote();

			assertDisplayedQuote(quoter, expectedQuotes[1]);
		});
	});

	test('shuffle notifies the UI immediately after changing the quote', async () => {
		const expectedQuotes = quotesFor(constants.CATEGORY_PROGRAMMING, constants.LANG_ENGLISH);
		assert.ok(expectedQuotes.length > 1);

		await withRandomValuesAsync([0, randomValueForIndex(1, expectedQuotes.length)], async () => {
			const quoter = new Quoter(constants.CATEGORY_PROGRAMMING, constants.LANG_ENGLISH, constants.DEFAULT_DISPLAY_SECONDS);
			const changed = waitForNextChange(quoter);

			quoter.displayRandomQuote();
			await changed;

			assertDisplayedQuote(quoter, expectedQuotes[1]);
		});
	});

	test('category and language changes notify the UI immediately', async () => {
		const firstStartup = quotesFor(constants.CATEGORY_STARTUP, constants.LANG_ENGLISH)[0];
		const firstKoreanStartup = quotesFor(constants.CATEGORY_STARTUP, constants.LANG_KOREAN)[0];

		await withRandomValuesAsync([0, 0, 0], async () => {
			const quoter = new Quoter(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH, constants.DEFAULT_DISPLAY_SECONDS);

			const categoryChanged = waitForNextChange(quoter);
			quoter.setCategory(constants.CATEGORY_STARTUP);
			await categoryChanged;
			assertDisplayedQuote(quoter, firstStartup);

			const languageChanged = waitForNextChange(quoter);
			quoter.setLanguage(constants.LANG_KOREAN);
			await languageChanged;
			assertDisplayedQuote(quoter, firstKoreanStartup);
		});
	});

	test('timer changes the displayed quote after the configured interval', async function () {
		this.timeout(4000);
		const expectedQuotes = quotesFor(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH);
		assert.ok(expectedQuotes.length > 1);

		await withRandomValuesAsync([0, randomValueForIndex(1, expectedQuotes.length)], async () => {
			const quoter = new Quoter(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH, 1);
			assertDisplayedQuote(quoter, expectedQuotes[0]);

			try {
				const changed = waitForNextChange(quoter);
				quoter.start();
				await changed;

				assertDisplayedQuote(quoter, expectedQuotes[1]);
			} finally {
				stopQuoter(quoter);
			}
		});
	});

	test('zero display seconds keeps the same quote while still notifying the UI', async function () {
		this.timeout(4000);
		const expectedQuote = quotesFor(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH)[0];

		await withRandomValuesAsync([0], async () => {
			const quoter = new Quoter(constants.CATEGORY_WISE_SAYING, constants.LANG_ENGLISH, 0);
			assertDisplayedQuote(quoter, expectedQuote);

			try {
				const changed = waitForNextChange(quoter);
				quoter.start();
				await changed;

				assertDisplayedQuote(quoter, expectedQuote);
			} finally {
				stopQuoter(quoter);
			}
		});
	});
});
