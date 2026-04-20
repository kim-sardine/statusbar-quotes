import * as vscode from 'vscode';
import * as constants from './constants';
import { extensionConfiguration, readExtensionConfiguration, StatusBarQuotesConfiguration } from './extensionConfiguration';
import { builtInCategories, supportedLanguages } from './models/categoryRegistry';
import { CustomCategory, CustomQuote, customCategoryKey } from './models/customQuote';
import { CustomQuoteStore } from './models/customQuoteStore';
import QuoteRepository from './models/quoteRepository';
import Quoter from './models/quoter';

interface CategoryQuickPickItem extends vscode.QuickPickItem {
	readonly category: string;
	readonly customCategoryId?: string;
}

export function initialRuntimeConfiguration(
	configuration: StatusBarQuotesConfiguration,
	customQuoteStore: CustomQuoteStore,
): StatusBarQuotesConfiguration {
	const selectedCustomCategoryId = customQuoteStore.getSelectedCustomCategoryId();
	return {
		...configuration,
		category: selectedCustomCategoryId ? customCategoryKey(selectedCustomCategoryId) : runtimeCategory(configuration.category),
	};
}

export function runtimeCategory(category: string): string {
	return category === constants.CATEGORY_CHOOSE_CUSTOM ? constants.CATEGORY_ALL : category;
}

class StatusBarQuoteController implements vscode.Disposable {
	private readonly statusBarItem: vscode.StatusBarItem;
	private readonly statusBarItemForShuffle: vscode.StatusBarItem;
	private readonly customQuoteStore: CustomQuoteStore;
	private readonly quoter: Quoter;
	private readonly disposables: vscode.Disposable[] = [];
	private configuration: StatusBarQuotesConfiguration;

	constructor(
		context: vscode.ExtensionContext,
		initialConfiguration: StatusBarQuotesConfiguration = readExtensionConfiguration(),
	) {
		this.customQuoteStore = CustomQuoteStore.fromMemento(context.globalState);
		this.configuration = initialRuntimeConfiguration(initialConfiguration, this.customQuoteStore);
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);
		this.statusBarItem.command = constants.CMD_SHOW_QUOTE_ON_MODAL;
		this.statusBarItem.show();

		this.statusBarItemForShuffle = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
		this.statusBarItemForShuffle.text = '$(search-refresh)';
		this.statusBarItemForShuffle.tooltip = 'Click to see new quotes';
		this.statusBarItemForShuffle.command = constants.CMD_SHUFFLE_QUOTES;
		this.setShuffleButtonVisible(initialConfiguration.displayShuffleButton);

		this.quoter = new Quoter(
			this.configuration.category,
			initialConfiguration.language,
			initialConfiguration.displaySeconds,
			new QuoteRepository(undefined, this.customQuoteStore),
		);

		this.disposables.push(
			this.statusBarItem,
			this.statusBarItemForShuffle,
			this.quoter,
			this.quoter.onTimeChanged(() => this.renderQuote()),
			...this.registerCommands(),
			vscode.workspace.onDidChangeConfiguration(event => {
				void this.onConfigurationChanged(event);
			}),
		);

		this.renderQuote();
		this.quoter.start();
	}

	public dispose(): void {
		while (this.disposables.length > 0) {
			this.disposables.pop()?.dispose();
		}
	}

	private registerCommands(): vscode.Disposable[] {
		return [
			vscode.commands.registerCommand(constants.CMD_SHOW_QUOTE_ON_MODAL, () => {
				vscode.window.showInformationMessage(this.quoter.quoteModalText);
			}),
			vscode.commands.registerCommand(constants.CMD_CHANGE_CATEGORY, async () => {
				const selectedCategory = await vscode.window.showQuickPick(this.categoryQuickPickItems(), { placeHolder: 'Select category' });
				if (!selectedCategory) { return; }

				await this.selectCategory(selectedCategory);
			}),
			vscode.commands.registerCommand(constants.CMD_CHANGE_LANGUAGE, async () => {
				const language = await vscode.window.showQuickPick([...supportedLanguages], { placeHolder: 'Select Language' });
				if (!language) { return; }

				await extensionConfiguration().update('language', language, true);
				this.applyLanguage(language);
			}),
			vscode.commands.registerCommand(constants.CMD_CHANGE_DISPLAY_SECONDS, async () => {
				const displaySeconds = await vscode.window.showInputBox({
					prompt: 'Quote change time interval (seconds)',
					placeHolder: `Range : 0 (do not change quote) ~ ${constants.MAXIMUM_DISPLAY_SECONDS} (${constants.MAXIMUM_DISPLAY_SECONDS_HUMANIZE})`,
				});
				const parsedDisplaySeconds = this.parseDisplaySeconds(displaySeconds);
				if (parsedDisplaySeconds === undefined) {
					vscode.window.showWarningMessage(`You can only enter number between 0 and ${constants.MAXIMUM_DISPLAY_SECONDS}`);
					return;
				}

				await extensionConfiguration().update('display-seconds', parsedDisplaySeconds, true);
				this.applyDisplaySeconds(parsedDisplaySeconds);
			}),
			vscode.commands.registerCommand(constants.CMD_SHUFFLE_QUOTES, async () => {
				this.quoter.initElapsedSeconds();
				this.quoter.displayRandomQuote();
			}),
			vscode.commands.registerCommand(constants.CMD_ADD_CUSTOM_CATEGORY, async () => {
				await this.addCustomCategoryAndSelect();
			}),
			vscode.commands.registerCommand(constants.CMD_MANAGE_CUSTOM_CATEGORIES, async () => {
				await this.manageCustomCategories();
			}),
			vscode.commands.registerCommand(constants.CMD_ADD_CUSTOM_QUOTE, async () => {
				await this.addCustomQuote();
			}),
			vscode.commands.registerCommand(constants.CMD_MANAGE_CUSTOM_QUOTES, async () => {
				await this.manageCustomQuotes();
			}),
		];
	}

	private parseDisplaySeconds(displaySeconds: string | undefined): number | undefined {
		if (!displaySeconds) {
			return undefined;
		}

		const parsedDisplaySeconds = Number.parseInt(displaySeconds, 10);
		if (Number.isNaN(parsedDisplaySeconds)) {
			return undefined;
		}

		return Math.min(parsedDisplaySeconds, constants.MAXIMUM_DISPLAY_SECONDS);
	}

	private async onConfigurationChanged(event: vscode.ConfigurationChangeEvent): Promise<void> {
		const nextConfiguration = readExtensionConfiguration();

		if (event.affectsConfiguration(constants.SETTING_CATEGORY)) {
			await this.applySettingCategory(nextConfiguration.category);
		}
		if (event.affectsConfiguration(constants.SETTING_LANGUAGE)) {
			this.applyLanguage(nextConfiguration.language);
		}
		if (event.affectsConfiguration(constants.SETTING_DISPLAY_SECONDS)) {
			this.applyDisplaySeconds(nextConfiguration.displaySeconds);
		}
		if (event.affectsConfiguration(constants.SETTING_DISPLAY_SHUFFLE_BUTTON)) {
			this.applyShuffleButtonVisible(nextConfiguration.displayShuffleButton);
		}
	}

	private async selectCategory(categoryItem: CategoryQuickPickItem): Promise<void> {
		if (categoryItem.customCategoryId) {
			await this.customQuoteStore.setSelectedCustomCategoryId(categoryItem.customCategoryId);
			this.applyCategory(categoryItem.category);
			return;
		}

		await this.customQuoteStore.setSelectedCustomCategoryId(undefined);
		await extensionConfiguration().update('category', categoryItem.category, true);
		this.applyCategory(categoryItem.category);
	}

	private async applySettingCategory(category: string): Promise<void> {
		await this.customQuoteStore.setSelectedCustomCategoryId(undefined);
		if (category === constants.CATEGORY_CHOOSE_CUSTOM) {
			await this.openCategoryPickerFromSettings();
			return;
		}

		this.applyCategory(category);
	}

	private async openCategoryPickerFromSettings(): Promise<void> {
		const selectedCategory = await vscode.window.showQuickPick(this.categoryQuickPickItems(), {
			placeHolder: 'Select a built-in or custom category',
		});
		if (!selectedCategory) {
			return;
		}

		await this.selectCategory(selectedCategory);
	}

	private categoryQuickPickItems(): CategoryQuickPickItem[] {
		return [
			...builtInCategories.map(category => ({
				label: category,
				description: 'Built-in',
				category,
			})),
			...this.customQuoteStore.listCategories().map(category => ({
				label: category.name,
				description: 'Custom category',
				category: customCategoryKey(category.id),
				customCategoryId: category.id,
			})),
		];
	}

	private async addCustomCategoryAndSelect(): Promise<CustomCategory | undefined> {
		const category = await this.promptForCustomCategory();
		if (!category) {
			return undefined;
		}

		await this.customQuoteStore.setSelectedCustomCategoryId(category.id);
		this.applyCategory(customCategoryKey(category.id));
		return category;
	}

	private async promptForCustomCategory(value?: string): Promise<CustomCategory | undefined> {
		const name = await vscode.window.showInputBox({
			prompt: 'Name this custom quote category',
			placeHolder: 'My Principles',
			value,
		});
		if (name === undefined) {
			return undefined;
		}

		try {
			return await this.customQuoteStore.addCategory(name);
		} catch (error) {
			this.showError(error);
			return undefined;
		}
	}

	private async addCustomQuote(): Promise<void> {
		const category = await this.pickCustomCategoryOrCreate('Select a custom category for this quote');
		if (!category) {
			return;
		}

		const sentence = await vscode.window.showInputBox({
			prompt: 'Add a custom quote to keep in sight while you code',
			placeHolder: 'Ship small, verify honestly.',
		});
		if (sentence === undefined) {
			return;
		}

		try {
			await this.customQuoteStore.addCustomQuote(category.id, sentence);
			await this.customQuoteStore.setSelectedCustomCategoryId(category.id);
			this.refreshOrSelectCustomCategory(category.id);
		} catch (error) {
			this.showError(error);
		}
	}

	private async pickCustomCategoryOrCreate(placeHolder: string): Promise<CustomCategory | undefined> {
		const createCategoryItem: CategoryQuickPickItem = {
			label: '$(plus) Create new custom category',
			category: '',
		};
		const categoryItems = this.customQuoteStore.listCategories().map(category => ({
			label: category.name,
			description: 'Custom category',
			category: customCategoryKey(category.id),
			customCategoryId: category.id,
		}));
		const selectedCategory = await vscode.window.showQuickPick([
			...categoryItems,
			createCategoryItem,
		], { placeHolder });

		if (!selectedCategory) {
			return undefined;
		}
		if (!selectedCategory.customCategoryId) {
			return await this.promptForCustomCategory();
		}

		return this.customQuoteStore.listCategories().find(category => category.id === selectedCategory.customCategoryId);
	}

	private async manageCustomCategories(): Promise<void> {
		const category = await this.pickExistingCustomCategory('Select a custom category to manage');
		if (!category) {
			return;
		}

		const action = await vscode.window.showQuickPick(['Rename category', 'Delete category'], { placeHolder: `Manage ${category.name}` });
		if (!action) {
			return;
		}

		if (action === 'Rename category') {
			await this.renameCustomCategory(category);
			return;
		}

		await this.deleteCustomCategory(category);
	}

	private async renameCustomCategory(category: CustomCategory): Promise<void> {
		const name = await vscode.window.showInputBox({
			prompt: 'Rename this custom quote category',
			value: category.name,
		});
		if (name === undefined) {
			return;
		}

		try {
			await this.customQuoteStore.renameCategory(category.id, name);
			this.refreshIfCategoryIsVisible(category.id);
		} catch (error) {
			this.showError(error);
		}
	}

	private async deleteCustomCategory(category: CustomCategory): Promise<void> {
		const confirmed = await vscode.window.showWarningMessage(
			`Delete "${category.name}" and all custom quotes in it?`,
			{ modal: true },
			'Delete',
		);
		if (confirmed !== 'Delete') {
			return;
		}

		try {
			await this.customQuoteStore.deleteCategory(category.id);
			if (this.configuration.category === customCategoryKey(category.id)) {
				this.applyCategory(constants.CATEGORY_ALL);
			} else {
				this.refreshIfAllIsVisible();
			}
		} catch (error) {
			this.showError(error);
		}
	}

	private async manageCustomQuotes(): Promise<void> {
		const quote = await this.pickExistingQuote('Select a custom quote to manage');
		if (!quote) {
			return;
		}

		const action = await vscode.window.showQuickPick(['Edit Custom Quote', 'Delete Custom Quote'], { placeHolder: quote.sentence });
		if (!action) {
			return;
		}

		if (action === 'Edit Custom Quote') {
			await this.editCustomQuote(quote);
			return;
		}

		await this.deleteCustomQuote(quote);
	}

	private async editCustomQuote(quote: CustomQuote): Promise<void> {
		const sentence = await vscode.window.showInputBox({
			prompt: 'Edit this custom quote',
			value: quote.sentence,
		});
		if (sentence === undefined) {
			return;
		}

		try {
			await this.customQuoteStore.updateQuote(quote.id, sentence);
			this.refreshIfCategoryIsVisible(quote.categoryId);
		} catch (error) {
			this.showError(error);
		}
	}

	private async deleteCustomQuote(quote: CustomQuote): Promise<void> {
		const confirmed = await vscode.window.showWarningMessage(
			'Delete this custom quote?',
			{ modal: true },
			'Delete',
		);
		if (confirmed !== 'Delete') {
			return;
		}

		try {
			await this.customQuoteStore.deleteCustomQuote(quote.id);
			this.refreshIfCategoryIsVisible(quote.categoryId);
		} catch (error) {
			this.showError(error);
		}
	}

	private async pickExistingCustomCategory(placeHolder: string): Promise<CustomCategory | undefined> {
		const categories = this.customQuoteStore.listCategories();
		if (categories.length === 0) {
			vscode.window.showInformationMessage('No custom categories yet.');
			return undefined;
		}

		const selectedCategory = await vscode.window.showQuickPick(categories.map(category => ({
			label: category.name,
			category: customCategoryKey(category.id),
			customCategoryId: category.id,
		})), { placeHolder });

		return selectedCategory?.customCategoryId
			? categories.find(category => category.id === selectedCategory.customCategoryId)
			: undefined;
	}

	private async pickExistingQuote(placeHolder: string): Promise<CustomQuote | undefined> {
		const quotes = this.customQuoteStore.listQuotes();
		if (quotes.length === 0) {
			vscode.window.showInformationMessage('No custom quotes yet.');
			return undefined;
		}

		const categoriesById = new Map(this.customQuoteStore.listCategories().map(category => [category.id, category.name]));
		const selectedQuote = await vscode.window.showQuickPick(quotes.map(quote => ({
			label: quote.sentence,
			description: categoriesById.get(quote.categoryId),
			quote,
		})), { placeHolder });

		return selectedQuote?.quote;
	}

	private applyCategory(category: string): void {
		if (this.configuration.category === category) {
			return;
		}

		this.configuration = { ...this.configuration, category };
		this.quoter.setCategory(category);
	}

	private applyLanguage(language: string): void {
		if (this.configuration.language === language) {
			return;
		}

		this.configuration = { ...this.configuration, language };
		this.quoter.setLanguage(language);
	}

	private applyDisplaySeconds(displaySeconds: number): void {
		if (this.configuration.displaySeconds === displaySeconds) {
			return;
		}

		this.configuration = { ...this.configuration, displaySeconds };
		this.quoter.setDisplaySeconds(displaySeconds);
	}

	private applyShuffleButtonVisible(displayShuffleButton: boolean): void {
		if (this.configuration.displayShuffleButton === displayShuffleButton) {
			return;
		}

		this.configuration = { ...this.configuration, displayShuffleButton };
		this.setShuffleButtonVisible(displayShuffleButton);
	}

	private refreshOrSelectCustomCategory(categoryId: string): void {
		const categoryKey = customCategoryKey(categoryId);
		if (this.configuration.category === categoryKey) {
			this.quoter.refreshQuotes();
			return;
		}

		this.applyCategory(categoryKey);
	}

	private refreshIfCategoryIsVisible(categoryId: string): void {
		if (this.configuration.category === customCategoryKey(categoryId)) {
			this.quoter.refreshQuotes();
			return;
		}

		this.refreshIfAllIsVisible();
	}

	private refreshIfAllIsVisible(): void {
		if (this.configuration.category === constants.CATEGORY_ALL) {
			this.quoter.refreshQuotes();
		}
	}

	private renderQuote(): void {
		this.statusBarItem.text = this.quoter.quoteText;
		this.statusBarItem.tooltip = this.quoter.quoteTooltip;
	}

	private setShuffleButtonVisible(visible: boolean): void {
		if (visible) {
			this.statusBarItemForShuffle.show();
		} else {
			this.statusBarItemForShuffle.hide();
		}
	}

	private showError(error: unknown): void {
		vscode.window.showWarningMessage(error instanceof Error ? error.message : 'Unable to update custom quotes.');
	}
}

export default StatusBarQuoteController;
