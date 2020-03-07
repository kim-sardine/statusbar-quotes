​
import * as vscode from 'vscode';
import * as constants from './constants';

export function activate(context: vscode.ExtensionContext) {
	const vsConfiguration = vscode.workspace.getConfiguration("statusbar-quotes");

	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBarItem.show();

	context.subscriptions.push(statusBarItem);
​

	let initial_category: string = vsConfiguration.get("category", constants.CATEGORY_WISE_SAYING);
	let initial_language: string = vsConfiguration.get("language", constants.LANG_ENGLISH);
	const quoter = new Quoter(initial_category, initial_language);

	quoter.start();
	quoter.onTimeChanged((args) => {
		statusBarItem.text = 'tt';
		statusBarItem.tooltip = args.wiseSayDisplay;
	});
​
	
	const cmdSelectLanguage = vscode.commands.registerCommand('statusbar-quotes.select-language', async () => {
		let language = await vscode.window.showQuickPick([constants.LANG_ENGLISH, constants.LANG_KOREAN], { placeHolder: `Select Language` });
		if (!language) { return; }
​
		await vsConfiguration.update("language", language, true);
		quoter.setLanguage(language);
	});
	context.subscriptions.push(cmdSelectLanguage);
​
	
	const cmdSelectCatrgory = vscode.commands.registerCommand('statusbar-quotes.select-category', async () => {
		let category = await vscode.window.showQuickPick([constants.CATEGORY_WISE_SAYING, constants.CATEGORY_HUMOR], { placeHolder: `Select category` });
		if (!category) { return; }
​
		await vsConfiguration.update("category", category, true);
		quoter.setCategory(category);
	});
	context.subscriptions.push(cmdSelectCatrgory);
​
​
	const onConfigurationChanged = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('statusbar-quotes.language')) {
			let changed_language: string = vsConfiguration.get("language", constants.LANG_ENGLISH);
			quoter.setLanguage(changed_language);
		}
		else if (event.affectsConfiguration('statusbar-quotes.category')) {
			let changed_category: string = vsConfiguration.get("category", constants.CATEGORY_WISE_SAYING);
			quoter.setCategory(changed_category);
		}
	});
	context.subscriptions.push(onConfigurationChanged);
}
​
​
class Quoter {
	private timeChangedEventEmitter = new vscode.EventEmitter<TimeChangedEventArgs>();
	
	readonly DISPLAY_TIME_IN_SEC = 5;
​
	private elapsedSeconds: number;
	private quoteList: string[];
	private quoteDisplay: string;
	private category: string;
	private language: string;
	private interval: NodeJS.Timer | undefined;
	
​
	private _WISE_SAY_OBJ: { [id: string] : string[] } = {
		English: [
			"Common sense is genius dressed in its working clothes.",
			"Deal with the faults of others as gently as your own.",
			"Justice is truth in action.",
			"A new broom sweeps clean but an old broom knows the corners.",
			"Give a man a fish and you feed him for a day; teach a man to fish and he'll eat forever.",
			"He who has a why to live can bear almost any how.",
			"Silence is often misinterpreted but never misquoted.",
			"Lost time is never found again.",
			"The wise understand by themselves; fools follow the reports of others.",
			"One should speak little with others and much with oneself.",
			"When you say one thing, the clever person understands three.",
			"Plan your life like you will live forever, and live your life like you will die the next day.",
			"Wisdom is ofttimes nearer when we stoop than when we soar.",
			"A proverb is one man's wit and all men's wisdom.",
			"A blind person who sees is better than a seeing person who is blind.",
			"A proverb is a short sentence based on long experience.",
			"Economy is the wealth of the poor and the wisdom of the rich.",
			"Even a fish wouldn't get into trouble if it kept its mouth shut.",
			"He that respects himself is safe from others.",
			"He who flees at the right time can fight again.",
			"A crown's no cure for a headache.",
			"Life is a journey, not a destination.",
			"Money buys everything but good sense.",
			"In bad things be slow; in good things be fast.",
			"Just because something is common sense doesn't mean it's common practice.",
			"Nothing is impossible to the willing mind.",
			"One head cannot hold all wisdom.",
			"Plan your life at New Year's, your day at dawn.",
			"Proverbs are the daughters of experience.",
		],
		Korean: [
			'그래도 지구는 돈다',
			'나는 생각한다 고로 나는 존재한다',
			'달리는 기차 위에 중립은 없다',
			'모든 국가는 그에 걸맞은 정부를 가진다',
			'박수칠 때 떠나라',
			'빛이 있으라',
			'빵이 없으면 케이크를 먹으면 되지',
			'신은 죽었다',
			'싸움이 급하니 나의 죽음을 알리지 말라',
			'역사를 잊은 민족에게 미래는 없다',
			'왔노라, 보았노라, 이겼노라',
			'이것 또한 지나가리라',
			'일찍 일어나는 새가 벌레를 잡는다',
			'적의 적은 나의 친구',
			'종교는 인민의 아편이다',
			'죄는 미워하되 사람은 미워하지 말라',
			'주사위는 던져졌다',
		],
	};
​
	constructor(initial_category: string, initial_language: string) {
		this.elapsedSeconds = 0;
		this.category = initial_category;
		this.language = initial_language;
		this.quoteList = [];
		this.quoteDisplay = '';
				​
		this.updateQuoteListAndChangeDisplay();
	}

	get onTimeChanged(): vscode.Event<TimeChangedEventArgs> {
		return this.timeChangedEventEmitter.event;
	}

	private updateQuoteListAndChangeDisplay(): void {
		this.quoteList = this._WISE_SAY_OBJ[this.language];
		this.setQuoteDisplay(this.quoteList[0]);
	}

	private setQuoteDisplay(quote: string): void {
		this.quoteDisplay = quote;
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
		if (this.elapsedSeconds >= this.DISPLAY_TIME_IN_SEC) {
			this.elapsedSeconds = 0;
			
			var quote = this.quoteList[Math.floor(Math.random() * this.quoteList.length)];
			this.setQuoteDisplay(quote);
		}
		this.elapsedSeconds += 1;
		this.fireTimeChangedEvent(this.elapsedSeconds, this.quoteDisplay);
	}

	public start() {
		this.interval = setInterval(() => {
			this.tick();
		}, 1000);
	}
	​
	public setLanguage(language: string) {
		this.updateQuoteListAndChangeDisplay();
		this.language = language;
	}
​
	​
	public setCategory(category: string) {
		this.updateQuoteListAndChangeDisplay();
		this.category = category;
	}
​
}
​
export interface TimeChangedEventArgs {
	elapsedSeconds: number,
	wiseSayDisplay: string,
}
​
export function deactivate() {}
