class Quotes {
	constructor(
		public readonly language: string,
		public readonly category: string,
		public readonly sentences: readonly string[],
	) { }
}

export default Quotes;
