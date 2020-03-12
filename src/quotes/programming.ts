import * as constants from '../constants';
import Quotes from '../interface';

const data: Quotes[] = [
    {
        language: constants.LANG_ENGLISH,
        sentences: [
            "A common fallacy is to assume authors of incomprehensible code will be able to express themselves clearly in comments. - Kevlin Henney",
            "A computer is like a violin. You can imagine a novice trying ﬁrst a phonograph and then a violin. The latter, he says, sounds terrible. That is the argument we have heard from our humanists and most of our computer scientists. Computer programs are good, they say, for particular purposes, but they aren’t ﬂexible. Neither is a violin, or a typewriter, until you learn how to use it. - Marvin Minsky",
            "A conscious human is driven by their conscience, not popular opinion. - Suzy Kassem",
            "A distributed system is one in which the failure of a computer you didn’t even know existed can render your own computer unusable. - Leslie Lamport",
            "A language that doesn't affect the way you think about programming is not worth knowing. - Alan J. Perlis",
            "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live - John Woods",
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
            "Any sufficiently advanced bug is indistinguishable from a feature - R. Kulawiec",
            "Any sufficiently advanced incompetence is indistinguishable from malice - Grey’s Law",
            "Bad programmers worry about the code. Good programmers worry about data structures and their relationships. - Linus Torvalds",
            "Big Brother fills us all with the same crap. My guess is he was clever the same way everybody thinks they're clever. I tell her to type in 'password - Chuck Palahniuk, Lullaby",
            "C is memory with syntactic sugar. - Dennis Kubes",
            "Dynamic typing: The belief that you can’t explain to a computer why your code works, but you can keep track of it all in your head. - chris martin",
            "Give a man a program, frustrate him for a day. Teach a man to program, frustrate him for a lifetime. - Muhammad Waseem",
            "Give someone a program, you frustrate them for a day; teach them how to program, you frustrate them for a lifetime. - David Leinweber",
            "How you look at it is pretty much how you'll see it - Rasheed Ogunlaru",
            "I think that it’s extraordinarily important that we in computer science keep fun in computing. When it started out it was an awful lot of fun. Of course the paying customers got shafted every now and then and after a while we began to take their complaints seriously. We began to feel as if we really were responsible for the successful error-free perfect use of these machines. I don’t think we are. I think we’re responsible for stretching them setting them off in new directions and keeping fun in the house. I hope the ﬁeld of computer science never loses its sense of fun. Above all I hope we don’t become missionaries. Don’t feel as if you’re Bible sales-men. The world has too many of those already. What you know about computing other people will learn. Don’t feel as if the key to successful computing is only in your hands. What’s in your hands I think and hope is intelligence: the ability to see the machine as more than when you were ﬁrst led up to it that you can make it more. - Alan J. Perlis",
            "If you put a million monkeys on a million keyboards, one of them will eventually write a Java program. The rest of them will write Perl programs.",
            "I'm not a great programmer; I'm just a good programmer with great habits. - Kent Beck",
            "Much of the essence of building a program is in fact the debugging of the specification. - Fred Brooks",
            "Object-oriented programming offers a sustainable way to write spaghetti code. It lets you accrete programs as a series of patches. - Paul Graham, Hackers & Painters: Big Ideas from the Computer Age",
            "On two occasions, I have been asked [by members of Parliament], 'Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?' I am not able to rightly apprehend the kind of confusion of ideas that could provoke such a question. - Charles Babbage",
            "Perl – The only language that looks the same before and after RSA encryption. - Keith Bostic",
            "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the Universe trying to produce bigger and better idiots. So far, the Universe is winning. - Rick Cook",
            "Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson",
            "Punishments include such things as flashbacks, flooding of unbearable emotions, painful body memories, flooding of memories in which the survivor perpetrated against others, self-harm, and suicide attempts. - Alison Miller, Healing the Unimaginable: Treating Ritual Abuse and Mind Control",
            "Remember that code is really the language in which we ultimately express the requirements. We may create languages that are closer to the requirements. We may create tools that help us parse and assemble those requirements into formal structures. But we will never eliminate necessary precision—so there will always be code. - Robert C. Martin",
            "Sufficiently advanced abstractions are indistinguishable from obfuscation. - raganwald",
            "Sufficiently advanced trolling is indistinguishable from thought leadership. - Hall’s Law",
            "Talk is cheap. Show me the code. - Linus Torvalds",
            "That's the thing about people who think they hate computers. What they really hate is lousy programmers. - Larry Niven",
            "The act of describing a program in unambiguous detail and the act of programming are one and the same. - Kevlin Henney",
            "The best programs are written so that computing machines can perform them quickly and so that human beings can understand them clearly. A programmer is ideally an essayist who works with traditional aesthetic and literary forms as well as mathematical concepts, to communicate the way that an algorithm works and to convince a reader that the results will be correct. - Donald E. Knuth, Selected Papers on Computer Science",
            "The computer programmer is a creator of universes for which he alone is the lawgiver. No playwright, no stage director, no emperor, however powerful, has ever exercised such absolute authority to arrange a stage or field of battle and to command such unswervingly dutiful actors or troops. - Joseph Weizenbaum",
            "The most disastrous thing that you can ever learn is your first programming language. - Alan Kay",
            "The most important property of a program is whether it accomplishes the intention of its user. - C.A.R. Hoare",
            "Truth can only be found in one place: the code. - Robert C. Martin, Clean Code: A Handbook of Agile Software Craftsmanship",
            "Unix will give you enough rope to shoot yourself in the foot. If you didn’t think rope would do that, you should have read the man page. - mhoye",
            "Walking on water and developing software from a specification are easy if both are frozen. - Edward V. Berard",
            "When they first built the University of California at Irvine they just put the buildings in. They did not put any sidewalks, they just planted grass. The next year, they came back and put the sidewalks where the trails were in the grass. Perl is just that kind of language. It is not designed from first principles. Perl is those sidewalks in the grass. - Larry Wall",
            "when you don't create things, you become defined by your tastes rather than ability. your tastes only narrow & exclude people. so create. - Why The Lucky Stiff",
            "When your hammer is C++, everything begins to look like a thumb. - Steve Haflich",
            "You've baked a really lovely cake, but then you've used dog shit for frosting. - Steve Jobs",
        ],
    },
    {
        language: constants.LANG_KOREAN,
        sentences: [
            "Boolean 이 좋은 것은 당신이 설령 잘못했더라도 한 비트만 바꾸면 된다는 것이다.",
            "결국 당신 코드를 유지보수하게 될 친구가 당신이 어디에 사는지 아는 광폭한 싸이코패스가 될 것이라고 여기고 코드를 작성하라.",
            "낙관론은 프로그래머라는 직업 관점에서 위험물이다. 피드백이 해결책이다. - Kent Beck",
            "당신 대부분은 프로그래머의 미덕과 친숙하다. 미덕은 세 가지인데 당연히 게으름, 성급함, 오만이다.",
            "당신은 소프트웨어 품질을 추구할 수도 있고 포인터 연산을 할 수도 있다. 그러나 두 개를 동시에 할 수는 없다. - Bertrand Meyer",
            "당신이 6개월 이상 한 번도 보지 않은 코드는 다른 사람이 다시 만드는 게 훨씬 더 나을 수 있다. - Eagleson's Law",
            "동작하지 않는 훌륭한 설계의 코드보다는 그래도 작동하는 미흡한 설계의 코드가 낫다.",
            "말은 쉽지, 코드를 보여줘. - Linus Torvalds",
            "무료 소프트웨어를 두려워하는 사람들은 자신들의 제품이 그것보다 못하기 때문이다. - David Emery",
            "세상에는 딱 두 가지 프로그래밍 언어가 있다. 사람들이 욕하는 언어와 아무도 사용하지 않는 언어. - Bjarne Stroustrup",
            "소프트웨어 설계를 구성하는 데에는 두 가지 방법이 있다. 한가지 방법은 아주 단순하게 만들어서 명백히 결함이 없는 것이다. 그리고 다른 방법은 명백한 결함이 없을 정도로 아주 복잡하게 만드는 것이다.",
            "아무리 구조가 잘 되어 있더라도 프로그래머가 나쁜 프로그램을 만드는 것을 방지하는 프로그래밍 언어는 없다. - Larry Flon",
            "애초에 디버깅은 코드를 작성하는 것 보다 배나 힘들다. 그러니 코드를 최대한 꼼꼼하게 작성하는 사람은 당연히 디버그할 정도로 똑똑하지 않은 것이다.",
            "에러 없는 프로그램을 만드는 데는 두가지 방법이 있다. 그런데 세번째 것만 작동한다. -  Alan J. Perlis",
            "올바로 작동하지 않는다고 걱정하지 마라. 만일 모든 게 잘 된다면 굳이 당신이 일할 이유가 없다. - Mosher's Law of Software Engineering",
            "완벽함이란 더 이상 추가할 것이 없을 때 이루어지는 것이 아니라 더 이상 버릴 것이 없을 때 이루어진다. - 에릭 레이몬드",
            "우리의 소프트웨어는 의미있는 요구사항을 거의 가지고 있지 않다. 그럼에도 불구하고 유일한 성공의 척도는 우리의 솔루션이 갈팡질팡하는 고객의 문제점을 해결해 줄 수 있느냐 하는 것이다. - Jeff Atwood",
            "좋은 디자인은 그 때문에 소모되는 비용보다 빠르게 가치가 쌓인다. - Thomas C. Gale",
            "좋은 프로그래머는 자신들의 두뇌를 사용한다. 그러나 좋은 가이드라인은 모든 케이스를 고려해야만 하는 노력을 줄여준다. - Francis Glassborow",
            "최고의 프로그래머는 그냥 좋은 프로그래머들보다 조금 더 나은 게 아니다. 그들은 어떻게 측정하던 간에 보통 사람들 보다 한 자리 수 이상이다. : 창의력, 스피드, 설계능력, 문제해결 능력까지. - Randall E. Stross",
            "컴퓨터 언어를 설계하는 것은 공원을 산책하는 것과 같다. '쥬라기 공원!!!' - Larry Wall",
            "코드 수를 기준으로 프로그램의 진도를 측정하는 것은 비행기 제작 진도를 무게로 측정하는 것과 같다. - Bill Gates",
            "코딩이란 사회조직에서 도굴보다는 위면서 관리의 바로 밑 어디엔가 위치하는 직업이다. - Gerald Weinberg",
            "항상 이런 생각으로 개발에 임하라. '내 소스를 유지보수하게 되는 개발자가 내가 어디 살고 있는지 알고 있는 과격한 사이코패스일 것이다.' - Martin Golding",
            "훌륭한 기계공은 일반 기계공보다 몇 배의 급여를 더 높이 받는다. 그러나 훌륭한 코드를 만들어내는 개발자는 일반적인 개발자보다 1만배 이상의 가치가 있다. - Bill Gates",
            "훌륭한 코드는 훌륭한 문서보다 낫다. - Steve McConnell",            
        ],
    }
];

export default data;