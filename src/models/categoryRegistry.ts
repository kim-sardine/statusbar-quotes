import * as constants from '../constants';

export interface CategoryDefinition {
	readonly displayName: string;
	readonly quoteGroupKey: string;
}

export const categoryDefinitions: readonly CategoryDefinition[] = [
	{
		displayName: constants.CATEGORY_WISE_SAYING,
		quoteGroupKey: 'wise_saying',
	},
	{
		displayName: constants.CATEGORY_PROGRAMMING,
		quoteGroupKey: 'programming',
	},
	{
		displayName: constants.CATEGORY_STARTUP,
		quoteGroupKey: 'startup',
	},
	{
		displayName: constants.CATEGORY_HTWFAIP,
		quoteGroupKey: 'how_to_win_friends_and_influence_people_dale_carnegie',
	},
];

export const supportedCategories: readonly string[] = [
	constants.CATEGORY_ALL,
	...categoryDefinitions.map(category => category.displayName),
];

export const supportedLanguages: readonly string[] = [
	constants.LANG_ENGLISH,
	constants.LANG_KOREAN,
];

export function quoteGroupKeyForCategory(category: string): string | undefined {
	return categoryDefinitions.find(definition => definition.displayName === category)?.quoteGroupKey;
}
