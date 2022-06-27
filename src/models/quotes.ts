// interface Quotes {
//     language: string;
//     sentences: string[];
// }

// export default Quotes;

class Quotes {
    language: string;
    category: string;
    sentences: string[];

    constructor(language: string, category: string, sentences: string[]) {
        this.language = language;
        this.category = category;
        this.sentences = sentences;
    }  
}

export default Quotes;
