import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as constants from '../../constants';
import { categoryDefinitions, supportedCategories, supportedLanguages } from '../../models/categoryRegistry';
import * as quoteGroups from '../../quotes';

interface ExtensionManifest {
	contributes: {
		commands: Array<{
			command: string;
		}>;
		configuration: {
			properties: Record<string, {
				default?: unknown;
				enum?: string[];
			}>;
		};
	};
}

function readManifest(): ExtensionManifest {
	const manifestPath = path.resolve(__dirname, '../../../package.json');
	return JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as ExtensionManifest;
}

suite('Extension metadata consistency', () => {
	test('package category enum matches the category registry', () => {
		const manifest = readManifest();
		const categoryConfiguration = manifest.contributes.configuration.properties[constants.SETTING_CATEGORY];

		assert.deepStrictEqual(categoryConfiguration.enum, [...supportedCategories]);
	});

	test('package language enum matches the language registry', () => {
		const manifest = readManifest();
		const languageConfiguration = manifest.contributes.configuration.properties[constants.SETTING_LANGUAGE];

		assert.deepStrictEqual(languageConfiguration.enum, [...supportedLanguages]);
	});

	test('display seconds default matches the runtime default', () => {
		const manifest = readManifest();
		const displaySecondsConfiguration = manifest.contributes.configuration.properties[constants.SETTING_DISPLAY_SECONDS];

		assert.strictEqual(displaySecondsConfiguration.default, constants.DEFAULT_DISPLAY_SECONDS);
	});

	test('custom quotes setting uses the public quotes shape', () => {
		const manifest = readManifest();
		const customQuotesConfiguration = manifest.contributes.configuration.properties[constants.SETTING_CUSTOM_QUOTES];

		assert.deepStrictEqual(customQuotesConfiguration.default, {
			version: 2,
			categories: {},
		});
	});

	test('package command contributions include every user-facing command constant', () => {
		const manifest = readManifest();
		const commands = new Set(manifest.contributes.commands.map(command => command.command));

		assert.ok(commands.has(constants.CMD_CHANGE_CATEGORY));
		assert.ok(commands.has(constants.CMD_CHANGE_LANGUAGE));
		assert.ok(commands.has(constants.CMD_CHANGE_DISPLAY_SECONDS));
		assert.ok(commands.has(constants.CMD_ADD_CUSTOM_CATEGORY));
		assert.ok(commands.has(constants.CMD_MANAGE_CUSTOM_CATEGORIES));
		assert.ok(commands.has(constants.CMD_ADD_CUSTOM_QUOTE));
		assert.ok(commands.has(constants.CMD_MANAGE_CUSTOM_QUOTES));
	});

	test('every category registry entry points to an exported quote group', () => {
		for (const definition of categoryDefinitions) {
			assert.ok(
				Object.prototype.hasOwnProperty.call(quoteGroups, definition.quoteGroupKey),
				`Expected ${definition.quoteGroupKey} to be exported from src/quotes/index.ts`,
			);
		}
	});
});
