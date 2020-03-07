import * as constants from './constants';

interface Quotes
{
    category: string;
    language: string;
    sentences: string[];
}

const quotes: Quotes[] = [
    {
        category: constants.CATEGORY_WISE_SAYING,
        language: constants.LANG_ENGLISH,
        sentences: [
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
    },
    {
        category: constants.CATEGORY_WISE_SAYING,
        language: constants.LANG_KOREAN,
        sentences: [
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
    }
];

export default quotes;